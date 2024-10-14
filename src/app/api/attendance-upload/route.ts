import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { prisma } from "@/utils/db";
import { read, utils } from 'xlsx';

// Disable body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper function to parse Excel file
async function parseExcel(buffer: ArrayBuffer) {
    const workbook = read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return utils.sheet_to_json(sheet);
}

// Helper function to parse CSV file
async function parseCSV(buffer: ArrayBuffer) {
    const csvText = new TextDecoder().decode(buffer);
    const csvRows = csvText.split('\n').map((row) => row.split(','));
    const headers = csvRows[0];
    return csvRows.slice(1).map((row) =>
        headers.reduce((obj, header, index) => {
            obj[header.trim()] = row[index].trim();
            return obj;
        }, {} as Record<string, string>)
    );
}

// Helper function to determine status based on check-in time
function getCheckInStatus(checkInTime: Date): string {
    const cutoffTime = new Date(checkInTime);
    cutoffTime.setHours(8, 0, 0, 0); // Set cutoff to 8 AM
    return checkInTime > cutoffTime ? "Late" : "On Time";
}

export async function POST(req: NextRequest) {
    try {
        // Parse the form data from the request
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            throw new Error("No file uploaded");
        }

        // Determine the file type
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!['xlsx', 'csv'].includes(extension || '')) {
            throw new Error('Unsupported file format');
        }

        // Create a reference in Firebase Storage
        const storageRef = ref(storage, `uploads/${file.name}`);

        // Convert file to a buffer
        const buffer = await file.arrayBuffer();

        // Upload the file to Firebase
        const snapshot = await uploadBytes(storageRef, new Uint8Array(buffer));
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Parse the file content
        let parsedData;
        if (extension === 'xlsx') {
            parsedData = await parseExcel(buffer);
        } else if (extension === 'csv') {
            parsedData = await parseCSV(buffer);
        }

        // Process each record and insert attendance data
        for (const record of parsedData) {
            const firstName = record.firstName;
            const lastName = record.lastName;
            const checkIn = new Date(record.checkIn);

            // Find the employee using first and last name
            const employee = await prisma.employee.findFirst({
                where: { firstName, lastName },
                include: {
                    teams: true,
                },
            });

            if (!employee) {
                throw new Error(`Employee ${firstName} ${lastName} not found.`);
            }

            // Extract employee information
            const employeeId = employee.id;
            const teamId = employee.teamId;
            const type = employee.officeLocation;

            // Determine the status based on check-in time
            const status = getCheckInStatus(checkIn);

            // Insert the attendance record
            await prisma.attendance.create({
                data: {
                    employeeId,
                    teamId,
                    checkIn,
                    status,
                    type,
                },
            });
        }

        return NextResponse.json({
            message: "File uploaded and attendance data processed successfully",
            fileUrl: downloadURL,
        });
    } catch (error: unknown) {
        return NextResponse.json({
            error: "File upload failed",
            details: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}

// File: src/app/api/attendance-upload/route.ts

import { NextRequest, NextResponse } from "next/server"; // Keep NextResponse
import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { prisma } from "@/utils/db";
import { read, utils } from 'xlsx';

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

// Handle file upload and attendance processing
export async function POST(req: NextRequest) { // Use the standard Request type
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
        interface AttendanceRecord {
            firstName: string;
            lastName: string;
            checkIn: string; // or Date if you are parsing it directly to a Date object
        }

        let parsedData: AttendanceRecord[] = []; // Initialize as an empty array

        if (extension === 'xlsx') {
            const rawData = await parseExcel(buffer) as Record<string, string>[];
            parsedData = rawData.map(record => ({
                firstName: record.firstName,
                lastName: record.lastName,
                checkIn: record.checkIn,
            }));
        } else if (extension === 'csv') {
            const rawData = await parseCSV(buffer) as Record<string, string>[];
            parsedData = rawData.map(record => ({
                firstName: record.firstName,
                lastName: record.lastName,
                checkIn: record.checkIn,
            }));
        }

        // Now you can safely use parsedData
        for (const record of parsedData) {
            const { firstName, lastName, checkIn } = record;
            const checkInDate = new Date(checkIn);

            // Find the employee using first and last name
            const employee = await prisma.employee.findFirst({
                where: { firstName, lastName },
                include: { teams: true },
            });

            if (!employee) {
                throw new Error(`Employee ${firstName} ${lastName} not found.`);
            }

            // Extract employee information
            const { id: employeeId, teamId, officeLocation: type } = employee;

            // Determine the status based on check-in time
            const status = getCheckInStatus(checkInDate);

            // Insert the attendance record
            await prisma.attendance.create({
                data: { employeeId, teamId, checkIn: checkInDate, status, type: type || '' },
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

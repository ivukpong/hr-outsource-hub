// File: app/api/attendance/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

// Retrieve all attendance records
export async function GET() {
    try {
        const attendanceRecords = await prisma.attendance.findMany({
            include: {
                employee: true, // Include employee data for each attendance record
                team: true, // Include team data for each attendance record
            },
        });
        return NextResponse.json(attendanceRecords);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve attendance records.' }, { status: 500 });
    }
}

// Create a new attendance record
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate the input data
        if (!body.employeeId || !body.checkIn) {
            return NextResponse.json({ error: 'Invalid input data.' }, { status: 400 });
        }

        // Check if the check-in time is past 8 AM
        const checkInDate = new Date(body.checkIn);
        const cutoffTime = new Date(checkInDate);
        cutoffTime.setHours(8, 0, 0, 0); // Set cutoff to 8 AM of the same day

        // Set status to "late" if check-in is past 8 AM
        if (checkInDate > cutoffTime) {
            body.status = 'Late'; // Update status to "late"
        } else {
            body.status = 'On Time'
        }

        const attendanceRecord = await prisma.attendance.create({
            data: body,
        });

        return NextResponse.json(attendanceRecord, { status: 201 });
    } catch (error: any) {
        console.error("Error creating attendance record:", error); // Log the error
        return NextResponse.json({ error: 'Failed to create attendance record.', details: error.message }, { status: 500 });
    }
}

// Update an existing attendance record
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
        }

        const updatedAttendanceRecord = await prisma.attendance.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return NextResponse.json(updatedAttendanceRecord);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Attendance record not found.' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update attendance record.', details: error.message }, { status: 500 });
    }
}

// Delete an attendance record by ID
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Attendance ID is required.' }, { status: 400 });
    }

    try {
        await prisma.attendance.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: 'Attendance record deleted successfully.' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Attendance record not found.' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete attendance record.', details: error.message }, { status: 500 });
    }
}

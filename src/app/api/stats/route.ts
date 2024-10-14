import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

// Get statistics
export async function GET() {
    try {
        // Fetch total employees
        const totalEmployees = await prisma.employee.count();

        // Fetch total teams
        const totalTeams = await prisma.team.count();

        // Calculate average check-in time
        const attendanceRecords = await prisma.attendance.findMany({
            select: {
                checkIn: true,
            },
        });

        const totalCheckInTime = attendanceRecords.reduce((total, record) => {
            const checkInTime = new Date(record.checkIn);
            return total + checkInTime.getTime(); // Convert to milliseconds
        }, 0);

        const averageCheckInTime = attendanceRecords.length
            ? new Date(totalCheckInTime / attendanceRecords.length) // Get average
            : null;

        // Fetch total departments
        const totalDepartments = await prisma.department.count();

        // Return the response
        return NextResponse.json({
            totalEmployees,
            totalTeams,
            averageCheckInTime: averageCheckInTime
                ? `${averageCheckInTime.getUTCHours()}h ${averageCheckInTime.getUTCMinutes()}m` // Format as "Xh Ym"
                : null,
            totalDepartments,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

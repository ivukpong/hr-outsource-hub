import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { Survey } from '@prisma/client';

// Get the total number of surveys created, grouped by month
export async function GET() {
    try {
        // Fetch surveys created within a specific date range
        const surveys: Survey[] = await prisma.survey.findMany({
            where: {
                createdAt: {
                    gte: new Date('2024-01-01'), // Start date (e.g., start of 2024)
                    lt: new Date('2025-01-01'),   // End date (e.g., end of 2024)
                },
            },
        });

        // Count the number of surveys created each month
        const surveysCreatedByMonth = countSurveysByMonth(surveys);

        return NextResponse.json(surveysCreatedByMonth); // Return the monthly count as JSON
    } catch (error) {
        console.error("Error fetching survey data:", error);
        return NextResponse.json({ error: "Failed to fetch survey data" }, { status: 500 });
    }
}

// Helper function to count surveys by month
function countSurveysByMonth(surveys: Survey[]): { month: string; count: number }[] {
    const monthCounts: { [month: string]: number } = {};

    // Count surveys created in each month
    surveys.forEach((survey) => {
        const month = survey.createdAt
            ? new Date(survey.createdAt).toLocaleString('default', { month: 'short' })
            : 'Unknown';

        if (!monthCounts[month]) {
            monthCounts[month] = 0;
        }
        monthCounts[month] += 1; // Increment count for each survey created in that month
    });

    // Define months in the correct order
    const monthsOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Create sorted data with default 0 values for months with no surveys
    const sortedCounts = monthsOrder.map((month) => ({
        month: month,
        count: monthCounts[month] || 0, // Default to 0 if no surveys for that month
    }));

    return sortedCounts;
}
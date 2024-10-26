import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { Survey } from '@prisma/client';

// Fetch total surveys created, grouped by month and by category
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

        // Count the number of surveys by category
        const surveysByCategory = countSurveysByCategory(surveys);

        return NextResponse.json({
            surveysCreatedByMonth,
            surveysByCategory,
        });
    } catch (error) {
        console.error("Error fetching survey data:", error);
        return NextResponse.json({ error: "Failed to fetch survey data" }, { status: 500 });
    }
}

// Helper function to count surveys created by month
function countSurveysByMonth(surveys: Survey[]): { month: string; count: number }[] {
    const monthCounts: { [month: string]: number } = {};

    surveys.forEach((survey) => {
        const month = survey.createdAt
            ? new Intl.DateTimeFormat('default', { month: 'short' }).format(new Date(survey.createdAt))
            : 'Unknown';

        monthCounts[month] = (monthCounts[month] || 0) + 1; // Increment count for each survey created in that month
    });

    const monthsOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const sortedCounts = monthsOrder.map((month) => ({
        month,
        count: monthCounts[month] || 0,
    }));

    return sortedCounts;
}

// Helper function to count surveys by category
function countSurveysByCategory(surveys: Survey[]): { category: string; count: number }[] {
    const categoryCounts: { [category: string]: number } = {};

    surveys.forEach((survey) => {
        const category = survey.category || 'Unknown';

        categoryCounts[category] = (categoryCounts[category] || 0) + 1; // Increment count for each survey in the category
    });

    return Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        count,
    }));
}

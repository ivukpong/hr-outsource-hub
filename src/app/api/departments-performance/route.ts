import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { Reward } from '@prisma/client';

// Get rewards grouped by month and department
export async function GET() {
    try {
        // Fetch departments with their rewards created after a specific date
        const departments = await prisma.department.findMany({
            include: {
                rewards: {
                    where: {
                        createdAt: {
                            gte: new Date('2024-01-01'), // Adjust the date range as needed
                        },
                    },
                },
                teams: true,
                departmentHead: true,
                employees: true,
            },
        });

        // Group rewards by month and department
        const data = groupByMonthAndDepartment(departments);

        return NextResponse.json(data); // Return the grouped data as JSON
    } catch (error) {
        console.error("Error fetching performance data:", error);
        return NextResponse.json({ error: "Failed to fetch performance data" }, { status: 500 });
    }
}

// Helper function to group rewards by month and department
function groupByMonthAndDepartment(departments: any[]) {
    const groupedData = {};
    const departmentNames = new Set();

    // Collect all department names
    departments.forEach((department) => {
        departmentNames.add(department.name);
        department.rewards.forEach((reward: Reward) => {
            const month = new Date(reward.earnedDate).toLocaleString('default', { month: 'long' });

            if (!groupedData[month]) {
                groupedData[month] = { name: month };
            }

            // Aggregate pointsEarned for each department
            if (!groupedData[month][department.name]) {
                groupedData[month][department.name] = 0; // Default to 0 if not present
            }
            groupedData[month][department.name] += reward.pointsEarned || 0;
        });
    });

    // Add default entries for each department for each month
    const monthsOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const sortedData = monthsOrder.map(month => {
        const entry = { name: month };
        departmentNames.forEach(departmentName => {
            entry[departmentName] = groupedData[month]?.[departmentName] || 0; // Default to 0
        });
        return entry;
    });

    return sortedData;
}

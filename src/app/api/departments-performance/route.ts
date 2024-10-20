import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { Reward, Department } from '@prisma/client';

// Get rewards grouped by month and department
export async function GET() {
    try {
        // Fetch departments with their rewards created after a specific date
        const departments: (Department & { rewards: Reward[] })[] = await prisma.department.findMany({
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

// Define the type for the sorted data entries
interface MonthlyDepartmentData {
    name: string; // Name of the month
    [key: string]: number | string; // Allow additional keys with numeric values
}

// Helper function to group rewards by month and department
function groupByMonthAndDepartment(departments: (Department & { rewards: Reward[] })[]): MonthlyDepartmentData[] {
    const groupedData: { [month: string]: { [departmentName: string]: number } } = {};
    const departmentNames = new Set<string>();

    // Collect all department names and group rewards by month
    departments.forEach((department) => {
        departmentNames.add(department.name);

        department.rewards.forEach((reward: Reward) => {
            const month = reward.earnedDate
                ? new Date(reward.earnedDate).toLocaleString('default', { month: 'short' })
                : 'Unknown';

            if (!groupedData[month]) {
                groupedData[month] = {};
            }

            // Aggregate pointsEarned for each department
            if (!groupedData[month][department.name]) {
                groupedData[month][department.name] = 0;
            }

            groupedData[month][department.name] += reward.pointsEarned || 0;
        });
    });

    // Define months in the correct order
    const monthsOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Create sorted data and fill in default values (0) for missing departments
    const sortedData: MonthlyDepartmentData[] = monthsOrder.map((month) => {
        const entry: MonthlyDepartmentData = { name: month }; // Explicitly define type

        departmentNames.forEach((departmentName) => {
            entry[departmentName] = groupedData[month]?.[departmentName] || 0;
        });

        return entry;
    });

    return sortedData;
}

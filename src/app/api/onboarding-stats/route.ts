import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { Department, Employee } from '@prisma/client';

// Get the total number of onboarded employees grouped by month and department
export async function GET() {
    try {
        // Fetch departments with their employees onboarded after a specific date
        const departments: (Department & { employees: Employee[] })[] = await prisma.department.findMany({
            include: {
                employees: {
                    where: {
                        createdAt: {
                            gte: new Date('2024-10-01'), // Adjust the date range as needed
                        },
                    },
                },
                teams: true,
                departmentHead: true,
            },
        });

        // Group employees by month and department
        const data = groupByMonthAndDepartment(departments);

        return NextResponse.json(data); // Return the grouped data as JSON
    } catch (error) {
        console.error("Error fetching onboarding data:", error);
        return NextResponse.json({ error: "Failed to fetch onboarding data" }, { status: 500 });
    }
}

// Define the type for the sorted data entries
interface MonthlyDepartmentData {
    name: string; // Name of the month
    [key: string]: number | string; // Allow additional keys with numeric values
}

// Helper function to group employees by month and department
function groupByMonthAndDepartment(departments: (Department & { employees: Employee[] })[]): MonthlyDepartmentData[] {
    const groupedData: { [month: string]: { [departmentName: string]: number } } = {};
    const departmentNames = new Set<string>();

    // Collect all department names and group employees by month
    departments.forEach((department) => {
        departmentNames.add(department.name);

        department.employees.forEach((employee: Employee) => {
            const month = employee.createdAt
                ? new Date(employee.createdAt).toLocaleString('default', { month: 'short' })
                : 'Unknown';

            if (!groupedData[month]) {
                groupedData[month] = {};
            }

            // Aggregate the number of employees onboarded for each department
            if (!groupedData[month][department.name]) {
                groupedData[month][department.name] = 0;
            }

            groupedData[month][department.name] += 1; // Count each onboarded employee
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

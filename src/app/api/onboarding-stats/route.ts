// import { NextResponse } from 'next/server';
// import { prisma } from '@/utils/db';
// import { Department, Employee } from '@prisma/client';

// // Get the total number of onboarded employees grouped by month and department
// export async function GET() {
//     try {
//         // Fetch departments with their employees onboarded after a specific date
//         const departments: (Department & { employees: Employee[] })[] = await prisma.department.findMany({
//             include: {
//                 employees: {
//                     where: {
//                         startDate: {
//                             gte: new Date('2024-01-01'), // Adjust to start from January 2024
//                             lt: new Date('2025-01-01')   // End at the end of 2024
//                         },
//                     },
//                 },
//                 teams: true,
//                 departmentHead: true,
//             },
//         });


//         // Group employees by month and department
//         const data = groupByMonthAndDepartment(departments);

//         return NextResponse.json(data); // Return the grouped data as JSON
//     } catch (error) {
//         console.error("Error fetching onboarding data:", error);
//         return NextResponse.json({ error: "Failed to fetch onboarding data" }, { status: 500 });
//     }
// }

// // Define the type for the sorted data entries
// interface MonthlyDepartmentData {
//     name: string; // Name of the month
//     [key: string]: number | string; // Allow additional keys with numeric values
// }

// // Helper function to group employees by month and department
// function groupByMonthAndDepartment(departments: (Department & { employees: Employee[] })[]): MonthlyDepartmentData[] {
//     const groupedData: { [month: string]: { [departmentName: string]: number } } = {};
//     const departmentNames = new Set<string>();

//     // Collect all department names and group employees by month
//     departments.forEach((department) => {
//         departmentNames.add(department.name);

//         department.employees.forEach((employee: Employee) => {
//             const month = employee.startDate
//                 ? new Date(employee.startDate).toLocaleString('default', { month: 'short' })
//                 : 'Unknown';

//             if (!groupedData[month]) {
//                 groupedData[month] = {};
//             }

//             // Aggregate the number of employees onboarded for each department
//             if (!groupedData[month][department.name]) {
//                 groupedData[month][department.name] = 0;
//             }

//             groupedData[month][department.name] += 1; // Count each onboarded employee
//         });
//     });

//     // Define months in the correct order
//     const monthsOrder = [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
//     ];

//     // Create sorted data and fill in default values (0) for missing departments
//     const sortedData: MonthlyDepartmentData[] = monthsOrder.map((month) => {
//         const entry: MonthlyDepartmentData = { name: month }; // Explicitly define type

//         departmentNames.forEach((departmentName) => {
//             entry[departmentName] = groupedData[month]?.[departmentName] || 0;
//         });

//         return entry;
//     });

//     return sortedData;
// }

import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { Employee } from '@prisma/client';

// Get the total number of onboarded employees grouped by month
export async function GET() {
    try {
        // Fetch employees onboarded after a specific date
        const employees: Employee[] = await prisma.employee.findMany({
            where: {
                startDate: {
                    gte: new Date('2024-01-01'), // Adjust to the desired date range
                    lt: new Date('2025-01-01'),   // End at the end of 2024
                },
            },
        });

        // Count the number of employees onboarded each month
        const totalOnboardedByMonth = countEmployeesByMonth(employees);

        return NextResponse.json(totalOnboardedByMonth); // Return the total count as JSON
    } catch (error) {
        console.error("Error fetching onboarding data:", error);
        return NextResponse.json({ error: "Failed to fetch onboarding data" }, { status: 500 });
    }
}

// Helper function to count employees onboarded by month
function countEmployeesByMonth(employees: Employee[]): { month: string; count: number }[] {
    const monthCounts: { [month: string]: number } = {};

    // Count employees for each month
    employees.forEach((employee) => {
        const month = employee.startDate
            ? new Date(employee.startDate).toLocaleString('default', { month: 'short' })
            : 'Unknown';

        if (!monthCounts[month]) {
            monthCounts[month] = 0;
        }
        monthCounts[month] += 1; // Count each onboarded employee
    });

    // Define months in the correct order
    const monthsOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Create sorted data
    const sortedCounts = monthsOrder.map((month) => ({
        month: month,
        count: monthCounts[month] || 0, // Default to 0 if no employees for that month
    }));

    return sortedCounts;
}
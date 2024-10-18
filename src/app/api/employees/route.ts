// File: app/api/employees/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';
import { Prisma } from '@prisma/client';

// Retrieve all employees
export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                department: true, // Include the department data for each employee
                teams: true, // Include the teams data for each employee
            },
        });
        return NextResponse.json(employees);
    } catch (error) {
        console.error('Error retrieving employees:', error);
        return NextResponse.json({ error: 'Failed to retrieve employees.' }, { status: 500 });
    }
}

// Create a new employee
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Creating employee:', body);

        const employee = await prisma.employee.create({
            data: body,
        });

        console.log('Employee created:', employee);
        return NextResponse.json(employee, { status: 201 });
    } catch (error) {
        console.error('Error creating employee:', error);
        return NextResponse.json({ error: 'Failed to create employee.' }, { status: 500 });
    }
}

// Update an existing employee
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedEmployee);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
            }
        }
        console.error('Error updating employee:', error);
        return NextResponse.json({ error: 'Failed to update employee.' }, { status: 500 });
    }
}

// Delete an employee by ID
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    }

    try {
        await prisma.employee.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: 'Employee deleted successfully.' });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
            }
        }
        console.error('Error deleting employee:', error);
        return NextResponse.json({ error: 'Failed to delete employee.' }, { status: 500 });
    }
}

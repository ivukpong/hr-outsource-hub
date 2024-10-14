// File: app/api/departments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

// Get all departments
export async function GET() {
    const departments = await prisma.department.findMany({
        include: {
            teams: true,
            departmentHead: true,
            employees: true,
            rewards: true,
        },
    });
    return NextResponse.json(departments);
}

// Create a new department
export async function POST(req: NextRequest) {
    const body = await req.json();
    const department = await prisma.department.create({
        data: body,
    });
    return NextResponse.json(department, { status: 201 });
}

// Update a department by ID
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, ...updateData } = body;

    console.log(body);

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
    }


    const updatedDepartment = await prisma.department.update({
        where: { id: Number(id) },
        data: updateData,
    });

    console.log(body);

    return NextResponse.json(updatedDepartment);
}

// Delete a department by ID
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Department ID is required.' }, { status: 400 });
    }

    await prisma.department.delete({
        where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Department deleted successfully.' });
}

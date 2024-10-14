// File: app/api/categories/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

// Get all categories
export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}

// Create a new category
export async function POST(req: NextRequest) {
    const body = await req.json();
    const category = await prisma.category.create({
        data: body,
    });
    return NextResponse.json(category, { status: 201 });
}

// Update a category by ID
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: updateData,
    });

    return NextResponse.json(updatedCategory);
}

// Delete a category by ID
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Category ID is required.' }, { status: 400 });
    }

    await prisma.category.delete({
        where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Category deleted successfully.' });
}

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';

// Get all KPIs
export async function GET() {
    const kpis = await prisma.kpi.findMany();
    return NextResponse.json(kpis);
}

// Create a new KPI
export async function POST(req: NextRequest) {
    const body = await req.json();
    const kpi = await prisma.kpi.create({
        data: body,
    });
    return NextResponse.json(kpi, { status: 201 });
}

// Update a KPI by ID
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
    }

    const updatedKpi = await prisma.kpi.update({
        where: { id: Number(id) },
        data: updateData,
    });

    return NextResponse.json(updatedKpi);
}

// Delete a KPI by ID
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'KPI ID is required.' }, { status: 400 });
    }

    await prisma.kpi.delete({
        where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'KPI deleted successfully.' });
}

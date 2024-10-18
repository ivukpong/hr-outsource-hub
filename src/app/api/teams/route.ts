// File: app/api/teams/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';

// Get all teams
export async function GET() {
    const teams = await prisma.team.findMany();
    return NextResponse.json(teams);
}

// Create a new team
export async function POST(req: NextRequest) {
    const body = await req.json();
    const team = await prisma.team.create({
        data: body,
    });
    return NextResponse.json(team, { status: 201 });
}

// Update a team by ID
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
    }

    const updatedTeam = await prisma.team.update({
        where: { id: Number(id) },
        data: updateData,
    });

    return NextResponse.json(updatedTeam);
}

// Delete a team by ID
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Team ID is required.' }, { status: 400 });
    }

    await prisma.team.delete({
        where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Team deleted successfully.' });
}

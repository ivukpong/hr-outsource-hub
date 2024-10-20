import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

// Get all announcements
export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: {
                isPinned: 'desc', // Pinned announcements first
            },
        });
        return NextResponse.json(announcements);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }
}

// Create a new announcement
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, date, isPinned } = body;

        if (!title || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                description,
                date: new Date(date),
                isPinned: isPinned || false,
            },
        });

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
    }
}

// Update an announcement by ID
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, title, description, date, isPinned } = body;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
        }

        const updatedAnnouncement = await prisma.announcement.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                date: new Date(date),
                isPinned,
            },
        });

        return NextResponse.json(updatedAnnouncement);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
    }
}

// Delete an announcement by ID
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
        }

        await prisma.announcement.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
    }
}


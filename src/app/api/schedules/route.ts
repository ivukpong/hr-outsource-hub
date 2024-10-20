import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

// Handler for all HTTP methods
// export async function GET(req: NextRequest) {
//     try {
//         const schedules = await prisma.schedule.findMany({
//             include: {
//                 participants: true, // Include participants in the response
//             },
//         });
//         return NextResponse.json(schedules);
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
//     }
// }

export async function GET(req: NextRequest) {
    try {
        const schedules = await prisma.schedule.findMany({
            include: {
                participants: {
                    include: {
                        Employee: true, // Include the Employee data for each participant
                    },
                },
            },
        });
        return NextResponse.json(schedules);
    } catch (error) {
        console.error(error); // Log the error for better debugging
        return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, startTime, endTime, location, participants } = body;

        if (!title || !startTime || !endTime || !location) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Prepare participant data for connectOrCreate operation
        const participantData = participants?.map((p: { name: string; email: string }) => ({
            where: { email: p.email }, // Check if participant exists by email
            create: { name: p.name, email: p.email }, // If not, create a new participant
        }));

        const schedule = await prisma.schedule.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                location,
                participants: {
                    connectOrCreate: participantData, // Add participants using connectOrCreate
                },
            },
            include: {
                participants: true, // Return participants with the created schedule
            },
        });

        return NextResponse.json(schedule, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, title, description, startTime, endTime, location, participants } = body;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
        }

        // Prepare participant data for connectOrCreate operation
        const participantData = participants?.map((p: { name: string; email: string }) => ({
            where: { email: p.email },
            create: { name: p.name, email: p.email },
        }));

        const updatedSchedule = await prisma.schedule.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                location,
                participants: {
                    connectOrCreate: participantData, // Update or create participants
                },
            },
            include: {
                participants: true, // Include participants in the updated response
            },
        });

        return NextResponse.json(updatedSchedule);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
        }

        await prisma.schedule.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
    }
}

// GET /api/performances
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET() {
    try {
        const performances = await prisma.performance.findMany({
            include: {
                employee: true,
                team: {
                    include: {
                        department: true, // Corrected from 'deparment' to 'department'
                    },
                },
                kpi: true,
            },
        });
        return NextResponse.json(performances);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Unable to fetch performances.' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { employeeId, teamId, kpiId, score } = body;

        const newPerformance = await prisma.performance.create({
            data: {
                employeeId,
                teamId,
                kpiId,
                score,
                progress: score,  // Assume initial progress is equal to points earned
                evaluationDate: new Date().toISOString(),
            },
        });

        return NextResponse.json(newPerformance, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Unable to create performance.' }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, pointsEarned, ...updateData } = body;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
        }

        // Fetch the current progress of the performance
        const currentPerformance = await prisma.performance.findUnique({
            where: { id: Number(id) },
        });

        if (!currentPerformance) {
            return NextResponse.json({ error: 'Performance not found.' }, { status: 404 });
        }

        const newProgress = currentPerformance.progress + pointsEarned;

        const updatedPerformance = await prisma.performance.update({
            where: { id: Number(id) },
            data: {
                ...updateData,
                score: currentPerformance.score + pointsEarned,
                progress: newProgress,  // Update progress
            },
        });

        return NextResponse.json(updatedPerformance);
    } catch (error) {
        console.log(error)

        return NextResponse.json({ error: 'Unable to update performance.' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Performance ID is required.' }, { status: 400 });
    }

    try {
        await prisma.performance.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: 'Performance deleted successfully.' });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Unable to delete performance.' }, { status: 500 });
    }
}
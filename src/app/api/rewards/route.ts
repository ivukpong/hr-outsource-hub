import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';

// Get all rewards
export async function GET() {
    const rewards = await prisma.reward.findMany({
        include: {
            employee: true,
            department: true,
            category: true
        }
    });
    return NextResponse.json(rewards);
}

// Create or update a reward
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { employeeId, departmentId, categoryId, pointsEarned, earnedDate } = body;

    // Check if a reward already exists with the same employeeId, departmentId, and categoryId
    const existingReward = await prisma.reward.findFirst({
        where: {
            employeeId,
            departmentId,
            categoryId,
        },
    });

    if (existingReward) {
        // If a reward exists, update it
        const newProgress = existingReward.progress + pointsEarned;

        const updatedReward = await prisma.reward.update({
            where: { id: existingReward.id },
            data: {
                pointsEarned: existingReward.pointsEarned + pointsEarned,
                progress: newProgress,  // Update progress
            },
        });

        return NextResponse.json(updatedReward, { status: 200 });
    } else {
        // If no reward exists, create a new one
        const newProgress = pointsEarned;

        const reward = await prisma.reward.create({
            data: {
                employeeId,
                departmentId,
                categoryId,
                pointsEarned,
                earnedDate: new Date(earnedDate),
                progress: newProgress,  // Set new progress
            },
        });

        return NextResponse.json(reward, { status: 201 });
    }
}

// Update a reward by ID
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { id, pointsEarned, ...updateData } = body;

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
    }

    // Fetch current progress for this reward
    const currentReward = await prisma.reward.findUnique({
        where: { id: Number(id) },
    });

    if (!currentReward) {
        return NextResponse.json({ error: 'Reward not found.' }, { status: 404 });
    }

    const newProgress = currentReward.progress + pointsEarned;

    const updatedReward = await prisma.reward.update({
        where: { id: Number(id) },
        data: {
            ...updateData,
            pointsEarned: currentReward.pointsEarned + pointsEarned,
            progress: newProgress,  // Update progress calculation
        },
    });

    return NextResponse.json(updatedReward);
}

// Delete a reward by ID
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Reward ID is required.' }, { status: 400 });
    }

    await prisma.reward.delete({
        where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Reward deleted successfully.' });
}

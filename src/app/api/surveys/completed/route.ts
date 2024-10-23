import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { surveyId } = body;

        console.log(body)

        // Increment the completed count in the database
        const updatedSurvey = await prisma.survey.update({
            where: { id: Number(surveyId) },
            data: {
                completedCount: {
                    increment: 1, // Increment the completedCount by 1
                },
            },
        });

        return NextResponse.json({
            message: 'Completed count incremented successfully',
            surveyId: updatedSurvey.id,
            completedCount: updatedSurvey.completedCount,
        });
    } catch (error) {
        console.error('Error incrementing completed count:', error);
        return NextResponse.json({ error: 'Failed to increment completed count' }, { status: 500 });
    }
}
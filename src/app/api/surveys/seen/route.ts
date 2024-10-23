import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { surveyId } = body;

        console.log(body)

        // Validate surveyId
        if (!surveyId || typeof surveyId !== 'number') {
            return NextResponse.json({ error: 'Invalid surveyId' }, { status: 400 });
        }

        // Increment the seen count in the database
        const updatedSurvey = await prisma.survey.update({
            where: { id: Number(surveyId) },
            data: {
                seenCount: {
                    increment: 1, // Increment the seenCount by 1
                },
            },
        });

        return NextResponse.json({
            message: 'Seen count incremented successfully',
            surveyId: updatedSurvey.id,
            seenCount: updatedSurvey.seenCount,
        });
    } catch (error) {
        console.error('Error incrementing seen count:', error);
        return NextResponse.json({ error: 'Failed to increment seen count' }, { status: 500 });
    }
}

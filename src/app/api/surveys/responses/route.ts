import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

// POST method to submit a survey response
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { surveyId, employeeEmail, response } = body;

        // Validate the request body
        if (!surveyId || !employeeEmail || !response) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Convert surveyId to number and validate it
        const surveyIdNum = Number(surveyId);
        const surveyExists = await prisma.survey.findUnique({
            where: { id: surveyIdNum },
        });

        if (!surveyExists) {
            return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
        }

        // Create a new response in the database
        const newResponse = await prisma.surveyResponse.create({
            data: {
                surveyId: surveyIdNum,
                employeeEmail,
                response: response.splice(2, 6), // Adjust this according to your needs
            },
        });

        return NextResponse.json({
            message: 'Response submitted successfully',
            response: newResponse,
        });
    } catch (error) {
        console.error('Error submitting response:', error);
        return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
    }
}

// GET method to retrieve all survey responses
export async function GET(req: NextRequest) {
    try {
        // Fetch responses for all surveys
        const responses = await prisma.surveyResponse.findMany({
            include: {
                employee: true, // Include employee details if needed
                survey: true,   // Include survey details if needed
            },
        });

        return NextResponse.json(responses);
    } catch (error) {
        console.error('Error retrieving responses:', error);
        return NextResponse.json({ error: 'Failed to retrieve responses' }, { status: 500 });
    }
}

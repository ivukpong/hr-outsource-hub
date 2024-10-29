import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { sendSurveyEmail } from '@/utils/email';
import { SurveyCategory } from '@prisma/client';
import { questionMapping } from '@/app/data';

const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbzH0Xl6sewQ2Z6FF_6nAu_TnZHGNnZqLhj6dF8r2QTZfqi1-VN6BroMkKN3Ehd1FSwffw/exec";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, category, sentToEmails, questions: customQuestions } = body;

        const typedCategory: SurveyCategory = category;
        const defaultQuestions = questionMapping[typedCategory as keyof typeof questionMapping] || [];
        const questions = customQuestions && customQuestions.length > 0 ? customQuestions : defaultQuestions;

        const survey = await prisma.survey.create({
            data: {
                title,
                description,
                category: typedCategory,
                sentToEmails,
                questions: {
                    create: questions,
                },
            },
        });

        const surveyId = survey.id;

        try {
            const formResponse = await fetch(googleAppsScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    questions,
                    surveyId,
                }),
            });

            const formResponseData = await formResponse.json();
            const prefilledFormLink = formResponseData.prefilledFormLink;

            await sendSurveyEmail(sentToEmails, title, prefilledFormLink);

            return NextResponse.json({
                message: 'Survey created successfully, form generated, and email sent.',
                surveyId,
                prefilledFormLink,
            });
        } catch (error) {
            console.error('Error creating Google Form:', error);
            return NextResponse.json({ error: 'Failed to create Google Form' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error creating survey:', error);
        return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const surveys = await prisma.survey.findMany({
            include: {
                responses: true,
            },
        });

        const totalSentEmails = surveys.reduce((total, survey) => total + (survey.sentToEmails?.length || 0), 0);
        const totalCompletedSurveys = surveys.reduce((total, survey) => total + (survey.completedCount || 0), 0);
        const totalSeenSurveys = surveys.reduce((total, survey) => total + (survey.seenCount || 0), 0);

        return NextResponse.json({
            surveys,
            totalSentEmails,
            totalCompletedSurveys,
            totalSeenSurveys,
        });
    } catch (error) {
        console.error('Error fetching surveys:', error);
        return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
    }
}

// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/utils/db';
// import { sendSurveyEmail } from '@/utils/email';
// import { Survey, SurveyCategory } from '@prisma/client';
// import { questionMapping } from '@/app/data';

// const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbxSZKdeuX-AbqO2HNG5mWIGFaSwpR_9p8Ql7RKfIalu/dev";

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { title, description, category, sentToEmails } = body;

//         const typedCategory: SurveyCategory = category;
//         const questions = questionMapping[typedCategory as keyof typeof questionMapping] || [];

//         const survey = await prisma.survey.create({
//             data: {
//                 title,
//                 description,
//                 category: typedCategory,
//                 sentToEmails,
//                 questions: {
//                     create: questions,
//                 },
//             },
//         });

//         const surveyId = survey.id;

//         try {
//             const formResponse = await fetch(googleAppsScriptUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     title,
//                     description,
//                     questions,
//                     surveyId,
//                 }),
//             });

//             const formResponseData = await formResponse.json();

//             if (!formResponse.ok) {
//                 console.error('Error creating Google Form:', formResponseData);
//                 return NextResponse.json({ error: 'Failed to create Google Form' }, { status: 500 });
//             }

//             // Assuming the prefilledFormLink comes from the form response
//             const prefilledFormLink = formResponseData.prefilledFormLink; // Adjust based on actual response structure

//             await sendSurveyEmail(sentToEmails, title, prefilledFormLink);

//             return NextResponse.json({
//                 message: 'Survey created successfully, form generated, and email sent.',
//                 surveyId,
//                 prefilledFormLink,
//             });
//         } catch (error) {
//             console.error('Error creating Google Form:', error);
//             return NextResponse.json({ error: 'Failed to create Google Form' }, { status: 500 });
//         }
//     } catch (error) {
//         console.error('Error creating survey:', error);
//         return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
//     }
// }

// export async function GET() {
//     try {
//         const surveys = await prisma.survey.findMany();

//         const totalSentEmails = surveys.reduce((total, survey) => total + (survey.sentToEmails?.length || 0), 0);
//         const totalCompletedSurveys = surveys.reduce((total, survey) => total + (survey.completedCount || 0), 0);
//         const totalSeenSurveys = surveys.reduce((total, survey) => total + (survey.seenCount || 0), 0);

//         const responseData = {
//             surveys,
//             totalSentEmails,
//             totalCompletedSurveys,
//             totalSeenSurveys,
//         };

//         console.log(surveys)

//         return NextResponse.json(responseData);
//     } catch (error) {
//         console.error('Error fetching surveys:', error);
//         return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
//     }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/utils/db';
// import { sendSurveyEmail } from '@/utils/email';
// import { SurveyCategory } from '@prisma/client'; // Ensure this import matches your enum location
// import { questionMapping } from '@/app/data';

// // Google Apps Script web app URL
// const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbzVDSQ6rCS5Ttk1jEGZ8svo_l_RUNfzyK_kpAiUWUzclWyF_cGEoo0j3-BZb88gftbkMg/exec";

// // API Endpoint to handle survey creation and email sending
// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { title, description, category, sentToEmails } = body;

//         // Type the category to SurveyCategory
//         const typedCategory: SurveyCategory = category;

//         // Get predefined questions based on the selected category
//         const questions = questionMapping[typedCategory];

//         // Create the survey in the database first
//         const survey = await prisma.survey.create({
//             data: {
//                 title,
//                 description,
//                 category: typedCategory,
//                 sentToEmails,
//                 questions: {
//                     create: questions,
//                 },
//             },
//         });

//         const surveyId = survey.id; // Get the surveyId to include in the form


//         // Call the Google Apps Script to create the form and include the surveyId as a hidden field
//         try {
//             const formResponse = await fetch(googleAppsScriptUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     title,
//                     description,
//                     questions,
//                     surveyId,
//                 }),
//             });

//             console.log('Google Form Link:', JSON.stringify({
//                 title,
//                 description,
//                 questions,
//                 surveyId
//             }));
//             const { prefilledFormLink } = await formResponse.json();
//             console.log(prefilledFormLink)


//             // Send email with the Google Form link
//             await sendSurveyEmail(sentToEmails, title, prefilledFormLink);

//             return NextResponse.json({
//                 message: 'Survey created successfully, form generated, and email sent.',
//                 surveyId: survey.id,
//                 prefilledFormLink,
//             });
//         } catch (error) {
//             console.error('Error creating Google Form:', error);
//             return NextResponse.json({ error: 'Failed to create Google Form' }, { status: 500 });
//         }
//     } catch (error) {
//         console.error('Error creating survey:', error);
//         return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
//     }
// }


// export async function GET() {
//     try {
//         const surveys = await prisma.survey.findMany({
//             include: {
//                 responses: true, // Include survey responses
//             },
//         });

//         // Calculate total sent emails and total completed surveys
//         const totalSentEmails = surveys.reduce((total, survey) => total + survey.sentToEmails.length, 0);
//         const totalCompletedSurveys = surveys.reduce((total, survey) => total + survey.completedCount, 0);
//         const totalSeenSurveys = surveys.reduce((total, survey) => total + survey.seenCount, 0);

//         return NextResponse.json({
//             surveys,
//             totalSentEmails,
//             totalCompletedSurveys,
//             totalSeenSurveys,
//         });
//     } catch (error) {
//         console.error('Error fetching surveys:', error);
//         return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
//     }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/utils/db';
// import { sendSurveyEmail } from '@/utils/email';
// import { SurveyCategory } from '@prisma/client'; // Ensure this import matches your enum location
// import { questionMapping } from '@/app/data';

// // Google Apps Script web app URL
// const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbzH0Xl6sewQ2Z6FF_6nAu_TnZHGNnZqLhj6dF8r2QTZfqi1-VN6BroMkKN3Ehd1FSwffw/exec";

// // API Endpoint to handle survey creation and email sending
// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { title, description, category, sentToEmails } = body;

//         // Ensure category is typed to SurveyCategory and fallback for questions if category is invalid
//         const typedCategory: SurveyCategory = category;
//         const questions = questionMapping[typedCategory as keyof typeof questionMapping] || [];

//         // Create the survey in the database first
//         const survey = await prisma.survey.create({
//             data: {
//                 title,
//                 description,
//                 category: typedCategory,
//                 sentToEmails,
//                 questions: {
//                     create: questions,
//                 },
//             },
//         });

//         const surveyId = survey.id; // Get the surveyId to include in the form

//         // Call the Google Apps Script to create the form and include the surveyId as a hidden field
//         try {
//             const formResponse = await fetch(googleAppsScriptUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     title,
//                     description,
//                     questions,
//                     surveyId,
//                 }),
//             });

//             // Parse the form response and log for debugging
//             const formResponseData = await formResponse.json();
//             const prefilledFormLink = formResponseData.prefilledFormLink;
//             console.log('Google Form Link:', prefilledFormLink);

//             // Send email with the Google Form link
//             await sendSurveyEmail(sentToEmails, title, prefilledFormLink);

//             return NextResponse.json({
//                 message: 'Survey created successfully, form generated, and email sent.',
//                 surveyId,
//                 prefilledFormLink,
//             });
//         } catch (error) {
//             console.error('Error creating Google Form:', error);
//             return NextResponse.json({ error: 'Failed to create Google Form' }, { status: 500 });
//         }
//     } catch (error) {
//         console.error('Error creating survey:', error);
//         return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
//     }
// }

// export async function GET() {
//     try {
//         const surveys = await prisma.survey.findMany({
//             include: {
//                 responses: true, // Include survey responses
//             },
//         });

//         // Calculate total sent emails and total completed surveys
//         const totalSentEmails = surveys.reduce((total, survey) => total + (survey.sentToEmails?.length || 0), 0);
//         const totalCompletedSurveys = surveys.reduce((total, survey) => total + (survey.completedCount || 0), 0);
//         const totalSeenSurveys = surveys.reduce((total, survey) => total + (survey.seenCount || 0), 0);

//         return NextResponse.json({
//             surveys,
//             totalSentEmails,
//             totalCompletedSurveys,
//             totalSeenSurveys,
//         });
//     } catch (error) {
//         console.error('Error fetching surveys:', error);
//         return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
//     }
// }

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

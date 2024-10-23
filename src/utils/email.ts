import nodemailer from 'nodemailer';

export async function sendSurveyEmail(email: string, surveyTitle: string, googleFormLink: string) {
    // Set up nodemailer transporter using Gmail or any other email service
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email service (e.g., Gmail, Yahoo, etc.)
        auth: {
            user: process.env.EMAIL_USER, // Email credentials from environment variables
            pass: process.env.EMAIL_PASS,
        },
    });

    // Define email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to: email,                    // Recipient email
        subject: `Survey Invitation: ${surveyTitle}`,  // Dynamic subject based on survey title
        text: `You are invited to participate in the survey "${surveyTitle}".\n\nPlease fill out the survey using the following link: ${googleFormLink}\n\nThank you!`, // Plain text body
        html: `<p>You are invited to participate in the survey <strong>"${surveyTitle}"</strong>.</p><p>Please fill out the survey using the following link: <a href="${googleFormLink}">${googleFormLink}</a></p><p>Thank you!</p>`, // HTML body
    };

    try {
        // Send the survey invitation email
        await transporter.sendMail(mailOptions);
        console.log(`Survey email sent to ${email}`);
    } catch (error) {
        console.error('Error sending survey email:', error);
        throw new Error('Failed to send survey email');
    }
}

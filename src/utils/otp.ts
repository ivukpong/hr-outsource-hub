import nodemailer from "nodemailer";

export async function sendOtpToEmail(email: string, otp: number) {
    // Set up nodemailer transporter (you will need to configure this for your email provider)
    const transporter = nodemailer.createTransport({
        service: "Gmail", // or your email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Verification OTP",
        text: `Your OTP is: ${otp}. It will expire in 15 minutes.`,
    };

    // // Send email
    const resp = await transporter.sendMail(mailOptions);

}

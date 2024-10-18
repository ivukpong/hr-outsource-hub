import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/db";
import { sendOtpToEmail } from "@/utils/otp";

export async function POST(request: NextRequest) {
    const { email } = await request.json();

    // Check if the user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Find OTP for the email
    const otpRecord = await prisma.otp.findUnique({
        where: { email }, // This should now work if email is unique
    });

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // If no OTP record exists, create a new one
    if (!otpRecord) {
        await prisma.otp.create({
            data: { email, otp },
        });
    } else {
        // If OTP record exists, update it with the new OTP
        await prisma.otp.update({
            where: { email }, // This should now work as well
            data: { otp: otp },
        });
    }



    await sendOtpToEmail(email, parseInt(otp))
    // (Optional) Send OTP to the user's email for password reset

    return NextResponse.json({ message: "OTP sent to email for password reset" }, { status: 200 });
}

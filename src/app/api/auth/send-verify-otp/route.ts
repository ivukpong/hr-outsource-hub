import { NextRequest, NextResponse } from 'next/server';
import { sendOtpToEmail } from "@/utils/otp"; // Assuming this utility sends the OTP email
import { prisma } from "@/utils/db"; // Import your Prisma client

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Generate a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Set OTP expiry time (15 minutes from now)
        const verifyAccountExpires = new Date(Date.now() + 15 * 60 * 1000);

        // Update user's record with OTP and expiry time
        await prisma.user.update({
            where: { email },
            data: {
                verifyAccountOtp: otp.toString(), // Make sure it's stored as a string if Prisma schema expects it
                verifyAccountExpires, // Store the expiry time as a Date object
            },
        });

        // Send OTP to user's email
        await sendOtpToEmail(email, otp);

        return NextResponse.json({
            success: true,
            message: "Verification OTP sent.",
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json(
            { success: false, message: "Error sending OTP" },
            { status: 500 }
        );
    }
}

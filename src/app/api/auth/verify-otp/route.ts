import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function POST(request: Request) {
    const { email, otp } = await request.json();

    // Find OTP
    const otpRecord = await prisma.otp.findUnique({
        where: { email },
    });

    if (!otpRecord || otpRecord.otp !== otp) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Verify the user account
    await prisma.user.update({
        where: { email },
        data: { isVerified: true },
    });

    // Delete the OTP after verification
    await prisma.otp.delete({
        where: { email },
    });

    return NextResponse.json({ message: "Account verified successfully" }, { status: 200 });
}

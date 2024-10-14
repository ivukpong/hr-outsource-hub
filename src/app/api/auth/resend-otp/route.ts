import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { sendOtpToEmail } from "@/utils/otp";

export async function POST(request: Request) {
    const { email } = await request.json();


    // Generate an OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store the OTP in the database
    await prisma.otp.update({
            where: { email },
            data: {
                otp
            },
        });

    await sendOtpToEmail(email, parseInt(otp))

    // (Optional) Send OTP to user's email (you need to integrate a service for this)

    return NextResponse.json(
        { message: "OTP sent to email" },
        { status: 201 }
    );
}

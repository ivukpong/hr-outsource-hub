import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/utils/db";
import { sendOtpToEmail } from "@/utils/otp";

export async function POST(request: Request) {
    const { name, email, password } = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });


    if (existingUser) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        if (!existingUser?.isVerified) {
            await sendOtpToEmail(email, parseInt(otp))
        }
        return NextResponse.json(
            { error: "User already exists", user: existingUser },
            { status: 400 }
        );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            isVerified: false,
        },
    });

    // Generate an OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store the OTP in the database
    await prisma.otp.create({
        data: {
            email,
            otp,
        },
    });

    await sendOtpToEmail(email, parseInt(otp))

    // (Optional) Send OTP to user's email (you need to integrate a service for this)

    return NextResponse.json(
        { message: "User created successfully, OTP sent to email" },
        { status: 201 }
    );
}

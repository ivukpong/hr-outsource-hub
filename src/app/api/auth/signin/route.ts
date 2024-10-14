import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/utils/db";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    // Find the user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is verified
    if (!user.isVerified) {
        return NextResponse.json(
            { error: "Account not verified" },
            { status: 403 }
        );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });


    return NextResponse.json(
        { message: "Sign in successful", token, user },
        { status: 200 }
    );
}

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/utils/db";

export async function POST(request: Request) {
    const { email, newPassword } = await request.json();


    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
    });

    return NextResponse.json(
        { message: "Password reset successful" },
        { status: 200 }
    );
}

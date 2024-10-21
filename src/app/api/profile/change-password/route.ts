import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/utils/db";

export async function PATCH(request: NextRequest) {
    const { id, oldPassword, newPassword } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        return NextResponse.json({ error: "Incorrect old password" }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: id },
        data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
}

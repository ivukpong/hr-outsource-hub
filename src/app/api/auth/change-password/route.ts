import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/utils/db";
import { getToken } from "next-auth/jwt";

export async function PATCH(request: NextRequest) {
    const token = await getToken({ req: request });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: token.userId } });

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        return NextResponse.json({ error: "Incorrect old password" }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: token.userId },
        data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
}

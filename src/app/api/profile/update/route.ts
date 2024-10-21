import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/utils/db';
import { Prisma } from '@prisma/client';

// Update user profile
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.formData();
        const id = body.get('id'); // Assuming the user ID is sent in the request body
        const name = body.get('name');
        const email = body.get('email');
        const designation = body.get('designation');
        const profilePic = body.get('profilePic');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
        }
        const updateData: { name?: string; email?: string; designation?: string; profilePic?: string } = {
            name: typeof name === 'string' ? name : undefined,
            email: typeof email === 'string' && email.trim() !== '' ? email : undefined,
            designation: typeof designation === 'string' ? designation : undefined,
            profilePic: typeof profilePic === 'string' ? profilePic : undefined, // Ensure it's a string or undefined
        };

        // Update the user in the database
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: updateData,
        });
        return NextResponse.json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'User not found.' }, { status: 404 });
            }
        }
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
    }
}

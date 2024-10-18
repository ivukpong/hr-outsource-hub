import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: ['/api/dashboard/:path*'],
};


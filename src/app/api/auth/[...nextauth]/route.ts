// File: src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the NextAuth configuration with explicit types
const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', required: true },
                password: { label: 'Password', type: 'password', required: true },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Missing email or password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (user && (await compare(credentials.password, user.password))) {
                    // Return the user object in the expected format
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        // You may want to include any other fields you need
                    } as unknown as User; // Cast to User type if necessary
                }

                return null; // Authentication failed
            },
        }),
    ],
    session: {
        strategy: 'jwt', // Correctly specified as a string but the type is inferred by NextAuthOptions
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};

// Default export for NextAuth API route
const handler = NextAuth(authOptions);

// You can define your API route handlers as follows
export { handler as GET, handler as POST };

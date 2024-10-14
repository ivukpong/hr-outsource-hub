import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define NextAuth configuration with proper types
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', required: true },
                password: { label: 'Password', type: 'password', required: true },
            },
            async authorize(credentials) {
                // Query the user from your database
                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                });

                // Validate credentials and return user if authenticated
                if (user && (await compare(credentials!.password, user.password))) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        // role: user.role, // Ensure role is returned with user
                    };
                }

                // Return null if authentication fails
                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt', // Use JWT strategy for session management
    },
    callbacks: {
        // JWT callback, including proper typing
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // token.role = user.role; // Pass role to the JWT token
            }
            return token;
        },

        // Session callback to include role in the session object
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                // session.user.role = token.role as string; // Add role to session
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);

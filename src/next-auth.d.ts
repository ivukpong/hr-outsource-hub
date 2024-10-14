// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            image?: string;
            // role: string;  // Add custom field `role`
        };
    }

    interface User {
        id: string;
        email: string;
        name?: string;
        image?: string;
        // role: string;  // Add custom field `role`
    }

    interface JWT {
        id: string;
        // role: string; // Add role to JWT token type
    }
}

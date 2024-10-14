// next.d.ts
import { NextRequest } from 'next/server';

declare module 'next/server' {
    export interface NextRequest {
        file?: {
            originalname: string;
            buffer: Buffer;
        };
    }
}
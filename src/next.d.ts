// next.d.ts
import { NextRequest as OriginalNextRequest } from 'next/server';

declare module 'next/request' {
    export interface NextRequest extends OriginalNextRequest {
        json(): Promise<unknown>;
        headers: Record<string, string | string[]>;
        url: string | URL | undefined;
        file?: {
            originalname: string;
            buffer: Buffer;
        };
    }
}

declare module 'streamifier' {
    import { Readable } from 'stream';

    interface Streamifier {
        createReadStream: (buffer: Buffer | string, options?: Record<string, unknown>) => Readable;
    }

    const streamifier: Streamifier;

    export default streamifier;
}


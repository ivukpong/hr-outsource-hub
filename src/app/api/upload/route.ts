import { NextResponse, NextRequest } from 'next/server';
import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Disable body parser
export async function POST(req: NextRequest) {
    try {
        // Parse the form data from the request
        const formData = await req.formData(); // req.formData() to access files
        const file = formData.get("file") as File; // Ensure this field name matches what you're sending from the frontend

        if (!file) {
            throw new Error("No file uploaded");
        }

        // Create a reference in Firebase Storage
        const storageRef = ref(storage, `uploads/${file.name}`);

        // Convert file to a Buffer
        const buffer = await file.arrayBuffer();

        // Upload the file to Firebase
        const snapshot = await uploadBytes(storageRef, new Uint8Array(buffer));

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return NextResponse.json({
            message: "File uploaded successfully",
            fileUrl: downloadURL,
        });
    } catch (error: unknown) {
        return NextResponse.json({
            error: "File upload failed",
            details: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}
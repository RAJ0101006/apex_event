import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { uploadMediaFile } from "@/lib/storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to upload files." },
        { status: 401 }
      );
    }

    // 2. Parse Form Data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "apex_events";

    if (!file) {
      return NextResponse.json(
        { error: "No file was provided in the request." },
        { status: 400 }
      );
    }

    // 3. File Size Validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit. Please select a smaller image or allow client compression." },
        { status: 400 }
      );
    }

    // 4. File Type Check
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, WebP, and GIF images are allowed." },
        { status: 400 }
      );
    }

    // 5. Convert to Buffer and store with magic byte validation
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadMediaFile(buffer, file.name, folder);

    return NextResponse.json({
      success: true,
      url: result.url,
      storagePublicId: result.storagePublicId,
      filename: result.filename,
      size: result.size,
      format: result.format,
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}

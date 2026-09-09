import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface StoredMedia {
  url: string;
  storagePublicId: string;
  filename: string;
  size: number;
  format: string;
}

/**
 * Validates actual binary magic bytes of the buffer to prevent spoofed file extensions
 */
export function validateImageMagicBytes(buffer: Buffer): { isValid: boolean; format?: string } {
  if (buffer.length < 12) return { isValid: false };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, format: "jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, format: "png" };
  }

  // WebP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, format: "webp" };
  }

  // GIF: 47 49 46 38 (GIF8)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { isValid: true, format: "gif" };
  }

  return { isValid: false };
}

/**
 * Uploads media file to Cloudinary if configured, or persists to local storage as fallback
 */
export async function uploadMediaFile(
  fileBuffer: Buffer,
  originalFilename: string,
  folder = "apex_events"
): Promise<StoredMedia> {
  const magicValidation = validateImageMagicBytes(fileBuffer);
  if (!magicValidation.isValid) {
    throw new Error("Invalid or corrupted image file. Please upload a genuine JPG, PNG, or WebP image.");
  }

  const format = magicValidation.format || "jpg";
  const sanitizedBase = path.parse(originalFilename).name.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
  const uniqueHash = crypto.randomBytes(8).toString("hex");
  const publicId = `${folder}/${sanitizedBase}_${uniqueHash}`;

  // 1. Cloudinary Integration (Production Persistent Cloud Storage)
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const stringToSign = `folder=${folder}&public_id=${sanitizedBase}_${uniqueHash}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

      const formData = new FormData();
      formData.append("file", new Blob([fileBuffer]), `${sanitizedBase}.${format}`);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);
      formData.append("public_id", `${sanitizedBase}_${uniqueHash}`);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          url: data.secure_url,
          storagePublicId: data.public_id,
          filename: `${sanitizedBase}.${format}`,
          size: fileBuffer.length,
          format,
        };
      } else {
        const errText = await response.text();
        console.error("Cloudinary upload failed:", errText);
      }
    } catch (cloudErr) {
      console.error("Cloudinary connection error:", cloudErr);
    }
  }

  // 2. Safe Local / Development Persistence Fallback
  // Ensure public/uploads directory exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const filename = `${sanitizedBase}_${uniqueHash}.${format}`;
  const localFilePath = path.join(uploadsDir, filename);

  await fs.writeFile(localFilePath, fileBuffer);

  return {
    url: `/uploads/${filename}`,
    storagePublicId: publicId,
    filename,
    size: fileBuffer.length,
    format,
  };
}

/**
 * Removes file from cloud storage or local disk
 */
export async function deleteMediaFile(storagePublicId?: string | null, url?: string | null): Promise<boolean> {
  if (!storagePublicId && !url) return false;

  // Cloudinary deletion
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret && storagePublicId) {
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const stringToSign = `public_id=${storagePublicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

      const formData = new FormData();
      formData.append("public_id", storagePublicId);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) return true;
    } catch (e) {
      console.error("Cloudinary deletion failed:", e);
    }
  }

  // Local file deletion
  if (url && url.startsWith("/uploads/")) {
    try {
      const filename = path.basename(url);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

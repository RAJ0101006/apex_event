"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, CheckCircle2, AlertCircle, RefreshCw, Image as ImageIcon } from "lucide-react";

export interface UploadedFileResult {
  url: string;
  storagePublicId?: string;
  filename: string;
  size: number;
}

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  status: "idle" | "compressing" | "uploading" | "success" | "error";
  progress: number;
  uploadedUrl?: string;
  storagePublicId?: string;
  error?: string;
}

interface ImageUploaderProps {
  onUploadSuccess?: (result: UploadedFileResult) => void;
  onBulkUploadSuccess?: (results: UploadedFileResult[]) => void;
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
}

/**
 * Client-side image compression using HTML5 Canvas
 */
async function compressImage(file: File, maxDim = 1920, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    // If SVG or GIF, don't re-compress on canvas
    if (file.type === "image/gif" || file.type === "image/svg+xml") {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve(blob && blob.size < file.size ? blob : file);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export default function ImageUploader({
  onUploadSuccess,
  onBulkUploadSuccess,
  folder = "apex_events",
  multiple = false,
  maxFiles = 20,
  label = "Upload Image from Device",
}: ImageUploaderProps) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addFilesToQueue = useCallback((newFiles: FileList | File[]) => {
    const validFiles: QueuedFile[] = [];
    const filesArray = Array.from(newFiles);

    for (const file of filesArray) {
      if (!file.type.startsWith("image/")) {
        alert(`File "${file.name}" is not an image and was skipped.`);
        continue;
      }

      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      validFiles.push({
        id,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        status: "idle",
        progress: 0,
      });
    }

    setQueue((prev) => (multiple ? [...prev, ...validFiles].slice(0, maxFiles) : validFiles.slice(0, 1)));
  }, [multiple, maxFiles]);

  const uploadSingleItem = async (item: QueuedFile): Promise<UploadedFileResult | null> => {
    setQueue((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: "compressing", progress: 20 } : f))
    );

    try {
      // Client-side compression
      const compressedBlob = await compressImage(item.file);

      setQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "uploading", progress: 50 } : f))
      );

      const formData = new FormData();
      formData.append("file", compressedBlob, item.name);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errJson.error || "Upload failed");
      }

      const data = await res.json();
      const result: UploadedFileResult = {
        url: data.url,
        storagePublicId: data.storagePublicId,
        filename: data.filename,
        size: data.size,
      };

      setQueue((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? {
                ...f,
                status: "success",
                progress: 100,
                uploadedUrl: data.url,
                storagePublicId: data.storagePublicId,
              }
            : f
        )
      );

      if (onUploadSuccess) {
        onUploadSuccess(result);
      }

      return result;
    } catch (error) {
      const msg = (error as Error).message || "Upload failed";
      setQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "error", error: msg, progress: 0 } : f))
      );
      return null;
    }
  };

  const handleUploadAll = async () => {
    setIsUploadingAll(true);
    const pendingItems = queue.filter((item) => item.status === "idle" || item.status === "error");
    const results: UploadedFileResult[] = [];

    for (const item of pendingItems) {
      const res = await uploadSingleItem(item);
      if (res) results.push(res);
    }

    setIsUploadingAll(false);
    if (results.length > 0 && onBulkUploadSuccess) {
      onBulkUploadSuccess(results);
    }
  };

  const handleRemove = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-foreground/80">{label}</label>

      {/* Drag & Drop Target */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-gray-200 hover:border-primary/50 bg-gray-50/50 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              addFilesToQueue(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Upload size={24} />
          </div>
          <div>
            <span className="font-bold text-foreground hover:underline">Click to browse device</span>
            <span className="text-foreground/60 text-sm"> or drag and drop images here</span>
          </div>
          <p className="text-xs text-foreground/50">
            Supports JPG, PNG, WebP (Auto-optimized &amp; compressed) • Max 10MB
          </p>
        </div>
      </div>

      {/* Queue & Previews */}
      {queue.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-bold text-foreground">
            <span>Selected Images ({queue.length})</span>
            {queue.some((i) => i.status === "idle" || i.status === "error") && (
              <button
                type="button"
                onClick={handleUploadAll}
                disabled={isUploadingAll}
                className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
              >
                {isUploadingAll && <RefreshCw size={14} className="animate-spin" />}
                <span>{isUploadingAll ? "Uploading..." : "Start Upload"}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-xs"
              >
                {/* Thumbnail Preview */}
                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative border border-gray-100">
                  <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Metadata & Status */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-foreground/50">{formatSize(item.size)}</p>

                  {/* Status Indicator */}
                  <div className="mt-1 flex items-center gap-1.5">
                    {item.status === "idle" && (
                      <span className="text-[10px] text-foreground/60 font-medium">Ready to upload</span>
                    )}
                    {item.status === "compressing" && (
                      <span className="text-[10px] text-amber-600 font-medium">Compressing...</span>
                    )}
                    {item.status === "uploading" && (
                      <span className="text-[10px] text-primary font-medium animate-pulse">Uploading...</span>
                    )}
                    {item.status === "success" && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Uploaded ✓
                      </span>
                    )}
                    {item.status === "error" && (
                      <span className="text-[10px] text-red-600 font-medium flex items-center gap-1 truncate" title={item.error}>
                        <AlertCircle size={12} /> {item.error || "Failed"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {item.status === "error" && (
                    <button
                      type="button"
                      onClick={() => uploadSingleItem(item)}
                      className="p-1.5 text-foreground/60 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                      title="Retry upload"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}
                  {item.status !== "uploading" && (
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemTitle?: string;
  itemThumbnail?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "warning" | "primary";
  isPending?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemTitle,
  itemThumbnail,
  confirmText = "Delete",
  confirmVariant = "danger",
  isPending = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 text-foreground/40 hover:text-foreground p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              confirmVariant === "danger"
                ? "bg-red-50 text-red-600"
                : confirmVariant === "warning"
                ? "bg-amber-50 text-amber-600"
                : "bg-primary/10 text-primary"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <h3 className="font-heading font-bold text-xl text-foreground">{title}</h3>
        </div>

        <p className="text-sm text-foreground/70 mb-4">{message}</p>

        {/* Item preview if provided */}
        {(itemTitle || itemThumbnail) && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-6">
            {itemThumbnail && (
              <img
                src={itemThumbnail}
                alt={itemTitle || "Thumbnail"}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            )}
            {itemTitle && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Item</p>
                <p className="text-sm font-bold text-foreground truncate">{itemTitle}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-bold text-foreground/70 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 ${
              confirmVariant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : confirmVariant === "warning"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isPending ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

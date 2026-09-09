"use client";

import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag } from "lucide-react";

export interface LightboxItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText?: string | null;
  description?: string | null;
  venue?: string | null;
  date?: string | null;
}

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function Lightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <span className="text-white/60 text-xs font-mono">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close Lightbox"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation - Prev Button */}
      {items.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-105"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Navigation - Next Button */}
      {items.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all hover:scale-105"
          aria-label="Next image"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Content Container */}
      <div
        className="max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image */}
        <div className="relative max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-white/10">
          <img
            src={currentItem.imageUrl}
            alt={currentItem.altText || currentItem.title}
            className="max-h-[70vh] w-auto max-w-full object-contain"
          />
        </div>

        {/* Caption and Project Details */}
        <div className="mt-4 text-center max-w-2xl px-4 text-white">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary/20 px-2.5 py-0.5 rounded-full border border-primary/30">
              {currentItem.category}
            </span>
            {currentItem.date && (
              <span className="text-white/60 text-xs flex items-center gap-1 font-mono">
                <Calendar size={12} />
                {currentItem.date}
              </span>
            )}
            {currentItem.venue && (
              <span className="text-white/60 text-xs flex items-center gap-1">
                <MapPin size={12} />
                {currentItem.venue}
              </span>
            )}
          </div>

          <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
            {currentItem.title}
          </h3>

          {currentItem.description && (
            <p className="text-sm text-white/80 mt-1 line-clamp-2 leading-relaxed">
              {currentItem.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

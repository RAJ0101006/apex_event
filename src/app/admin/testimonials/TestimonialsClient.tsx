"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Star, CheckCircle2, User } from "lucide-react";
import ImageUploader, { UploadedFileResult } from "../components/ImageUploader";
import ConfirmModal from "../components/ConfirmModal";
import { createTestimonial, deleteTestimonial } from "../actions";

interface TestimonialItem {
  id: string;
  customerName: string;
  photoUrl?: string | null;
  review: string;
  rating: number;
  eventType?: string | null;
  date?: string | null;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

export default function TestimonialsClient({ initialTestimonials }: { initialTestimonials: TestimonialItem[] }) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedFileResult | null>(null);
  const [deletingItem, setDeletingItem] = useState<TestimonialItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (uploadedImage) formData.set("photoUrl", uploadedImage.url);

    startTransition(async () => {
      try {
        await createTestimonial(formData);
        setIsAdding(false);
        setUploadedImage(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to add testimonial");
      }
    });
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    startTransition(async () => {
      try {
        await deleteTestimonial(deletingItem.id);
        setDeletingItem(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to remove testimonial");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Client Testimonials CMS</h1>
          <p className="text-foreground/60 text-sm mt-1">
            Manage genuine client reviews and wedding feedback. (No fake reviews are shown to visitors).
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>{isAdding ? "Close Form" : "Add Review"}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm animate-fade-in">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Add Client Testimonial</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <ImageUploader
              multiple={false}
              folder="apex_testimonials"
              label="Client / Couple Photo (Optional)"
              onUploadSuccess={(res) => setUploadedImage(res)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Client / Couple Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="e.g. Priya &amp; Rohan"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Event Type &amp; Date
                </label>
                <input
                  type="text"
                  name="eventType"
                  placeholder="e.g. Wedding Reception &bull; Surat (Jan 2026)"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <select
                  name="rating"
                  defaultValue="5"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                >
                  <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                  <option value="4">★★★★☆ (4 Stars - Great)</option>
                  <option value="3">★★★☆☆ (3 Stars - Good)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  defaultValue={0}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Client Review Quote *
              </label>
              <textarea
                name="review"
                required
                rows={4}
                placeholder="Quote the exact feedback shared by the client regarding decor, punctuality, and coordination..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                <input type="checkbox" name="featured" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span className="font-semibold">Featured on Public Homepage</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                <input type="checkbox" name="active" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span className="font-semibold">Active &amp; Visible</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-foreground/70 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-xs disabled:opacity-50"
              >
                {isPending ? "Saving Review..." : "Save Testimonial"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Testimonial?"
        message="Are you sure you want to remove this client review from the website?"
        itemTitle={deletingItem?.customerName}
        confirmText="Remove Review"
        confirmVariant="danger"
        isPending={isPending}
      />

      {testimonials.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-foreground/50">
          <Star size={36} className="mx-auto text-amber-400 mb-2 opacity-80" />
          <h3 className="font-heading font-bold text-lg text-foreground mb-1">No Testimonials Yet</h3>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            The CMS is fully prepared. To maintain strict integrity and authenticity, no fake reviews are displayed on the public site. Add genuine reviews as clients share their celebrations.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-xs"
          >
            Add First Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400 text-sm">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  {item.featured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-foreground/80 italic leading-relaxed mb-4">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.customerName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {item.customerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.customerName}</p>
                    {item.eventType && <p className="text-[10px] text-foreground/50">{item.eventType}</p>}
                  </div>
                </div>

                <button
                  onClick={() => setDeletingItem(item)}
                  className="p-1.5 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Review"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

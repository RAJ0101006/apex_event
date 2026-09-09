"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Upload,
} from "lucide-react";
import ImageUploader, { UploadedFileResult } from "../components/ImageUploader";
import ConfirmModal from "../components/ConfirmModal";
import { createEvent, updateEvent, deleteEvent, restoreEvent } from "../actions";

const CATEGORIES = [
  "All",
  "Marriage",
  "Engagement",
  "Couple Entry",
  "Carnival",
  "Pre-Wedding",
  "Corporate",
  "Birthday",
  "Other",
];

interface EventItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  storagePublicId?: string | null;
  altText?: string | null;
  description?: string | null;
  date?: string | null;
  venue?: string | null;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  isDeleted: boolean;
  createdAt: Date | string;
}

export default function GalleryClient({ initialEvents }: { initialEvents: EventItem[] }) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showInactive, setShowInactive] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Create Form State
  const [isAdding, setIsAdding] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedFileResult | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkUploadedList, setBulkUploadedList] = useState<UploadedFileResult[]>([]);
  const [bulkCategory, setBulkCategory] = useState("Marriage");

  // Edit Form State
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);

  // Delete Confirmation State
  const [deletingItem, setDeletingItem] = useState<EventItem | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    const matchesActive = showInactive ? true : (!e.isDeleted && e.active);

    return matchesSearch && matchesCategory && matchesActive;
  });

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadedImage) {
      alert("Please upload an image from your device before saving.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("imageUrl", uploadedImage.url);
    if (uploadedImage.storagePublicId) {
      formData.set("storagePublicId", uploadedImage.storagePublicId);
    }

    startTransition(async () => {
      try {
        await createEvent(formData);
        setIsAdding(false);
        setUploadedImage(null);
        form.reset();
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to create event");
      }
    });
  };

  const handleBulkSave = async () => {
    if (bulkUploadedList.length === 0) {
      alert("No images have been uploaded yet.");
      return;
    }

    startTransition(async () => {
      try {
        for (const item of bulkUploadedList) {
          const formData = new FormData();
          const cleanTitle = item.filename
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          formData.set("title", cleanTitle);
          formData.set("category", bulkCategory);
          formData.set("imageUrl", item.url);
          if (item.storagePublicId) formData.set("storagePublicId", item.storagePublicId);
          formData.set("altText", `${cleanTitle} - Apex Event Surat`);
          formData.set("featured", "false");
          formData.set("active", "true");
          formData.set("sortOrder", "0");

          await createEvent(formData);
        }
        setBulkMode(false);
        setBulkUploadedList([]);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Bulk save encountered an issue.");
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    if (uploadedImage) {
      formData.set("imageUrl", uploadedImage.url);
      if (uploadedImage.storagePublicId) formData.set("storagePublicId", uploadedImage.storagePublicId);
    } else {
      formData.set("imageUrl", editingItem.imageUrl);
    }

    startTransition(async () => {
      try {
        await updateEvent(editingItem.id, formData);
        setEditingItem(null);
        setUploadedImage(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to update event");
      }
    });
  };

  const confirmDeleteAction = async () => {
    if (!deletingItem) return;

    startTransition(async () => {
      try {
        await deleteEvent(deletingItem.id, isPermanentDelete);
        setDeletingItem(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to delete event");
      }
    });
  };

  const handleRestore = async (id: string) => {
    startTransition(async () => {
      try {
        await restoreEvent(id);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to restore event");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Gallery &amp; Portfolio Manager</h1>
          <p className="text-foreground/60 text-sm mt-1">
            Manage past project showcases with direct device uploads and auto-optimization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setBulkMode(!bulkMode);
              setIsAdding(false);
            }}
            className="px-4 py-2 bg-white border border-gray-200 text-foreground rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-xs"
          >
            {bulkMode ? "Switch to Single" : "Bulk Upload Mode"}
          </button>
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              setBulkMode(false);
            }}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>{isAdding ? "Close Form" : "Add Project"}</span>
          </button>
        </div>
      </div>

      {/* Bulk Upload Modal/Card */}
      {bulkMode && (
        <div className="bg-white border-2 border-primary/30 p-6 rounded-2xl shadow-sm space-y-5 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Bulk Image Uploader</h3>
              <p className="text-xs text-foreground/60 mt-0.5">
                Select multiple event photos from your device at once. They will be auto-compressed and imported into the chosen category.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
              Bulk Mode
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Assign Category to All
              </label>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
              >
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ImageUploader
            multiple
            maxFiles={20}
            folder="apex_events"
            label="Select Multiple Project Photos"
            onBulkUploadSuccess={(results) => {
              setBulkUploadedList(results);
            }}
          />

          {bulkUploadedList.length > 0 && (
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600">
                ✓ {bulkUploadedList.length} images ready to be saved to portfolio
              </span>
              <button
                type="button"
                onClick={handleBulkSave}
                disabled={isPending}
                className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {isPending ? "Saving All Projects..." : `Save ${bulkUploadedList.length} Projects to Portfolio`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Single Add Event Form */}
      {isAdding && !bulkMode && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm animate-fade-in">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Add New Portfolio Project</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-5">
            {/* Direct Device Image Upload */}
            <ImageUploader
              multiple={false}
              folder="apex_events"
              label="Project Photo (Direct Device Upload)"
              onUploadSuccess={(res) => setUploadedImage(res)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Royal Marigold Mandap"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Venue / Location (Optional)
                </label>
                <input
                  type="text"
                  name="venue"
                  placeholder="e.g. Sarthana Farm Campus, Surat"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Year / Date (Optional)
                </label>
                <input
                  type="text"
                  name="date"
                  placeholder="e.g. 2026"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe special themes, floral accents, pyros, or mandap detailing..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Image SEO Alt Text
                </label>
                <input
                  type="text"
                  name="altText"
                  placeholder="e.g. Luxury wedding mandap decor Surat Apex Event"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
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

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                <input type="checkbox" name="featured" className="rounded text-primary focus:ring-primary" />
                <span className="font-semibold">Feature on Homepage</span>
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
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-foreground/70 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !uploadedImage}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50 flex items-center gap-2"
              >
                {isPending ? "Saving Project..." : "Save Portfolio Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-xl text-foreground mb-4">Edit Portfolio Project</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Replace image option */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <img
                  src={uploadedImage ? uploadedImage.url : editingItem.imageUrl}
                  alt={editingItem.title}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{editingItem.title}</p>
                  <p className="text-[11px] text-foreground/50">
                    {uploadedImage ? "New image selected" : "Current image active"}
                  </p>
                </div>
              </div>

              <ImageUploader
                multiple={false}
                folder="apex_events"
                label="Replace Photo (Optional)"
                onUploadSuccess={(res) => setUploadedImage(res)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingItem.title}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingItem.category}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    defaultValue={editingItem.venue || ""}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Date/Year
                  </label>
                  <input
                    type="text"
                    name="date"
                    defaultValue={editingItem.date || ""}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingItem.description || ""}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    name="altText"
                    defaultValue={editingItem.altText || ""}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={editingItem.sortOrder}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editingItem.featured}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="font-semibold">Featured on Homepage</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingItem.active}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="font-semibold">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setUploadedImage(null);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-foreground/70 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDeleteAction}
        title={isPermanentDelete ? "Permanently Delete Project?" : "Archive Project?"}
        message={
          isPermanentDelete
            ? "This will permanently remove the project and its stored media. This action cannot be undone."
            : "This project will be moved to archived/trash. You can restore it later."
        }
        itemTitle={deletingItem?.title}
        itemThumbnail={deletingItem?.imageUrl}
        confirmText={isPermanentDelete ? "Delete Permanently" : "Move to Trash"}
        confirmVariant="danger"
        isPending={isPending}
      />

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-foreground/40" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, venue, description..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs text-foreground focus:border-primary focus:bg-white outline-none"
            />
          </div>

          {/* Show Inactive Toggle */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-foreground/70 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Show Inactive &amp; Archived</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-xs"
                  : "bg-gray-50 text-foreground/70 hover:bg-gray-100 hover:text-foreground border border-gray-200/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-2xl p-12 text-center text-foreground/50">
            <p className="font-heading font-bold text-lg text-foreground mb-1">No Projects Found</p>
            <p className="text-xs">Adjust your search or category filter, or add your first project.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-xs"
            >
              Add Project Now
            </button>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                event.isDeleted
                  ? "border-red-200 opacity-60 bg-red-50/20"
                  : !event.active
                  ? "border-gray-200 opacity-75"
                  : "border-gray-200 hover:border-primary/40"
              }`}
            >
              <div>
                {/* Image Container */}
                <div className="h-44 bg-gray-100 relative overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.altText || event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {event.featured && (
                      <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Star size={10} /> Featured
                      </span>
                    )}
                    {event.isDeleted && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        Archived
                      </span>
                    )}
                    {!event.active && !event.isDeleted && (
                      <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        Hidden
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {event.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-heading font-bold text-base text-foreground line-clamp-1">{event.title}</h4>
                  {event.venue && <p className="text-xs text-foreground/50 line-clamp-1 mt-0.5">{event.venue}</p>}
                  {event.description && (
                    <p className="text-xs text-foreground/70 line-clamp-2 mt-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-foreground/40">Order: {event.sortOrder}</span>

                <div className="flex items-center gap-1">
                  {event.isDeleted ? (
                    <>
                      <button
                        onClick={() => handleRestore(event.id)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Restore Project"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setIsPermanentDelete(true);
                          setDeletingItem(event);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingItem(event);
                          setUploadedImage(null);
                        }}
                        className="p-1.5 text-foreground/60 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setIsPermanentDelete(false);
                          setDeletingItem(event);
                        }}
                        className="p-1.5 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Archive Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

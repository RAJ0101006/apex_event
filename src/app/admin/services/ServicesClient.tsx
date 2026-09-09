"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Search, Star, Eye, EyeOff, RotateCcw } from "lucide-react";
import ImageUploader, { UploadedFileResult } from "../components/ImageUploader";
import ConfirmModal from "../components/ConfirmModal";
import { createService, updateService, deleteService } from "../actions";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  fullDescription?: string | null;
  imageUrl: string;
  icon?: string | null;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  isDeleted: boolean;
}

export default function ServicesClient({ initialServices }: { initialServices: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Create Form State
  const [isAdding, setIsAdding] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedFileResult | null>(null);

  // Edit State
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  // Delete State
  const [deletingItem, setDeletingItem] = useState<ServiceItem | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadedImage) {
      alert("Please upload a cover image for the service from your device.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("imageUrl", uploadedImage.url);

    startTransition(async () => {
      try {
        await createService(formData);
        setIsAdding(false);
        setUploadedImage(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to create service");
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
    } else {
      formData.set("imageUrl", editingItem.imageUrl);
    }

    startTransition(async () => {
      try {
        await updateService(editingItem.id, formData);
        setEditingItem(null);
        setUploadedImage(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to update service");
      }
    });
  };

  const confirmDeleteAction = async () => {
    if (!deletingItem) return;

    startTransition(async () => {
      try {
        await deleteService(deletingItem.id, isPermanentDelete);
        setDeletingItem(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to delete service");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Services Manager</h1>
          <p className="text-foreground/60 text-sm mt-1">
            Manage core services and exclusive specialties offered by APEX EVENT.
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingItem(null);
          }}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>{isAdding ? "Close Form" : "Add Service"}</span>
        </button>
      </div>

      {/* Add Service Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm animate-fade-in">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Add New Service</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <ImageUploader
              multiple={false}
              folder="apex_services"
              label="Service Cover Image (Direct Device Upload)"
              onUploadSuccess={(res) => setUploadedImage(res)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Royal Mandap Decor"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Short Description (Summary) *
              </label>
              <textarea
                name="description"
                required
                rows={2}
                placeholder="Brief summary for card display..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Full Description (Detailed Scope)
              </label>
              <textarea
                name="fullDescription"
                rows={3}
                placeholder="Full details of what is included (lighting, fabrics, setup time)..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                <input type="checkbox" name="featured" className="rounded text-primary focus:ring-primary" />
                <span className="font-semibold">Highlight as Specialty (Golden Badge)</span>
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
                disabled={isPending || !uploadedImage}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-xs disabled:opacity-50"
              >
                {isPending ? "Saving Service..." : "Save Service"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-xl text-foreground mb-4">Edit Service</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
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
                folder="apex_services"
                label="Replace Cover Image (Optional)"
                onUploadSuccess={(res) => setUploadedImage(res)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Service Title
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={editingItem.description}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editingItem.featured}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="font-semibold">Exclusive Specialty</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingItem.active}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="font-semibold">Active &amp; Visible</span>
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

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDeleteAction}
        title="Remove Service?"
        message="Are you sure you want to remove this service? It will no longer be visible on the public website."
        itemTitle={deletingItem?.title}
        itemThumbnail={deletingItem?.imageUrl}
        confirmText="Remove Service"
        confirmVariant="danger"
        isPending={isPending}
      />

      {/* Search Input */}
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 text-foreground/40" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services by title or description..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs text-foreground focus:border-primary focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
              !service.active ? "opacity-60 border-gray-200" : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <div>
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {service.featured && (
                  <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
                    <Star size={10} /> Exclusive Specialty
                  </span>
                )}
                {!service.active && (
                  <span className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    Hidden
                  </span>
                )}
              </div>

              <div className="p-5">
                <h4 className="font-heading font-bold text-lg text-foreground mb-2">{service.title}</h4>
                <p className="text-xs text-foreground/70 leading-relaxed">{service.description}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-foreground/40">Order: {service.sortOrder}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingItem(service);
                    setUploadedImage(null);
                  }}
                  className="p-1.5 text-foreground/60 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Service"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsPermanentDelete(false);
                    setDeletingItem(service);
                  }}
                  className="p-1.5 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Service"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

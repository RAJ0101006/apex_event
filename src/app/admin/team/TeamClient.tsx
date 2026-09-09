"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, User } from "lucide-react";
import ImageUploader, { UploadedFileResult } from "../components/ImageUploader";
import ConfirmModal from "../components/ConfirmModal";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "../actions";

interface TeamItem {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string | null;
  phone?: string | null;
  socialLinks?: string | null;
  visible: boolean;
  sortOrder: number;
  isDeleted: boolean;
}

export default function TeamClient({ initialTeam }: { initialTeam: TeamItem[] }) {
  const [team, setTeam] = useState<TeamItem[]>(initialTeam);
  const [isPending, startTransition] = useTransition();

  // Create Form State
  const [isAdding, setIsAdding] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedFileResult | null>(null);

  // Edit State
  const [editingItem, setEditingItem] = useState<TeamItem | null>(null);

  // Delete State
  const [deletingItem, setDeletingItem] = useState<TeamItem | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadedImage) {
      alert("Please upload a profile photo from your device.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("imageUrl", uploadedImage.url);

    startTransition(async () => {
      try {
        await createTeamMember(formData);
        setIsAdding(false);
        setUploadedImage(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to add team member");
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
        await updateTeamMember(editingItem.id, formData);
        setEditingItem(null);
        setUploadedImage(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to update team member");
      }
    });
  };

  const confirmDeleteAction = async () => {
    if (!deletingItem) return;

    startTransition(async () => {
      try {
        await deleteTeamMember(deletingItem.id, false);
        setDeletingItem(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to remove team member");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Team &amp; Crew Manager</h1>
          <p className="text-foreground/60 text-sm mt-1">
            Manage profiles and designations of APEX EVENT creative stylists and coordinators.
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
          <span>{isAdding ? "Close Form" : "Add Team Member"}</span>
        </button>
      </div>

      {/* Add Member Form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm animate-fade-in">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Add Team Member</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <ImageUploader
              multiple={false}
              folder="apex_team"
              label="Profile Photo (Direct Device Upload)"
              onUploadSuccess={(res) => setUploadedImage(res)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Kaushik Kikani"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Designation / Role *
                </label>
                <input
                  type="text"
                  name="role"
                  required
                  placeholder="e.g. Founder &amp; Creative Director"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Bio / Brief Profile
                </label>
                <input
                  type="text"
                  name="bio"
                  placeholder="e.g. Expert in thematic mandap conceptualization..."
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

            <div className="pt-2">
              <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                <input type="checkbox" name="visible" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span className="font-semibold">Public Visibility</span>
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
                {isPending ? "Adding Member..." : "Save Member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-xl text-foreground mb-4">Edit Team Profile</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <img
                  src={uploadedImage ? uploadedImage.url : editingItem.imageUrl}
                  alt={editingItem.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{editingItem.name}</p>
                  <p className="text-[11px] text-foreground/50">{editingItem.role}</p>
                </div>
              </div>

              <ImageUploader
                multiple={false}
                folder="apex_team"
                label="Replace Profile Photo (Optional)"
                onUploadSuccess={(res) => setUploadedImage(res)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingItem.name}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    defaultValue={editingItem.role}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Bio / Overview
                </label>
                <input
                  type="text"
                  name="bio"
                  defaultValue={editingItem.bio || ""}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={editingItem.sortOrder}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-foreground focus:border-primary outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                    <input
                      type="checkbox"
                      name="visible"
                      defaultChecked={editingItem.visible}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="font-semibold">Public Visibility</span>
                  </label>
                </div>
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
        title="Remove Team Member?"
        message="Are you sure you want to remove this profile from the website team roster?"
        itemTitle={deletingItem?.name}
        itemThumbnail={deletingItem?.imageUrl}
        confirmText="Remove Member"
        confirmVariant="danger"
        isPending={isPending}
      />

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all text-center flex flex-col justify-between group ${
              !member.visible ? "opacity-60 border-gray-200" : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <div className="p-6 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-gray-100 shadow-sm relative">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                {!member.visible && (
                  <span className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex items-center justify-center">
                    Hidden
                  </span>
                )}
              </div>

              <h4 className="font-heading font-bold text-lg text-foreground">{member.name}</h4>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{member.role}</p>
              {member.bio && <p className="text-xs text-foreground/60 mt-2 line-clamp-2">{member.bio}</p>}
            </div>

            <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-foreground/40">Order: {member.sortOrder}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingItem(member);
                    setUploadedImage(null);
                  }}
                  className="p-1.5 text-foreground/60 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setDeletingItem(member)}
                  className="p-1.5 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Member"
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

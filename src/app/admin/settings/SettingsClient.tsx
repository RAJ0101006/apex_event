"use client";

import { useState, useTransition } from "react";
import { Settings, Save, CheckCircle2, Phone, Mail, MapPin, Globe, Sparkles } from "lucide-react";
import ImageUploader, { UploadedFileResult } from "../components/ImageUploader";
import { updateBusinessSettings } from "../actions";

interface BusinessSettingsData {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string | null;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  aboutTitle: string;
  aboutText?: string | null;
  metaTitle: string;
  metaDescription: string;
  keywords?: string | null;
}

export default function SettingsClient({ initialSettings }: { initialSettings: BusinessSettingsData }) {
  const [settings, setSettings] = useState<BusinessSettingsData>(initialSettings);
  const [heroImage, setHeroImage] = useState<UploadedFileResult | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (heroImage) formData.set("heroImageUrl", heroImage.url);

    startTransition(async () => {
      try {
        await updateBusinessSettings(formData);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 4000);
      } catch (err) {
        alert((err as Error).message || "Failed to update business settings");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Website &amp; Business Settings</h1>
          <p className="text-foreground/60 text-sm mt-1">
            Centralized single source of truth for business contact details, hero branding, and SEO metadata.
          </p>
        </div>
        {isSuccess && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. General & Brand */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles size={18} className="text-primary" />
            <h3 className="font-heading font-bold text-lg text-foreground">General Brand Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                defaultValue={settings.businessName}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                name="tagline"
                defaultValue={settings.tagline}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact & Location Information */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Phone size={18} className="text-primary" />
            <h3 className="font-heading font-bold text-lg text-foreground">Contact &amp; Physical Location</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Phone Number (Clickable tel:)
              </label>
              <input
                type="text"
                name="phone"
                defaultValue={settings.phone}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                name="whatsapp"
                defaultValue={settings.whatsapp}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={settings.email}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Full Physical Address (Surat Campus)
              </label>
              <textarea
                name="address"
                rows={2}
                defaultValue={settings.address}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Google Maps Directions URL
              </label>
              <textarea
                name="googleMapsUrl"
                rows={2}
                defaultValue={settings.googleMapsUrl}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Social Media Links */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Globe size={18} className="text-primary" />
            <h3 className="font-heading font-bold text-lg text-foreground">Social Profiles</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                defaultValue={settings.instagramUrl}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Facebook URL (Optional)
              </label>
              <input
                type="url"
                name="facebookUrl"
                defaultValue={settings.facebookUrl || ""}
                placeholder="https://facebook.com/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                YouTube URL (Optional)
              </label>
              <input
                type="url"
                name="youtubeUrl"
                defaultValue={settings.youtubeUrl || ""}
                placeholder="https://youtube.com/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Homepage Hero & CTAs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Settings size={18} className="text-primary" />
            <h3 className="font-heading font-bold text-lg text-foreground">Homepage Hero Configuration</h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
              Hero Headline
            </label>
            <input
              type="text"
              name="heroTitle"
              defaultValue={settings.heroTitle}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
              Hero Subtitle
            </label>
            <textarea
              name="heroSubtitle"
              rows={2}
              defaultValue={settings.heroSubtitle}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                name="primaryCtaText"
                defaultValue={settings.primaryCtaText}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Secondary CTA Button Label
              </label>
              <input
                type="text"
                name="secondaryCtaText"
                defaultValue={settings.secondaryCtaText}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
              About Section Brand Story
            </label>
            <textarea
              name="aboutText"
              rows={4}
              defaultValue={settings.aboutText || ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* 5. SEO & Social Sharing (OpenGraph) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Globe size={18} className="text-primary" />
            <h3 className="font-heading font-bold text-lg text-foreground">SEO &amp; Search Engine Optimization</h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
              Global Meta Title
            </label>
            <input
              type="text"
              name="metaTitle"
              defaultValue={settings.metaTitle}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              rows={3}
              defaultValue={settings.metaDescription}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
              Target Local SEO Keywords
            </label>
            <input
              type="text"
              name="keywords"
              defaultValue={settings.keywords || ""}
              placeholder="wedding decorators in Surat, event planner Surat, engagement decor Surat..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} />
            <span>{isPending ? "Saving All Settings..." : "Save Business Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { createLead } from "../admin/actions";

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    phone: string;
    service: string;
    date: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get("name") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const service = (formData.get("service") as string) || "Event Decor";
    const date = (formData.get("date") as string) || "";

    // Client-side quick check
    if (!name || name.length < 2) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    startTransition(async () => {
      const result = await createLead(formData);
      if (result && result.error) {
        setErrorMessage(result.error);
      } else {
        setSubmittedData({ name, phone, service, date });
        setIsSuccess(true);
        form.reset();
      }
    });
  };

  if (isSuccess && submittedData) {
    const waText = `Hello APEX EVENT, I have submitted an inquiry.\nName: ${submittedData.name}\nEvent Date: ${submittedData.date}\nService: ${submittedData.service}\nPlease connect with me.`;
    const waLink = `https://wa.me/919023815963?text=${encodeURIComponent(waText)}`;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-primary/10 border border-primary/30 p-8 rounded-2xl text-center space-y-4 animate-fade-in"
      >
        <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="font-heading text-2xl font-bold text-foreground">Inquiry Received!</h3>
        <p className="text-foreground/75 text-sm max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-foreground">{submittedData.name}</strong>. Our team in Surat has received your inquiry for <strong>{submittedData.service}</strong> and will contact you promptly.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl text-xs hover:bg-[#20b858] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            <span>Chat Instantly on WhatsApp</span>
          </a>
          <button
            onClick={() => setIsSuccess(false)}
            className="w-full sm:w-auto px-5 py-3 border border-gray-200 bg-white text-foreground/70 font-semibold rounded-xl text-xs hover:bg-gray-50 transition-colors"
          >
            Send Another Inquiry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot field for bot protection (Hidden from real users) */}
      <input
        type="text"
        name="website_hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Kaushal Patel"
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="e.g. 9876543210"
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
            Event Date *
          </label>
          <input
            type="date"
            name="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
            Service Required *
          </label>
          <select
            name="service"
            required
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xs"
          >
            <option value="Marriage Events">Marriage &amp; Mandap Decor</option>
            <option value="Engagement Decor">Engagement Stage Styling</option>
            <option value="Grand Couple Entry">Grand Couple Entry (Pyros &amp; Fog FX)</option>
            <option value="Carnivals & Pre-Wedding">Carnivals, Haldi &amp; Sangeet</option>
            <option value="Bespoke Complete Event">Bespoke Full Event Management</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
            City / Venue (Optional)
          </label>
          <input
            type="text"
            name="venue"
            placeholder="e.g. Surat, Navsari, Bardoli"
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
            Estimated Budget (Optional)
          </label>
          <select
            name="budget"
            defaultValue=""
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xs"
          >
            <option value="">Select Estimated Range</option>
            <option value="₹50,000 - ₹1,50,000">₹50,000 - ₹1,50,000</option>
            <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000</option>
            <option value="₹3,00,000 - ₹6,00,000">₹3,00,000 - ₹6,00,000</option>
            <option value="₹6,00,000+">₹6,00,000+ (Luxury Execution)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
          Tell Us About Your Celebration
        </label>
        <textarea
          name="message"
          rows={3}
          placeholder="Share your theme preferences, preferred flowers, entry special effects, or approximate guest count..."
          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xs"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/95 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Submitting Inquiry...</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>Send Event Inquiry</span>
          </>
        )}
      </button>
    </form>
  );
}

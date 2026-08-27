"use client";

import { useState } from "react";
import { createLead } from "../admin/actions";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    await createLead(formData);
    setIsSubmitting(false);
    setIsSuccess(true);
    // Reset form would normally go here (e.g., using a ref)
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-primary/20 border border-primary/50 text-center p-8 rounded-2xl"
      >
        <h3 className="font-heading text-2xl font-bold text-primary mb-2">Thank You!</h3>
        <p className="text-white/80">Your inquiry has been received. We will get back to you shortly.</p>
        <button onClick={() => setIsSuccess(false)} className="mt-6 px-6 py-2 bg-primary text-card font-bold rounded-full">
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-foreground/60 mb-1">Name</label>
          <input type="text" name="name" required className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-3 text-foreground focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm text-foreground/60 mb-1">Phone Number</label>
          <input type="tel" name="phone" required className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-3 text-foreground focus:border-primary outline-none transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-foreground/60 mb-1">Event Date</label>
          <input type="date" name="date" required className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-3 text-foreground focus:border-primary outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-sm text-foreground/60 mb-1">Service Required</label>
          <select name="service" required className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-3 text-foreground focus:border-primary outline-none transition-colors">
            <option value="Marriage Decor">Marriage Decor</option>
            <option value="Engagement">Engagement</option>
            <option value="Couple Entry">Grand Couple Entry</option>
            <option value="Carnival">Carnival & Pre-Wedding</option>
            <option value="Custom Bespoke">Custom Bespoke</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm text-foreground/60 mb-1">Estimated Budget (Optional)</label>
        <input type="text" name="budget" className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-3 text-foreground focus:border-primary outline-none transition-colors" placeholder="e.g. ₹50,000 - ₹1,00,000" />
      </div>
      <div>
        <label className="block text-sm text-foreground/60 mb-1">Message</label>
        <textarea name="message" rows={4} className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-3 text-foreground focus:border-primary outline-none transition-colors" placeholder="Tell us about your dream event..."></textarea>
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary/90 shadow-md transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}

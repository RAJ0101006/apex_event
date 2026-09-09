"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, HelpCircle, Eye, EyeOff } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { createFaq, deleteFaq } from "../actions";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  sortOrder: number;
}

export default function FaqsClient({ initialFaqs }: { initialFaqs: FaqItem[] }) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingItem, setDeletingItem] = useState<FaqItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await createFaq(formData);
        setIsAdding(false);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to create FAQ");
      }
    });
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    startTransition(async () => {
      try {
        await deleteFaq(deletingItem.id);
        setDeletingItem(null);
        window.location.reload();
      } catch (err) {
        alert((err as Error).message || "Failed to remove FAQ");
      }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">FAQ Manager</h1>
          <p className="text-foreground/60 text-sm mt-1">
            Manage answers to common client questions displayed in the public FAQ section.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>{isAdding ? "Close Form" : "Add FAQ"}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm animate-fade-in">
          <h3 className="font-heading font-bold text-xl text-foreground mb-4">Add Frequently Asked Question</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue="General"
                  placeholder="e.g. Booking, Locations, Couple Entry"
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
                Question *
              </label>
              <input
                type="text"
                name="question"
                required
                placeholder="e.g. How early should we book our wedding decor in Surat?"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                Answer *
              </label>
              <textarea
                name="answer"
                required
                rows={4}
                placeholder="Provide a clear, factual answer..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 text-sm text-foreground/80 cursor-pointer">
                <input type="checkbox" name="active" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span className="font-semibold">Active &amp; Visible on Public Website</span>
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
                {isPending ? "Saving..." : "Save Question"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Question?"
        message="Are you sure you want to remove this FAQ from the public website?"
        itemTitle={deletingItem?.question}
        confirmText="Delete FAQ"
        confirmVariant="danger"
        isPending={isPending}
      />

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-primary/40 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-foreground/70 px-2 py-0.5 rounded">
                  {faq.category}
                </span>
                <span className="text-[11px] text-foreground/40">Order: {faq.sortOrder}</span>
              </div>
              <h4 className="font-heading font-bold text-base text-foreground mb-1">{faq.question}</h4>
              <p className="text-xs text-foreground/70 leading-relaxed">{faq.answer}</p>
            </div>

            <button
              onClick={() => setDeletingItem(faq)}
              className="p-1.5 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end md:self-start"
              title="Remove FAQ"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

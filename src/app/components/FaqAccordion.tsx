"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs.length > 0 ? faqs[0].id : null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
              isOpen
                ? "bg-white border-primary/40 shadow-sm"
                : "bg-white/80 hover:bg-white border-gray-200/80"
            }`}
          >
            <button
              onClick={() => toggle(faq.id)}
              className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="font-heading font-bold text-base sm:text-lg text-foreground">
                {faq.question}
              </span>
              <span
                className={`p-2 rounded-full transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? "rotate-180 bg-primary/10 text-primary" : "text-foreground/40"
                }`}
              >
                <ChevronDown size={18} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 sm:px-6 pb-6 text-foreground/75 text-sm sm:text-base leading-relaxed border-t border-gray-50 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

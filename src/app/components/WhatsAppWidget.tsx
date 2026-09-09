"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppWidget({ phone = "919023815963" }: { phone?: string }) {
  const cleanPhone = phone.replace(/\D/g, "");
  const defaultMsg = encodeURIComponent(
    "Hello APEX EVENT, I would like to enquire about wedding & event decor services in Surat."
  );
  const waUrl = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=${defaultMsg}`;

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:bg-[#20b858] transition-all flex items-center justify-center group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      aria-label="Chat with Apex Event on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
        Chat with Us
      </span>
    </motion.a>
  );
}

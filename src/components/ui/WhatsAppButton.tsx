"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { ContactSettings } from "@/services/settings";

const DEFAULT_WHATSAPP = "9779702032444";

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "site_settings", "contact"), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as ContactSettings;
        setWhatsappNumber(data.whatsapp.replace(/\+/g, ""));
      }
    });
    return () => unsubscribe();
  }, []);

  const message = encodeURIComponent("Hello, I want to know about your coffee.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/20 hover:bg-[#128C7E] transition-colors"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="sr-only">WhatsApp</span>
      
      {/* Glow Effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10"></span>
    </motion.a>
  );
}

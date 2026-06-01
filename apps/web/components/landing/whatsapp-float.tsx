"use client";

import { motion } from "framer-motion";

import { CONTACT_CONFIG } from "@/lib/config";

export function WhatsAppFloat() {
  const coachPhone = CONTACT_CONFIG.whatsappPhone;
  const message = encodeURIComponent(CONTACT_CONFIG.whatsappDefaultMessage);

  return (
    <div className="fixed bottom-6 start-6 z-50 pointer-events-auto hidden md:block">
      <motion.a
        href={`https://wa.me/${coachPhone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: 1.5 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-success text-white shadow-[0_4px_24px_rgba(0,214,143,0.4)] cursor-pointer focus:outline-none"
        aria-label="تواصل معنا عبر واتساب"
      >
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-25" />
        
        {/* WhatsApp Icon */}
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.48 2 2 6.48 2 12c0 2.17.57 4.2 1.57 5.96L2 22l4.24-1.12C7.96 21.85 9.92 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.72 0-3.43-.46-4.9-1.34l-.35-.21-2.9.76.78-2.83-.23-.37C3.49 14.53 3 12.87 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9-4.04 9-9 9z"/>
        </svg>
      </motion.a>
    </div>
  );
}

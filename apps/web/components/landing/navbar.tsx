"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const links = [
  { label: "عن الكوتش", href: "#about" },
  { label: "احسب احتياجك", href: "#calculator" },
  { label: "التحولات", href: "#transformations" },
  { label: "الأسعار", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "glass py-3 border-b border-white/10"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#hero" 
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center gap-3 group select-none cursor-pointer"
        >
          <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="Eagle Gym Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-white hover:text-accent transition-colors font-display font-black tracking-widest text-xl">
            EAGLE <span className="text-accent">GYM</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <div 
            className="flex items-center gap-1 relative bg-white/[0.02] p-1 rounded-full border border-white/5"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {links.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: "smooth" });
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                className="relative text-text-2 hover:text-text-1 px-4 py-2 transition-colors text-xs font-semibold rounded-full cursor-pointer"
              >
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute inset-0 bg-white/5 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          <Button href="/login" variant="ghost" size="sm" className="text-text-2 hover:text-accent font-semibold">تسجيل الدخول</Button>
          <Button href="/apply" size="sm" className="shadow-[0_0_15px_rgba(255, 30, 39, 0.3)] hover:shadow-[0_0_20px_rgba(255, 30, 39, 0.5)] transition-all">تقديم طلب</Button>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-1 p-2 cursor-pointer bg-white/5 border border-white/10 rounded-lg transition-colors hover:bg-white/10"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass border-t border-white/10 absolute top-full inset-x-0"
          >
            <div className="px-6 py-6 space-y-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block text-text-2 hover:text-text-1 transition-colors py-2 text-lg font-medium cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button href="/login" variant="outline" className="w-full text-text-1" size="lg">تسجيل الدخول</Button>
                <Button href="/apply" className="w-full" size="lg">تقديم طلب</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CONTACT_CONFIG } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 py-16 bg-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9">
                <Image
                  src="/images/logo.png"
                  alt="Eagle Gym Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-display font-black text-3xl text-accent tracking-wider">EAGLE GYM</h3>
            </div>
            <p className="text-text-2 text-sm max-w-sm leading-relaxed mb-6">
              منصة التدريب الأونلاين الأولى في مصر. نقدم أنظمة تدريب وتغذية علمية ومخصصة بالكامل لمساعدتك في تحقيق أهدافك بأسرع وقت وأقل جهد.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                {
                  name: "Instagram",
                  href: CONTACT_CONFIG.instagramUrl,
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                    </svg>
                  )
                },
                {
                  name: "Facebook",
                  href: CONTACT_CONFIG.facebookUrl,
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  )
                },
                {
                  name: "YouTube",
                  href: CONTACT_CONFIG.youtubeUrl,
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )
                },
                {
                  name: "TikTok",
                  href: CONTACT_CONFIG.tiktokUrl,
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.58-.67-.02 2.44-.01 4.88-.01 7.32-.03 1.34-.36 2.71-1.07 3.84-.79 1.34-2.16 2.38-3.72 2.77-1.48.38-3.13.27-4.54-.37-1.72-.75-3.08-2.31-3.56-4.12-.55-2.02-.15-4.29 1.1-5.99 1.16-1.61 3.04-2.64 5.03-2.78v4.06c-.84.07-1.68.49-2.19 1.18-.55.72-.67 1.7-.35 2.53.31.84 1.07 1.48 1.95 1.66.86.18 1.8-.06 2.42-.69.53-.52.79-1.27.77-2.01-.02-3.41-.01-6.82-.01-10.23z"/>
                    </svg>
                  )
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface-high border border-border flex items-center justify-center text-text-2 hover:text-accent hover:border-accent/40 transition-all duration-300 shadow-md"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-text-1 font-bold mb-4 text-sm tracking-wider">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { label: "الرئيسية", href: "#hero" },
                { label: "عن الكوتش", href: "#about" },
                { label: "احسب احتياجك", href: "#calculator" },
                { label: "التحولات", href: "#transformations" },
                { label: "الأسعار", href: "#pricing" }
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-text-3 hover:text-accent transition-colors text-sm font-semibold">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-text-1 font-bold mb-4 text-sm tracking-wider">تواصل معنا</h4>
            <ul className="space-y-3 text-text-3 text-sm font-semibold">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span className="text-text-2">{CONTACT_CONFIG.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span className="text-text-2" dir="ltr">{CONTACT_CONFIG.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span className="text-text-2">{CONTACT_CONFIG.location}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-12 pt-8 text-center flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-3 text-xs font-semibold">
            © {new Date().getFullYear()} EAGLE Coaching. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 text-xs text-text-3 font-semibold">
            <a href="/privacy" className="hover:text-accent transition-colors">سياسة الخصوصية</a>
            <a href="/terms" className="hover:text-accent transition-colors">شروط الخدمة</a>
          </div>
          <p className="text-text-3 text-xs">
            تصميم مخصص فاخر لمنصة EAGLE للتدريب.
          </p>
        </div>
      </div>
    </footer>
  );
}

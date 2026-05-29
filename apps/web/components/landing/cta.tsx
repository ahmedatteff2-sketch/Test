"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCMSContent } from "@/lib/cms";

const defaultCTA = {
  badgeText: "أماكن متاحة الآن للتدريب",
  title: "جاهز تبدأ رحلة التحول؟",
  description: "الخطوة الأولى هي الأصعب — بعدها كل حاجة بتبقى أسهل. سجّل دلوقتي وابدأ رحلتك للوصول للجسم اللي بتحلم بيه تحت إشراف علمي متكامل.",
  ctaText: "سجّل الآن — مجاناً",
  secondaryText: "تواصل معنا",
  features: ["✓ بدون التزام", "✓ استشارة مجانية", "✓ خطة مخصصة"],
};

export function CTA() {
  const content = useCMSContent("cta", defaultCTA);
  const badgeText = content?.badgeText || defaultCTA.badgeText;
  const title = content?.title || defaultCTA.title;
  const description = content?.description || defaultCTA.description;
  const ctaText = content?.ctaText || defaultCTA.ctaText;
  const features = content?.features || defaultCTA.features;

  const whatsappUrl = `https://wa.me/201012345678?text=${encodeURIComponent("مرحباً كوتش، حابب استفسر عن باقات التدريب المتاحة وطريقة الاشتراك 🦅")}`;

  return (
    <section id="cta" className="relative py-32 overflow-hidden bg-bg">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255, 30, 39, 0.18) 0%, transparent 60%)",
          }}
        />
        {/* Futuristic background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 z-0 pointer-events-none" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="glass p-12 md:p-16 rounded-[var(--radius-xl)] border-accent/20 bg-surface/80 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(255,30,39,0.1)] relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-info/10 rounded-full blur-[80px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 glass-accent rounded-full px-5 py-2 mx-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-ping" />
              <span className="text-sm font-semibold text-accent-text">{badgeText}</span>
            </div>
            
            <h2 className="font-display font-extrabold text-white text-4xl md:text-6xl leading-[1.1] tracking-tight max-w-3xl mx-auto">
              {title.includes("رحلة التحول") ? (
                <>
                  {title.split("رحلة التحول")[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#FF453A] drop-shadow-[0_0_25px_rgba(255,30,39,0.35)]">رحلة التحول</span>
                  {title.split("رحلة التحول")[1]}
                </>
              ) : (
                title
              )}
            </h2>
            
            <p className="text-text-2 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                href="/apply" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-6 rounded-full shadow-[0_0_20px_rgba(255,30,39,0.3)] hover:shadow-[0_0_35px_rgba(255,30,39,0.5)] transition-all duration-300 animate-pulse-glow font-bold"
              >
                {ctaText}
              </Button>
              <Button 
                href={whatsappUrl} 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-white/10 hover:bg-white/5 gap-2 transition-all duration-300 font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 text-success fill-success" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.48 2 2 6.48 2 12c0 2.17.57 4.2 1.57 5.96L2 22l4.24-1.12C7.96 21.85 9.92 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.72 0-3.43-.46-4.9-1.34l-.35-.21-2.9.76.78-2.83-.23-.37C3.49 14.53 3 12.87 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9-4.04 9-9 9z"/>
                </svg>
                <span>تواصل واتساب</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-border/40">
              {features.map((t) => {
                const text = t.replace("✓ ", "").replace("✓", "");
                return (
                  <div key={t} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent font-bold text-xs select-none">
                      ✓
                    </span>
                    <span className="text-text-2 text-sm font-semibold">{text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";
 
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCMSContent } from "@/lib/cms";
import { cn } from "@/lib/utils";

const defaultHero = {
  headline: "ابني جسمك\nاكسر حدودك",
  subheadline: "أقوى منصة تدريب أونلاين في مصر. جداول تمرين مخصصة، نظام غذائي محسوب بالجرامات، ومتابعة يومية تضمن لك الوصول لهدفك في أسرع وقت.",
  ctaText: "ابدأ رحلتك الآن",
  metric1Value: "+2,400",
  metric1Label: "مشترك",
  metric2Value: "98%",
  metric2Label: "نسبة الالتزام",
  metric3Value: "4.9★",
  metric3Label: "تقييم المشتركين",
};

export function Hero() {
  const content = useCMSContent("hero", defaultHero);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_gym_bg.png"
          alt="Gym Background"
          fill
          className="object-cover object-center opacity-40 scale-105 transition-transform duration-[10s] ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/90 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/75 to-transparent" />
      </div>

      {/* Futuristic Background Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none" />
      <div className="absolute top-[-10%] start-[-10%] w-[50%] aspect-square rounded-full bg-accent/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] end-[-10%] w-[40%] aspect-square rounded-full bg-info/5 blur-[100px] pointer-events-none z-0" />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-6 text-xs font-semibold rounded-full bg-surface-high/80 backdrop-blur-md text-accent border border-accent/30 shadow-[0_0_15px_rgba(197,162,93,0.15)]">
              <span>🥇</span>
              <span>أقوى منصة تدريب أونلاين في مصر</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-extrabold text-white mb-6 leading-[1.05] tracking-tight whitespace-pre-line"
          >
            {content.headline.split("\n").map((line, idx) => (
              <span key={idx}>
                {idx > 0 ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#D4AF37] drop-shadow-[0_0_30px_rgba(197,162,93,0.3)]">
                    {line}
                  </span>
                ) : (
                  line
                )}
                {idx < content.headline.split("\n").length - 1 && <br />}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-text-2 mb-10 max-w-2xl leading-relaxed"
          >
            {content.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              href="/apply"
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(197,162,93,0.4)] hover:shadow-[0_0_35px_rgba(197,162,93,0.6)] hover:scale-105 active:scale-98 transition-all duration-300 hover:animate-pulse-glow font-bold"
            >
              {content.ctaText}
            </Button>
            <Button
              href="#pricing"
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-white/20 hover:bg-white/5 hover:scale-105 active:scale-98 transition-all duration-300 font-bold"
            >
              استكشف الخطط
            </Button>
          </motion.div>

          {/* Trust Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 inline-flex flex-wrap items-center gap-4 bg-surface-high/60 backdrop-blur-md border border-accent/20 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-xl"
          >
            <div className="flex -space-x-3.5 rtl:space-x-reverse">
              {[
                { name: "أحمد", color: "from-accent/20 to-accent/40 text-accent border-accent/20" },
                { name: "محمد", color: "from-info/20 to-info/40 text-info border-info/20" },
                { name: "عمر", color: "from-warning/20 to-warning/40 text-warning border-warning/20" },
                { name: "سارة", color: "from-purple-500/20 to-purple-500/40 text-purple-400 border-purple-500/20" },
              ].map((av, idx) => (
                <div key={idx} className={cn("w-9 h-9 rounded-full border-2 border-bg bg-gradient-to-br flex items-center justify-center text-xs font-black select-none", av.color)}>
                  {av.name[0]}
                </div>
              ))}
            </div>
            <div className="text-text-1 text-sm font-semibold flex flex-col">
              <span className="text-white flex items-center gap-1.5">
                <span className="text-accent">★ 4.9</span> (أكثر من 1,000 مشترك)
              </span>
              <span className="text-xs text-text-2 mt-0.5">حقّقوا خسارة متوسط 3 كجم في أول أسبوع! 💥</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
        className="relative bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 cursor-pointer pointer-events-auto select-none mt-auto"
      >
        <span className="text-[10px] text-text-3 font-semibold uppercase tracking-wider">اكتشف المزيد</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-accent"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

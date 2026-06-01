"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCMSContent } from "@/lib/cms";
import { BeforeAfterSlider } from "./before-after-slider";

const defaultTrainees = [
  {
    name: "عمر خالد",
    title: "من 120 كيلوغرام إلى 85 كيلوغرام في 6 أشهر",
    description: "التزام كامل ومتابعة مستمرة أدت إلى خسارة الدهون وبناء الكتلة العضلية وتحسين الصحة العامة بشكل ملحوظ. النظام كان مرن جداً ومناسب لأسلوب حياتي المزدحم.",
    beforeImage: "/images/client_before.png",
    afterImage: "/images/client_after.png",
    beforeLabel: "قبل (120 كجم)",
    afterLabel: "بعد (85 كجم)",
    stats: [
      { value: "35 كجم", label: "وزن مفقود" },
      { value: "-22%", label: "نسبة الدهون" },
      { value: "6 أشهر", label: "المدة" }
    ],
    tag: "خسارة وزن وسمنة مفرطة"
  },
  {
    name: "محمد علي",
    title: "من جسم نحيف 62 كجم إلى 78 كجم عضلات في 8 أشهر",
    description: "كنت أعاني من النحافة وصعوبة زيادة الوزن. مع جدول التمرين عالي الكثافة المخصص والتغذية فائقة السعرات، تمكنت من زيادة 16 كجم كتلة عضلية صافية وتحسين القوة العامة.",
    beforeImage: "/images/client_before.png", // Reuse image with custom labels/stats
    afterImage: "/images/client_after.png",
    beforeLabel: "قبل (62 كجم)",
    afterLabel: "بعد (78 كجم)",
    stats: [
      { value: "+16 كجم", label: "كتلة عضلية" },
      { value: "-5%", label: "نسبة الدهون" },
      { value: "8 أشهر", label: "المدة" }
    ],
    tag: "ضخامة وزيادة عضلات"
  },
  {
    name: "ياسين محمود",
    title: "تنشيف وإبراز العضلات خلال 12 أسبوع",
    description: "هدفي كان إظهار تفاصيل العضلات والتخلص من الدهون العنيدة حول البطن. النظام الغذائي المحسوب بالجرامات والمتابعة اليومية مع الكوتش كانا العامل الحاسم للوصول لأفضل فورمة.",
    beforeImage: "/images/client_before.png",
    afterImage: "/images/client_after.png",
    beforeLabel: "قبل (88 كجم)",
    afterLabel: "بعد (79 كجم)",
    stats: [
      { value: "-9 كجم", label: "دهون مفقودة" },
      { value: "-12%", label: "نسبة الدهون" },
      { value: "12 أسبوع", label: "المدة" }
    ],
    tag: "تنشيف وفتنس"
  }
];

export function Transformations() {
  const [activeTab, setActiveTab] = useState(0);
  const current = defaultTrainees[activeTab];

  return (
    <section className="py-24 bg-bg relative overflow-hidden" id="transformations">
      {/* Ambient background decoration */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-3 block">
            قصص النجاح
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            نتائج حقيقية، <span className="text-accent">أبطال حقيقيون</span>
          </h2>
          <p className="text-text-3 max-w-2xl mx-auto">
            قصص نجاح واقعية ومؤثرة تظهر مدى التزام المشتركين بتعليمات الكوتش والوصول للجسم المثالي.
          </p>
        </div>

        {/* Trainees Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {defaultTrainees.map((trainee, idx) => (
            <button
              key={trainee.name}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-3 rounded-full text-sm font-bold border transition-all cursor-pointer ${
                activeTab === idx
                  ? "bg-accent border-accent text-bg shadow-[0_0_15px_rgba(197,162,93,0.3)]"
                  : "bg-surface border-border text-text-2 hover:border-accent/40"
              }`}
            >
              {trainee.name} — <span className="text-xs opacity-80">{trainee.tag}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto"
          >
            {/* Slider Column */}
            <div className="lg:col-span-7 w-full">
              <BeforeAfterSlider
                beforeImage={current.beforeImage}
                afterImage={current.afterImage}
                beforeLabel={current.beforeLabel}
                afterLabel={current.afterLabel}
              />
              <p className="text-center text-xs text-text-3 mt-4">
                اسحب الشريط لرؤية التحول الكامل للمشترك
              </p>
            </div>

            {/* Testimonial & Stats Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass p-8 rounded-[var(--radius-xl)] relative border-accent/10">
                <div className="absolute top-0 end-0 p-4 opacity-5 pointer-events-none text-6xl">
                  🏆
                </div>

                <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/20">
                  قصة نجاح مميزة
                </span>

                <h3 className="text-2xl font-display font-extrabold text-white mb-2 leading-tight">
                  {current.name}
                </h3>
                <p className="text-accent text-sm font-semibold mb-6">
                  {current.title}
                </p>

                <div className="border-t border-b border-border/60 py-4 my-6 grid grid-cols-3 gap-4 text-center">
                  {current.stats.map((stat, sIdx) => (
                    <div key={stat.label} className={sIdx === 1 ? "border-x border-border/60" : ""}>
                      <p className={`text-2xl font-display font-black ${sIdx === 1 ? "text-accent" : "text-white"}`}>
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-text-3 font-semibold mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <p className="text-text-2 text-sm leading-relaxed italic relative z-10">
                  "{current.description}"
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}


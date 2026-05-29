"use client";

import { motion } from "framer-motion";
import { useCMSContent } from "@/lib/cms";

const defaultHowItWorks = {
  title: "إزاي بنوصلك لهدفك؟",
  description: "خطوات بسيطة وواضحة، هنكون معاك خطوة بخطوة.",
  items: [
    {
      num: "01",
      title: "الاستبيان الأولي",
      desc: "هتملا فورم تفصيلي عن حالتك، هدفك، تاريخك المرضي، والأكل اللي بتحبه.",
      icon: "survey"
    },
    {
      num: "02",
      title: "تصميم الخطة",
      desc: "الكوتش هيصمم لك جدول تمرين ونظام غذائي مخصصين 100% لجسمك وهدفك.",
      icon: "design"
    },
    {
      num: "03",
      title: "بدأ الرحلة",
      desc: "هتدخل على المنصة بتاعتنا، هتلاقي كل حاجة واضحة وبالفيديوهات والشرح.",
      icon: "launch"
    },
    {
      num: "04",
      title: "المتابعة والتطور",
      desc: "تشيكن يومي أو أسبوعي حسب باقتك، وتعديلات مستمرة عشان نضمن النتيجة.",
      icon: "track"
    }
  ]
};

function getIcon(num: string) {
  const baseClass = "w-6 h-6 text-accent";
  switch (num) {
    case "01":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "02":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "03":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      );
    case "04":
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    default:
      return null;
  }
}

export function HowItWorks() {
  const content = useCMSContent("how_it_works", defaultHowItWorks);
  const title = content?.title || defaultHowItWorks.title;
  const description = content?.description || defaultHowItWorks.description;
  const items = content?.items || defaultHowItWorks.items;

  return (
    <section id="how-it-works" className="py-24 bg-bg relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-3 block">
            خطوات بسيطة
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            {title.includes("لهدفك") ? (
              <>
                {title.split("لهدفك")[0]}
                <span className="text-accent">لهدفك</span>
                {title.split("لهدفك")[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-text-3 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[2.75rem] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-accent/10 via-accent/50 to-accent/10 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {items.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative p-6 rounded-[var(--radius-xl)] bg-surface border border-border hover:border-accent/30 transition-all duration-300 group"
              >
                <div className="p-3.5 rounded-xl bg-accent-dim border border-accent/20 inline-flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(197,162,93,0.06)] relative z-10 transition-transform duration-300 group-hover:scale-110">
                  {getIcon(step.num)}
                </div>
                <h3 className="text-xl font-bold text-text-1 mb-2 group-hover:text-accent transition-colors">{step.title}</h3>
                <p className="text-sm text-text-3 leading-relaxed">{step.desc}</p>
                
                <div className="absolute top-4 end-4 text-4xl font-display font-black text-surface-high group-hover:text-accent/5 transition-colors select-none">
                  {step.num}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

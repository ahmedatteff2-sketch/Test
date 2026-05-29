"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCMSContent } from "@/lib/cms";

const defaultFAQ = {
  title: "الأسئلة الشائعة",
  description: "كل ما يدور في ذهنك عن البرنامج ونظام التدريب والمتابعة اليومية وإجاباتها بالتفصيل.",
  items: [
    {
      question: "هل نظام التغذية بيعتمد على الحرمان؟",
      answer: "لا طبعاً! نظام التغذية مرن وبيعتمد على حساب السعرات والماكروز (البروتين، الكارب، الدهون). بنوفرلك وجبات لذيذة وصحية من اختيارك، وتقدر تاكل أكل البيت العادي أو الأكل اللي بتحبه طالما في حدود سعراتك اليومية وهدفك."
    },
    {
      question: "هل أحتاج مكملات غذائية عشان أعمل نتيجة؟",
      answer: "المكملات هي 'عامل مكمل' للدايت وليست أساسية. الأساس هو الأكل الطبيعي المتوازن. إذا كنت محتاج مكملات معينة بناءً على فحص أو نقص معين، الكوتش هيرشحلك المناسب، لكن تقدر تعمل نتيجة خرافية 100% بدون أي مكملات."
    },
    {
      question: "أنا مبتدئ تماماً، هل البرنامج مناسب ليا؟",
      answer: "البرنامج مثالي للمبتدئين. بنصمم الخطة التدريبية خطوة بخطوة، وبنوفرلك شرح فيديو لكل تمرين عشان تعرف التكنيك الصحيح وتتفادى الإصابات. الكوتش كمان بيراجع فيديوهات تمرينك اللي بتبعتها عشان يصححلك الأداء أول بأول."
    },
    {
      question: "كيف بتتم المتابعة اليومية مع الكوتش؟",
      answer: "المتابعة بتتم يومياً من خلال شات المنصة، وبشكل تفصيلي من خلال 'التشيكن' اليومي اللي بتسجل فيه التزامك بالدايت والتمرين والمياه والنوم. أسبوعياً بيتم مراجعة الوزن والقياسات وصور التطور وبناءً عليها بنعدل الجداول لو محتاجة تغيير."
    },
    {
      question: "هل ينفع أتمرن في البيت لو مش متاح جيم؟",
      answer: "طبعاً! بنفصلك برنامج تمارين منزلية حسب الأدوات المتاحة عندك (سواء بوزن الجسم، أو أستيك المقاومة، أو دمبلز خفيفة) وبنضمنلك تحقق أقصى استفادة وجسم مثالي."
    },
    {
      question: "إيه اللي بيحصل لو وزني ثبت أو بطلت أحقق نتايج؟",
      answer: "هنا بييجي دور المتابعة الذكية؛ الكوتش بيحلل بياناتك الأسبوعية واليومية وبيحدد سبب الثبات (سواء قلة نوم، احتباس سوائل، أو تكيف الأيض)، وبنعدل السعرات أو التمارين فوراً لكسر الثبات والاستمرار في التطور."
    }
  ]
};

function FAQItem({ id, question, answer, isOpen, onToggle }: { id: string; question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div 
      onClick={onToggle} 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      aria-controls={id}
      className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-[var(--radius-xl)] cursor-pointer select-none"
    >
      <Card 
        className={cn(
          "p-5 hover:bg-surface-high/80 transition-all border border-border",
          isOpen && "border-accent/30 bg-surface-high/60"
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <h3 className="font-bold text-text-1 text-sm md:text-base">{question}</h3>
          <span className={cn("w-6 h-6 rounded-full bg-bg flex items-center justify-center text-text-2 shrink-0 transition-transform duration-300", isOpen && "rotate-180 text-accent")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={id}
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="text-text-2 text-xs md:text-sm leading-relaxed border-t border-border/50 pt-4">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

export function FAQ() {
  const content = useCMSContent("faq", defaultFAQ);
  const title = content?.title || defaultFAQ.title;
  const description = content?.description || defaultFAQ.description;
  const items = content?.items || defaultFAQ.items;

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-24 bg-bg relative">
      {/* Dynamic SEO Schema for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Background decorations */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-text-1 mb-4"
          >
            {title.includes("الشائعة") ? (
              <>
                {title.split("الشائعة")[0]}
                <span className="text-accent">الشائعة</span>
                {title.split("الشائعة")[1]}
              </>
            ) : (
              title
            )}
          </motion.h2>
          <p className="text-text-2 max-w-2xl mx-auto text-sm md:text-base">
            {description}
          </p>
        </div>
 
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <FAQItem
                id={`faq-answer-${idx}`}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIdx === idx}
                onToggle={() => handleToggle(idx)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

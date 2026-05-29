"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCMSContent } from "@/lib/cms";

const defaultTestimonials = {
  title: "قصص نجاح تصنع الفارق",
  description: "آراء بعض المشتركين في رحلتهم لتغيير شكل أجسامهم وحياتهم مع نظام التدريب والمتابعة المتكامل.",
  items: [
    {
      id: 1,
      name: "أحمد عبد الله",
      result: "خسرت 22 كجم في 4 شهور",
      text: "التجربة مع الكوتش غيرت حياتي تماماً. نظام الدايت مرن وسهل الالتزام بيه، والتمرين كان متفصل على حجم وقتي ومستوايا الصعب في الشغل.",
      rating: 5,
      avatar: "أ"
    },
    {
      id: 2,
      name: "سارة محمود",
      result: "بناء عضل وتقليل دهون (Recomp)",
      text: "مكنتش متخيلة إن البنت تقدر تبني عضل من غير ما تضخم بشكل مش حلو. المتابعة وتعديل التمارين والوجبات خلاني أوصل لجسم أحلامي وصحتي بقت أحسن بكتير.",
      rating: 5,
      avatar: "س"
    },
    {
      id: 3,
      name: "مصطفى كريم",
      result: "زيادة 12 كجم كتلة عضلية",
      text: "أفضل استثمار عملته في صحتي وجسمي. المتابعة اليومية والاهتمام بالتفاصيل وحل مشاكل إصابة الكتف اللي كانت عندي خلاني أتمرن بأوزان أثقل وأنا مطمن.",
      rating: 5,
      avatar: "م"
    },
    {
      id: 4,
      name: "حسام الجيار",
      result: "تنشيف وظهور العضلات في 12 أسبوع",
      text: "الكوتش بيتابع كل تفصيلة حتى جودة النوم والضغط والمياه. المتابعة الأسبوعية بالصور والوزن وتحديث الجدول خلتني دايماً ملتزم وفي قمة الحماس.",
      rating: 5,
      avatar: "ح"
    },
    {
      id: 5,
      name: "طارق حسن",
      result: "زيادة القوة البدنية والتخلص من آلام الظهر",
      text: "كشخص فوق الأربعين كان عندي تخوف كبير من الإصابات. المدرب صمم برنامج تمرين ذكي ركز على تقوية العضلات المحيطة بالركبة وأسفل الظهر. دلوقتي بتمرن بدون أي ألم وصحتي في أحسن حال.",
      rating: 5,
      avatar: "ط"
    },
    {
      id: 6,
      name: "رانيا سعيد",
      result: "خسارة 14 كجم وتنسيق القوام",
      text: "أحسن نظام متابعة جربته. الكوتش حريص جداً وبيسمع تفاصيل يومي، والنظام الغذائي كان متفصل بالظبط على الأكل المتاح في البيت فمتحستش بأي حرمان أو ضغط نفسي.",
      rating: 5,
      avatar: "ر"
    }
  ]
};

export function Testimonials() {
  const content = useCMSContent("testimonials", defaultTestimonials);
  const title = content?.title || defaultTestimonials.title;
  const description = content?.description || defaultTestimonials.description;
  const items = content?.items || defaultTestimonials.items;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [items.length, activeIndex]);

  useEffect(() => {
    if (items.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  const handleNext = () => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentTestimonial = items[activeIndex] || items[0] || defaultTestimonials.items[0];

  return (
    <section id="testimonials" className="py-24 bg-surface/30 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-text-1 mb-4"
          >
            {title.includes("الفارق") ? (
              <>
                {title.split("الفارق")[0]}
                <span className="text-accent">الفارق</span>
                {title.split("الفارق")[1]}
              </>
            ) : (
              title
            )}
          </motion.h2>
          <p className="text-text-2 max-w-2xl mx-auto text-sm md:text-base">
            {description}
          </p>
        </div>

        {items.length > 0 && (
          <div className="relative max-w-3xl mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <Card className="p-8 md:p-12 bg-surface/80 border-accent/10 backdrop-blur-xl shadow-xl relative overflow-hidden hover:border-accent/30 transition-colors duration-300">
                  {/* Quote Icon Background */}
                  <div className="absolute top-4 end-6 text-9xl text-accent/5 font-serif select-none pointer-events-none">
                    ”
                  </div>

                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-accent/15 border-2 border-accent text-accent flex items-center justify-center text-xl font-bold mb-6 shadow-[0_0_15px_rgba(197,162,93,0.15)]">
                      {currentTestimonial.avatar}
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: currentTestimonial.rating || 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-accent fill-accent"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-text-1 text-base md:text-lg leading-relaxed mb-6 italic max-w-2xl relative z-10">
                      "{currentTestimonial.text}"
                    </p>

                    {/* Client Info */}
                    <h4 className="font-bold text-text-1 text-lg mb-1">
                      {currentTestimonial.name}
                    </h4>
                    <span className="text-accent font-semibold text-sm">
                      {currentTestimonial.result}
                    </span>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="flex justify-between items-center mt-8 max-w-[180px] mx-auto">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border bg-surface hover:bg-surface-high hover:border-accent text-text-1 flex items-center justify-center transition-all cursor-pointer"
                aria-label="السابق"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Dots indicator */}
              <div className="flex gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all cursor-pointer",
                      activeIndex === idx ? "bg-accent scale-125" : "bg-text-3 hover:bg-text-2"
                    )}
                    aria-label={`شريحة ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-border bg-surface hover:bg-surface-high hover:border-accent text-text-1 flex items-center justify-center transition-all cursor-pointer"
                aria-label="التالي"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

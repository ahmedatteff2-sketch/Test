"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCMSContent } from "@/lib/cms";

const defaultPricing = {
  title: "استثمر في صحتك",
  description: "اختار الباقة اللي تناسب هدفك وميزانيتك.",
  items: [
    {
      name: "الباقة الأساسية",
      price: "1500",
      period: "شهرياً",
      description: "مثالية للمبتدئين اللي محتاجين توجيه.",
      features: [
        "جدول تمرين مخصص ومتكامل",
        "نظام غذائي محسوب بالجرامات",
        "تشيكن أسبوعي لمتابعة التقدم",
        "تعديل النظام مرة شهرياً",
      ],
      highlighted: false,
    },
    {
      name: "باقة النخبة (VIP)",
      price: "3500",
      period: "شهرياً",
      description: "للي عايز أفضل نتيجة في أسرع وقت مع متابعة لصيقة.",
      features: [
        "كل مميزات الباقة الأساسية",
        "تشيكن يومي (24/7 دعم مباشر)",
        "تحليل فيديوهات التمرين والأداء",
        "تعديلات لا نهائية على النظام والتمارين",
        "خطة مكملات غذائية مخصصة",
      ],
      highlighted: true,
    },
    {
      name: "باقة الـ 3 شهور",
      price: "4000",
      period: "3 شهور",
      description: "التزام طويل المدى بسعر أوفر.",
      features: [
        "نفس مميزات الباقة الأساسية",
        "خصم خاص 15%",
        "تتبع التطور على المدى الطويل",
        "مكالمة زوم شهرية مع الكوتش",
      ],
      highlighted: false,
    },
  ]
};

export function Pricing() {
  const content = useCMSContent("pricing", defaultPricing);
  const title = content?.title || defaultPricing.title;
  const description = content?.description || defaultPricing.description;
  const items = content?.items || defaultPricing.items;

  return (
    <section className="py-24 bg-surface relative overflow-hidden" id="pricing">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-3 block">
            باقات الاشتراك
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            {title.includes("صحتك") ? (
              <>
                {title.split("صحتك")[0]}
                <span className="text-accent">صحتك</span>
                {title.split("صحتك")[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-text-3 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {items.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: i * 0.1,
              }}
              className={cn(
                plan.highlighted
                  ? "vip-glow-card md:scale-105 shadow-[0_0_40px_rgba(255,30,39,0.2)] hover:shadow-[0_0_50px_rgba(255,30,39,0.3)] z-10"
                  : "relative p-8 rounded-[var(--radius-xl)] flex flex-col bg-bg border border-border hover:border-accent/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
              )}
            >
              {plan.highlighted ? (
                <div className="vip-glow-card-inner p-8 relative">
                  <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center z-20">
                    <span className="bg-accent text-bg px-4 py-1.5 text-xs font-extrabold rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(255,30,39,0.4)] animate-pulse">
                      <svg className="w-3.5 h-3.5 text-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      </svg>
                      <span>الباقة الأكثر طلباً</span>
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-text-3 mb-6 min-h-[40px]">{plan.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-display font-bold text-white">{plan.price} ج.م</span>
                    <span className="text-text-3 text-sm"> / {plan.period}</span>
                  </div>
 
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-text-2 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
 
                  <Button
                    href="/apply"
                    variant="primary"
                    className="w-full font-bold shadow-[0_0_20px_rgba(255,30,39,0.3)] hover:shadow-[0_0_30px_rgba(255,30,39,0.5)] mt-auto z-10"
                  >
                    اشترك الآن
                  </Button>
                  <p className="text-[10px] text-text-2 text-center mt-3 flex items-center justify-center gap-1 z-10">
                    🛡️ ضمان استرداد كامل الاشتراك خلال أول 7 أيام
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-text-1 mb-2">{plan.name}</h3>
                  <p className="text-sm text-text-3 mb-6 min-h-[40px]">{plan.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-display font-bold text-white">{plan.price} ج.م</span>
                    <span className="text-text-3 text-sm"> / {plan.period}</span>
                  </div>
 
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-text-2">{feature}</span>
                      </li>
                    ))}
                  </ul>
 
                  <Button
                    href="/apply"
                    variant="outline"
                    className="w-full mt-auto"
                  >
                    اشترك الآن
                  </Button>
                  <p className="text-[10px] text-text-3 text-center mt-3 flex items-center justify-center gap-1">
                    🛡️ ضمان استرداد كامل الاشتراك خلال أول 7 أيام
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

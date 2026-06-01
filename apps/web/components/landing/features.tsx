"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCMSContent } from "@/lib/cms";

interface Feature {
  number: string;
  title: string;
  description: string;
}

const defaultFeatures = {
  items: [
    {
      number: "01",
      title: "خطة تمرين مخصصة",
      description:
        "تمارين مصممة لجسمك وأهدافك بالتحديد. كل تمرين، كل مجموعة، كل تكرار — محسوب بدقة. مش خطة عامة من الإنترنت.",
    },
    {
      number: "02",
      title: "نظام تغذية مرن",
      description:
        "سواء تفضل وجبات محددة أو حساب سعرات مرن — عندنا النظامين. ماكروز محسوبة + قاعدة بيانات أكل ضخمة.",
    },
    {
      number: "03",
      title: "متابعة يومية",
      description:
        "تشيكن يومي يتابع تمرينك، أكلك، نومك، وميتك. المدرب يشوف كل حاجة ويعدّل الخطة لو محتاجة.",
    },
    {
      number: "04",
      title: "تقارير أسبوعية ذكية",
      description:
        "كل أسبوع تجيك رسالة بإنجازاتك، معدل إلتزامك، وتوصيات المدرب. أرقام حقيقية مش كلام.",
    },
    {
      number: "05",
      title: "صور التقدم والقياسات",
      description:
        "ارفع صورك الأسبوعية وقياساتك. شوف تطورك بالبصري والأرقام — الفرق اللي محسوش بيه هيبان.",
    },
    {
      number: "06",
      title: "تواصل مباشر مع المدرب",
      description:
        "رسائل فورية مع مدربك في أي وقت. سؤال عن تمرين؟ مش عارف تاكل إيه؟ اسأل وهيرد عليك.",
    },
  ]
};
export function Features() {
  const [weight, setWeight] = useState(80);

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 end-0 w-[450px] h-[450px] rounded-full blur-[150px] opacity-10 -translate-y-1/2 pointer-events-none"
        style={{ background: "var(--accent)" }}
      />
      <div
        className="absolute bottom-0 start-0 w-[350px] h-[350px] rounded-full blur-[120px] opacity-5 pointer-events-none"
        style={{ background: "var(--info)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-3 block">
            مميزات المنصة
          </span>
          <h2 className="font-display font-extrabold text-white text-3xl md:text-5xl leading-tight max-w-2xl mx-auto">
            كل ما تحتاجه للوصول <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#F0C978] drop-shadow-[0_0_20px_rgba(197,162,93,0.25)]">لهدفك</span> في مكان واحد
          </h2>
          <p className="text-text-3 text-sm mt-4 max-w-md mx-auto">
            توقف عن استخدام جداول إكسل المعقدة وشات الواتساب غير المنظم. احصل على تجربة تدريب متكاملة.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Workouts (Double column on desktop) */}
          <div className="lg:col-span-7 bg-surface border border-border rounded-[var(--radius-xl)] p-8 flex flex-col md:flex-row gap-8 items-center justify-between hover:border-accent/30 hover:shadow-[0_15px_35px_rgba(197,162,93,0.06)] transition-all duration-300 group">
            <div className="space-y-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent transition-transform duration-300 group-hover:scale-110">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3z" />
                  <path d="M9 8h6M9 12h6M9 16h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-1 font-display group-hover:text-accent transition-colors">خطة تدريب ذكية ومخصصة</h3>
              <p className="text-sm text-text-3 leading-relaxed">
                جداول تمارين مصممة خصيصاً لجسمك ومستواك. يمكنك تسجيل أوزانك ومجموعاتك مباشرة وبسرعة في الجيم مع حساب ذكي لحجم التدريب.
              </p>
            </div>
            
            {/* Workout Tracker Interactive Widget */}
            <div className="w-full md:w-auto shrink-0 flex justify-center">
              <div className="bg-bg/85 border border-border/80 p-5 rounded-2xl space-y-4 font-sans w-full max-w-[280px] shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-1 font-bold">بنش بريس (صدر)</span>
                  <span className="text-[10px] text-accent font-mono font-bold bg-accent/15 px-2 py-0.5 rounded">المجموعة 3</span>
                </div>
                
                <div className="flex items-center justify-between bg-surface p-3 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setWeight(Math.max(0, weight - 2.5))} 
                    className="w-8 h-8 rounded-lg bg-surface-high hover:bg-border text-text-1 flex items-center justify-center font-bold text-lg cursor-pointer select-none active:scale-95 transition-all"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <span className="text-lg font-black text-text-1 font-mono">{weight}</span>
                    <span className="text-[9px] text-text-3 block uppercase tracking-wider font-semibold mt-0.5">كيلوجرام</span>
                  </div>
                  <button 
                    onClick={() => setWeight(weight + 2.5)} 
                    className="w-8 h-8 rounded-lg bg-surface-high hover:bg-border text-text-1 flex items-center justify-center font-bold text-lg cursor-pointer select-none active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex justify-between text-[10px] text-text-3">
                  <span>التكرار المستهدف: 10</span>
                  <span className="text-success font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    تطور +2.5kg ✓
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Nutrition (Single column) */}
          <div className="lg:col-span-5 bg-surface border border-border rounded-[var(--radius-xl)] p-8 flex flex-col justify-between hover:border-accent/30 hover:shadow-[0_15px_35px_rgba(197,162,93,0.06)] transition-all duration-300 group">
            <div className="space-y-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent transition-transform duration-300 group-hover:scale-110">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-1 font-display group-hover:text-accent transition-colors">نظام غذائي مرن ومحسوب</h3>
              <p className="text-sm text-text-3 leading-relaxed">
                وفرنا لك قاعدة بيانات أكل مرنة مع حساب الماكروز والسعرات بدقة للوصول لهدفك بدون حرمان.
              </p>
            </div>

            {/* Calorie Macro Ring Widget */}
            <div className="flex justify-center">
              <div className="bg-bg/85 border border-border/80 p-5 rounded-2xl space-y-4 font-sans w-full max-w-[240px] flex flex-col items-center shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-high)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="6" strokeDasharray="264" strokeDashoffset="60" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] text-text-3 uppercase tracking-wider font-semibold">المتبقي</span>
                    <span className="text-base font-black font-mono text-text-1 mt-0.5">420</span>
                    <span className="text-[9px] text-text-3">سعرة</span>
                  </div>
                </div>
                
                <div className="w-full grid grid-cols-3 gap-1 text-center text-[10px] text-text-2 border-t border-border/40 pt-3">
                  <div>
                    <div className="font-bold font-mono text-white">142g</div>
                    <div className="text-[8px] text-text-3">بروتين</div>
                  </div>
                  <div className="border-x border-border/40">
                    <div className="font-bold font-mono text-white">185g</div>
                    <div className="text-[8px] text-text-3">كارب</div>
                  </div>
                  <div>
                    <div className="font-bold font-mono text-white">58g</div>
                    <div className="text-[8px] text-text-3">دهون</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Chat 24/7 (Single column) */}
          <div className="lg:col-span-5 bg-surface border border-border rounded-[var(--radius-xl)] p-8 flex flex-col justify-between hover:border-accent/30 hover:shadow-[0_15px_35px_rgba(197,162,93,0.06)] transition-all duration-300 group">
            <div className="space-y-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent transition-transform duration-300 group-hover:scale-110">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-1 font-display group-hover:text-accent transition-colors">تواصل مباشر ودعم مستمر</h3>
              <p className="text-sm text-text-3 leading-relaxed">
                شات مباشر ومتابعة يومية مع مدربك للإجابة على جميع استفساراتك وتعديل خطتك أولاً بأول.
              </p>
            </div>

            {/* Simulated Chat Widget */}
            <div className="flex justify-center">
              <div className="bg-bg/85 border border-border/80 p-4 rounded-2xl space-y-3 font-sans w-full max-w-[260px] text-xs shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-1.5 pb-2 border-b border-border/40">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-bold text-[10px] text-text-2">محادثة الكوتش</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-surface-high/60 border border-border p-2.5 rounded-xl rounded-tr-none text-text-2 max-w-[85%] leading-relaxed">
                    كوتش، هو ينفع آكل شوفان بدل الرز؟
                  </div>
                  <div className="bg-accent/10 border border-accent/15 p-2.5 rounded-xl rounded-tl-none text-text-1 max-w-[85%] ms-auto text-end leading-relaxed font-semibold">
                    طبعاً يا بطل، الـ 50 جرام شوفان بديل رائع ومحسوب. 👍
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Reports (Double column on desktop) */}
          <div className="lg:col-span-7 bg-surface border border-border rounded-[var(--radius-xl)] p-8 flex flex-col md:flex-row gap-8 items-center justify-between hover:border-accent/30 hover:shadow-[0_15px_35px_rgba(197,162,93,0.06)] transition-all duration-300 group">
            <div className="space-y-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent transition-transform duration-300 group-hover:scale-110">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10M18 20V4M6 20v-6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-1 font-display group-hover:text-accent transition-colors">تقارير أسبوعية وإحصائيات ذكية</h3>
              <p className="text-sm text-text-3 leading-relaxed">
                تقارير وتحليلات أسبوعية تلقائية توضح تطور وزنك، قوة عضلاتك، ونسبة التزامك لمراقبة الأداء بشكل مستمر.
              </p>
            </div>

            {/* Smart Weekly Analytics Widget */}
            <div className="w-full md:w-auto shrink-0 flex justify-center">
              <div className="bg-bg/85 border border-border/80 p-5 rounded-2xl space-y-4 font-sans w-full max-w-[280px] shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-1">التقرير الأسبوعي</span>
                  <span className="text-success bg-success/15 px-2 py-0.5 rounded font-bold text-[9px]">الالتزام: 96%</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface rounded-xl border border-white/5 text-center">
                    <span className="text-[9px] text-text-3 block font-semibold uppercase">الوزن المفقود</span>
                    <span className="text-lg font-display font-extrabold text-accent mt-1 block">5.4kg</span>
                    <span className="text-[8px] text-text-3 mt-0.5 block">خلال 30 يوم</span>
                  </div>
                  <div className="p-3 bg-surface rounded-xl border border-white/5 text-center">
                    <span className="text-[9px] text-text-3 block font-semibold uppercase">التمرين المنجز</span>
                    <span className="text-lg font-display font-extrabold text-text-1 mt-1 block">5 / 5</span>
                    <span className="text-[8px] text-text-3 mt-0.5 block">أيام التزام</span>
                  </div>
                </div>
                <div className="p-2.5 bg-success/5 border border-success/20 rounded-xl text-[9px] text-success leading-relaxed">
                  🎉 لقد حققت هدف حرق الدهون المخطط له بنجاح هذا الأسبوع!
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

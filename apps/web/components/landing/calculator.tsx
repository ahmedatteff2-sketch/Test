"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Calculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [activity, setActivity] = useState<string>("1.375"); // Default: moderate
  const [goal, setGoal] = useState<string>("lose"); // lose, gain, recomp
  const [results, setResults] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recommendedPlan: string;
    planReason: string;
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const act = parseFloat(activity);

    if (!w || !h || !a) return;

    // Miflin-St Jeor Equation for BMR
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // TDEE
    const tdee = Math.round(bmr * act);

    // Goal adjustment
    let targetCalories = tdee;
    let planReason = "";
    let recommendedPlan = "الباقة الأساسية";

    if (goal === "lose") {
      targetCalories = Math.round(tdee - 500); // 500 kcal deficit
      planReason = "هدف التنشيف يتطلب عجز في السعرات الحرارية مع رفع نسبة البروتين لتجنب خسارة العضلات.";
      // Recommend VIP for faster weight loss supervision
      recommendedPlan = w > 100 ? "باقة النخبة (VIP)" : "الباقة الأساسية";
    } else if (goal === "gain") {
      targetCalories = Math.round(tdee + 300); // 300 kcal surplus
      planReason = "بناء العضلات يتطلب فائض طاقة خفيف ومدروس مع تمرين مقاومة تصاعدي وقوي.";
      recommendedPlan = "باقة الـ 3 شهور";
    } else {
      targetCalories = Math.round(tdee); // Maintenance
      planReason = "إعادة تشكيل الجسم (Recomp) تتطلب توازن دقيق لخسارة الدهون وبناء العضلات في نفس الوقت.";
      recommendedPlan = "باقة النخبة (VIP)";
    }

    // Macro splits
    // Protein: ~2g per kg of bodyweight
    const proteinGrams = Math.round(w * 2);
    const proteinCalories = proteinGrams * 4;

    // Fat: ~20% to 25% of total calories
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: The remainder of calories
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);

    setResults({
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      recommendedPlan,
      planReason,
    });

    // Auto-scroll to results on mobile devices (< 1024px)
    setTimeout(() => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        const el = document.getElementById("results-container");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }, 100);
  };

  return (
    <section id="calculator" className="py-24 bg-surface-high/20 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[250px] h-[250px] bg-info/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-3 block">
            أدوات ذكية
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            احسب احتياجك واعرف <span className="text-accent">خطتك المقترحة</span>
          </h2>
          <p className="text-text-3 max-w-2xl mx-auto">
            ادخل بياناتك الحالية ليقوم نظامنا بحساب السعرات والماكروز اليومية التقريبية واقتراح باقة الاشتراك الأنسب لك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Calculator Inputs Form */}
          <div className="lg:col-span-6 bg-surface border border-border p-8 rounded-[var(--radius-xl)] shadow-xl">
            <form onSubmit={calculate} className="space-y-6">
              {/* Gender selector */}
              <div>
                <label className="text-sm font-bold text-text-1 mb-3 block">النوع</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={cn(
                      "py-3.5 rounded-[var(--radius-md)] border text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                      gender === "male"
                        ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(197,162,93,0.1)]"
                        : "bg-bg border-border text-text-2 hover:border-accent/30"
                    )}
                  >
                    <span>♂</span>
                    <span>ذكر</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={cn(
                      "py-3.5 rounded-[var(--radius-md)] border text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                      gender === "female"
                        ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(197,162,93,0.1)]"
                        : "bg-bg border-border text-text-2 hover:border-accent/30"
                    )}
                  >
                    <span>♀</span>
                    <span>أنثى</span>
                  </button>
                </div>
              </div>

              {/* Physical stats inputs */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-text-2 mb-2 block">السن</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full bg-bg border border-border rounded-[var(--radius-md)] px-4 py-3 text-text-1 text-sm font-mono text-center focus:outline-none focus:border-accent/60"
                    required
                    min="12"
                    max="90"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-2 mb-2 block">الوزن (كجم)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="80"
                    className="w-full bg-bg border border-border rounded-[var(--radius-md)] px-4 py-3 text-text-1 text-sm font-mono text-center focus:outline-none focus:border-accent/60"
                    required
                    min="30"
                    max="250"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-2 mb-2 block">الطول (سم)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="175"
                    className="w-full bg-bg border border-border rounded-[var(--radius-md)] px-4 py-3 text-text-1 text-sm font-mono text-center focus:outline-none focus:border-accent/60"
                    required
                    min="100"
                    max="220"
                  />
                </div>
              </div>

              {/* Activity Level Selector */}
              <div>
                <label className="text-sm font-bold text-text-1 mb-2 block">مستوى النشاط اليومي</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full bg-bg border border-border rounded-[var(--radius-md)] px-4 py-3.5 text-text-1 text-sm focus:outline-none focus:border-accent/60 cursor-pointer"
                >
                  <option value="1.2">نشاط منخفض جداً (عمل مكتبي، بدون تمرين)</option>
                  <option value="1.375">نشاط خفيف (تمرين خفيف 1-3 أيام/أسبوع)</option>
                  <option value="1.55">نشاط متوسط (تمرين متوسط 3-5 أيام/أسبوع)</option>
                  <option value="1.725">نشاط عالٍ (تمرين شاق 6-7 أيام/أسبوع)</option>
                </select>
              </div>

              {/* Fitness Goal */}
              <div>
                <label className="text-sm font-bold text-text-1 mb-2 block">الهدف الرئيسي</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "lose", label: "خسارة دهون" },
                    { key: "gain", label: "بناء عضلات" },
                    { key: "recomp", label: "تنسيق القوام" },
                  ].map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => setGoal(g.key)}
                      className={cn(
                        "py-3 px-2 rounded-[var(--radius-md)] border text-xs font-bold transition-all cursor-pointer text-center",
                        goal === g.key
                          ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(197,162,93,0.1)]"
                          : "bg-bg border-border text-text-2 hover:border-accent/30"
                      )}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculate Button */}
              <Button type="submit" size="lg" className="w-full font-bold shadow-[0_0_20px_rgba(197,162,93,0.2)]">
                احسب احتياجك الآن
              </Button>
            </form>
          </div>

          {/* Results display panel */}
          <div id="results-container" className="lg:col-span-6 min-h-[460px] flex items-stretch">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full bg-surface border border-accent/20 p-8 rounded-[var(--radius-xl)] shadow-xl flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Glowing background */}
                  <div className="absolute top-0 end-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div>
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold rounded-full bg-success/15 text-success border border-success/20">
                      تم الحساب بنجاح ✓
                    </span>
                    
                    <h3 className="text-lg font-bold text-text-2 mb-1">السعرات اليومية المقترحة:</h3>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-5xl font-display font-black text-white">{results.calories}</span>
                      <span className="text-text-3 text-sm font-bold">سعرة حرارية / يوم</span>
                    </div>

                    {/* Macros Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="p-3 bg-bg rounded-xl border border-border text-center">
                        <span className="text-[10px] text-text-3 block font-bold">بروتين</span>
                        <span className="text-lg font-display font-black text-accent mt-1 block">{results.protein}g</span>
                        <span className="text-[9px] text-text-2 block mt-0.5">{results.protein * 4} Kcal</span>
                      </div>
                      <div className="p-3 bg-bg rounded-xl border border-border text-center">
                        <span className="text-[10px] text-text-3 block font-bold">كربوهيدرات</span>
                        <span className="text-lg font-display font-black text-white mt-1 block">{results.carbs}g</span>
                        <span className="text-[9px] text-text-2 block mt-0.5">{results.carbs * 4} Kcal</span>
                      </div>
                      <div className="p-3 bg-bg rounded-xl border border-border text-center">
                        <span className="text-[10px] text-text-3 block font-bold">دهون</span>
                        <span className="text-lg font-display font-black text-white mt-1 block">{results.fat}g</span>
                        <span className="text-[9px] text-text-2 block mt-0.5">{results.fat * 9} Kcal</span>
                      </div>
                    </div>

                    {/* Recommendation box */}
                    <div className="p-4 bg-accent-dim border border-accent/20 rounded-2xl mb-6">
                      <div className="flex items-center gap-2 text-accent font-bold text-sm mb-1.5">
                        <span>🎯 الخطة المقترحة:</span>
                        <span className="underline decoration-wavy decoration-accent">{results.recommendedPlan}</span>
                      </div>
                      <p className="text-xs text-text-2 leading-relaxed">
                        {results.planReason}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      href="/apply"
                      size="lg"
                      className="w-full font-bold shadow-[0_0_20px_rgba(197,162,93,0.35)] hover:shadow-[0_0_30px_rgba(197,162,93,0.55)] transition-all duration-300 animate-pulse-glow"
                    >
                      اشترك الآن بالخطة المقترحة
                    </Button>
                    <button
                      type="button"
                      onClick={() => setResults(null)}
                      className="w-full text-center text-xs font-semibold text-text-3 hover:text-text-2 transition-colors py-1 cursor-pointer"
                    >
                      إعادة الحساب بالبيانات الجديدة
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full bg-surface/50 border border-border border-dashed p-8 rounded-[var(--radius-xl)] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center text-text-3 text-3xl mb-4">
                    📊
                  </div>
                  <h3 className="text-xl font-bold text-text-1 mb-2">لوحة النتائج</h3>
                  <p className="text-sm text-text-3 max-w-sm leading-relaxed">
                    ادخل بياناتك المترية في الحاسبة على الجانب واضغط "احسب احتياجك" لتظهر خطتك هنا في ثوانٍ.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

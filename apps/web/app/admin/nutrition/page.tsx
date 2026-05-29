"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { foodDatabase } from "@/lib/food-database";
/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */
interface MealPlanItem {
  name: string;
  amount: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealPlan {
  id: string;
  clientName: string;
  goal: string;
  totalKcal: number;
  totalProtein: number;
  mealsCount: number;
  lastUpdated: string;
  status: "active" | "draft" | "archived";
  compliance: number;
}

/* ══════════════════════════════════════════
   Mock Data
   ══════════════════════════════════════════ */
const mealPlans: MealPlan[] = [
  { id: "1", clientName: "أحمد محمد", goal: "حرق دهون", totalKcal: 2200, totalProtein: 180, mealsCount: 5, lastUpdated: "منذ يومين", status: "active", compliance: 92 },
  { id: "2", clientName: "حسام نبيل", goal: "بناء عضلات", totalKcal: 3200, totalProtein: 220, mealsCount: 6, lastUpdated: "منذ أسبوع", status: "active", compliance: 96 },
  { id: "3", clientName: "محمد علي", goal: "بناء عضلات", totalKcal: 2800, totalProtein: 200, mealsCount: 5, lastUpdated: "منذ 3 أيام", status: "active", compliance: 78 },
  { id: "4", clientName: "يوسف إبراهيم", goal: "إعادة تشكيل", totalKcal: 2400, totalProtein: 190, mealsCount: 5, lastUpdated: "اليوم", status: "active", compliance: 88 },
  { id: "5", clientName: "كريم حسن", goal: "حرق دهون", totalKcal: 1800, totalProtein: 160, mealsCount: 4, lastUpdated: "منذ أسبوعين", status: "draft", compliance: 55 },
  { id: "6", clientName: "عمر خالد", goal: "رياضي", totalKcal: 2600, totalProtein: 170, mealsCount: 5, lastUpdated: "منذ شهر", status: "archived", compliance: 45 },
  { id: "7", clientName: "مصطفى أمين", goal: "إعادة تشكيل", totalKcal: 2300, totalProtein: 185, mealsCount: 5, lastUpdated: "منذ 4 أيام", status: "active", compliance: 84 },
  { id: "8", clientName: "طارق سعيد", goal: "حرق دهون", totalKcal: 2000, totalProtein: 170, mealsCount: 4, lastUpdated: "منذ 5 أيام", status: "active", compliance: 58 },
];



const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  draft: "bg-warning/10 text-warning",
  archived: "bg-text-3/10 text-text-3",
};
const statusLabels: Record<string, string> = { active: "نشط", draft: "مسودة", archived: "أرشيف" };

type FilterStatus = "all" | "active" | "draft" | "archived";

/* ══════════════════════════════════════════
   Create Plan Modal
   ══════════════════════════════════════════ */
function CreatePlanModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-[var(--radius-xl)] p-8 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", step >= s ? "bg-accent text-bg" : "bg-surface-high text-text-3")}>{s}</div>
              {s < 3 && <div className={cn("flex-1 h-0.5 rounded-full", step > s ? "bg-accent" : "bg-surface-high")} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-1">خطة غذائية جديدة</h2>
            <div>
              <label className="text-sm font-medium text-text-2 mb-2 block">العميل</label>
              <select className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                <option>أحمد محمد</option>
                <option>محمد علي</option>
                <option>كريم حسن</option>
                <option>عمر خالد</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="السعرات اليومية" type="number" placeholder="2200" />
              <Input label="البروتين (g)" type="number" placeholder="180" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="الكاربز (g)" type="number" placeholder="250" />
              <Input label="الدهون (g)" type="number" placeholder="60" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-2 block">الهدف</label>
              <select className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                <option>حرق دهون</option>
                <option>بناء عضلات</option>
                <option>إعادة تشكيل</option>
                <option>الحفاظ على الوزن</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-2 block">عدد الوجبات</label>
              <div className="flex gap-2">
                {[3, 4, 5, 6].map((n) => (
                  <button key={n} className="flex-1 py-2 rounded-[var(--radius-md)] bg-surface-high border border-border text-sm text-text-2 hover:border-accent/30 hover:text-accent transition-all cursor-pointer">
                    {n} وجبات
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>التالي — اختيار الأكل</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-1">قاعدة بيانات الأكل</h2>
            <Input placeholder="بحث عن طعام..." />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {foodDatabase.map((food) => (
                <button key={food.name} className="w-full flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-surface-high border border-border hover:border-accent/30 transition-all cursor-pointer text-start">
                  <div>
                    <p className="text-sm font-medium text-text-1">{food.name}</p>
                    <p className="text-[10px] text-text-3">لكل 100g</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-text-2">{food.per100.kcal} سعرة</span>
                    <span className="text-info">{food.per100.protein}p</span>
                    <span className="text-warning">{food.per100.carbs}c</span>
                    <span className="text-danger">{food.per100.fat}f</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>التالي — المراجعة</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-1">مراجعة الخطة</h2>
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-text-3 text-xs">السعرات</p>
                  <p className="text-lg font-bold text-accent">2200 kcal</p>
                </div>
                <div>
                  <p className="text-text-3 text-xs">البروتين</p>
                  <p className="text-lg font-bold text-info">180g</p>
                </div>
                <div>
                  <p className="text-text-3 text-xs">الكاربز</p>
                  <p className="text-lg font-bold text-warning">250g</p>
                </div>
                <div>
                  <p className="text-text-3 text-xs">الدهون</p>
                  <p className="text-lg font-bold text-danger">60g</p>
                </div>
              </div>
            </Card>
            <div>
              <label className="text-sm font-medium text-text-2 mb-2 block">ملاحظات للعميل</label>
              <textarea placeholder="نصايح أو تعليمات خاصة..." className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm placeholder:text-text-3 focus:outline-none focus:ring-1 focus:ring-accent/30 min-h-[80px] resize-none" />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)}>رجوع</Button>
              <Button className="flex-1" onClick={onClose}>إنشاء الخطة ✅</Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Plan Details Modal and Mock Data
   ══════════════════════════════════════════ */
const mealPlanDetails: Record<string, MealPlanItem[]> = {
  "1": [
    { name: "شوفان باللبن والموز والعسل وحبات اللوز", amount: "100g شوفان + 250ml لبن + موزة + 15g لوز", kcal: 580, protein: 24, carbs: 88, fat: 14 },
    { name: "صدور دجاج مشوية مع أرز بسمتي مسلوق وسلطة خضراء", amount: "200g دجاج + 150g أرز بسمتي + خيار وطماطم", kcal: 620, protein: 55, carbs: 60, fat: 10 },
    { name: "واي بروتين مخفوق مع زبدة فول سوداني وتفاحة", amount: "1 سكوب بروتين + 20g زبدة + تفاحة متوسطة", kcal: 390, protein: 32, carbs: 30, fat: 14 },
    { name: "لحم بقري مفروم قليل الدهن مع بطاطس مشوية بالفرن", amount: "150g لحم + 200g بطاطس مشوية", kcal: 510, protein: 42, carbs: 45, fat: 12 },
    { name: "جبنة قريش خفيفة مع خيار، طماطم وزيت زيتون بكر", amount: "200g جبنة + 5ml زيت زيتون + خضروات", kcal: 260, protein: 29, carbs: 12, fat: 11 },
  ],
  "2": [
    { name: "أومليت 5 بيضات كاملة مع خبز شوفان وجبن شيدر", amount: "5 بيضات + 2 شريحة خبز شوفان + 20g شيدر", kcal: 780, protein: 47, carbs: 52, fat: 36 },
    { name: "لحم بقري مشوي مع أرز بسمتي بالمكسرات والزبيب", amount: "250g لحم + 250g أرز + 20g مكسرات مشكلة", kcal: 950, protein: 68, carbs: 95, fat: 30 },
    { name: "مخفوق الضخامة للرياضيين (حليب كامل الدسم، بروتين، موز، زبدة فستق)", amount: "350ml حليب + 1.5 سكوب بروتين + 35g زبدة فستق", kcal: 720, protein: 45, carbs: 75, fat: 26 },
    { name: "صدور دجاج مشوية مع مكرونة مسلوقة وصلصة طماطم طبيعية", amount: "200g دجاج + 200g مكرونة سميد", kcal: 650, protein: 56, carbs: 80, fat: 8 },
    { name: "تونة في المحلول المائي مع بطاطا حلوة مشوية وزيت حار", amount: "علبة تونة كبيرة + 250g بطاطا حلوة + 5ml زيت", kcal: 470, protein: 41, carbs: 58, fat: 5 },
    { name: "كازين بروتين مع زبدة لوز طبيعية قبل النوم", amount: "1 سكوب كازين + 15g زبدة لوز", kcal: 260, protein: 28, carbs: 9, fat: 13 },
  ],
};

function PlanDetailsModal({ plan, onClose }: { plan: MealPlan; onClose: () => void }) {
  const meals = mealPlanDetails[plan.id] || mealPlanDetails["1"];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-[var(--radius-xl)] p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto border border-border/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
          <div>
            <h2 className="text-xl font-display font-bold text-text-1">تفاصيل الخطة الغذائية — {plan.clientName}</h2>
            <p className="text-xs text-text-3 mt-1">الهدف: {plan.goal} • معدل الالتزام: {plan.compliance}%</p>
          </div>
          <button onClick={onClose} className="text-text-3 hover:text-text-1 text-2xl font-bold p-1">&times;</button>
        </div>

        {/* Macros summary card */}
        <Card className="p-4 mb-6 bg-surface/50 border-accent/10">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-text-3 text-xs">إجمالي السعرات</p>
              <p className="text-lg font-bold text-accent font-mono">{plan.totalKcal} kcal</p>
            </div>
            <div>
              <p className="text-text-3 text-xs">البروتين</p>
              <p className="text-lg font-bold text-info font-mono">{plan.totalProtein}g</p>
            </div>
            <div>
              <p className="text-text-3 text-xs">الكاربوهيدرات</p>
              <p className="text-lg font-bold text-warning font-mono">{Math.round(plan.totalKcal * 0.45 / 4)}g</p>
            </div>
            <div>
              <p className="text-text-3 text-xs">الدهون</p>
              <p className="text-lg font-bold text-danger font-mono">{Math.round(plan.totalKcal * 0.25 / 9)}g</p>
            </div>
          </div>
        </Card>

        {/* Meals list */}
        <div className="space-y-4">
          <h3 className="font-semibold text-text-1 text-sm mb-2">الوجبات اليومية ({meals.length} وجبات)</h3>
          {meals.map((meal, index) => (
            <div key={index} className="p-4 rounded-xl bg-surface-high/40 border border-border/40 flex flex-col md:flex-row justify-between gap-4 hover:border-accent/20 transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] bg-accent/15 text-accent border border-accent/25 px-2.5 py-0.5 rounded-full font-bold">الوجبة {index + 1}</span>
                <p className="font-bold text-text-1 text-sm mt-2">{meal.name}</p>
                <p className="text-xs text-text-3">الكمية المقترحة: {meal.amount}</p>
              </div>
              <div className="flex items-center gap-3 text-xs self-end md:self-center font-mono bg-surface-high/60 px-3 py-1.5 rounded-lg border border-border/20">
                <span className="text-text-1 font-bold">{meal.kcal} kcal</span>
                <span className="text-text-3">|</span>
                <span className="text-info">{meal.protein}g P</span>
                <span className="text-text-3">|</span>
                <span className="text-warning">{meal.carbs}g C</span>
                <span className="text-text-3">|</span>
                <span className="text-danger">{meal.fat}g F</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border/50">
          <Button variant="ghost" onClick={onClose}>إغلاق</Button>
          <Button className="bg-accent text-bg hover:bg-accent/90" onClick={onClose}>تحديث وإرسال للعميل ⚡</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function AdminNutritionPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  const filtered = mealPlans.filter((p) => {
    const matchSearch = p.clientName.includes(search);
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const totalActive = mealPlans.filter((p) => p.status === "active").length;
  const avgCompliance = Math.round(mealPlans.filter((p) => p.status === "active").reduce((s, p) => s + p.compliance, 0) / totalActive);
  const lowCompliance = mealPlans.filter((p) => p.status === "active" && p.compliance < 60).length;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showCreate && <CreatePlanModal onClose={() => setShowCreate(false)} />}
        {selectedPlan && <PlanDetailsModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-1">التغذية</h1>
          <p className="text-text-2 text-sm mt-1">إدارة الخطط الغذائية لكل العملاء ومتابعة الالتزام</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" /></svg>
          خطة جديدة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "خطط نشطة", value: totalActive.toString(), color: "text-success" },
          { label: "متوسط الالتزام بالدايت", value: `${avgCompliance}%`, color: avgCompliance >= 80 ? "text-success" : "text-warning" },
          { label: "التزام ضعيف", value: lowCompliance.toString(), color: lowCompliance > 0 ? "text-danger" : "text-success" },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-4 text-center">
              <p className="text-text-3 text-xs">{s.label}</p>
              <p className={cn("text-2xl font-display font-bold mt-1", s.color)}>{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Cheat Meal Requests */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-warning shadow-[0_0_15px_rgba(234,179,8,0.1)] relative overflow-hidden">
          <div className="absolute top-0 end-0 p-3 opacity-20 pointer-events-none">
            <span className="text-6xl">🍕</span>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-text-1 text-lg mb-4 flex items-center gap-2">
              <span className="text-warning text-xl">🍕</span> طلبات الوجبات المفتوحة (Cheat Meals)
            </h3>
            <div className="space-y-3 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between p-3 rounded-[var(--radius-md)] bg-bg border border-border">
                <div>
                  <p className="font-bold text-text-1 text-sm">أحمد محمد <span className="text-xs text-text-3 font-normal">(بناء عضلات)</span></p>
                  <p className="text-xs text-text-2 mt-1"><span className="text-warning font-semibold">الطلب:</span> بيتزا مارجريتا وسط</p>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0 w-full md:w-auto">
                  <Button size="sm" className="flex-1 md:flex-none bg-warning hover:bg-warning/90 text-black">الموافقة (خصم 800kcal)</Button>
                  <Button size="sm" variant="outline" className="flex-1 md:flex-none border-danger text-danger hover:bg-danger/10">رفض</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input placeholder="بحث بالاسم..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {([
            { value: "all", label: "الكل" },
            { value: "active", label: "نشط" },
            { value: "draft", label: "مسودة" },
            { value: "archived", label: "أرشيف" },
          ] as { value: FilterStatus; label: string }[]).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer",
                filter === f.value ? "bg-accent text-bg" : "bg-surface-high text-text-2 hover:text-text-1"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hover className="relative overflow-hidden">
              {/* Status stripe */}
              <div className={cn("absolute top-0 start-0 w-1 h-full rounded-s-[var(--radius-lg)]",
                plan.status === "active" ? "bg-success" : plan.status === "draft" ? "bg-warning" : "bg-text-3"
              )} />

              <div className="ps-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent text-sm font-bold">{plan.clientName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-1">{plan.clientName}</p>
                      <p className="text-xs text-text-3">{plan.goal}</p>
                    </div>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", statusColors[plan.status])}>
                    {statusLabels[plan.status]}
                  </span>
                </div>

                {/* Macro summary */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-surface-high rounded-[var(--radius-sm)] p-2 text-center">
                    <p className="text-[10px] text-text-3">سعرات</p>
                    <p className="text-sm font-bold text-accent font-mono">{plan.totalKcal}</p>
                  </div>
                  <div className="bg-surface-high rounded-[var(--radius-sm)] p-2 text-center">
                    <p className="text-[10px] text-text-3">بروتين</p>
                    <p className="text-sm font-bold text-info font-mono">{plan.totalProtein}g</p>
                  </div>
                  <div className="bg-surface-high rounded-[var(--radius-sm)] p-2 text-center">
                    <p className="text-[10px] text-text-3">وجبات</p>
                    <p className="text-sm font-bold text-text-1 font-mono">{plan.mealsCount}</p>
                  </div>
                </div>

                {/* Compliance */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-3">التزام الدايت</span>
                  <span className={cn("text-xs font-bold", plan.compliance >= 80 ? "text-success" : plan.compliance >= 60 ? "text-warning" : "text-danger")}>{plan.compliance}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-high overflow-hidden mb-3">
                  <div className={cn("h-full rounded-full", plan.compliance >= 80 ? "bg-success" : plan.compliance >= 60 ? "bg-warning" : "bg-danger")} style={{ width: `${plan.compliance}%` }} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-[10px] text-text-3">تحديث: {plan.lastUpdated}</span>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-accent hover:underline cursor-pointer" onClick={() => setSelectedPlan(plan)}>تعديل</button>
                    <span className="text-text-3">•</span>
                    <button className="text-xs text-text-2 hover:text-text-1 cursor-pointer">نسخ</button>
                    <span className="text-text-3">•</span>
                    <button 
                      onClick={() => setSelectedPlan(plan)}
                      className="text-xs text-accent hover:underline cursor-pointer font-medium"
                    >
                      عرض
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Food database preview */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-text-1">قاعدة بيانات الأكل</h3>
              <p className="text-xs text-text-3">{foodDatabase.length} عنصر غذائي</p>
            </div>
            <button className="text-xs text-accent hover:underline cursor-pointer">إضافة عنصر</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start text-xs font-medium text-text-3 uppercase tracking-wider pb-2">الاسم</th>
                  <th className="text-center text-xs font-medium text-text-3 uppercase tracking-wider pb-2">سعرات</th>
                  <th className="text-center text-xs font-medium text-text-3 uppercase tracking-wider pb-2">بروتين</th>
                  <th className="text-center text-xs font-medium text-text-3 uppercase tracking-wider pb-2">كاربز</th>
                  <th className="text-center text-xs font-medium text-text-3 uppercase tracking-wider pb-2">دهون</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {foodDatabase.slice(0, 6).map((food) => (
                  <tr key={food.name} className="hover:bg-surface-high/50 transition-colors">
                    <td className="py-2 text-sm text-text-1">{food.name}</td>
                    <td className="py-2 text-xs text-center text-text-2 font-mono">{food.per100.kcal}</td>
                    <td className="py-2 text-xs text-center text-info font-mono">{food.per100.protein}g</td>
                    <td className="py-2 text-xs text-center text-warning font-mono">{food.per100.carbs}g</td>
                    <td className="py-2 text-xs text-center text-danger font-mono">{food.per100.fat}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════
   Circular Macro Ring
   ══════════════════════════════════════════ */
function MacroRing({
  label, current, target, unit, color, size = 100,
}: {
  label: string; current: number; target: number; unit: string; color: string; size?: number;
}) {
  const pct = Math.min((current / target) * 100, 120);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 100) / 100);
  const ringColor = pct > 105 ? "var(--danger)" : pct > 90 ? "var(--warning)" : color;
  const remaining = Math.max(target - current, 0);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-high)" strokeWidth="6" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={ringColor} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-text-1 text-sm">{current}</span>
          <span className="text-text-3 text-[10px]">/ {target}</span>
        </div>
      </div>
      <span className="text-text-2 text-xs font-medium">{label}</span>
      <span className="text-text-3 text-[9px]">باقي {remaining}{unit}</span>
    </div>
  );
}

/* ══════════════════════════════════════════
   Data
   ══════════════════════════════════════════ */
interface FoodItem {
  name: string;
  amount: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  alternatives?: { name: string; amount: string; kcal: number; protein: number }[];
}

interface Meal {
  id: string;
  type: string;
  icon: string;
  time: string;
  items: FoodItem[];
  eaten: boolean;
}

const initialMeals: Meal[] = [
  {
    id: "breakfast",
    type: "فطار",
    icon: "breakfast",
    time: "7:00 - 9:00 ص",
    eaten: true,
    items: [
      { name: "بيض مسلوق", amount: "3 بيضات", kcal: 210, protein: 18, carbs: 2, fat: 14,
        alternatives: [
          { name: "بيض أومليت", amount: "3 بيضات", kcal: 230, protein: 18 },
          { name: "بيض مقلي (زيت خفيف)", amount: "3 بيضات", kcal: 260, protein: 18 },
        ]},
      { name: "خبز أسمر", amount: "2 شريحة", kcal: 120, protein: 4, carbs: 22, fat: 1,
        alternatives: [
          { name: "شوفان", amount: "50g", kcal: 190, protein: 7 },
          { name: "توست أبيض", amount: "2 شريحة", kcal: 130, protein: 3 },
        ]},
      { name: "جبنة قريش", amount: "100g", kcal: 85, protein: 12, carbs: 3, fat: 2 },
    ],
  },
  {
    id: "lunch",
    type: "غداء",
    icon: "lunch",
    time: "1:00 - 3:00 م",
    eaten: true,
    items: [
      { name: "صدور فراخ مشوية", amount: "200g", kcal: 330, protein: 62, carbs: 0, fat: 7,
        alternatives: [
          { name: "سمك مشوي (تيلابيا)", amount: "250g", kcal: 280, protein: 55 },
          { name: "لحم بقري مفروم (5%)", amount: "200g", kcal: 340, protein: 58 },
          { name: "صدور ديك رومي", amount: "200g", kcal: 300, protein: 60 },
        ]},
      { name: "أرز أبيض", amount: "150g مطبوخ", kcal: 195, protein: 4, carbs: 44, fat: 0,
        alternatives: [
          { name: "مكرونة", amount: "150g مطبوخ", kcal: 200, protein: 7 },
          { name: "بطاطس مسلوقة", amount: "200g", kcal: 170, protein: 4 },
          { name: "بطاطا حلوة", amount: "200g", kcal: 180, protein: 4 },
        ]},
      { name: "سلطة خضراء", amount: "طبق", kcal: 45, protein: 2, carbs: 8, fat: 1 },
    ],
  },
  {
    id: "snack1",
    type: "سناك 1",
    icon: "snack1",
    time: "5:00 - 6:00 م",
    eaten: false,
    items: [
      { name: "واي بروتين", amount: "سكوب", kcal: 120, protein: 24, carbs: 3, fat: 1 },
      { name: "موز", amount: "1 ثمرة", kcal: 95, protein: 1, carbs: 23, fat: 0 },
      { name: "زبدة فول سوداني", amount: "15g", kcal: 90, protein: 4, carbs: 3, fat: 8 },
    ],
  },
  {
    id: "dinner",
    type: "عشاء",
    icon: "dinner",
    time: "8:00 - 10:00 م",
    eaten: false,
    items: [
      { name: "تونة لايت", amount: "علبة 170g", kcal: 180, protein: 40, carbs: 0, fat: 2,
        alternatives: [
          { name: "صدور فراخ", amount: "150g", kcal: 250, protein: 47 },
          { name: "بيض مسلوق", amount: "4 بيضات", kcal: 280, protein: 24 },
        ]},
      { name: "خبز أسمر", amount: "1 شريحة", kcal: 60, protein: 2, carbs: 11, fat: 0.5 },
      { name: "خيار + طماطم", amount: "حبة من كل", kcal: 30, protein: 1, carbs: 6, fat: 0 },
    ],
  },
  {
    id: "snack2",
    type: "سناك 2 (اختياري)",
    icon: "snack2",
    time: "قبل النوم",
    eaten: false,
    items: [
      { name: "زبادي يوناني", amount: "150g", kcal: 100, protein: 15, carbs: 5, fat: 2 },
      { name: "مكسرات نيئة", amount: "15g", kcal: 90, protein: 3, carbs: 2, fat: 8 },
    ],
  },
];

/* ══════════════════════════════════════════
   Nutrition Tips
   ══════════════════════════════════════════ */
const coachTips = [
  { icon: "tip", text: "حاول تاكل البروتين في أول 30 دقيقة بعد التمرين" },
  { icon: "water", text: "اشرب كوباية مية قبل كل وجبة بـ 15 دقيقة" },
  { icon: "diet", text: "كل سلطة مع الغداء والعشاء — الألياف بتساعد في الشبع" },
];

const flexibleSwaps = [
  { craving: "عايز بيتزا؟", swap: "خد 2 slice وبدّل وجبة العشاء بتونة + سلطة", kcal: 640, protein: 34 },
  { craving: "نفسك في رز زيادة؟", swap: "زود 100g رز وقلل 15g دهون من باقي اليوم", kcal: 130, protein: 3 },
  { craving: "حلو بعد التمرين؟", swap: "زبادي يوناني + موز + عسل بدل حلويات عالية الدهون", kcal: 260, protein: 22 },
];

function getCoachTipIcon(iconType: string) {
  const baseClass = "w-4 h-4 text-accent shrink-0 mt-0.5";
  switch (iconType) {
    case "tip":
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case "water":
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case "diet":
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M12 3a9 9 0 110 18 9 9 0 010-18z" />
        </svg>
      );
    default:
      return null;
  }
}

function getMealIcon(iconId: string) {
  switch (iconId) {
    case "breakfast":
      return (
        <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        </svg>
      );
    case "lunch":
      return (
        <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      );
    case "snack1":
    case "snack2":
      return (
        <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2h12v3H6zM6 5l1.5 14A2 2 0 0 0 9.5 21h5a2 2 0 0 0 2-2L18 5M12 5v16" />
        </svg>
      );
    case "dinner":
      return (
        <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ══════════════════════════════════════════
   Meal Card Component
   ══════════════════════════════════════════ */
function MealCard({ meal, onToggleEaten, onShowAlternatives }: {
  meal: Meal;
  onToggleEaten: () => void;
  onShowAlternatives: (food: FoodItem) => void;
}) {
  const totalKcal = meal.items.reduce((s, i) => s + i.kcal, 0);
  const totalProtein = meal.items.reduce((s, i) => s + i.protein, 0);
  const totalCarbs = meal.items.reduce((s, i) => s + i.carbs, 0);
  const totalFat = meal.items.reduce((s, i) => s + i.fat, 0);

  return (
    <Card className={cn("relative overflow-hidden transition-all border border-border bg-surface p-4", meal.eaten && "border-success/20")}>
      {/* Eaten indicator */}
      {meal.eaten && (
        <div className="absolute top-0 start-0 w-1 h-full bg-success rounded-s-[var(--radius-lg)]" />
      )}

      <div className={cn(meal.eaten && "ps-2")}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {getMealIcon(meal.icon)}
            <div>
              <h3 className="font-semibold text-text-1 text-sm">{meal.type}</h3>
              <p className="text-[10px] text-text-3">{meal.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-end">
              <p className="text-sm font-bold text-text-1">{totalKcal} <span className="text-text-3 text-[10px]">سعرة</span></p>
              <p className="text-[10px] text-info">{totalProtein}g بروتين</p>
            </div>
            <button
              onClick={onToggleEaten}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border",
                meal.eaten
                  ? "bg-success/15 border-success/30 text-success"
                  : "bg-surface-high border-border text-text-3 hover:border-accent/30"
              )}
            >
              {meal.eaten ? "✓" : "○"}
            </button>
          </div>
        </div>

        {/* Food items */}
        <div className="space-y-0">
          {meal.items.map((item) => (
            <div key={item.name} className="flex items-center justify-between py-2 border-b border-border last:border-0 group">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={cn("text-sm", meal.eaten ? "text-text-2" : "text-text-1")}>{item.name}</span>
                <span className="text-[10px] text-text-3 shrink-0">({item.amount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-text-3">{item.kcal}</span>
                  <span className="text-info">{item.protein}p</span>
                  <span className="text-warning">{item.carbs}c</span>
                  <span className="text-danger">{item.fat}f</span>
                </div>
                {item.alternatives && item.alternatives.length > 0 && (
                  <button
                    onClick={() => onShowAlternatives(item)}
                    className="text-[9px] text-accent hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    بدائل
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Macro bar */}
        <div className="flex gap-0.5 mt-3 h-1.5 rounded-full overflow-hidden">
          <div className="bg-info rounded-s-full" style={{ width: `${(totalProtein * 4 / totalKcal) * 100}%` }} title="بروتين" />
          <div className="bg-warning" style={{ width: `${(totalCarbs * 4 / totalKcal) * 100}%` }} title="كاربز" />
          <div className="bg-danger rounded-e-full" style={{ width: `${(totalFat * 9 / totalKcal) * 100}%` }} title="دهون" />
        </div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════
   Alternatives Modal
   ══════════════════════════════════════════ */
function AlternativesModal({ food, onClose }: { food: FoodItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bg/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-xl)] p-6 w-full max-w-md mx-0 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-display font-bold text-text-1 mb-1">بدائل {food.name}</h3>
        <p className="text-xs text-text-3 mb-4">اختار بديل بنفس القيمة الغذائية تقريباً</p>

        {/* Original */}
        <div className="p-3 rounded-[var(--radius-md)] bg-accent-dim border border-accent/20 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent">{food.name}</p>
              <p className="text-[10px] text-text-3">{food.amount}</p>
            </div>
            <div className="text-end">
              <p className="text-sm font-bold text-accent">{food.kcal} سعرة</p>
              <p className="text-[10px] text-info">{food.protein}g بروتين</p>
            </div>
          </div>
          <span className="text-[9px] text-accent/70">✓ الأساسي</span>
        </div>

        {/* Alternatives */}
        <div className="space-y-2">
          {food.alternatives?.map((alt) => (
            <button
              key={alt.name}
              className="w-full p-3 rounded-[var(--radius-md)] bg-surface-high border border-border hover:border-accent/30 transition-all cursor-pointer text-start"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-1">{alt.name}</p>
                  <p className="text-[10px] text-text-3">{alt.amount}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold text-text-1">{alt.kcal} سعرة</p>
                  <p className="text-[10px] text-info">{alt.protein}g بروتين</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-4" onClick={onClose}>إغلاق</Button>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════ */
export default function NutritionPage() {
  const [meals, setMeals] = useState(initialMeals);
  const [altFood, setAltFood] = useState<FoodItem | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [showCheatModal, setShowCheatModal] = useState(false);
  const [cheatMealName, setCheatMealName] = useState("");
  const [cheatMealSent, setCheatMealSent] = useState(false);

  function toggleEaten(mealId: string) {
    setMeals((prev) => prev.map((m) => m.id === mealId ? { ...m, eaten: !m.eaten } : m));
  }

  // Calculate totals from eaten meals
  const eatenMeals = meals.filter((m) => m.eaten);
  const totalEaten = {
    kcal: eatenMeals.reduce((s, m) => s + m.items.reduce((s2, i) => s2 + i.kcal, 0), 0),
    protein: eatenMeals.reduce((s, m) => s + m.items.reduce((s2, i) => s2 + i.protein, 0), 0),
    carbs: eatenMeals.reduce((s, m) => s + m.items.reduce((s2, i) => s2 + i.carbs, 0), 0),
    fat: eatenMeals.reduce((s, m) => s + m.items.reduce((s2, i) => s2 + i.fat, 0), 0),
  };

  const allTotals = {
    kcal: meals.reduce((s, m) => s + m.items.reduce((s2, i) => s2 + i.kcal, 0), 0),
    protein: meals.reduce((s, m) => s + m.items.reduce((s2, i) => s2 + i.protein, 0), 0),
  };

  const targets = { kcal: 2200, protein: 180, carbs: 250, fat: 60 };
  const mealsEatenCount = eatenMeals.length;
  const totalMealsCount = meals.length;
  const remaining = {
    kcal: Math.max(targets.kcal - totalEaten.kcal, 0),
    protein: Math.max(targets.protein - totalEaten.protein, 0),
    carbs: Math.max(targets.carbs - totalEaten.carbs, 0),
    fat: Math.max(targets.fat - totalEaten.fat, 0),
  };

  return (
    <div className="space-y-5">
      {/* Alternatives Modal */}
      <AnimatePresence>
        {altFood && <AlternativesModal food={altFood} onClose={() => setAltFood(null)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-text-1">النظام الغذائي</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCheatModal(true)}
            className="text-xs text-warning hover:underline cursor-pointer flex items-center gap-1.5 bg-warning/10 px-3 py-1.5 rounded-full border border-warning/20 font-bold"
          >
            <svg className="w-3.5 h-3.5 text-warning shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            <span>وجبة فري</span>
          </button>
          <button
            onClick={() => setShowTips(!showTips)}
            className="text-xs text-accent hover:underline cursor-pointer flex items-center gap-1.5 bg-accent-dim px-3 py-1.5 rounded-full border border-accent/20 font-bold"
          >
            <svg className="w-3.5 h-3.5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6M10 22h4" />
            </svg>
            <span>نصايح</span>
          </button>
        </div>
      </div>

      {/* Cheat Meal Modal */}
      <AnimatePresence>
        {showCheatModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm px-4"
            onClick={() => setShowCheatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface border border-border p-6 rounded-[var(--radius-lg)] w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              {!cheatMealSent ? (
                <>
                  <h3 className="text-lg font-bold text-text-1 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-warning shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                    <span>طلب وجبة مفتوحة</span>
                  </h3>
                  <p className="text-xs text-text-3 mb-4">نفسك في إيه؟ النظام هيحسب سعرات الوجبة ويخصمها من باقي أيام الأسبوع عشان متخربش الدايت.</p>
                  <input 
                    type="text" 
                    placeholder="مثال: بيتزا مارجريتا وسط" 
                    value={cheatMealName}
                    onChange={(e) => setCheatMealName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 bg-bg border border-border rounded-[var(--radius-sm)] focus:outline-none focus:border-warning text-sm"
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex-1" onClick={() => setShowCheatModal(false)}>إلغاء</Button>
                    <Button 
                      className="flex-1 bg-warning hover:bg-warning/90 text-black font-bold" 
                      disabled={!cheatMealName.trim()}
                      onClick={() => setCheatMealSent(true)}
                    >
                      إرسال الطلب
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 flex flex-col items-center">
                  <svg className="w-12 h-12 text-warning animate-spin mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M6.34 17.66l2.83-2.83M17.66 6.34l-2.83 2.83" />
                  </svg>
                  <h3 className="font-bold text-text-1 mb-2">طلبك قيد المراجعة</h3>
                  <p className="text-xs text-text-3 mb-4">الكوتش هيراجع الطلب وهيخصم سعراته من باق الأسبوع.</p>
                  <Button variant="outline" className="w-full" onClick={() => {setShowCheatModal(false); setCheatMealSent(false); setCheatMealName("");}}>حسناً</Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coach tips */}
      <AnimatePresence>
        {showTips && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <Card className="bg-accent-dim border border-accent/15 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-accent mb-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6M10 22h4" />
                </svg>
                <span>نصايح الكوتش</span>
              </h3>
              <div className="space-y-2.5">
                {coachTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    {getCoachTipIcon(tip.icon)}
                    <p className="text-xs text-text-2 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-2">وجبات مكتملة</span>
          <span className="text-xs font-bold text-accent">{mealsEatenCount}/{totalMealsCount}</span>
        </div>
        <div className="h-2 rounded-full bg-surface-high overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(mealsEatenCount / totalMealsCount) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
          />
        </div>
      </Card>

      {/* Macro rings */}
      <Card>
        <div className="flex items-center justify-around py-2">
          <MacroRing label="سعرات" current={totalEaten.kcal} target={targets.kcal} unit=" kcal" color="var(--accent)" size={110} />
          <MacroRing label="بروتين" current={totalEaten.protein} target={targets.protein} unit="g" color="#4BA3FF" size={80} />
          <MacroRing label="كاربز" current={totalEaten.carbs} target={targets.carbs} unit="g" color="#FFB020" size={80} />
          <MacroRing label="دهون" current={totalEaten.fat} target={targets.fat} unit="g" color="#FF6B6B" size={80} />
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4BA3FF]" /><span className="text-[9px] text-text-3">بروتين</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFB020]" /><span className="text-[9px] text-text-3">كاربز</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF6B6B]" /><span className="text-[9px] text-text-3">دهون</span></div>
        </div>
      </Card>

      <Card className="border-info/20 bg-info/[0.045] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold text-info">Flexible Diet Wallet</p>
            <h2 className="mt-1 text-lg font-bold text-text-1">كل اللي تحبه، بس محسوب</h2>
            <p className="mt-1 text-sm leading-7 text-text-2">
              المتبقي اليوم: {remaining.kcal} سعرة، {remaining.protein}g بروتين، {remaining.carbs}g كارب، {remaining.fat}g دهون.
            </p>
          </div>
          <div className="grid gap-2 lg:w-[520px]">
            {flexibleSwaps.map((item) => (
              <button
                key={item.craving}
                className="rounded-lg border border-white/10 bg-bg/45 p-3 text-start transition-colors hover:border-info/30 hover:bg-info/10"
                onClick={() => setShowCheatModal(true)}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-text-1">{item.craving}</span>
                  <span className="text-xs font-bold text-info" dir="ltr">{item.kcal} kcal</span>
                </div>
                <p className="mt-1 text-xs leading-6 text-text-2">{item.swap} · {item.protein}g protein</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Daily plan summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-3">إجمالي الخطة اليومية</p>
            <p className="text-lg font-bold text-text-1">{allTotals.kcal} <span className="text-xs text-text-3">سعرة</span></p>
          </div>
          <div className="text-end">
            <p className="text-xs text-text-3">إجمالي بروتين</p>
            <p className="text-lg font-bold text-info">{allTotals.protein}g</p>
          </div>
          <div className="text-end">
            <p className="text-xs text-text-3">الهدف</p>
            <p className="text-lg font-bold text-accent">{targets.kcal} <span className="text-xs text-text-3">سعرة</span></p>
          </div>
        </div>
      </Card>

      {/* Meals */}
      {meals.map((meal, i) => (
        <motion.div
          key={meal.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
        >
          <MealCard
            meal={meal}
            onToggleEaten={() => toggleEaten(meal.id)}
            onShowAlternatives={(food) => setAltFood(food)}
          />
        </motion.div>
      ))}

      {/* Diet compliance note */}
      <Card className="p-4 text-center border border-border bg-surface">
        <p className="text-xs text-text-3 mb-1">ملاحظة من الكوتش</p>
        <p className="text-sm text-text-1">ممتاز الأسبوع ده! حاول تزود البروتين في الفطار شوية.</p>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Weight data (12 weeks) ── */
const weightData = [
  { week: "W1", value: 86 },
  { week: "W2", value: 85.5 },
  { week: "W3", value: 85.2 },
  { week: "W4", value: 84.8 },
  { week: "W5", value: 85.0 },
  { week: "W6", value: 84.2 },
  { week: "W7", value: 83.8 },
  { week: "W8", value: 83.5 },
  { week: "W9", value: 83.0 },
  { week: "W10", value: 82.8 },
  { week: "W11", value: 82.6 },
  { week: "W12", value: 82.5 },
];

/* ── Strength PRs & Trends ── */
const strengthData: Record<string, number[]> = {
  bench: [60, 62, 65, 68, 70, 72, 75, 78, 80],
  squat: [100, 102, 105, 108, 112, 115, 118, 120],
  deadlift: [110, 115, 120, 125, 128, 132, 135, 140],
};
const strengthWeeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9"];

const strengthPRs = [
  { exercise: "بنش بريس", current: 80, previous: 60, unit: "kg", key: "bench" },
  { exercise: "سكوات", current: 120, previous: 100, unit: "kg", key: "squat" },
  { exercise: "ديدليفت", current: 140, previous: 110, unit: "kg", key: "deadlift" },
];

/* ── Measurements ── */
const measurements = [
  { label: "الخصر", current: 83, previous: 88, unit: "cm", goodDir: "down" },
  { label: "الصدر", current: 103, previous: 100, unit: "cm", goodDir: "up" },
  { label: "الأكتاف", current: 119, previous: 116, unit: "cm", goodDir: "up" },
  { label: "الذراع", current: 37, previous: 35, unit: "cm", goodDir: "up" },
  { label: "الفخذ", current: 58, previous: 56, unit: "cm", goodDir: "up" },
];

/* ── Compliance weekly ── */
const weeklyCompliance = [
  { week: "W1", workout: 80, diet: 70, checkin: 85 },
  { week: "W2", workout: 85, diet: 75, checkin: 90 },
  { week: "W3", workout: 90, diet: 80, checkin: 100 },
  { week: "W4", workout: 85, diet: 85, checkin: 100 },
  { week: "W5", workout: 95, diet: 82, checkin: 85 },
  { week: "W6", workout: 90, diet: 88, checkin: 100 },
];

/* ── Multi-Line Chart for Strength ── */
function MultiLineChart({
  data,
  selectedKeys,
  weeks,
  colors = { bench: "#3B82F6", squat: "#E50914", deadlift: "#A855F7" }
}: {
  data: Record<string, number[]>;
  selectedKeys: string[];
  weeks: string[];
  colors?: Record<string, string>;
}) {
  const w = 100, h = 100;

  // Find overall min and max across selected lines
  const activeValues = selectedKeys.flatMap(k => data[k] || []);
  if (activeValues.length === 0) return <div className="h-40 flex items-center justify-center text-xs text-text-3">يرجى تحديد تمرين واحد على الأقل</div>;
  const max = Math.max(...activeValues);
  const min = Math.min(...activeValues);
  const range = max - min || 1;
  const padding = range * 0.1;
  const adjMin = min - padding;
  const adjRange = range + padding * 2;

  return (
    <div className="relative h-44">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        {selectedKeys.map(key => {
          const vals = data[key] || [];
          const color = colors[key as keyof typeof colors] || "var(--accent)";
          const points = vals.map((v, i) => {
            const x = (i / (weeks.length - 1)) * w;
            const y = h - ((v - adjMin) / adjRange) * h;
            return { x, y };
          });
          const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

          return (
            <g key={key}>
              <path d={pathD} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, idx) => (
                <circle key={idx} cx={p.x} cy={p.y} r="1.5" fill={color} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {weeks.map((wk, i) => (
          <span key={i} className="text-[9px] text-text-3 font-mono">{wk}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Standard Single Line Chart ── */
function LineChart({
  data,
  valueKey,
  labelKey,
  color = "var(--accent)",
  height = 180,
}: {
  data: Record<string, number | string>[];
  valueKey: string;
  labelKey: string;
  color?: string;
  height?: number;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const values = data.map((d) => d[valueKey] as number);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const padding = range * 0.1;
  const adjMin = min - padding;
  const adjRange = range + padding * 2;

  const w = 100, h = 100;
  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * w,
    y: h - ((v - adjMin) / adjRange) * h,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${w},${h} L0,${h} Z`;

  return (
    <div className="relative" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`cg-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#cg-${color.replace(/[^a-z0-9]/gi, "")})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredIdx === i ? 3 : 1.5}
            fill={color}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
      </svg>
      {hoveredIdx !== null && (
        <div
          className="absolute -top-8 px-2 py-1 rounded-[var(--radius-sm)] bg-surface-high border border-border text-xs text-text-1 pointer-events-none whitespace-nowrap"
          style={{ left: `${(hoveredIdx / (values.length - 1)) * 100}%`, transform: "translateX(-50%)" }}
        >
          {values[hoveredIdx]} kg
        </div>
      )}
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] text-text-3 font-mono">{String(d[labelKey])}</span>
        ))}
      </div>
    </div>
  );
}

type TabKey = "weight" | "strength" | "measurements" | "compliance" | "gallery";

export default function ProgressPage() {
  const [tab, setTab] = useState<TabKey>("weight");
  const [sliderPosition, setSliderPosition] = useState(50);
  
  /* ── Interactive Strength Chart States ── */
  const [selectedStrengthKeys, setSelectedStrengthKeys] = useState<string[]>(["bench", "squat"]);

  /* ── AI Swapper States ── */
  const [swappedFrom, setSwappedFrom] = useState("سكوات بالبار");
  const [swappedEquipment, setSwappedEquipment] = useState("دمبلز فقط");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapResult, setSwapResult] = useState<any | null>(null);

  /* ── Weekly Wins Share Modal State ── */
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  /* ── Fitness Wrapped States ── */
  const [isWrappedOpen, setIsWrappedOpen] = useState(false);
  const [wrappedSlide, setWrappedSlide] = useState(0);

  const totalWeightLoss = weightData[0].value - weightData[weightData.length - 1].value;
  const weeklyAvgLoss = (totalWeightLoss / weightData.length).toFixed(1);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "weight", label: "الوزن" },
    { key: "strength", label: "القوة والـ PRs" },
    { key: "measurements", label: "القياسات" },
    { key: "compliance", label: "الالتزام" },
    { key: "gallery", label: "الصور (قبل وبعد)" },
  ];

  function getTabIcon(key: TabKey) {
    switch (key) {
      case "weight":
        return (
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M20 12H4M19 12a7 7 0 1 1-14 0" />
          </svg>
        );
      case "strength":
        return (
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3h12M12 3v18M8 21h8M4 7h16M4 17h16" />
          </svg>
        );
      case "measurements":
        return (
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="10" rx="2" />
            <path d="M6 7v4M10 7v3M14 7v4M18 7v3" />
          </svg>
        );
      case "compliance":
        return (
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18M18 9l-5 5-3-3-4 4" />
          </svg>
        );
      case "gallery":
        return (
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        );
      default:
        return null;
    }
  }

  /* ── AI Exercise Swapper Simulator ── */
  const handleSwapExercise = () => {
    setIsSwapping(true);
    setSwapResult(null);

    setTimeout(() => {
      setIsSwapping(false);
      if (swappedFrom === "سكوات بالبار" && swappedEquipment === "دمبلز فقط") {
        setSwapResult({
          alternative: "Dumbbell Goblet Squat (سكوات الكأس بالدمبل)",
          targetMuscle: "عضلة الفخذ الأمامية (Quads) والمؤخرة (Glutes)",
          instructions: "احمل دمبل واحد ثقيل أمام صدرك عمودياً بكلا اليدين، انزل لأسفل ببطء وحافظ على استقامة ظهرك وتثبيت قدميك بالأرض، ثم اصعد بقوة."
        });
      } else if (swappedFrom === "بنش بريس بالبار" && swappedEquipment === "وزن الجسم") {
        setSwapResult({
          alternative: "Tempo Push-ups (تمرين الضغط ببطء وتثبيت)",
          targetMuscle: "عضلة الصدر (Chest) والترايسبس والكتف الأمامي",
          instructions: "اتخذ وضعية الضغط، انزل ببطء شديد (3 ثوانٍ نزول)، اثبت في الأسفل لمدة ثانية، ثم ادفع جسمك للأعلى بقوة."
        });
      } else {
        setSwapResult({
          alternative: "Single-Arm Dumbbell Romanian Deadlift",
          targetMuscle: "عضلات الفخذ الخلفية والقطنية",
          instructions: "امسك دمبل في يد واحدة، انزل بالوزن مع ثني خفيف في الركبة وميل الجذع للأمام حتى تشعر بضغط خفيف في الخلفيات."
        });
      }
    }, 1000);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* ── Fitness Wrapped Button & Callout ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-display font-bold text-text-1">تقدم اللاعب والتقارير</h1>
          <p className="text-xs text-text-3 mt-0.5">تقارير حية، مقارنات القوة، ومؤشر الالتزام بالأجهزة الذكية</p>
        </div>
        <Button 
          onClick={() => {
            setIsWrappedOpen(true);
            setWrappedSlide(0);
          }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs"
        >
          افتح حصاد اللياقة السنوي EAGLE Wrapped
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "إجمالي النقص بالوزن", value: `${totalWeightLoss.toFixed(1)} kg`, color: "text-success" },
          { label: "معدل الخسارة الأسبوعي", value: `${weeklyAvgLoss} kg/أسبوع`, color: "text-accent" },
          { label: "الالتزام الحالي Streak", value: "14 يوم متواصل", color: "text-warning" },
        ].map((s) => (
          <Card key={s.label} className="p-3 text-center border border-border bg-surface">
            <p className="text-[10px] text-text-3">{s.label}</p>
            <p className={cn("text-xs md:text-sm font-bold mt-0.5", s.color)}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Weekly Summary Wins Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-4 border border-accent/20 bg-gradient-to-br from-surface to-surface-high relative overflow-hidden">
          <div className="absolute top-0 end-0 p-3 opacity-10 pointer-events-none">
            <svg className="w-24 h-24 text-accent/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 1 4 4v3H8V6a4 4 0 0 1 4-4z" />
            </svg>
          </div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-text-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-warning shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>بطاقة إنجاز الأسبوع الذهبية (Weekly Wins)</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-accent/20 text-accent border border-accent/30">
              أداء نخبوي
            </span>
          </div>
          <p className="text-xs text-text-2 mb-4 leading-relaxed">
            لقد تمكنت من الحفاظ على التزام كامل بالخطوات التدريبية ومواعيد التشيكن. المدرب فخور جداً بتقدم قوتك العضلية!
          </p>
          <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-t border-border/30">
            <div className="flex gap-4 text-[10px] text-text-3">
              <div>الالتزام العام: <span className="font-bold text-accent">93%</span></div>
              <div>التمارين المنجزة: <span className="font-bold text-info">5/5 تمارين</span></div>
            </div>
            <Button size="sm" onClick={() => setIsShareModalOpen(true)} className="text-[10px] bg-accent text-bg font-bold">
              مشاركة الإنجاز كقصة
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Tabs Selection */}
      <div className="flex gap-1 p-1 rounded-[var(--radius-md)] bg-surface-high overflow-x-auto custom-scrollbar whitespace-nowrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 py-2 px-3 rounded-[var(--radius-sm)] text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5",
              tab === t.key ? "bg-accent text-bg font-bold" : "text-text-2 hover:text-text-1"
            )}
          >
            {getTabIcon(t.key)}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      
      {/* 1. Weight Tab */}
      {tab === "weight" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-1">منحنى تغير الوزن الكلي</h3>
              <div className="text-end">
                <p className="text-lg font-display font-bold text-accent">{weightData[weightData.length - 1].value} kg</p>
                <p className="text-xs text-success">-{totalWeightLoss.toFixed(1)} kg إجمالي الفقد</p>
              </div>
            </div>
            <LineChart data={weightData} valueKey="value" labelKey="week" />
          </Card>

          <Card>
            <h3 className="font-semibold text-text-1 mb-3">تفاصيل التغير الأسبوعي</h3>
            <div className="space-y-2 text-xs">
              {weightData.slice(1).map((d, i) => {
                const diff = d.value - weightData[i].value;
                return (
                  <div key={d.week} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-text-2">{d.week}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-text-1 font-mono font-bold">{d.value} kg</span>
                      <span className={cn("font-bold font-mono", diff < 0 ? "text-success" : diff > 0 ? "text-danger" : "text-text-3")}>
                        {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* 2. Strength & PRs Tab */}
      {tab === "strength" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          
          {/* Multi-Exercise Comparison Graph */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-semibold text-text-1">منحنى مقارنة القوة</h3>
                <p className="text-xs text-text-3">حدد التمارين لعرضها معاً على الرسم البياني</p>
              </div>
              
              {/* Checkbox selectors */}
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { key: "bench", label: "بنش بريس", color: "border-blue-500 text-blue-500" },
                  { key: "squat", label: "سكوات", color: "border-accent text-accent" },
                  { key: "deadlift", label: "ديدليفت", color: "border-purple-500 text-purple-400" },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={selectedStrengthKeys.includes(item.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStrengthKeys(prev => [...prev, item.key]);
                        } else {
                          setSelectedStrengthKeys(prev => prev.filter(k => k !== item.key));
                        }
                      }}
                      className="accent-[var(--accent)]" 
                    />
                    <span className={cn("font-bold", selectedStrengthKeys.includes(item.key) ? item.color : "text-text-3")}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <MultiLineChart 
              data={strengthData} 
              selectedKeys={selectedStrengthKeys} 
              weeks={strengthWeeks} 
            />
          </Card>

          {/* RPE & Estimated 1RM display */}
          <Card>
            <h3 className="font-semibold text-text-1 mb-3">حساب الـ 1RM التقديري ومستويات RPE</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: "سكوات بالبار", maxWeight: "120 kg × 5 reps", rpe: 8.5, estimated1RM: "135 kg" },
                { name: "ديدليفت بالبار", maxWeight: "140 kg × 3 reps", rpe: 9.0, estimated1RM: "151 kg" },
                { name: "بنش بريس بالبار", maxWeight: "80 kg × 6 reps", rpe: 8.0, estimated1RM: "94 kg" },
              ].map((ex, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-surface-high border border-border/40 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-text-1">{ex.name}</p>
                    <p className="text-[10px] text-text-3 mt-0.5">أقصى وزن سجلت: {ex.maxWeight}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-accent font-bold font-mono">1RM: {ex.estimated1RM}</p>
                    <p className="text-[9px] text-text-3 mt-0.5">معدل الجهد RPE: {ex.rpe}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Smart Exercise Swapper Card */}
          <Card className="border border-border p-4 bg-surface">
            <h3 className="font-bold text-text-1 text-sm mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.73" />
              </svg>
              <span>مساعد تبديل التمارين بالذكاء الاصطناعي (AI Exercise Swapper)</span>
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-text-3 block mb-1">التمرين المطلوب استبداله</label>
                  <select 
                    value={swappedFrom} 
                    onChange={e => setSwappedFrom(e.target.value)}
                    className="w-full text-xs bg-bg border border-border p-2 rounded text-text-1 focus:outline-none"
                  >
                    <option value="سكوات بالبار">سكوات بالبار (Barbell Squat)</option>
                    <option value="بنش بريس بالبار">بنش بريس بالبار (Barbell Bench Press)</option>
                    <option value="ديدليفت بالبار">ديدليفت بالبار (Barbell Deadlift)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-text-3 block mb-1">المعدات المتاحة حالياً</label>
                  <select 
                    value={swappedEquipment} 
                    onChange={e => setSwappedEquipment(e.target.value)}
                    className="w-full text-xs bg-bg border border-border p-2 rounded text-text-1 focus:outline-none"
                  >
                    <option value="دمبلز فقط">دمبلز فقط (Dumbbells Only)</option>
                    <option value="وزن الجسم">وزن الجسم فقط (Bodyweight)</option>
                    <option value="حبال المقاومة">حبال المقاومة (Resistance Bands)</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleSwapExercise} disabled={isSwapping} className="w-full text-xs font-bold" size="sm">
                {isSwapping ? "جاري البحث عن بديل عالي الكفاءة..." : "اقتراح بديل ذكي بالذكاء الاصطناعي"}
              </Button>

              {swapResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-lg bg-accent/5 border border-accent/20 text-xs space-y-2"
                >
                  <p className="font-bold text-accent">البديل المقترح: {swapResult.alternative}</p>
                  <p className="text-[10px] text-text-2">العضلة المستهدفة: {swapResult.targetMuscle}</p>
                  <p className="text-[10px] text-text-3 leading-relaxed mt-1">**كيفية الأداء:** {swapResult.instructions}</p>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* 3. Measurements Tab */}
      {tab === "measurements" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <h3 className="font-semibold text-text-1 mb-4">القياسات البدنية وتتبع الجسم</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {measurements.map((m) => {
                const diff = m.current - m.previous;
                const isGood = (m.goodDir === "down" && diff < 0) || (m.goodDir === "up" && diff > 0);
                return (
                  <div key={m.label} className="bg-surface-high rounded-[var(--radius-md)] p-3 border border-border/40">
                    <p className="text-text-3">{m.label}</p>
                    <p className="text-text-1 font-bold text-base mt-1">{m.current} {m.unit}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={cn("font-medium", isGood ? "text-success" : "text-danger")}>
                        {diff > 0 ? "+" : ""}{diff} {m.unit}
                      </span>
                      <span className={cn("text-[9px]", isGood ? "text-success" : "text-danger")}>
                        {isGood ? "✓ تقدم رائع" : "✗ ثبات"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* 4. Compliance Tab */}
      {tab === "compliance" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Card>
            <h3 className="font-semibold text-text-1 mb-4">مستويات الالتزام الأسبوعي</h3>
            <div className="space-y-3">
              {weeklyCompliance.map((w) => (
                <div key={w.week} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-2 font-medium">{w.week}</span>
                    <span className="text-text-3 font-mono">{Math.round((w.workout + w.diet + w.checkin) / 3)}% متوسط الالتزام</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div className="flex-1 rounded-full bg-surface-high overflow-hidden" title="تمارين">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${w.workout}%` }} />
                    </div>
                    <div className="flex-1 rounded-full bg-surface-high overflow-hidden" title="دايت">
                      <div className="h-full rounded-full bg-info" style={{ width: `${w.diet}%` }} />
                    </div>
                    <div className="flex-1 rounded-full bg-surface-high overflow-hidden" title="تشيكن">
                      <div className="h-full rounded-full bg-success" style={{ width: `${w.checkin}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Leaderboard and Community Challenges */}
          <Card className="border border-border p-4 bg-surface">
            <h3 className="font-bold text-text-1 text-sm mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-warning shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 1 4 4v3H8V6a4 4 0 0 1 4-4z" />
              </svg>
              <span>لوحة متصدري التحديات الأسبوعية (EAGLE Community)</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                <p className="font-bold text-accent">تحدي الأسبوع: الالتزام التام بـ 10,000 خطوة يومياً</p>
                <p className="text-[10px] text-text-2 mt-1">المكافأة: وسام "صياد الخطوات الفضي" للمتأهلين</p>
              </div>

              {/* Leaderboard rows */}
              <div className="space-y-2">
                {[
                  { rank: 1, name: "حسام ن. (أنت)", streak: "21 يوم متتالي", score: "96% التزام" },
                  { rank: 2, name: "أحمد م.", streak: "14 يوم متتالي", score: "92% التزام" },
                  { rank: 3, name: "يوسف إ.", streak: "7 يوم متتالي", score: "88% التزام" },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-surface-high/60 border border-border/20 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-bg border border-border flex items-center justify-center font-bold text-accent">{row.rank}</span>
                      <span className="font-semibold text-text-1">{row.name}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-warning font-medium">{row.streak}</span>
                      <span className="font-bold text-text-2">{row.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 5. Photos / Comparison Gallery Tab (Arabic Encoding Fixed!) */}
      {tab === "gallery" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-text-1">مقارنة التطور البصري (قبل وبعد)</h3>
                <p className="text-xs text-text-3">اسحب الخط لليمين واليسار لمشاهدة الفرق بدقة</p>
              </div>
              <button className="text-xs font-bold text-accent px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                + رفع صور جديدة
              </button>
            </div>
            
            <div className="relative aspect-[4/3] w-full rounded-[var(--radius-lg)] overflow-hidden bg-surface-high group select-none border border-border/60 shadow-2xl">
              {/* After Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                <span className="text-text-2 text-sm font-bold">صورة الوزن الحالي (82.5 kg) - بعد</span>
              </div>
              <span className="absolute bottom-4 left-4 z-10 px-2.5 py-1 bg-success/80 backdrop-blur text-bg text-[10px] font-bold rounded shadow-lg">
                بعد (82.5 kg)
              </span>

              {/* Before Image */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                  <span className="text-text-3 text-sm font-bold">صورة أول يوم (86 kg) - قبل</span>
                </div>
                <span className="absolute bottom-4 right-4 z-10 px-2.5 py-1 bg-accent/80 backdrop-blur text-bg text-[10px] font-bold rounded shadow-lg whitespace-nowrap">
                  قبل (86 kg)
                </span>
              </div>

              {/* Slider Line Indicator */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-accent pointer-events-none z-10"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-8 h-8 rounded-full bg-accent text-bg shadow-2xl border border-border flex items-center justify-center font-bold text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-bg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 19l7-7-7-7M7 5l-7 7 7 7" />
                  </svg>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
              />
            </div>
            <p className="text-xs text-center text-text-3 mt-4">اسحب الخط للمقارنة الكاملة</p>
          </Card>
        </motion.div>
      )}

      {/* ── Weekly Wins Share Story Modal ── */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg border border-border max-w-sm w-full rounded-2xl p-6 relative shadow-2xl text-center"
            >
              <h3 className="text-base font-bold text-text-1 mb-4">معاينة بطاقة قصة الانستجرام / واتساب</h3>
              
              {/* Instagram Story Mockup Card */}
              <div className="w-full aspect-[9/16] rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-accent/20 p-6 flex flex-col justify-between border border-accent/20 text-right shadow-xl mb-4 relative overflow-hidden">
                <div className="absolute top-0 end-0 p-3 opacity-10">
                  <svg className="w-32 h-32 text-accent/5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-[10px] font-bold tracking-wider text-accent uppercase font-display">EAGLE PLATFORM</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-text-1">بطل الأسبوع الملتزم</h4>
                  <p className="text-[10px] text-text-3 mt-1">نتائج الأسبوع السادس (W6)</p>
                </div>

                <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="text-center">
                    <p className="text-xl font-bold font-mono text-accent">14 يوم</p>
                    <p className="text-[8px] text-text-3">التزام متتالي متواصل</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-[9px] border-t border-white/5 pt-2">
                    <div>
                      <p className="font-bold text-info">93%</p>
                      <p className="text-text-3">نسبة الالتزام</p>
                    </div>
                    <div>
                      <p className="font-bold text-success">-3.5 kg</p>
                      <p className="text-text-3">خسارة الوزن</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[9px] text-text-2">صُنِع بواسطة مدربي منصة EAGLE</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(false)}>
                  إغلاق المعاينة
                </Button>
                <Button size="sm" className="bg-accent text-bg font-bold" onClick={() => {
                  alert("تم تحميل صورة القصة بنجاح إلى ملفاتك ومحاكاة النشر!");
                  setIsShareModalOpen(false);
                }}>
                  تحميل ومشاركة الآن
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Fitness Wrapped Fullscreen Modal (Spotify Wrapped Style) ── */}
      <AnimatePresence>
        {isWrappedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 max-w-sm w-full rounded-2xl p-6 relative shadow-2xl h-[70vh] flex flex-col justify-between text-center overflow-hidden"
            >
              {/* Progress dots */}
              <div className="flex justify-center gap-1 mb-2">
                {[0, 1, 2].map(i => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1 rounded-full transition-all",
                      wrappedSlide === i ? "w-6 bg-accent" : "w-2 bg-neutral-700"
                    )} 
                  />
                ))}
              </div>

              {/* Wrapped Contents */}
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <AnimatePresence mode="wait">
                  {wrappedSlide === 0 && (
                    <motion.div 
                      key="s0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 flex flex-col items-center"
                    >
                      <svg className="w-16 h-16 text-accent animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6.5 9.5h11M6.5 14.5h11M3 6.5h18v11H3z" />
                      </svg>
                      <h3 className="text-xl font-extrabold text-text-1">لقد قمت برفع الكثير من الأوزان!</h3>
                      <p className="text-sm text-text-2 font-display">
                        قمت برفع ما مجموعه **145,200 كجم** إجمالاً خلال عام 2026.
                      </p>
                      <p className="text-xs text-accent bg-accent/10 px-3 py-1.5 rounded-full inline-block font-bold">
                        هذا يعادل وزن 24 فيلاً أفريقياً بالغاً!
                      </p>
                    </motion.div>
                  )}

                  {wrappedSlide === 1 && (
                    <motion.div 
                      key="s1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 flex flex-col items-center"
                    >
                      <svg className="w-16 h-16 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                      <h3 className="text-xl font-extrabold text-text-1">التزام حديدي بالنظام الغذائي</h3>
                      <p className="text-sm text-text-2 font-display">
                        بلغ متوسط التزامك بالسعرات والماكروز **92%**.
                      </p>
                      <p className="text-xs text-info bg-info/10 px-3 py-1.5 rounded-full inline-block font-bold">
                        تفوقت على 95% من مشتركي EAGLE هذا العام!
                      </p>
                    </motion.div>
                  )}

                  {wrappedSlide === 2 && (
                    <motion.div 
                      key="s2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 flex flex-col items-center"
                    >
                      <svg className="w-16 h-16 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <h3 className="text-xl font-extrabold text-text-1">جاهز للمستوى التالي في 2026؟</h3>
                      <p className="text-sm text-text-2 font-display">
                        لقد بنيت عادات ممتازة وحققت نتائج بصرية حقيقية. استمر مع EAGLE.
                      </p>
                      <p className="text-xs text-success bg-success/10 px-3 py-1.5 rounded-full inline-block font-bold">
                        أطول سلسلة التزام متتالي: 21 يوم!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsWrappedOpen(false)}
                  className="flex-1 text-xs"
                >
                  إغلاق
                </Button>

                {wrappedSlide < 2 ? (
                  <Button 
                    onClick={() => setWrappedSlide(s => s + 1)}
                    className="flex-1 bg-accent text-bg text-xs font-bold"
                  >
                    التالي
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setIsWrappedOpen(false)}
                    className="flex-1 bg-success hover:bg-success/90 text-white text-xs font-bold"
                  >
                    شكرًا يا كوتش!
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

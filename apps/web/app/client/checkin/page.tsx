"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ── Custom SVGs ── */
function getMoodIcon(score: number) {
  const baseClass = "w-5 h-5 text-accent mb-1";
  switch (score) {
    case 1:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 16c1.5-1.5 2.5-1.5 4 0" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    case 2:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="15" x2="16" y2="15" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    case 3:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14s1.5 2 3 2 3-2 3-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    case 4:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 13.5s1.5 2.5 4 2.5 4-2.5 4-2.5" />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
          <circle cx="15" cy="9" r="1" fill="currentColor" />
        </svg>
      );
    case 5:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 13s1.5 3 4 3 4-3 4-3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.5l-1-1M15 9.5l1-1" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

function getEnergyIcon(value: number) {
  const baseClass = "w-5 h-5 text-accent mb-1";
  switch (value) {
    case 1:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="16" height="10" rx="2" />
          <line x1="22" y1="11" x2="22" y2="13" />
        </svg>
      );
    case 2:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="16" height="10" rx="2" />
          <line x1="22" y1="11" x2="22" y2="13" />
          <line x1="5" y1="10" x2="5" y2="14" />
        </svg>
      );
    case 3:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 4:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case 5:
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5L21 3M17 11.5l3.5-3.5M11.5 17l-3.5 3.5M9.5 9.5l-4-4M14 6l3.5-3.5M6 14l-3.5 3.5M12 12c-2.5 2.5-4 5.5-4 5.5s3-1.5 5.5-4z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Streak display ── */
function StreakBanner({ count }: { count: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="text-center bg-gradient-to-br from-surface to-surface-high border-accent/20">
        <div className="flex items-center justify-center gap-2 mb-1 text-accent">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
          </svg>
          <span className="font-display font-extrabold text-4xl text-accent">{count}</span>
        </div>
        <p className="text-text-2 text-sm font-medium">يوم متتالي بدون انقطاع!</p>
        <div className="flex justify-center gap-1 mt-3">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                i < count % 7 ? "bg-accent text-bg" : "bg-surface-high text-text-3"
              )}
            >
              {i < count % 7 ? "✓" : i + 1}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

/* ── Mood selector ── */
const moods = [
  { label: "سيء" },
  { label: "عادي" },
  { label: "كويس" },
  { label: "ممتاز" },
  { label: "خرافي" },
];

/* ── Energy level ── */
const energyLevels = [
  { label: "مفيش", value: 1 },
  { label: "ضعيفة", value: 2 },
  { label: "متوسطة", value: 3 },
  { label: "عالية", value: 4 },
  { label: "خرافية", value: 5 },
];

export default function CheckinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [workoutStatus, setWorkoutStatus] = useState<string | null>(null);
  const [dietPercent, setDietPercent] = useState(80);
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [sleepHours, setSleepHours] = useState("7");
  const [waterCups, setWaterCups] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [soreness, setSoreness] = useState<number | null>(null);

  /* ── Wearable Sync State ── */
  const [isSyncing, setIsSyncing] = useState(false);

  /* ── AI Meal Scanner State ── */
  const [mealImage, setMealImage] = useState<string | null>(null);
  const [isScanningMeal, setIsScanningMeal] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  /* ── Toasts State ── */
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const triggerToast = (text: string) => {
    const id = Date.now().toString();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4500);
  };

  const streak = 14;

  /* ── Wearables Sync Trigger ── */
  const handleWearableSync = () => {
    setIsSyncing(true);
    triggerToast("⌚ جاري البحث ومزامنة البيانات مع Apple Health & Smart Watch...");
    
    setTimeout(() => {
      setSleepHours("7.5");
      setSleepQuality(4);
      setWaterCups(6);
      setSoreness(2);
      setDietPercent(90);
      setIsSyncing(false);
      triggerToast("✅ تم سحب البيانات بنجاح: النوم 7.5 س، جودة 4/5، شرب المياه 6 أكواب!");
    }, 1800);
  };

  /* ── AI Meal Photo Scanner Simulation ── */
  const handleMealUploadMock = () => {
    // We simulate uploading a meal photo
    setMealImage("/images/meal_mock.png");
    setIsScanningMeal(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanningMeal(false);
      setScanResult({
        detectedFoods: [
          { name: "صدر دجاج مشوي (~150g)", macros: "40g P, 3g F, 0g C" },
          { name: "أرز بسمتي مسلوق (~150g)", macros: "3g P, 1g F, 38g C" },
          { name: "سلطة خضراء وزيت زيتون", macros: "1g P, 7g F, 5g C" },
        ],
        totalCalories: 430,
        confidence: 94
      });
      setDietPercent(95); // Set diet compliance to high
      triggerToast("اكتمل تحليل طبقك بالذكاء الاصطناعي! تم احتساب الماكروز تلقائياً.");
    }, 2500);
  };

  const deleteMealScan = () => {
    setMealImage(null);
    setScanResult(null);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <div>
          <h2 className="text-2xl font-display font-bold text-text-1 mb-2">تم إرسال التشيكن بنجاح</h2>
          <p className="text-text-2 text-sm">استمر يا بطل! الكوتش هيراجع بياناتك وتكنيك التمارين وهيرد عليك فوراً.</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="text-center px-8 py-5">
            <div className="flex justify-center mb-2 text-accent">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <p className="font-display font-bold text-2xl text-accent mt-1">{streak + 1} يوم</p>
            <p className="text-text-3 text-xs">سجل التزام متتالي متصاعد!</p>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5 relative">
      
      {/* ── Visual Toasts ── */}
      <div className="fixed top-6 right-6 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="bg-surface border border-accent/20 px-4 py-3 rounded-lg shadow-[0_4px_25px_rgba(197,162,93,0.15)] flex items-center gap-3 pointer-events-auto"
            >
              <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6M10 22h4" />
              </svg>
              <p className="text-xs font-semibold text-text-1 font-display">{t.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-display font-bold text-text-1">التشيكن اليومي للمتدرب</h1>
        
        {/* Wearables Sync Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleWearableSync}
          disabled={isSyncing}
          className="text-xs border-accent/20 hover:bg-accent-dim flex items-center gap-2 font-bold"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="2" width="12" height="20" rx="4" />
            <path d="M12 6h.01M12 18h.01M9 10h6" />
          </svg>
          <span>{isSyncing ? "جاري المزامنة..." : "مزامنة البيانات من الساعة الذكية"}</span>
        </Button>
      </div>

      <StreakBanner count={streak} />

      <Card className="border border-border p-5 bg-surface">
        <div className="space-y-6">
          
          {/* Workout status */}
          <div>
            <label className="text-sm font-medium text-text-2 mb-2.5 block">حالة تمرين اليوم</label>
            <div className="flex gap-2">
              {[
                { value: "done", label: "كملت التدريب", color: "border-success/40 bg-success/10 text-success" },
                { value: "partial", label: "تمرين جزئي", color: "border-warning/40 bg-warning/10 text-warning" },
                { value: "skipped", label: "راحة / سكبت", color: "border-danger/40 bg-danger/10 text-danger" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setWorkoutStatus(opt.value)}
                  className={cn(
                    "flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all cursor-pointer border",
                    workoutStatus === opt.value ? opt.color : "bg-surface-high border-border text-text-2 hover:border-border-hover"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Visual Meal Scanner Section */}
          <div className="border border-border/40 p-4 rounded-xl bg-surface-high/30">
            <label className="text-sm font-medium text-text-2 mb-2.5 block flex items-center gap-2">
              <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              <span>ماسح الوجبات بالذكاء الاصطناعي (أسرع للالتزام)</span>
            </label>
            
            {!mealImage ? (
              <div 
                onClick={handleMealUploadMock}
                className="border border-dashed border-border hover:border-accent/40 rounded-lg p-6 text-center cursor-pointer transition-colors"
              >
                <svg className="w-8 h-8 text-text-3 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <p className="text-xs text-text-1 font-bold">اضغط هنا لتصوير أو رفع صورة طبق اليوم</p>
                <p className="text-[10px] text-text-3 mt-1">الذكاء الاصطناعي هيقوم بتحليل الطبق وتخمين الماكروز تلقائياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-border bg-black">
                  
                  {/* Mock Uploaded Image Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-emerald-900/40 flex items-center justify-center">
                    <span className="text-text-3 text-xs">طبق وجبتك اليومي</span>
                  </div>

                  {/* Scanning Scanner Effect */}
                  {isScanningMeal && (
                    <motion.div 
                      initial={{ y: "0%" }}
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-1 bg-accent shadow-[0_0_15px_#FF1E27] z-10"
                    />
                  )}

                  <div className="absolute top-2 start-2 bg-black/75 text-[10px] px-2 py-0.5 rounded text-text-1">
                    صورة وجبتك الملتقطة
                  </div>

                  {isScanningMeal && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-bold text-accent animate-pulse">
                      جاري تحليل الأطعمة وتقدير الأحجام...
                    </div>
                  )}
                </div>

                {scanResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-lg bg-bg border border-accent/20 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="font-bold text-text-1">نتائج التحليل (دقة {scanResult.confidence}%)</span>
                      <span className="text-accent font-bold font-mono">~{scanResult.totalCalories} kcal</span>
                    </div>
                    <div className="space-y-1">
                      {scanResult.detectedFoods.map((f: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-text-2 text-[11px]">
                          <span>{f.name}</span>
                          <span className="font-mono text-text-3">{f.macros}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={deleteMealScan} className="text-xs text-danger border-danger/20 hover:bg-danger/10">
                    حذف الصورة
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Diet compliance */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-medium text-text-2">التزام الدايت لليوم</label>
              <span className={cn("text-sm font-bold", dietPercent >= 80 ? "text-success" : dietPercent >= 60 ? "text-warning" : "text-danger")}>{dietPercent}%</span>
            </div>
            <input type="range" min="0" max="100" step="5" value={dietPercent} onChange={(e) => setDietPercent(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
            <div className="flex justify-between text-xs text-text-3 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm font-medium text-text-2 mb-2.5 block">المزاج والصحة النفسية</label>
            <div className="flex gap-2">
              {moods.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-[var(--radius-md)] transition-all cursor-pointer border",
                    mood === i ? "border-accent/40 bg-accent-dim scale-105 text-accent font-bold" : "bg-surface-high border-border hover:border-border-hover text-text-2"
                  )}
                >
                  {getMoodIcon(i + 1)}
                  <span className="text-[10px] text-text-3 font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div>
            <label className="text-sm font-medium text-text-2 mb-2.5 block">مستوى الطاقة ومحفز النشاط</label>
            <div className="flex gap-2">
              {energyLevels.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setEnergy(e.value)}
                  className={cn(
                    "flex-1 py-2.5 rounded-[var(--radius-md)] text-xs font-medium transition-all cursor-pointer border text-center flex flex-col items-center justify-center gap-1",
                    energy === e.value ? "border-accent/40 bg-accent-dim text-accent font-bold" : "bg-surface-high border-border text-text-2 hover:border-border-hover"
                  )}
                >
                  {getEnergyIcon(e.value)}
                  <div className="text-[9px] mt-0.5">{e.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep + Soreness */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-2 mb-2.5 block">جودة النوم</label>
              <div className="flex gap-1 flex-wrap">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSleepQuality(n)}
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-[var(--radius-sm)] text-sm transition-all cursor-pointer border",
                      sleepQuality !== null && n <= sleepQuality ? "bg-accent text-bg border-accent font-bold" : "bg-surface-high border-border text-text-2 hover:border-border-hover"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-2.5 block">ساعات النوم</label>
              <input
                type="number"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                step="0.5"
                className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
            </div>
          </div>

          {/* Soreness */}
          <div>
            <label className="text-sm font-medium text-text-2 mb-2.5 block">مستوى تعب المفاصل والعضلات (Soreness)</label>
            <div className="flex gap-2">
              {[
                { v: 1, label: "مستكفي" },
                { v: 2, label: "خفيف" },
                { v: 3, label: "متوسط" },
                { v: 4, label: "تعب شديد" },
              ].map((s) => (
                <button
                  key={s.v}
                  onClick={() => setSoreness(s.v)}
                  className={cn(
                    "flex-1 py-2.5 rounded-[var(--radius-md)] text-xs transition-all cursor-pointer border text-center flex flex-col items-center justify-center gap-1",
                    soreness === s.v ? "border-accent/40 bg-accent-dim text-accent font-bold" : "bg-surface-high border-border text-text-2 hover:border-border-hover"
                  )}
                >
                  <span className="text-sm font-bold font-mono text-text-1">{s.v}</span>
                  <div className="text-[9px] mt-0.5">{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Hydration with Wave filling animation */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-medium text-text-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-info shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <span>كمية شرب المياه لليوم</span>
              </label>
              <span className="text-xs text-text-3 font-bold font-mono">{waterCups}/8 أكواب ({waterCups * 250}ml)</span>
            </div>
            
            {/* Cups Container */}
            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }, (_, i) => {
                const isActive = i < waterCups;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setWaterCups(i + 1);
                      triggerToast(`تم شرب ${(i + 1) * 250}ml مياه اليوم!`);
                    }}
                    className={cn(
                      "h-12 rounded-[var(--radius-md)] text-sm transition-all cursor-pointer border relative overflow-hidden flex items-end justify-center pb-2 select-none",
                      isActive ? "border-info/40 text-white" : "bg-surface-high border-border text-text-3 hover:bg-info/10"
                    )}
                  >
                    {/* Filling Wave Effect */}
                    {isActive && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-info to-info/70 z-0"
                        transition={{ duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10 font-bold">كوب {i + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-text-2 mb-2.5 block">ملاحظات اليوم للكوتش</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="هل شعرت بأي ألم؟ كيف كان أداؤك؟ أي تفاصيل تفيد المدرب..."
              className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm placeholder:text-text-3 focus:outline-none focus:ring-1 focus:ring-accent/30 min-h-[80px] resize-none"
            />
          </div>

          <Button className="w-full font-bold" size="lg" onClick={() => setSubmitted(true)}>
            إرسال التقرير اليومي
          </Button>
        </div>
      </Card>
    </div>
  );
}

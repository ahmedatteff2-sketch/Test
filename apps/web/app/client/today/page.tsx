"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatRing } from "@/components/ui/stat-ring";

/* ── Mock workout data ── */
const mockDay = {
  dayName: "اليوم الأول — صدر وتراي",
  exercises: [
    { id: "1", name: "بنش بريس", sets: 4, reps: "8-10", restSeconds: 120, lastWeight: 60, lastReps: 10, coachHighlight: "ركز على النزول ببطء" },
    { id: "2", name: "دمبل فلاي", sets: 3, reps: "10-12", restSeconds: 90, lastWeight: 16, lastReps: 12, coachHighlight: null },
    { id: "3", name: "كيبل كروس أوفر", sets: 3, reps: "12-15", restSeconds: 60, lastWeight: 15, lastReps: 15, coachHighlight: null },
    { id: "4", name: "تراي بوش داون", sets: 3, reps: "10-12", restSeconds: 60, lastWeight: 25, lastReps: 12, coachHighlight: null },
    { id: "5", name: "سكال كراشر", sets: 3, reps: "10-12", restSeconds: 60, lastWeight: 20, lastReps: 10, coachHighlight: "حافظ على المرفق ثابت" },
  ],
};

/* ── Rest Timer Overlay ── */
function RestTimer({
  duration,
  exerciseName,
  onSkip,
  onComplete,
}: {
  duration: number;
  exerciseName: string;
  onSkip: () => void;
  onComplete: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const circumference = 2 * Math.PI * 45;
  const progress = timeLeft / duration;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Vibrate if available on client
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 400]);
          }
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/95 backdrop-blur-xl"
    >
      <p className="text-text-2 text-sm mb-8">{exerciseName}</p>

      {/* SVG ring */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background ring */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--surface-high)" strokeWidth="4" />
          {/* Progress ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-extrabold text-text-1" style={{ fontSize: "var(--text-6xl)" }}>
            {timeLeft}
          </span>
        </div>
      </div>

      <p className="text-text-3 text-sm mt-6 mb-8">راحة</p>

      <Button variant="ghost" onClick={onSkip} size="lg">
        تخطي الراحة
      </Button>
    </motion.div>
  );
}

/* ── Set Logger Row ── */
function SetRow({
  setNumber,
  lastWeight,
  lastReps,
  onComplete,
}: {
  setNumber: number;
  lastWeight: number;
  lastReps: number;
  onComplete: (weight: number, reps: number) => void;
}) {
  const [weight, setWeight] = useState(lastWeight);
  const [reps, setReps] = useState(lastReps);
  const [done, setDone] = useState(false);

  function handleDone() {
    setDone(true);
    onComplete(weight, reps);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 py-3 border-b border-border last:border-0",
        done && "opacity-50"
      )}
    >
      {/* Set number */}
      <span className="text-text-3 text-sm w-8 font-mono">{setNumber}</span>

      {/* Ghost hint */}
      {!done && (
        <span className="text-text-3 text-xs flex-shrink-0">
          آخر: {lastWeight}kg × {lastReps}
        </span>
      )}

      <div className="flex-1" />

      {/* Weight input */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setWeight(Math.max(0, weight - 2.5))}
          disabled={done}
          className="w-8 h-8 rounded-[var(--radius-sm)] bg-surface-high text-text-2 text-sm flex items-center justify-center cursor-pointer hover:bg-border disabled:opacity-30"
        >
          -
        </button>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          disabled={done}
          className="w-14 h-8 rounded-[var(--radius-sm)] bg-surface border border-border text-center text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        <button
          onClick={() => setWeight(weight + 2.5)}
          disabled={done}
          className="w-8 h-8 rounded-[var(--radius-sm)] bg-surface-high text-text-2 text-sm flex items-center justify-center cursor-pointer hover:bg-border disabled:opacity-30"
        >
          +
        </button>
      </div>

      {/* Reps */}
      <span className="text-text-3 text-xs">×</span>
      <input
        type="number"
        value={reps}
        onChange={(e) => setReps(Number(e.target.value))}
        disabled={done}
        className="w-12 h-8 rounded-[var(--radius-sm)] bg-surface border border-border text-center text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-accent/30"
      />

      {/* Done button */}
      <Button
        size="sm"
        variant={done ? "ghost" : "primary"}
        onClick={handleDone}
        disabled={done}
        className="min-w-[50px]"
      >
        {done ? "✓" : "تم"}
      </Button>
    </motion.div>
  );
}

export default function TodayPage() {
  const [restTimer, setRestTimer] = useState<{
    duration: number;
    exerciseName: string;
  } | null>(null);

  const [waterLogged, setWaterLogged] = useState(1500);
  const [fatigueState, setFatigueState] = useState("مستقر");
  const [isAlertSent, setIsAlertSent] = useState(false);
  const [openVideo, setOpenVideo] = useState<Record<string, boolean>>({});
  const waterTarget = 3500;

  function handleSetComplete(exerciseName: string, restSeconds: number) {
    setRestTimer({ duration: restSeconds, exerciseName });
  }

  return (
    <div className="space-y-6">
      {/* Rest Timer overlay */}
      <AnimatePresence>
        {restTimer && (
          <RestTimer
            duration={restTimer.duration}
            exerciseName={restTimer.exerciseName}
            onSkip={() => setRestTimer(null)}
            onComplete={() => setRestTimer(null)}
          />
        )}
      </AnimatePresence>

      {/* Day header */}
      <div>
        <h1 className="text-xl font-display font-bold text-text-1">
          {mockDay.dayName}
        </h1>
        <p className="text-text-2 text-sm mt-1">
          {mockDay.exercises.length} تمارين
        </p>
      </div>

      {/* Hydration & Injury Trackers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Water Tracker */}
        <Card className="p-4 relative overflow-hidden bg-surface border border-border">
          <div className="flex items-center gap-4">
            <StatRing
              value={Math.min((waterLogged / waterTarget) * 100, 100)}
              size={76}
              strokeWidth={7}
              color="var(--info)"
              label={`ميزان المياه: ${waterLogged} من ${waterTarget} مل`}
              className="shrink-0"
            >
              <svg className="w-6 h-6 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </StatRing>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-text-1 select-none">ميزان المياه اليومي</h3>
                <button
                  className="text-[9px] text-text-3 hover:text-text-2 cursor-pointer select-none font-bold"
                  onClick={() => setWaterLogged(0)}
                >
                  إعادة ضبط
                </button>
              </div>
              <p className="mt-0.5 text-[11px] text-text-2 font-mono" dir="ltr">
                {waterLogged} / {waterTarget} مل
              </p>
              <div className="mt-2.5 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 min-h-9 text-xs border-info/20 text-info hover:bg-info/10"
                  onClick={() => setWaterLogged(prev => Math.min(prev + 250, waterTarget + 1000))}
                >
                  + 250مل
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 min-h-9 text-xs border-info/20 text-info hover:bg-info/10"
                  onClick={() => setWaterLogged(prev => Math.min(prev + 500, waterTarget + 1000))}
                >
                  + 500مل
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Injury / Fatigue Tracker */}
        <Card className="p-4 bg-surface border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-1 flex items-center gap-1.5 select-none">
              <svg className="w-3.5 h-3.5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span>مؤشر الإجهاد اليومي</span>
            </h3>
            <span className="text-[9px] text-text-3">تحديث تلقائي</span>
          </div>

          <div className="flex justify-between items-center gap-1.5 mb-2">
            {[
              { label: "مستقر", color: "bg-success", glow: "shadow-[0_0_8px_var(--success)]" },
              { label: "مجهد", color: "bg-warning", glow: "shadow-[0_0_8px_var(--warning)]" },
              { label: "مصاب", color: "bg-danger", glow: "shadow-[0_0_8px_var(--danger)]" }
            ].map((state) => (
              <button
                key={state.label}
                onClick={() => {
                  setFatigueState(state.label);
                  setIsAlertSent(true);
                  setTimeout(() => setIsAlertSent(false), 2500);
                }}
                className={cn(
                  "flex-1 py-2 px-1 rounded-lg border text-center transition-all cursor-pointer text-[10px] flex flex-col items-center justify-center gap-1.5",
                  fatigueState === state.label
                    ? "bg-accent/15 border-accent text-accent font-bold"
                    : "bg-surface-high/50 border-border/40 text-text-2 hover:bg-surface-high"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", state.color, state.glow)} />
                <span>{state.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {isAlertSent && (
              <motion.p
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[8px] text-accent text-center font-bold"
              >
                ✓ تم تحديث مؤشر الإجهاد لدى الكوتش!
              </motion.p>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Exercises */}
      {mockDay.exercises.map((exercise, i) => (
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
        >
          <Card className="border border-border p-4 bg-surface">
            {/* Exercise header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-text-1">{exercise.name}</h3>
                <p className="text-text-3 text-xs mt-0.5">
                  {exercise.sets} مجموعات × {exercise.reps} تكرار • راحة{" "}
                  {exercise.restSeconds}ث
                </p>
              </div>
              {exercise.coachHighlight && (
                <div className="bg-accent-dim text-accent text-xs rounded-[var(--radius-sm)] px-2 py-1 max-w-[140px] flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6M10 22h4" />
                  </svg>
                  <span>{exercise.coachHighlight}</span>
                </div>
              )}
              {!exercise.coachHighlight && (
                <button
                  type="button"
                  className="text-xs text-info hover:underline flex items-center gap-1.5"
                  aria-expanded={!!openVideo[exercise.id]}
                  aria-controls={`video-upload-${exercise.id}`}
                  onClick={() =>
                    setOpenVideo((prev) => ({ ...prev, [exercise.id]: !prev[exercise.id] }))
                  }
                >
                  <svg className="w-3.5 h-3.5 text-info shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <span>طلب مراجعة أداء</span>
                </button>
              )}
            </div>

            {/* Video Upload Section */}
            {openVideo[exercise.id] && (
              <div id={`video-upload-${exercise.id}`} className="mb-4 p-3 bg-surface-high rounded-[var(--radius-md)] border border-info/20">
                <label htmlFor={`video-url-${exercise.id}`} className="block text-xs text-text-2 mb-2">
                  ارفع فيديو للتمرين ده عشان الكوتش يراجع أداءك.
                </label>
                <div className="flex gap-2">
                  <input id={`video-url-${exercise.id}`} type="text" placeholder="رابط الفيديو (YouTube أو Drive)" className="flex-1 px-3 py-1.5 bg-bg border border-border rounded-[var(--radius-sm)] text-xs text-text-1 focus:outline-none focus:border-info" />
                  <Button size="sm" className="bg-info hover:bg-info/90 text-white">إرسال</Button>
                </div>
              </div>
            )}

            {/* Sets */}
            <div>
              {Array.from({ length: exercise.sets }, (_, j) => (
                <SetRow
                  key={j}
                  setNumber={j + 1}
                  lastWeight={exercise.lastWeight}
                  lastReps={exercise.lastReps}
                  onComplete={() =>
                    handleSetComplete(exercise.name, exercise.restSeconds)
                  }
                />
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

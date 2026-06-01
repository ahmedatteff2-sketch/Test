"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ── Heatmap data (7 days × clients) ── */
const heatmapClients = [
  { name: "أحمد محمد", days: [3, 3, 2, 3, 3, 0, 3] },
  { name: "حسام نبيل", days: [3, 3, 3, 3, 3, 3, 3] },
  { name: "يوسف إبراهيم", days: [3, 2, 3, 3, 0, 3, 2] },
  { name: "محمد علي", days: [2, 2, 1, 3, 2, 0, 2] },
  { name: "مصطفى أمين", days: [3, 3, 2, 3, 3, 2, 3] },
  { name: "طارق سعيد", days: [1, 2, 1, 0, 2, 1, 0] },
  { name: "كريم حسن", days: [1, 0, 1, 1, 0, 0, 1] },
  { name: "عمر خالد", days: [0, 0, 1, 0, 0, 0, 0] },
];
const dayLabels = ["سبت", "أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];

function heatColor(v: number) {
  if (v === 0) return "bg-surface-high";
  if (v === 1) return "bg-danger/40";
  if (v === 2) return "bg-warning/40";
  return "bg-success/50";
}

/* ── Compliance sparkline ── */
const complianceTrend = [65, 72, 68, 78, 82, 76, 80, 85, 79, 83, 88, 86, 90, 87];

function Sparkline({ data, color = "var(--accent)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, "")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Goal Progress Ring Component ── */
function ProgressRing({ percent, size = 38, strokeWidth = 3.5, color = "var(--accent)" }: { percent: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[9px] font-bold text-text-1">{percent}%</span>
      </div>
    </div>
  );
}

interface ClientDetail {
  id: string;
  name: string;
  compliance: number;
  streak: number;
  daysSinceCheckin: number;
  weightTrend: number[];
  complianceTrend: number[];
  goal: string;
  risk: "low" | "medium" | "high";
  caloriesTarget?: number;
  currentCycle?: string;
  phoneNumber?: string;
}

const initialClientDetails: ClientDetail[] = [
  { id: "1", name: "أحمد محمد", compliance: 92, streak: 14, daysSinceCheckin: 0, weightTrend: [86, 85.5, 85, 84.8, 84.2, 83.5, 82.5], complianceTrend: [85, 88, 90, 91, 92, 92, 92], goal: "حرق دهون", risk: "low", caloriesTarget: 2000, currentCycle: "تنشيف متقدم", phoneNumber: "+201011111111" },
  { id: "6", name: "حسام نبيل", compliance: 96, streak: 21, daysSinceCheckin: 0, weightTrend: [88, 88.5, 89, 89.5, 90, 90.2, 90.7], complianceTrend: [90, 92, 94, 95, 96, 96, 96], goal: "بناء عضلات", risk: "low", caloriesTarget: 2800, currentCycle: "ضخامة عضلية", phoneNumber: "+201022222222" },
  { id: "4", name: "يوسف إبراهيم", compliance: 88, streak: 7, daysSinceCheckin: 0, weightTrend: [79, 78.8, 78.5, 78.3, 78.3, 78.2, 78.3], complianceTrend: [80, 82, 85, 86, 88, 88, 88], goal: "إعادة تشكيل", risk: "low", caloriesTarget: 2200, currentCycle: "إعادة هيكلة", phoneNumber: "+201033333333" },
  { id: "8", name: "مصطفى أمين", compliance: 84, streak: 5, daysSinceCheckin: 0, weightTrend: [77, 76.5, 76.2, 76, 76, 76, 76], complianceTrend: [78, 80, 82, 83, 84, 84, 84], goal: "إعادة تشكيل", risk: "low", caloriesTarget: 2100, currentCycle: "صيانة", phoneNumber: "+201044444444" },
  { id: "2", name: "محمد علي", compliance: 78, streak: 3, daysSinceCheckin: 1, weightTrend: [73, 73, 72.8, 72.5, 72.5, 72.5, 72.5], complianceTrend: [70, 72, 75, 76, 78, 78, 78], goal: "بناء عضلات", risk: "medium", caloriesTarget: 2500, currentCycle: "قوة بدنية", phoneNumber: "+201055555555" },
  { id: "7", name: "طارق سعيد", compliance: 58, streak: 0, daysSinceCheckin: 2, weightTrend: [103, 103.5, 103, 102.8, 102.5, 102.3, 102.3], complianceTrend: [65, 62, 60, 58, 58, 58, 58], goal: "حرق دهون", risk: "medium", caloriesTarget: 1900, currentCycle: "عجز حراري", phoneNumber: "+201066666666" },
  { id: "3", name: "كريم حسن", compliance: 55, streak: 0, daysSinceCheckin: 3, weightTrend: [95, 95.5, 95.2, 95.5, 95, 95, 95], complianceTrend: [60, 58, 56, 55, 55, 55, 55], goal: "حرق دهون", risk: "high", caloriesTarget: 1800, currentCycle: "تنشيف قوي", phoneNumber: "+201077777777" },
  { id: "5", name: "عمر خالد", compliance: 45, streak: 0, daysSinceCheckin: 5, weightTrend: [68, 68.2, 68.1, 68.1, 68.1, 68.1, 68.1], complianceTrend: [55, 52, 50, 48, 45, 45, 45], goal: "رياضي", risk: "high", caloriesTarget: 2300, currentCycle: "تحمل وتكييف", phoneNumber: "+201088888888" },
];

const riskColors = { low: "text-success", medium: "text-warning", high: "text-danger" };
const riskBg = { low: "bg-success/10", medium: "bg-warning/10", high: "bg-danger/10" };
const riskLabel = { low: "مستقر", medium: "يحتاج متابعة", high: "خطر" };

function getGoalProgressPercent(client: ClientDetail) {
  const start = client.weightTrend[0];
  const current = client.weightTrend[client.weightTrend.length - 1];
  if (client.goal === "بناء عضلات") {
    const target = start + 5;
    const pct = Math.round(((current - start) / 5) * 100);
    return Math.min(100, Math.max(0, pct));
  } else {
    const target = start - 8;
    const pct = Math.round(((start - current) / 8) * 100);
    return Math.min(100, Math.max(0, pct));
  }
}

function getWeeklyReport(client: ClientDetail) {
  const activeDays = Math.round((client.compliance / 100) * 7);
  const exerciseGoal = client.goal === "بناء عضلات" ? 5 : 4;
  const exercisesDone = Math.max(1, Math.round((client.compliance / 100) * exerciseGoal));
  const calorieAvg = client.caloriesTarget || (client.goal === "بناء عضلات" ? 2500 : 1900);
  const weightChange = (client.weightTrend[0] - client.weightTrend[client.weightTrend.length - 1]).toFixed(1);

  return {
    complianceText: `${client.compliance}% التزام`,
    summaryText: `إكمال ${exercisesDone}/${exerciseGoal} تمارين. متوسط السعرات المحددة ${calorieAvg} سعرة. خسارة الوزن الإجمالي: ${weightChange} كجم. ${
      client.compliance >= 85 
        ? "استمر على هذا الأداء الرائع! 🚀" 
        : client.compliance >= 65 
          ? "أداء جيد ولكن يحتاج لمزيد من التركيز والالتزام بالوجبات. 📈" 
          : "الرجاء التواصل لمعرفة أسباب التراجع وتعديل الجداول. ⚠️"
    }`
  };
}

const initialFeed = [
  { id: "1", icon: "✅", text: "أحمد محمد أكمل التشيكن اليومي", time: "منذ 15 دقيقة", type: "checkin" },
  { id: "2", icon: "🏋️", text: "حسام نبيل سجّل تمرين صدر (12 مجموعة)", time: "منذ 32 دقيقة", type: "workout" },
  { id: "3", icon: "📸", text: "يوسف إبراهيم رفع صور التقدم للتقييم الأسبوعي", time: "منذ ساعة", type: "photo" },
  { id: "4", icon: "⚖️", text: "محمد علي سجّل الوزن الجديد: 72.5kg (-0.5)", time: "منذ ساعتين", type: "weight" },
  { id: "5", icon: "🍽️", text: "مصطفى أمين سجّل وجبة الغداء والالتزام بالماكروز", time: "منذ 3 ساعات", type: "nutrition" },
  { id: "6", icon: "⚠️", text: "عمر خالد لم يسجّل أي تشيكن منذ 5 أيام متتالية", time: "تنبيه هام", type: "alert" },
];

const feedTypeStyles = {
  checkin: "bg-success/15 text-success border border-success/20",
  workout: "bg-accent/15 text-accent border border-accent/20",
  photo: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  weight: "bg-info/15 text-info border border-info/20",
  nutrition: "bg-warning/15 text-warning border border-warning/20",
  alert: "bg-danger/15 text-danger border border-danger/25 animate-pulse",
};

const followUpTemplates = [
  {
    title: "غياب التشيكن",
    tone: "danger",
    text: "بقالك كذا يوم مش باعت تشيكن. ابعتلي الوزن والنوم والدايت النهارده عشان نلحق الأسبوع.",
  },
  {
    title: "ثبات وزن",
    tone: "warning",
    text: "الوزن ثابت، فهنراجع متوسط السعرات والخطوات قبل ما نقلل الأكل. ابعتلي آخر 3 أيام أكل.",
  },
  {
    title: "تحفيز",
    tone: "success",
    text: "أداؤك ممتاز الأسبوع ده. خلينا نثبت نفس النظام ونزود الحمل تدريجيًا في التمرين الجاي.",
  },
  {
    title: "مراجعة تكنيك",
    tone: "info",
    text: "ارفع فيديو آخر مجموعة من التمرين الأساسي عشان أراجع المسار والمدى الحركي قبل التصعيد.",
  },
];

const toneStyles = {
  danger: "border-danger/25 bg-danger/10 text-danger",
  warning: "border-warning/25 bg-warning/10 text-warning",
  success: "border-success/25 bg-success/10 text-success",
  info: "border-info/25 bg-info/10 text-info",
};

type RiskFilter = "all" | "low" | "medium" | "high";

export default function MonitoringPage() {
  const [clients, setClients] = useState<ClientDetail[]>(initialClientDetails);
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [feed, setFeed] = useState(initialFeed);
  
  /* ── Toasts State ── */
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const triggerToast = (text: string) => {
    const id = Date.now().toString();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  };

  /* ── Video Recorder Modal State ── */
  const [videoModalClient, setVideoModalClient] = useState<ClientDetail | null>(null);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "completed">("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  /* ── Live Coaching Session Scheduler State ── */
  const [sessions, setSessions] = useState<{ id: string; clientName: string; date: string; time: string; type: string }[]>([
    { id: "s1", clientName: "كريم حسن", date: "2026-05-24", time: "18:00", type: "استشارة بالفيديو" }
  ]);
  const [selectedClientForSession, setSelectedClientForSession] = useState("كريم حسن");
  const [sessionDate, setSessionDate] = useState("2026-05-25");
  const [sessionTime, setSessionTime] = useState("16:00");
  const [sessionType, setSessionType] = useState("مراجعة القياسات والماكروز");
  const [selectedTemplate, setSelectedTemplate] = useState(followUpTemplates[0].text);

  /* ── Autopilot Actions Handlers ── */
  const handleReduceCalories = (clientId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const oldCals = c.caloriesTarget || 2500;
        const newCals = oldCals - 150;
        triggerToast(`🤖 تم تعديل سعرات ${c.name} من ${oldCals}kcal إلى ${newCals}kcal!`);
        // Log to activity feed
        setFeed(f => [
          { id: Date.now().toString(), icon: "🤖", text: `الطيار الآلي قلل سعرات ${c.name} بمقدار 150 سعرة`, time: "الآن", type: "nutrition" },
          ...f
        ]);
        return { ...c, caloriesTarget: newCals, risk: "low" as const };
      }
      return c;
    }));
  };

  const handleApplyDeload = (clientId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        triggerToast(`🤖 تم تغيير الدورة التدريبية لـ ${c.name} إلى أسبوع استشفائي (Deload Week)!`);
        setFeed(f => [
          { id: Date.now().toString(), icon: "🤖", text: `تم تفعيل أسبوع الاستشفاء (Deload) لـ ${c.name}`, time: "الآن", type: "workout" },
          ...f
        ]);
        return { ...c, currentCycle: "أسبوع الاستشفاء (Deload)", risk: "low" as const };
      }
      return c;
    }));
  };

  /* ── Video Recording Simulation ── */
  const startRecording = () => {
    setRecordingState("recording");
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopRecording = () => {
    clearInterval(timerInterval);
    setRecordingState("completed");
  };

  const sendVideoReply = () => {
    if (!videoModalClient) return;
    triggerToast(`🎥 تم إرسال رد الفيديو بنجاح إلى ${videoModalClient.name}!`);
    setVideoModalClient(null);
    setRecordingState("idle");
    setRecordingSeconds(0);
  };

  /* ── Add Scheduled Session ── */
  const handleAddSession = () => {
    const newSession = {
      id: Date.now().toString(),
      clientName: selectedClientForSession,
      date: sessionDate,
      time: sessionTime,
      type: sessionType
    };
    setSessions(prev => [...prev, newSession]);
    triggerToast(`📅 تم جدولة جلسة كوتشينج مع ${selectedClientForSession} بنجاح!`);
  };

  const filtered = clients.filter(
    (c) => riskFilter === "all" || c.risk === riskFilter
  );

  const totalActive = clients.length;
  const avgCompliance = Math.round(clients.reduce((s, c) => s + c.compliance, 0) / totalActive);
  const highRiskCount = clients.filter((c) => c.risk === "high").length;
  const todayCheckins = clients.filter((c) => c.daysSinceCheckin === 0).length;

  return (
    <div className="space-y-6 relative">
      
      {/* ── Visual Custom Toasts ── */}
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
              <span className="text-accent text-lg">💡</span>
              <p className="text-xs font-semibold text-text-1 font-display">{t.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-1">المتابعة والتحليلات</h1>
        <p className="text-text-2 text-sm mt-1">لوحة تحكم ذكية مزودة بالطيار الآلي ونظام مراقبة الأداء المتطور</p>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "معدل الالتزام العام", value: `${avgCompliance}%`, color: avgCompliance >= 80 ? "text-success" : "text-warning" },
          { label: "تشيكنات اليوم", value: `${todayCheckins}/${totalActive}`, color: "text-accent" },
          { label: "عملاء في خطر", value: `${highRiskCount}`, color: highRiskCount > 0 ? "text-danger" : "text-success" },
          { label: "أعلى streak التزام", value: "21 يوم متواصل", color: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="p-4">
              <p className="text-text-3 text-xs">{s.label}</p>
              <p className={cn("text-xl font-display font-bold mt-1", s.color)}>{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Injury/Fatigue Warning Panel (Fatigue & Injury Forecasting) ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-danger/30 bg-danger/5 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">🩺</span>
              <div>
                <h4 className="text-sm font-bold text-danger">مؤشر التحذير المسبق من الإصابات والتعب المفرط</h4>
                <p className="text-xs text-text-2 mt-0.5">
                  تم اكتشاف إجهاد عضلي حاد لدى متدربين بسبب نقص النوم وتزامن قفزات الأوزان التدريبية (Load Spikes).
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-bg/60 border border-danger/30 px-3 py-1 rounded text-[11px] text-text-1">
                ⚠️ **كريم حسن**: ألم المفاصل **4/4** (ركبة) | نوم 4.5 س
              </div>
              <div className="bg-bg/60 border border-warning/30 px-3 py-1 rounded text-[11px] text-text-1">
                ⚠️ **عمر خالد**: هبوط الاستشفاء بالكامل منذ 5 أيام
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Auto-Pilot Alerts (Stagnation) ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-accent shadow-[0_0_20px_rgba(197,162,93,0.07)] relative overflow-hidden">
          <div className="absolute top-0 end-0 p-3 opacity-15 pointer-events-none">
            <span className="text-8xl">🤖</span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-bold text-text-1 text-lg">الطيار الآلي (Auto-Pilot AI)</h3>
                <p className="text-xs text-text-3">تحليلات الأوزان والنتائج مع التعديلات الفورية المقترحة للمشتركين</p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              {/* Muhammad Ali Alert */}
              <div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-[var(--radius-md)] bg-bg border border-border">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                  <div>
                    <p className="font-bold text-text-1 text-sm">محمد علي <span className="text-xs text-text-3 font-normal">(حرق دهون)</span></p>
                    <p className="text-xs text-text-2 mt-1">الوزن ثابت عند 72.5kg لـ 14 يوم متتالية. التزامه ممتاز (78%).</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0 w-full md:w-auto">
                  <Button size="sm" onClick={() => handleReduceCalories("2")}>تقليل السعرات 10% (-150 kcal)</Button>
                  <Button size="sm" variant="outline" className="flex-1 md:flex-none">تجاهل</Button>
                </div>
              </div>

              {/* Hussam Nabil Alert */}
              <div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-[var(--radius-md)] bg-bg border border-border">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                  <div>
                    <p className="font-bold text-text-1 text-sm">حسام نبيل <span className="text-xs text-text-3 font-normal">(بناء عضلات)</span></p>
                    <p className="text-xs text-text-2 mt-1">توقف تطور القوة في تمرين السكوات منذ 3 أسابيع متتالية.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0 w-full md:w-auto">
                  <Button size="sm" onClick={() => handleApplyDeload("6")}>تغيير لـ Deload Week</Button>
                  <Button size="sm" variant="outline" className="flex-1 md:flex-none">تجاهل</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Compliance trend + heatmap ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-text-1">معدل الالتزام (14 يوم)</h3>
                <p className="text-xs text-text-3">المعدل العام للمشتركين</p>
              </div>
              <span className="text-2xl font-display font-bold text-accent">{avgCompliance}%</span>
            </div>
            <Sparkline data={complianceTrend} />
          </Card>
        </motion.div>

        {/* Heatmap */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <h3 className="font-semibold text-text-1 mb-1">خريطة النشاط الأسبوعية للعملاء</h3>
            <p className="text-xs text-text-3 mb-4">0 = لا نشاط • 1 = ضعيف • 2 = جزئي • 3 = كامل</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-20 shrink-0" />
                {dayLabels.map((d) => (
                  <span key={d} className="flex-1 text-center text-[10px] text-text-3">{d}</span>
                ))}
              </div>
              {heatmapClients.map((client) => (
                <div key={client.name} className="flex items-center gap-1.5">
                  <span className="w-20 shrink-0 text-xs text-text-2 truncate">{client.name}</span>
                  {client.days.map((v, j) => (
                    <div
                      key={j}
                      className={cn("flex-1 h-6 rounded-[4px] transition-all", heatColor(v))}
                      title={`${client.name} — ${dayLabels[j]}: ${v}/3`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Client list & details filter ── */}
      <div className="flex items-center gap-2">
        {(["all", "high", "medium", "low"] as RiskFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setRiskFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer",
              riskFilter === f ? "bg-accent text-bg" : "bg-surface-high text-text-2 hover:text-text-1"
            )}
          >
            {f === "all" ? `الكل (${clients.length})` : `${riskLabel[f]} (${clients.filter((c) => c.risk === f).length})`}
          </button>
        ))}
      </div>

      <Card className="border-accent/15 bg-accent/[0.04] p-5">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold text-accent">Message Playbook</p>
            <h2 className="mt-1 text-lg font-bold text-text-1">قوالب متابعة جاهزة حسب حالة العميل</h2>
            <p className="mt-2 text-sm leading-7 text-text-2">
              اختار قالب، عدله في ثواني، وابعت واتساب أو انسخه في الشات. ده يقلل وقت المتابعة ويخلي الردود ثابتة واحترافية.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {followUpTemplates.map((template) => (
                <button
                  key={template.title}
                  onClick={() => setSelectedTemplate(template.text)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs font-bold transition-colors",
                    toneStyles[template.tone as keyof typeof toneStyles]
                  )}
                >
                  {template.title}
                </button>
              ))}
            </div>
            <textarea
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="min-h-[88px] w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm leading-7 text-text-1 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(selectedTemplate);
                  triggerToast("تم نسخ قالب المتابعة");
                }}
              >
                نسخ الرسالة
              </Button>
              <Button size="sm" onClick={() => triggerToast("تم تجهيز الرسالة للإرسال")}>
                تجهيز للإرسال
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Client detail cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((client, i) => {
          const report = getWeeklyReport(client);
          const goalPercent = getGoalProgressPercent(client);
          // WhatsApp direct pre-filled text template
          const waMessage = encodeURIComponent(`مرحباً ${client.name}، حابب أطمن عليك وعلى التزامك بالدايت والتمارين اليومين دول.. هل فيه أي مشاكل بتواجهك نقدر نعدلها مع بعض؟`);
          const waLink = `https://wa.me/${client.phoneNumber?.replace("+", "")}?text=${waMessage}`;

          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card hover className="relative overflow-hidden">
                <div className={cn("absolute top-0 start-0 w-1 h-full", client.risk === "high" ? "bg-danger" : client.risk === "medium" ? "bg-warning" : "bg-success")} />

                <div className="ps-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", riskBg[client.risk])}>
                        <span className={cn("text-sm font-bold", riskColors[client.risk])}>{client.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-1">{client.name}</p>
                        <p className="text-[10px] text-text-3">الخطة: {client.currentCycle} ({client.goal})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center" title="نسبة تحقيق الوزن المستهدف">
                        <ProgressRing percent={goalPercent} color="var(--accent)" />
                        <span className="text-[8px] text-text-3 mt-0.5">الهدف</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", riskBg[client.risk], riskColors[client.risk])}>
                        {riskLabel[client.risk]}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-[10px] text-text-3">نسبة الالتزام</p>
                      <p className={cn("text-sm font-bold", client.compliance >= 80 ? "text-success" : client.compliance >= 60 ? "text-warning" : "text-danger")}>{client.compliance}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-3">الـ Streak</p>
                      <p className="text-sm font-bold text-text-1">{client.streak > 0 ? `🔥 ${client.streak}` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-3">آخر تشيكن</p>
                      <p className={cn("text-sm font-bold", client.daysSinceCheckin === 0 ? "text-success" : client.daysSinceCheckin <= 1 ? "text-text-1" : "text-danger")}>
                        {client.daysSinceCheckin === 0 ? "اليوم" : `${client.daysSinceCheckin} أيام`}
                      </p>
                    </div>
                  </div>

                  {/* Trends */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-[10px] text-text-3 mb-1">الوزن (7 أسابيع)</p>
                      <Sparkline data={client.weightTrend} color="var(--info)" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-3 mb-1">الالتزام</p>
                      <Sparkline data={client.complianceTrend} color={client.risk === "high" ? "var(--danger)" : client.risk === "medium" ? "var(--warning)" : "var(--success)"} />
                    </div>
                  </div>

                  {/* Weekly report summary */}
                  <div className="p-2.5 rounded bg-surface-high/50 border border-border/40 text-[11px] text-text-2 mb-3">
                    <div className="flex items-center justify-between mb-1 font-semibold text-text-1">
                      <span>📊 تقرير الأسبوع (الماكروز والتمارين)</span>
                      <span className="text-accent">{report.complianceText}</span>
                    </div>
                    <p className="leading-relaxed text-text-2">{report.summaryText}</p>
                  </div>

                  {/* Quick Actions (Form Checks / Video Replies / WhatsApp) */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
                    <Link href={`/admin/clients/${client.id}`} className="text-xs text-accent hover:underline cursor-pointer font-medium">
                      بروفايل العميل
                    </Link>
                    <span className="text-text-3 text-[10px]">•</span>
                    
                    {/* Video Reply Trigger */}
                    <button 
                      onClick={() => setVideoModalClient(client)}
                      className="text-xs text-info hover:text-info/80 cursor-pointer flex items-center gap-1"
                    >
                      🎥 رد فيديو سريع
                    </button>
                    <span className="text-text-3 text-[10px]">•</span>

                    {/* WhatsApp Action */}
                    <a 
                      href={waLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-success hover:underline flex items-center gap-1"
                    >
                      💬 واتساب
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ── Live Coaching Sessions Scheduler Widget ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scheduler Form */}
        <Card className="lg:col-span-1 p-5">
          <h3 className="font-bold text-text-1 text-sm mb-3 flex items-center gap-1.5">
            <span>📅</span> جدولة جلسة كوتشينج مباشرة
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-text-3 block mb-1">اختر العميل</label>
              <select 
                value={selectedClientForSession}
                onChange={e => setSelectedClientForSession(e.target.value)}
                className="w-full text-xs bg-bg border border-border p-2 rounded text-text-1 focus:outline-none focus:border-accent"
              >
                {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-text-3 block mb-1">التاريخ</label>
                <input 
                  type="date" 
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                  className="w-full text-xs bg-bg border border-border p-2 rounded text-text-1" 
                />
              </div>
              <div>
                <label className="text-[10px] text-text-3 block mb-1">الوقت</label>
                <input 
                  type="time" 
                  value={sessionTime}
                  onChange={e => setSessionTime(e.target.value)}
                  className="w-full text-xs bg-bg border border-border p-2 rounded text-text-1" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-text-3 block mb-1">نوع الجلسة</label>
              <input 
                type="text" 
                value={sessionType}
                onChange={e => setSessionType(e.target.value)}
                placeholder="مراجعة التكنيك والأرقام القياسية..."
                className="w-full text-xs bg-bg border border-border p-2 rounded text-text-1 focus:outline-none focus:border-accent" 
              />
            </div>

            <Button onClick={handleAddSession} className="w-full text-xs" size="sm">
              جدولة الجلسة 🚀
            </Button>
          </div>
        </Card>

        {/* Scheduled Sessions List */}
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-bold text-text-1 text-sm mb-3">الجلسات المجدولة القادمة ({sessions.length})</h3>
          <div className="space-y-2 h-[190px] overflow-y-auto custom-scrollbar">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-high border border-border/40 text-xs">
                <div>
                  <p className="font-bold text-text-1">{s.clientName}</p>
                  <p className="text-text-3 text-[10px] mt-0.5">{s.type}</p>
                </div>
                <div className="text-end">
                  <p className="text-accent font-mono font-bold">{s.time}</p>
                  <p className="text-text-3 text-[9px]">{s.date}</p>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="text-xs text-text-3 text-center py-8">لا يوجد جلسات مجدولة حالياً.</p>
            )}
          </div>
        </Card>
      </div>

      {/* ── Activity Feed ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
            <h3 className="font-semibold text-text-1">آخر الأنشطة والالتزامات</h3>
            <span className="text-xs text-text-3">مباشر الآن 🟢</span>
          </div>
          <div className="space-y-3">
            {feed.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface/50 border border-border/20 hover:bg-surface hover:border-border/60 transition-all">
                <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0", feedTypeStyles[item.type as keyof typeof feedTypeStyles])}>
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-text-1 font-medium truncate">{item.text}</p>
                  <p className="text-[10px] text-text-3 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Coach Video Recording Modal ── */}
      <AnimatePresence>
        {videoModalClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg border border-border max-w-md w-full rounded-2xl p-6 relative shadow-2xl"
            >
              <h3 className="text-lg font-bold text-text-1 mb-2">تسجيل رد فيديو سريع للمتدرب</h3>
              <p className="text-xs text-text-3 mb-4">المرسل إليه: **{videoModalClient.name}**</p>

              {/* Simulated Camera Viewport */}
              <div className="aspect-video w-full bg-black rounded-lg relative overflow-hidden flex flex-col items-center justify-center border border-border mb-4">
                {recordingState === "idle" && (
                  <div className="text-center text-text-3">
                    <span className="text-4xl">📷</span>
                    <p className="text-xs mt-2">الكاميرا جاهزة للبدء</p>
                  </div>
                )}
                
                {recordingState === "recording" && (
                  <>
                    {/* Blinking record indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 px-2 py-0.5 rounded text-[10px] text-red-500 font-bold">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      REC
                    </div>
                    <span className="text-xs font-mono text-text-1 bg-black/70 px-3 py-1 rounded">
                      {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")}
                    </span>
                    <div className="absolute bottom-2 text-[9px] text-text-3">جاري التسجيل المباشر من كاميرا الويب...</div>
                  </>
                )}

                {recordingState === "completed" && (
                  <div className="text-center text-success">
                    <span className="text-4xl">🎬</span>
                    <p className="text-xs mt-2">تم إنتاج الفيديو بنجاح (مدة: {recordingSeconds} ثانية)</p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setVideoModalClient(null);
                    setRecordingState("idle");
                    clearInterval(timerInterval);
                  }}
                >
                  إلغاء
                </Button>

                {recordingState === "idle" && (
                  <Button onClick={startRecording} className="bg-red-600 hover:bg-red-500 text-white">
                    ابدأ التسجيل 🔴
                  </Button>
                )}

                {recordingState === "recording" && (
                  <Button onClick={stopRecording} className="bg-text-1 text-bg">
                    إيقاف التسجيل ⏹️
                  </Button>
                )}

                {recordingState === "completed" && (
                  <>
                    <Button variant="outline" onClick={() => setRecordingState("idle")}>إعادة التسجيل</Button>
                    <Button onClick={sendVideoReply} className="bg-accent text-bg">إرسال للمتدرب 🚀</Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

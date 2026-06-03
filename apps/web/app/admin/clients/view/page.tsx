"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ── Mock client data ── */
const allClients: Record<string, {
  id: string; name: string; email: string; phone: string; goal: string; age: number;
  weight: number; height: number; bodyFat: number; startDate: string; isActive: boolean;
  compliance: number; streak: number; lastCheckin: string;
  weightHistory: { date: string; value: number }[];
  notes: string;
}> = {
  "1": {
    id: "1", name: "أحمد محمد", email: "ahmed@gmail.com", phone: "01012345678",
    goal: "حرق دهون", age: 25, weight: 85.2, height: 178, bodyFat: 22, startDate: "2026-01-15",
    isActive: true, compliance: 92, streak: 14, lastCheckin: "اليوم",
    weightHistory: [
      { date: "Jan", value: 92 }, { date: "Feb", value: 89.5 }, { date: "Mar", value: 87.8 },
      { date: "Apr", value: 86.2 }, { date: "May", value: 85.2 },
    ],
    notes: "عميل ملتزم جداً. محتاج يزود البروتين شوية.",
  },
  "2": {
    id: "2", name: "محمد علي", email: "moh@gmail.com", phone: "01098765432",
    goal: "بناء عضلات", age: 28, weight: 72.5, height: 175, bodyFat: 16, startDate: "2026-02-01",
    isActive: true, compliance: 78, streak: 3, lastCheckin: "أمس",
    weightHistory: [
      { date: "Feb", value: 70 }, { date: "Mar", value: 71.2 }, { date: "Apr", value: 72 },
      { date: "May", value: 72.5 },
    ],
    notes: "محتاج يركز على تمارين الأرجل. وزنه بيزيد بس ببطء.",
  },
  "3": {
    id: "3", name: "كريم حسن", email: "karim@gmail.com", phone: "01155555555",
    goal: "حرق دهون", age: 32, weight: 95.0, height: 180, bodyFat: 28, startDate: "2025-11-20",
    isActive: true, compliance: 55, streak: 0, lastCheckin: "3 أيام",
    weightHistory: [
      { date: "Nov", value: 100 }, { date: "Dec", value: 98 }, { date: "Jan", value: 97 },
      { date: "Feb", value: 96.5 }, { date: "Mar", value: 96 }, { date: "Apr", value: 95.5 },
      { date: "May", value: 95 },
    ],
    notes: "التزامه ضعيف. لازم نتواصل معاه أكتر.",
  },
  "4": {
    id: "4", name: "يوسف إبراهيم", email: "youssef@gmail.com", phone: "01234567890",
    goal: "إعادة تشكيل", age: 24, weight: 78.3, height: 182, bodyFat: 18, startDate: "2026-03-10",
    isActive: true, compliance: 88, streak: 7, lastCheckin: "اليوم",
    weightHistory: [
      { date: "Mar", value: 80 }, { date: "Apr", value: 79 }, { date: "May", value: 78.3 },
    ],
    notes: "بيحقق نتايج ممتازة في الـ Recomposition.",
  },
  "5": {
    id: "5", name: "عمر خالد", email: "omar@gmail.com", phone: "01177777777",
    goal: "رياضي", age: 22, weight: 68.1, height: 170, bodyFat: 14, startDate: "2025-09-05",
    isActive: false, compliance: 45, streak: 0, lastCheckin: "أسبوع",
    weightHistory: [
      { date: "Sep", value: 70 }, { date: "Oct", value: 69 }, { date: "Nov", value: 68.5 },
      { date: "Dec", value: 68.1 },
    ],
    notes: "توقف عن الحضور. محتاج متابعة.",
  },
  "6": {
    id: "6", name: "حسام نبيل", email: "hussam@gmail.com", phone: "01099999999",
    goal: "بناء عضلات", age: 27, weight: 90.7, height: 185, bodyFat: 15, startDate: "2026-04-01",
    isActive: true, compliance: 96, streak: 21, lastCheckin: "اليوم",
    weightHistory: [
      { date: "Apr", value: 88 }, { date: "May", value: 90.7 },
    ],
    notes: "أفضل عميل عندي. التزام خرافي.",
  },
  "7": {
    id: "7", name: "طارق سعيد", email: "tarek@gmail.com", phone: "01066666666",
    goal: "حرق دهون", age: 35, weight: 102.3, height: 176, bodyFat: 30, startDate: "2026-01-28",
    isActive: true, compliance: 62, streak: 2, lastCheckin: "أمس",
    weightHistory: [
      { date: "Jan", value: 108 }, { date: "Feb", value: 106 }, { date: "Mar", value: 104.5 },
      { date: "Apr", value: 103 }, { date: "May", value: 102.3 },
    ],
    notes: "بينزل ببطء بس مستمر. لازم نشجعه.",
  },
  "8": {
    id: "8", name: "مصطفى أمين", email: "mostafa@gmail.com", phone: "01044444444",
    goal: "إعادة تشكيل", age: 26, weight: 76.0, height: 174, bodyFat: 19, startDate: "2026-02-15",
    isActive: true, compliance: 84, streak: 5, lastCheckin: "اليوم",
    weightHistory: [
      { date: "Feb", value: 78 }, { date: "Mar", value: 77.5 }, { date: "Apr", value: 76.5 },
      { date: "May", value: 76 },
    ],
    notes: "ماشي كويس. هنبدأ نزود أوزان التمرين.",
  },
};

/* ── Mini Line Chart ── */
function MiniChart({ data }: { data: { date: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const w = 300, h = 100;
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * (w - 20) + 10,
    y: h - 10 - ((d.value - min) / range) * (h - 30),
  }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${points[0].x},${h - 10} ${polyline} ${points[points.length - 1].x},${h - 10}`}
          fill="url(#chartGrad)"
        />
        <polyline points={polyline} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--accent)" />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-text-3 mt-1 px-1">
        {data.map((d, i) => (
          <span key={i}>{d.date}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Photo Comparison Modal ── */
function PhotoComparisonModal({ onClose, clientName }: { onClose: () => void; clientName: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-[var(--radius-xl)] border border-border/80 w-full max-w-lg overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div>
            <h2 className="text-lg font-display font-bold text-text-1">مقارنة صور التقدم — {clientName}</h2>
            <p className="text-xs text-text-3 mt-1">اسحب المنزلق لرؤية الفرق بين البداية واليوم</p>
          </div>
          <button onClick={onClose} className="text-text-3 hover:text-text-1 text-2xl font-bold p-1 leading-none">&times;</button>
        </div>

        {/* Modal Body: Image Comparison Slider */}
        <div className="p-6 flex flex-col items-center justify-center bg-surface/30">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-border/60 select-none">
            {/* After Image (Background) */}
            <img
              src="/images/client_after.png"
              alt="بعد التحول"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <span className="absolute bottom-4 left-4 z-10 px-2.5 py-1 bg-success/80 backdrop-blur text-bg text-[10px] font-bold rounded shadow-lg">
              بعد التحول (اليوم)
            </span>

            {/* Before Image (Foreground overlay with clipPath) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src="/images/client_before.png"
                alt="قبل التحول"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-4 right-4 z-10 px-2.5 py-1 bg-accent/80 backdrop-blur text-bg text-[10px] font-bold rounded shadow-lg whitespace-nowrap">
                قبل التحول (البداية)
              </span>
            </div>

            {/* Slider Line Indicator */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-accent pointer-events-none z-10"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              {/* Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-accent text-bg shadow-2xl border border-border flex items-center justify-center font-bold text-xs select-none">
                ↔️
              </div>
            </div>

            {/* Hidden Native Slider Input Overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-border/40 bg-surface/10">
          <Button variant="ghost" onClick={onClose}>إغلاق</Button>
          <Button className="bg-accent text-bg hover:bg-accent/90" onClick={onClose}>مشاركة الصور 📸</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Client detail view.
 *
 * NOTE: this was previously the dynamic route `/admin/clients/[id]`. Under the
 * static export it became a single static page that reads the client id from the
 * `?id=` query string, so it works for any id at runtime (a dynamic route would
 * need `generateStaticParams` and could only emit build-time-known ids). Reached
 * via `/admin/clients/view?id=<id>` (see the clients list link).
 */
function ClientDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const client = allClients[id];
  const [activeTab, setActiveTab] = useState<"overview" | "notes">("overview");
  const [showPhotos, setShowPhotos] = useState(false);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-full bg-accent-dim text-accent mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-1 mb-2">العميل غير موجود</h2>
        <p className="text-text-3 text-sm mb-6">تأكد من الرابط أو ارجع لقائمة العملاء.</p>
        <Button href="/admin/clients">← رجوع للعملاء</Button>
      </div>
    );
  }

  const weightChange = client.weightHistory.length >= 2
    ? (client.weightHistory[client.weightHistory.length - 1].value - client.weightHistory[0].value).toFixed(1)
    : "0";
  const isLoss = parseFloat(weightChange) < 0;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showPhotos && <PhotoComparisonModal onClose={() => setShowPhotos(false)} clientName={client.name} />}
      </AnimatePresence>

      {/* Back Link */}
      <Link href="/admin/clients" className="text-sm text-text-3 hover:text-accent transition-colors flex items-center gap-1">
        ← رجوع للعملاء
      </Link>

      {/* Client Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 end-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-accent text-2xl font-bold">{client.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-text-1">{client.name}</h1>
                <p className="text-text-3 text-sm">{client.email} • {client.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", client.isActive ? "bg-success/10 text-success" : "bg-text-3/10 text-text-3")}>
                    {client.isActive ? "نشط" : "غير نشط"}
                  </span>
                  <span className="text-text-3 text-xs">منذ {client.startDate}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`https://wa.me/2${client.phone}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-success"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.13.558 4.13 1.535 5.865L0 24l6.305-1.654A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.756-.556-5.29-1.516l-.38-.225-3.94 1.034 1.052-3.847-.248-.394A9.947 9.947 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                  واتساب
                </Button>
              </a>
              <Button variant="outline" size="sm">تعديل البيانات</Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "الوزن الحالي", value: `${client.weight} kg`, icon: "⚖️", color: "text-text-1" },
          { label: "نسبة الدهون", value: `${client.bodyFat}%`, icon: "📊", color: "text-warning" },
          { label: "الالتزام", value: `${client.compliance}%`, icon: "✅", color: client.compliance >= 80 ? "text-success" : client.compliance >= 60 ? "text-warning" : "text-danger" },
          { label: "Streak", value: client.streak > 0 ? `🔥 ${client.streak} يوم` : "—", icon: "", color: "text-warning" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="text-center p-4">
              <p className="text-text-3 text-xs mb-1">{stat.icon} {stat.label}</p>
              <p className={cn("text-xl font-bold font-display", stat.color)}>{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {([
          { key: "overview", label: "نظرة عامة" },
          { key: "notes", label: "ملاحظات الكوتش" },
        ] as { key: "overview" | "notes"; label: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-[var(--radius-md)] transition-all cursor-pointer",
              activeTab === tab.key ? "text-accent border-b-2 border-accent" : "text-text-3 hover:text-text-1"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Chart */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-1">تطور الوزن</h3>
                <span className={cn("text-sm font-bold", isLoss ? "text-success" : "text-info")}>
                  {isLoss ? "↓" : "↑"} {weightChange} kg
                </span>
              </div>
              <MiniChart data={client.weightHistory} />
            </Card>
          </motion.div>

          {/* Client Info */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <h3 className="font-semibold text-text-1 mb-4">بيانات العميل</h3>
              <div className="space-y-3">
                {[
                  { label: "الهدف", value: client.goal },
                  { label: "العمر", value: `${client.age} سنة` },
                  { label: "الطول", value: `${client.height} cm` },
                  { label: "تاريخ البداية", value: client.startDate },
                  { label: "آخر تشيكن", value: client.lastCheckin },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-text-3">{item.label}</span>
                    <span className="text-sm font-medium text-text-1">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Compliance Bar */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <Card>
              <h3 className="font-semibold text-text-1 mb-3">نسبة الالتزام</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-4 rounded-full bg-surface-high overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${client.compliance}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("h-full rounded-full", client.compliance >= 80 ? "bg-success" : client.compliance >= 60 ? "bg-warning" : "bg-danger")}
                  />
                </div>
                <span className={cn("text-lg font-bold font-mono", client.compliance >= 80 ? "text-success" : client.compliance >= 60 ? "text-warning" : "text-danger")}>
                  {client.compliance}%
                </span>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {activeTab === "notes" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <h3 className="font-semibold text-text-1 mb-4">📝 ملاحظات الكوتش</h3>
            <div className="p-4 bg-surface-high rounded-[var(--radius-md)] border border-border mb-4">
              <p className="text-sm text-text-1 leading-relaxed">{client.notes}</p>
            </div>
            <div className="flex gap-2">
              <textarea
                placeholder="أضف ملاحظة جديدة..."
                className="flex-1 px-4 py-3 rounded-[var(--radius-md)] bg-bg border border-border text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-accent/30 min-h-[80px] resize-none"
              />
            </div>
            <Button className="mt-3">حفظ الملاحظة</Button>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="flex flex-wrap gap-3">
          <h3 className="w-full font-semibold text-text-1 mb-2">إجراءات سريعة</h3>
          <Button variant="outline" size="sm">📋 تعديل الخطة الغذائية</Button>
          <Button variant="outline" size="sm">🏋️ تعديل التمارين</Button>
          <Button variant="outline" size="sm" onClick={() => setShowPhotos(true)}>📸 عرض الصور</Button>
          <a href={`https://wa.me/2${client.phone}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">💬 مراسلة واتساب</Button>
          </a>
          {!client.isActive && (
            <Button size="sm" className="bg-success hover:bg-success/90 text-white">🔄 إعادة تفعيل</Button>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default function ClientDetailPage() {
  // useSearchParams() requires a Suspense boundary in a static export.
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20" aria-busy="true">
          <span className="sr-only">جارٍ التحميل…</span>
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      }
    >
      <ClientDetail />
    </Suspense>
  );
}

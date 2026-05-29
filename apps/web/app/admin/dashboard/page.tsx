"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ── Sparkline ── */
function Spark({ data, color = "var(--accent)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 80, h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-7" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Stat Card ── */
function StatCard({ title, value, change, changeType, icon, sparkData, delay }: {
  title: string; value: string; change: string; changeType: "up" | "down" | "neutral";
  icon: React.ReactNode; sparkData?: number[]; delay: number;
}) {
  const changeColor = changeType === "up" ? "text-success" : changeType === "down" ? "text-danger" : "text-text-3";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-2 text-sm">{title}</p>
            <p className="text-3xl font-bold text-text-1 mt-2 font-display">{value}</p>
            <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>
          </div>
          <div className="p-3 rounded-[var(--radius-md)] bg-accent-dim text-accent">{icon}</div>
        </div>
        {sparkData && <div className="mt-3"><Spark data={sparkData} /></div>}
      </Card>
    </motion.div>
  );
}

/* ── Data ── */
const recentClients = [
  { id: "1", name: "أحمد محمد", compliance: 92, streak: 14, lastCheckin: "اليوم", risk: "low" },
  { id: "6", name: "حسام نبيل", compliance: 96, streak: 21, lastCheckin: "اليوم", risk: "low" },
  { id: "2", name: "محمد علي", compliance: 78, streak: 3, lastCheckin: "أمس", risk: "medium" },
  { id: "3", name: "كريم حسن", compliance: 55, streak: 0, lastCheckin: "3 أيام", risk: "high" },
  { id: "4", name: "يوسف إبراهيم", compliance: 88, streak: 7, lastCheckin: "اليوم", risk: "low" },
  { id: "5", name: "عمر خالد", compliance: 45, streak: 0, lastCheckin: "5 أيام", risk: "high" },
];

const riskColors: Record<string, string> = { low: "text-success", medium: "text-warning", high: "text-danger" };
const riskBg: Record<string, string> = { low: "bg-success/10", medium: "bg-warning/10", high: "bg-danger/10" };

const todayActivity = [
  { type: "checkin", text: "أحمد محمد أكمل التشيكن اليومي", time: "15 دق" },
  { type: "workout", text: "حسام نبيل سجّل تمرين صدر (12 مجموعة)", time: "32 دق" },
  { type: "photo", text: "يوسف إبراهيم رفع صور التقدم الأسبوعي", time: "1 ساعة" },
  { type: "weight", text: "محمد علي سجّل الوزن الجديد: 72.5kg", time: "2 ساعة" },
  { type: "alert", text: "عمر خالد غائب ولم يرسل تشيكن منذ 5 أيام", time: "تنبيه" },
];

function getActivityIcon(type: string) {
  const baseClass = "w-4 h-4 text-accent shrink-0";
  switch (type) {
    case "checkin":
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      );
    case "workout":
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 6.5h11M6.5 17.5h11M3 6.5h18v11H3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 6.5v11M17.5 6.5v11" />
        </svg>
      );
    case "photo":
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
        </svg>
      );
    case "weight":
      return (
        <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 17V9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17V5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 17v-4" />
        </svg>
      );
    case "alert":
      return (
        <svg className={cn(baseClass, "text-danger")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Donut chart ── */
function Donut({ value, size = 80, color = "var(--accent)" }: { value: number; size?: number; color?: string }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-high)" strokeWidth="6" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-text-1 text-sm">{value}%</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const router = useRouter();

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage("");
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-1">نظرة عامة</h1>
        <p className="text-text-2 text-sm mt-1">مرحباً بك — إليك ملخص اليوم</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="عملاء نشطين" value="42" change="↑ 3 هذا الشهر" changeType="up" delay={0} sparkData={[35, 36, 38, 39, 40, 41, 42]}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
        />
        <StatCard title="معدل الالتزام" value="76%" change="↑ 4% عن الأسبوع الماضي" changeType="up" delay={0.1} sparkData={[68, 70, 72, 71, 73, 75, 76]}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard title="عملاء بحاجة لمتابعة" value="5" change="أقل من 60% التزام" changeType="down" delay={0.2} sparkData={[8, 7, 6, 7, 6, 5, 5]}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
        />
        <StatCard title="تشيكنات اليوم" value="28" change="من أصل 42 عميل" changeType="neutral" delay={0.3} sparkData={[20, 25, 28, 30, 22, 26, 28]}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
        />
      </div>

      {/* Quick Actions Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-5 border border-border bg-surface">
          <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>الوصول السريع والمهام اليومية</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/admin/clients" 
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-high/30 border border-border/40 hover:border-accent/40 hover:bg-surface-high/70 transition-all text-center group cursor-pointer"
            >
              <svg className="w-6 h-6 mb-2 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
              <span className="text-xs md:text-sm font-semibold text-text-1">إضافة عميل جديد</span>
              <span className="text-[10px] text-text-3 mt-1">إنشاء ملف ومتابعة جديدة</span>
            </Link>

            <Link 
              href="/admin/nutrition" 
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-high/30 border border-border/40 hover:border-accent/40 hover:bg-surface-high/70 transition-all text-center group cursor-pointer"
            >
              <svg className="w-6 h-6 mb-2 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className="text-xs md:text-sm font-semibold text-text-1">خطط التغذية</span>
              <span className="text-[10px] text-text-3 mt-1">تعديل وجبات ودايت المشتركين</span>
            </Link>

            <Link 
              href="/admin/monitoring" 
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-high/30 border border-border/40 hover:border-accent/40 hover:bg-surface-high/70 transition-all text-center group cursor-pointer"
            >
              <svg className="w-6 h-6 mb-2 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18M9 21V9M15 21V13" />
              </svg>
              <span className="text-xs md:text-sm font-semibold text-text-1">لوحة المراقبة</span>
              <span className="text-[10px] text-text-3 mt-1">متابعة التزام العملاء والأداء</span>
            </Link>

            <Link 
              href="/admin/monitoring" 
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-high/30 border border-border/40 hover:border-accent/40 hover:bg-surface-high/70 transition-all text-center group cursor-pointer"
            >
              <svg className="w-6 h-6 mb-2 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4M8 15h.01M16 15h.01" />
              </svg>
              <span className="text-xs md:text-sm font-semibold text-text-1">الطيار الآلي</span>
              <span className="text-[10px] text-text-3 mt-1">اقتراحات وحل ثبات الوزن</span>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Coach Broadcasts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="border border-info/40 bg-surface shadow-[0_0_20px_rgba(59,130,246,0.05)] relative overflow-hidden">
          <div className="absolute top-0 end-0 p-3 opacity-5 pointer-events-none">
            <svg className="w-32 h-32 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="p-5 relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <svg className="w-5 h-5 text-info shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <h3 className="font-bold text-text-1">بث رسالة للجميع (Broadcast)</h3>
              </div>
              <p className="text-xs text-text-3 mb-4">ابعت إشعار طارئ أو نصيحة تظهر في لوحة تحكم كل العملاء فوراً.</p>
              
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="مثال: جهزوا نفسكم لخطة صيام رمضان الأسبوع الجاي!" 
                  className="flex-1 px-4 py-2 rounded-[var(--radius-md)] bg-bg border border-border text-sm text-text-1 focus:outline-none focus:border-info"
                />
                <Button 
                  onClick={handleSendBroadcast} 
                  disabled={!broadcastMessage.trim() || broadcastSent}
                  className="bg-info hover:bg-info/90 text-white min-w-[120px] font-bold"
                >
                  {broadcastSent ? "تم الإرسال ✓" : "إرسال للجميع"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance donut breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <h3 className="font-semibold text-text-1 mb-4">توزيع الالتزام</h3>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <Donut value={67} color="var(--success)" />
                <p className="text-xs text-text-3 mt-2">ممتاز (&gt;80%)</p>
              </div>
              <div className="text-center">
                <Donut value={21} color="var(--warning)" />
                <p className="text-xs text-text-3 mt-2">متوسط (60-80%)</p>
              </div>
              <div className="text-center">
                <Donut value={12} color="var(--danger)" />
                <p className="text-xs text-text-3 mt-2">ضعيف (&lt;60%)</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Clients quick list */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-text-1">العملاء</h2>
              <Link href="/admin/clients" className="text-accent text-sm font-medium hover:underline cursor-pointer">عرض الكل</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-start text-xs font-medium text-text-3 uppercase tracking-wider pb-3 ps-0">العميل</th>
                    <th className="text-start text-xs font-medium text-text-3 uppercase tracking-wider pb-3">الالتزام</th>
                    <th className="text-start text-xs font-medium text-text-3 uppercase tracking-wider pb-3">Streak</th>
                    <th className="text-start text-xs font-medium text-text-3 uppercase tracking-wider pb-3">آخر تشيكن</th>
                    <th className="text-end text-xs font-medium text-text-3 uppercase tracking-wider pb-3 pe-0">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentClients.map((client) => (
                    <tr 
                      key={client.id} 
                      onClick={() => router.push(`/admin/clients/${client.id}`)}
                      className="group hover:bg-surface-high/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 ps-0">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", riskBg[client.risk])}>
                            <span className={cn("text-xs font-bold", riskColors[client.risk])}>{client.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium text-text-1 group-hover:text-accent transition-colors">{client.name}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-surface-high overflow-hidden">
                            <div className={cn("h-full rounded-full", client.compliance >= 80 ? "bg-success" : client.compliance >= 60 ? "bg-warning" : "bg-danger")} style={{ width: `${client.compliance}%` }} />
                          </div>
                          <span className="text-xs text-text-2 font-mono">{client.compliance}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">
                        {client.streak > 0 ? (
                          <span className="text-warning inline-flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                            </svg>
                            <span>{client.streak}</span>
                          </span>
                        ) : (
                          <span className="text-text-3">—</span>
                        )}
                      </td>
                      <td className="py-3 text-sm text-text-2">{client.lastCheckin}</td>
                      <td className="py-3 pe-0 text-end">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", riskBg[client.risk], riskColors[client.risk])}>
                          {client.risk === "low" ? "مستقر" : client.risk === "medium" ? "متابعة" : "خطر"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Activity feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <h3 className="font-semibold text-text-1 mb-4">نشاطات اليوم</h3>
          <div className="space-y-3">
            {todayActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="p-2 bg-accent-dim text-accent rounded-full shrink-0 flex items-center justify-center">
                  {getActivityIcon(a.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-1">{a.text}</p>
                  <p className={cn("text-xs mt-0.5", a.time === "تنبيه" ? "text-danger font-bold" : "text-text-3")}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

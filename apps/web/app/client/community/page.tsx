"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const topWeightLoss = [
  { rank: 1, name: "يوسف إبراهيم", value: "-4.5 kg", avatar: "ي", color: "text-[#FFD700] border-[#FFD700] bg-[#FFD700]/10" },
  { rank: 2, name: "سارة محمود", value: "-3.2 kg", avatar: "س", color: "text-[#C0C0C0] border-[#C0C0C0] bg-[#C0C0C0]/10" },
  { rank: 3, name: "عمر خالد", value: "-2.8 kg", avatar: "ع", color: "text-[#CD7F32] border-[#CD7F32] bg-[#CD7F32]/10" },
];

const topStreaks = [
  { rank: 1, name: "حسام نبيل", value: "21 يوم متتالي", avatar: "ح", color: "text-accent border-accent/30 bg-accent/10" },
  { rank: 2, name: "أحمد محمد", value: "14 يوم متتالي", avatar: "أ", color: "text-accent border-accent/20 bg-accent/5" },
  { rank: 3, name: "منى سعيد", value: "12 يوم متتالي", avatar: "م", color: "text-accent border-accent/20 bg-accent/5" },
];

const newPRs = [
  { name: "محمد علي", exercise: "سكوات", weight: "120 kg", date: "اليوم" },
  { name: "طارق سعيد", exercise: "بنش بريس", weight: "85 kg", date: "أمس" },
  { name: "كريم حسن", exercise: "ديدليفت", weight: "150 kg", date: "منذ يومين" },
];

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-1">مجتمع الأبطال</h1>
          <p className="text-text-2 text-sm mt-1">المنافسة تصنع الأبطال. تابع ترتيبك وتطورك مقارنة بباقي اللاعبين.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weight Loss Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-0 overflow-hidden border border-accent/20 bg-surface">
            <div className="bg-accent/5 p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-text-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 18l-9-9-4 4-8-8" />
                  <path d="M17 18h6v-6" />
                </svg>
                <span>أبطال نزول الوزن (الشهر الحالي)</span>
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {topWeightLoss.map((user, i) => (
                <div key={user.name} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-surface-high/60 border border-border/40">
                  <div className="flex items-center gap-3">
                    <span className={cn("w-6 h-6 rounded-full border text-[10px] font-bold flex items-center justify-center font-mono", user.color)}>
                      {user.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-xs font-bold text-text-2">
                      {user.avatar}
                    </div>
                    <span className={cn("font-medium", i === 0 ? "text-accent" : "text-text-1")}>{user.name}</span>
                  </div>
                  <span className="font-bold text-success font-mono">{user.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Streaks Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-0 overflow-hidden border border-warning/20 bg-surface">
            <div className="bg-warning/5 p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-text-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-warning shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>ملوك الالتزام المتتالي (Streak)</span>
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {topStreaks.map((user, i) => (
                <div key={user.name} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-surface-high/60 border border-border/40">
                  <div className="flex items-center gap-3">
                    <span className={cn("w-6 h-6 rounded-full border text-[10px] font-bold flex items-center justify-center font-mono", user.color)}>
                      {user.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-xs font-bold text-text-2">
                      {user.avatar}
                    </div>
                    <span className={cn("font-medium", i === 0 ? "text-warning" : "text-text-1")}>{user.name}</span>
                  </div>
                  <span className="font-bold text-warning font-mono">{user.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Wall of PRs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border border-info/20 bg-surface p-5">
          <h3 className="font-bold text-text-1 flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-info shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <path d="M9 17V9l3 3 3-3v8" />
            </svg>
            <span>حائط الأرقام القياسية (PRs)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {newPRs.map((pr) => (
              <div key={pr.name} className="p-4 rounded-[var(--radius-md)] bg-surface-high border border-border hover:border-info/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-3 font-mono">{pr.date}</span>
                  <span className="text-xs bg-info/10 text-info px-2.5 py-0.5 rounded-full font-bold border border-info/20">رقم جديد</span>
                </div>
                <h4 className="font-bold text-text-1 mb-1">{pr.name}</h4>
                <p className="text-sm text-text-2">
                  نجح في كسر رقمه في الـ <span className="text-info font-bold">{pr.exercise}</span> بوزن <span className="font-bold text-text-1">{pr.weight}</span>!
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Motivation Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text-1 mb-1">هل اسمك ليس في القائمة؟</h3>
            <p className="text-sm text-text-2">استمر في التزامك، كل تقرير تشيكن ترسله وكل تمرين تكمله يقربك من لوحة الشرف.</p>
          </div>
          <svg className="w-8 h-8 text-accent animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </Card>
      </motion.div>
    </div>
  );
}

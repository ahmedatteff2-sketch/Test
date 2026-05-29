"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data
const stats = {
  mrr: 45000,
  mrrGrowth: "+12%",
  activeClients: 42,
  churnRate: "4.5%",
  upcomingRenewals: 8,
};

const revenueData = [
  { month: "يناير", amount: 28000 },
  { month: "فبراير", amount: 32000 },
  { month: "مارس", amount: 38000 },
  { month: "أبريل", amount: 41000 },
  { month: "مايو", amount: 45000 },
];

const upcomingRenewals = [
  { name: "أحمد محمد", date: "بعد يومين", plan: "الباقة الأساسية", price: 1500 },
  { name: "سارة خالد", date: "بعد 4 أيام", plan: "باقة الـ VIP", price: 3500 },
  { name: "محمود حسن", date: "بعد أسبوع", plan: "الباقة الأساسية", price: 1500 },
];

export default function FinanceDashboard() {
  const maxRev = Math.max(...revenueData.map(d => d.amount));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-1">الماليات وإدارة البيزنس 💰</h1>
          <p className="text-text-2 text-sm mt-1">تابع إيراداتك، نسب التجديد، ونمو البيزنس الخاص بيك</p>
        </div>
        <Button variant="outline">تحميل التقرير الشهري</Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-t-2 border-t-accent bg-gradient-to-b from-accent/5 to-transparent">
          <p className="text-sm text-text-3 mb-1">الإيرادات المتكررة (MRR)</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-display font-bold text-text-1">{stats.mrr.toLocaleString()} ج.م</h3>
            <span className="text-success text-sm font-bold mb-1">{stats.mrrGrowth}</span>
          </div>
        </Card>
        <Card className="p-5 border-t-2 border-t-info bg-gradient-to-b from-info/5 to-transparent">
          <p className="text-sm text-text-3 mb-1">العملاء النشطين</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-display font-bold text-text-1">{stats.activeClients}</h3>
            <span className="text-text-3 text-sm mb-1">عميل</span>
          </div>
        </Card>
        <Card className="p-5 border-t-2 border-t-warning bg-gradient-to-b from-warning/5 to-transparent">
          <p className="text-sm text-text-3 mb-1">تجديدات قادمة (هذا الأسبوع)</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-display font-bold text-text-1">{stats.upcomingRenewals}</h3>
            <span className="text-text-3 text-sm mb-1">اشتراكات</span>
          </div>
        </Card>
        <Card className="p-5 border-t-2 border-t-danger bg-gradient-to-b from-danger/5 to-transparent">
          <p className="text-sm text-text-3 mb-1">معدل الإلغاء (Churn Rate)</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-display font-bold text-text-1">{stats.churnRate}</h3>
            <span className="text-success text-sm font-bold mb-1">ممتاز ↓</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-text-1 mb-6">نمو الإيرادات (آخر 5 شهور)</h3>
          <div className="h-64 flex items-end gap-4">
            {revenueData.map((data, i) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex items-end justify-center h-full rounded-t-[var(--radius-md)] bg-surface-high overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.amount / maxRev) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-full bg-accent group-hover:bg-accent-dim transition-colors"
                  />
                  <span className="absolute bottom-2 text-[10px] font-bold text-bg opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.amount / 1000}k
                  </span>
                </div>
                <span className="text-xs text-text-3">{data.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Renewals */}
        <Card className="p-6">
          <h3 className="font-bold text-text-1 mb-6">تجديدات هذا الأسبوع</h3>
          <div className="space-y-4">
            {upcomingRenewals.map((renewal, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-surface border border-border">
                <div>
                  <p className="text-sm font-bold text-text-1">{renewal.name}</p>
                  <p className="text-xs text-text-3">{renewal.plan}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold text-accent">{renewal.price} ج.م</p>
                  <p className="text-[10px] text-warning">{renewal.date}</p>
                </div>
              </div>
            ))}
            <Button className="w-full mt-2" variant="outline">إرسال تذكيرات (WhatsApp)</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

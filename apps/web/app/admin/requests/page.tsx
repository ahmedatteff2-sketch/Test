"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialRequests = [
  {
    id: "REQ-001",
    name: "خالد محسن",
    phone: "01012345678",
    gender: "ذكر",
    age: 24,
    goal: "تنشيف حرق دهون",
    experience: "من 6 شهور لسنة",
    commitment: "4 أيام",
    hasInjuries: false,
    injuriesDetails: "",
    hasDiseases: false,
    diseasesDetails: "",
    status: "pending",
    date: "اليوم 10:30 ص"
  },
  {
    id: "REQ-002",
    name: "سارة عبدلله",
    phone: "01198765432",
    gender: "أنثى",
    age: 28,
    goal: "إعادة تشكيل",
    experience: "أول مرة أنزل",
    commitment: "3 أيام",
    hasInjuries: true,
    injuriesDetails: "خشونة بسيطة في الركبة اليمين",
    hasDiseases: false,
    diseasesDetails: "",
    status: "pending",
    date: "أمس 04:15 م"
  },
  {
    id: "REQ-003",
    name: "محمود حسن",
    phone: "01234567890",
    gender: "ذكر",
    age: 35,
    goal: "تحسين اللياقة والصحة",
    experience: "أكتر من سنة",
    commitment: "5 أيام",
    hasInjuries: true,
    injuriesDetails: "ديسك في الفقرات القطنية من سنتين بس متعالج",
    hasDiseases: true,
    diseasesDetails: "مقاومة أنسولين",
    status: "pending",
    date: "منذ يومين"
  }
];

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedReq, setSelectedReq] = useState<typeof initialRequests[0] | null>(null);

  const handleAction = (id: string, action: "approve" | "reject") => {
    setRequests(requests.filter(r => r.id !== id));
    setSelectedReq(null);
    // In real app, make API call to update status
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-1">طلبات الانضمام</h1>
        <p className="text-text-2 text-sm mt-1">راجع طلبات العملاء الجدد ووافق عليها عشان يبدأو رحلتهم معاك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1 space-y-3">
          {requests.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <span className="text-4xl block mb-2">📥</span>
              <p className="text-text-2 font-medium">مفيش طلبات جديدة</p>
            </Card>
          ) : (
            requests.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={cn(
                  "w-full text-start p-4 rounded-[var(--radius-lg)] border transition-all cursor-pointer",
                  selectedReq?.id === req.id 
                    ? "bg-accent-dim border-accent shadow-[0_0_15px_rgba(197, 162, 93, 0.1)]" 
                    : "bg-surface border-border hover:border-accent/40"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-text-1">{req.name}</h3>
                  <span className="text-[10px] text-text-3">{req.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-surface-high text-text-2">{req.goal}</span>
                  {(req.hasInjuries || req.hasDiseases) && (
                    <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger">⚠️ تنبيه طبي</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Request Details */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedReq ? (
              <motion.div key={selectedReq.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
                    <div>
                      <h2 className="text-2xl font-bold text-text-1">{selectedReq.name}</h2>
                      <div className="flex items-center gap-4 text-sm text-text-2 mt-2">
                        <span>{selectedReq.age} سنة • {selectedReq.gender}</span>
                        <a href={`https://wa.me/2${selectedReq.phone}`} target="_blank" rel="noreferrer" className="text-success hover:underline flex items-center gap-1">
                          واتساب: {selectedReq.phone}
                        </a>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-bold border border-warning/20">قيد المراجعة</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <h4 className="text-accent font-bold text-sm uppercase tracking-wider">التدريب والهدف</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-text-3 mb-1">الهدف الأساسي</p>
                          <p className="font-medium text-text-1">{selectedReq.goal}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-3 mb-1">الخبرة في الجيم</p>
                          <p className="font-medium text-text-1">{selectedReq.experience}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-3 mb-1">الالتزام الأسبوعي</p>
                          <p className="font-medium text-text-1">{selectedReq.commitment}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-danger font-bold text-sm uppercase tracking-wider">الحالة الطبية</h4>
                      <div className="space-y-3">
                        <div className={cn("p-3 rounded-[var(--radius-md)] border", selectedReq.hasInjuries ? "bg-danger/5 border-danger/20" : "bg-success/5 border-success/20")}>
                          <p className="text-xs text-text-3 mb-1">الإصابات</p>
                          <p className={cn("font-medium", selectedReq.hasInjuries ? "text-danger" : "text-success")}>
                            {selectedReq.hasInjuries ? selectedReq.injuriesDetails : "لا يوجد إصابات"}
                          </p>
                        </div>
                        <div className={cn("p-3 rounded-[var(--radius-md)] border", selectedReq.hasDiseases ? "bg-danger/5 border-danger/20" : "bg-success/5 border-success/20")}>
                          <p className="text-xs text-text-3 mb-1">الأمراض المزمنة</p>
                          <p className={cn("font-medium", selectedReq.hasDiseases ? "text-danger" : "text-success")}>
                            {selectedReq.hasDiseases ? selectedReq.diseasesDetails : "لا يوجد أمراض مزمنة"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-border">
                    <Button className="flex-1 bg-success hover:bg-success/90 text-white" onClick={() => handleAction(selectedReq.id, "approve")}>
                      ✓ قبول وإنشاء حساب
                    </Button>
                    <Button variant="outline" className="flex-1 border-danger/50 text-danger hover:bg-danger/10" onClick={() => handleAction(selectedReq.id, "reject")}>
                      ✕ رفض الطلب
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[400px] flex flex-col items-center justify-center text-text-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-50">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>اختار طلب من القائمة عشان تعرض تفاصيله</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

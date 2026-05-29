"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockMesoCycles = [
  {
    id: "1",
    clientName: "أحمد محمد",
    currentPhase: "تضخيم (Hypertrophy)",
    week: 3,
    totalWeeks: 8,
    status: "active",
    blocks: [
      { name: "أسبوع 1-4: تركيز أوزان وحجم", type: "Hypertrophy", progress: 75 },
      { name: "أسبوع 5-6: ثبات أو تحميل زائد", type: "Strength", progress: 0 },
      { name: "أسبوع 7-8: ديلود (Deload)", type: "Deload", progress: 0 },
    ]
  },
  {
    id: "2",
    clientName: "حسام نبيل",
    currentPhase: "تنشيف (Cutting)",
    week: 1,
    totalWeeks: 12,
    status: "active",
    blocks: [
      { name: "أسبوع 1-4: عجز سعرات خفيف", type: "Deficit", progress: 25 },
      { name: "أسبوع 5-8: عجز عالي مع كارديو", type: "Aggressive Cut", progress: 0 },
      { name: "أسبوع 9-12: تجهيز فورمة", type: "Peak", progress: 0 },
    ]
  },
  {
    id: "3",
    clientName: "مصطفى أمين",
    currentPhase: "ديلود (Deload)",
    week: 4,
    totalWeeks: 4,
    status: "completed",
    blocks: [
      { name: "أسبوع 1-3: قوة وتضخيم", type: "Strength", progress: 100 },
      { name: "أسبوع 4: راحة سلبية وتخفيف", type: "Deload", progress: 100 },
    ]
  }
];

export default function MesoCyclesPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-1">المواسم التدريبية (Meso-cycles)</h1>
          <p className="text-text-2 text-sm mt-1">خطط على المدى الطويل مش بس أسابيع.</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-info hover:bg-info/90 text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
            <path d="M12 5v14m-7-7h14" />
          </svg>
          موسم جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockMesoCycles.map((meso, i) => (
          <motion.div key={meso.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="relative overflow-hidden">
              <div className={cn("absolute top-0 start-0 w-1 h-full", meso.status === "active" ? "bg-info" : "bg-text-3")} />
              <div className="ps-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center font-bold text-text-2">
                      {meso.clientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-1">{meso.clientName}</h3>
                      <p className="text-xs text-text-3 font-mono">Phase: <span className="text-info">{meso.currentPhase}</span></p>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-2xl font-bold font-display text-text-1">{meso.week}</span>
                    <span className="text-text-3 text-sm">/{meso.totalWeeks}</span>
                    <p className="text-[10px] text-text-2 mt-0.5">أسابيع</p>
                  </div>
                </div>

                {/* Blocks Timeline */}
                <div className="space-y-3">
                  <p className="text-xs text-text-3 mb-2">خريطة الموسم (Blocks):</p>
                  {meso.blocks.map((block, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn("w-3 h-3 rounded-full border-2", block.progress === 100 ? "bg-success border-success" : block.progress > 0 ? "bg-info border-info" : "bg-transparent border-border")} />
                        {j < meso.blocks.length - 1 && <div className={cn("w-0.5 h-6", block.progress === 100 ? "bg-success" : "bg-border")} />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className={cn("text-sm font-medium", block.progress > 0 ? "text-text-1" : "text-text-3")}>{block.name}</p>
                          <span className={cn("text-[10px] px-2 py-0.5 rounded", block.progress === 100 ? "bg-success/10 text-success" : block.progress > 0 ? "bg-info/10 text-info" : "bg-surface-high text-text-3")}>
                            {block.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">تعديل الخطة</Button>
                  {meso.status === "active" && <Button variant="outline" size="sm" className="flex-1 text-xs border-success/50 text-success hover:bg-success/10">التالي (انتقال لـ Block)</Button>}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface border border-border p-6 rounded-[var(--radius-xl)] w-full max-w-lg mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-text-1 mb-4">بناء موسم تدريبي (Meso-cycle)</h2>
              <p className="text-sm text-text-3 mb-6">قسّم خطة العميل لبلوكات (Blocks) عشان تتجنب ثبات الأداء.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-2 mb-2 block">العميل</label>
                  <select className="w-full px-3 py-2 bg-bg border border-border rounded-[var(--radius-md)] text-sm text-text-1 focus:outline-none">
                    <option>أحمد محمد</option>
                    <option>يوسف إبراهيم</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-2 mb-2 block">الهدف من الموسم</label>
                  <input type="text" placeholder="مثال: تضخيم صافي وتطوير السكوات" className="w-full px-3 py-2 bg-bg border border-border rounded-[var(--radius-md)] text-sm focus:outline-none" />
                </div>

                <div className="p-4 border border-info/30 bg-info/5 rounded-[var(--radius-md)]">
                  <p className="text-sm font-bold text-info mb-2">البلوكات (Blocks)</p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" value="أسبوع 1-4: زيادة الحجم (Hypertrophy)" readOnly className="flex-1 px-3 py-1.5 bg-surface-high border border-border rounded text-xs opacity-70" />
                      <Button size="sm" variant="ghost" className="text-danger">×</Button>
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="اسم البلوك الجديد (مثال: أسبوع 5-6 ديلود)" className="flex-1 px-3 py-1.5 bg-bg border border-border rounded text-xs focus:outline-none focus:border-info" />
                      <Button size="sm" className="bg-surface-high text-text-2">+</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1" onClick={() => setShowAdd(false)}>إلغاء</Button>
                <Button className="flex-1 bg-info hover:bg-info/90 text-white">حفظ الموسم</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

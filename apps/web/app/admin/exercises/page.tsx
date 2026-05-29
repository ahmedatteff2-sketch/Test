"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ── Types ── */
interface ExerciseItem {
  id: string;
  name: string;
  nameAr: string;
  muscleGroup: string;
  equipment: string;
  videoUrl: string;
}

/* ── Mock data ── */
const muscleGroups = ["الكل", "صدر", "ظهر", "أكتاف", "بايسبس", "ترايسبس", "أرجل", "بطن", "كارديو"];

const mockExercises: ExerciseItem[] = [
  { id: "1", name: "Bench Press", nameAr: "بنش بريس", muscleGroup: "صدر", equipment: "بار", videoUrl: "" },
  { id: "2", name: "Incline Dumbbell Press", nameAr: "بنش مائل دمبل", muscleGroup: "صدر", equipment: "دمبل", videoUrl: "" },
  { id: "3", name: "Cable Flye", nameAr: "كيبل فلاي", muscleGroup: "صدر", equipment: "كيبل", videoUrl: "" },
  { id: "4", name: "Lat Pulldown", nameAr: "سحب أمامي", muscleGroup: "ظهر", equipment: "ماكينة", videoUrl: "" },
  { id: "5", name: "Barbell Row", nameAr: "تجديف بار", muscleGroup: "ظهر", equipment: "بار", videoUrl: "" },
  { id: "6", name: "Deadlift", nameAr: "ديدلفت", muscleGroup: "ظهر", equipment: "بار", videoUrl: "" },
  { id: "7", name: "Overhead Press", nameAr: "ضغط علوي", muscleGroup: "أكتاف", equipment: "بار", videoUrl: "" },
  { id: "8", name: "Lateral Raise", nameAr: "رفرفة جانبية", muscleGroup: "أكتاف", equipment: "دمبل", videoUrl: "" },
  { id: "9", name: "Squat", nameAr: "سكوات", muscleGroup: "أرجل", equipment: "بار", videoUrl: "" },
  { id: "10", name: "Leg Press", nameAr: "ليج بريس", muscleGroup: "أرجل", equipment: "ماكينة", videoUrl: "" },
  { id: "11", name: "Barbell Curl", nameAr: "كيرل بار", muscleGroup: "بايسبس", equipment: "بار", videoUrl: "" },
  { id: "12", name: "Tricep Pushdown", nameAr: "تراي بوش داون", muscleGroup: "ترايسبس", equipment: "كيبل", videoUrl: "" },
];

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = mockExercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.nameAr.includes(search);
    const matchGroup = selectedGroup === "الكل" || e.muscleGroup === selectedGroup;
    return matchSearch && matchGroup;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-1">مكتبة التمارين</h1>
          <p className="text-text-2 text-sm mt-1">{mockExercises.length} تمرين مسجل</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14m-7-7h14" />
          </svg>
          إضافة تمرين
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input placeholder="بحث عن تمرين..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Muscle group tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {muscleGroups.map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer",
              selectedGroup === group
                ? "bg-accent text-bg"
                : "bg-surface-high text-text-2 hover:text-text-1 hover:bg-surface"
            )}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Exercise grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((exercise, i) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <Card hover className="group">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-1 group-hover:text-accent transition-colors">{exercise.nameAr}</h3>
                  <p className="text-xs text-text-3 mt-0.5 font-mono">{exercise.name}</p>
                </div>
                <span className="text-accent text-xs bg-accent-dim rounded-full px-2 py-0.5">
                  {exercise.muscleGroup}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-4 text-xs text-text-3">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                  </svg>
                  {exercise.equipment}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Exercise Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass rounded-[var(--radius-xl)] p-8 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-display font-bold text-text-1 mb-6">إضافة تمرين</h2>
              <form className="space-y-4">
                <Input label="اسم التمرين (إنجليزي)" placeholder="Bench Press" dir="ltr" className="text-start" />
                <Input label="اسم التمرين (عربي)" placeholder="بنش بريس" />
                <div>
                  <label className="text-sm font-medium text-text-2 mb-2 block">العضلة</label>
                  <select className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                    {muscleGroups.filter(g => g !== "الكل").map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <Input label="المعدات" placeholder="بار، دمبل، كيبل..." />
                <Input label="رابط الفيديو" placeholder="https://youtube.com/..." dir="ltr" className="text-start" />
                <div className="flex gap-3 pt-2">
                  <Button type="button" className="flex-1">إضافة</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>إلغاء</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

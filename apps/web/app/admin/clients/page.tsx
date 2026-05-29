"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ── Types ── */
interface ClientRow {
  id: string;
  name: string;
  email: string;
  goal: string;
  compliance: number;
  weight: string;
  isActive: boolean;
  startDate: string;
  lastCheckin: string;
}

/* ── Mock data ── */
const mockClients: ClientRow[] = [
  { id: "1", name: "أحمد محمد", email: "ahmed@gmail.com", goal: "fat_loss", compliance: 92, weight: "85.2", isActive: true, startDate: "2026-01-15", lastCheckin: "اليوم" },
  { id: "2", name: "محمد علي", email: "moh@gmail.com", goal: "muscle_gain", compliance: 78, weight: "72.5", isActive: true, startDate: "2026-02-01", lastCheckin: "أمس" },
  { id: "3", name: "كريم حسن", email: "karim@gmail.com", goal: "fat_loss", compliance: 55, weight: "95.0", isActive: true, startDate: "2025-11-20", lastCheckin: "3 أيام" },
  { id: "4", name: "يوسف إبراهيم", email: "youssef@gmail.com", goal: "recomposition", compliance: 88, weight: "78.3", isActive: true, startDate: "2026-03-10", lastCheckin: "اليوم" },
  { id: "5", name: "عمر خالد", email: "omar@gmail.com", goal: "athletic", compliance: 45, weight: "68.1", isActive: false, startDate: "2025-09-05", lastCheckin: "أسبوع" },
  { id: "6", name: "حسام نبيل", email: "hussam@gmail.com", goal: "muscle_gain", compliance: 96, weight: "90.7", isActive: true, startDate: "2026-04-01", lastCheckin: "اليوم" },
  { id: "7", name: "طارق سعيد", email: "tarek@gmail.com", goal: "fat_loss", compliance: 62, weight: "102.3", isActive: true, startDate: "2026-01-28", lastCheckin: "أمس" },
  { id: "8", name: "مصطفى أمين", email: "mostafa@gmail.com", goal: "recomposition", compliance: 84, weight: "76.0", isActive: true, startDate: "2026-02-15", lastCheckin: "اليوم" },
];

const goalLabels: Record<string, string> = {
  fat_loss: "حرق دهون",
  muscle_gain: "بناء عضلات",
  recomposition: "إعادة تشكيل",
  athletic: "رياضي",
};

const goalColors: Record<string, string> = {
  fat_loss: "bg-danger/10 text-danger",
  muscle_gain: "bg-info/10 text-info",
  recomposition: "bg-warning/10 text-warning",
  athletic: "bg-success/10 text-success",
};

/* ── Add Client Modal ── */
function AddClientModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-[var(--radius-xl)] p-8 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-display font-bold text-text-1 mb-6">إضافة عميل جديد</h2>
        <form className="space-y-4">
          <Input label="الاسم الكامل" placeholder="أحمد محمد" required />
          <Input label="البريد الإلكتروني" type="email" placeholder="email@example.com" dir="ltr" className="text-start" required />
          <Input label="كلمة المرور" type="password" placeholder="••••••••" dir="ltr" className="text-start" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="العمر" type="number" placeholder="25" />
            <Input label="الوزن (kg)" type="number" placeholder="80" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-2 mb-2 block">الهدف</label>
            <select className="w-full px-4 py-2.5 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="fat_loss">حرق دهون</option>
              <option value="muscle_gain">بناء عضلات</option>
              <option value="recomposition">إعادة تشكيل</option>
              <option value="athletic">رياضي</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" className="flex-1">إضافة العميل</Button>
            <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterGoal, setFilterGoal] = useState<string>("all");

  const filtered = mockClients.filter((c) => {
    const matchSearch = c.name.includes(search) || c.email.includes(search);
    const matchGoal = filterGoal === "all" || c.goal === filterGoal;
    return matchSearch && matchGoal;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-1">العملاء</h1>
          <p className="text-text-2 text-sm mt-1">{mockClients.length} عميل مسجل</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14m-7-7h14" />
          </svg>
          إضافة عميل
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="بحث بالاسم أو الإيميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "الكل" },
            { value: "fat_loss", label: "حرق" },
            { value: "muscle_gain", label: "بناء" },
            { value: "recomposition", label: "تشكيل" },
            { value: "athletic", label: "رياضي" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterGoal(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer",
                filterGoal === f.value
                  ? "bg-accent text-bg"
                  : "bg-surface-high text-text-2 hover:text-text-1"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-high/50">
                {["العميل", "الهدف", "الوزن", "الالتزام", "آخر تشيكن", "الحالة", ""].map((h) => (
                  <th key={h} className="text-start text-xs font-medium text-text-3 uppercase tracking-wider px-6 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((client, i) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-surface-high/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <span className="text-accent text-sm font-bold">{client.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-1">{client.name}</p>
                        <p className="text-xs text-text-3">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium", goalColors[client.goal])}>
                      {goalLabels[client.goal]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-1 font-mono">{client.weight} kg</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface-high overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", client.compliance >= 80 ? "bg-success" : client.compliance >= 60 ? "bg-warning" : "bg-danger")}
                          style={{ width: `${client.compliance}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-2 font-mono">{client.compliance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-2">{client.lastCheckin}</td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1 text-xs", client.isActive ? "text-success" : "text-text-3")}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", client.isActive ? "bg-success" : "bg-text-3")} />
                      {client.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <Link href={`/admin/clients/${client.id}`} className="text-accent hover:underline transition-colors text-sm cursor-pointer inline-flex items-center gap-1">
                      عرض ←
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

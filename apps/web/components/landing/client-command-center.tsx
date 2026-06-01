"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const clientRows = [
  { name: "أحمد محمد", goal: "تنشيف", adherence: 94, checkin: "اليوم", risk: "low" },
  { name: "محمد علي", goal: "زيادة عضل", adherence: 76, checkin: "أمس", risk: "medium" },
  { name: "كريم حسن", goal: "نزول وزن", adherence: 48, checkin: "3 أيام", risk: "high" },
];

const automations = [
  "تنبيه تلقائي عند غياب التشيكن",
  "اقتراح تعديل السعرات عند ثبات الوزن",
  "رسالة متابعة جاهزة لكل حالة",
  "ملخص أسبوعي للالتزام والتقدم",
];

const riskStyles = {
  low: "bg-success/12 text-success border-success/20",
  medium: "bg-warning/12 text-warning border-warning/20",
  high: "bg-danger/12 text-danger border-danger/20",
};

export function ClientCommandCenter() {
  return (
    <section id="client-command-center" className="relative overflow-hidden bg-bg py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(197,162,93,0.05),transparent_45%)] pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="mb-3 block text-sm font-bold text-accent">متابعة العملاء بذكاء</span>
          <h2 className="max-w-2xl text-4xl font-black leading-tight text-white md:text-5xl">
            مش مجرد برنامج تدريب. دي غرفة عمليات للكوتش.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-text-2">
            شوف مين ملتزم، مين غايب، مين وزنه ثابت، ومين محتاج رسالة فورية. كل عميل له حالة واضحة وخطوة متابعة مقترحة بدل ما تضيع وسط الشاتات والجداول.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {automations.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/12 text-accent">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-text-1">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/admin/monitoring" size="lg" className="rounded-lg">
              افتح لوحة المتابعة
            </Button>
            <Button href="#pricing" size="lg" variant="outline" className="rounded-lg border-white/15">
              شوف النظام بالكامل
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-lg border border-white/10 bg-surface/80 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-xs font-bold text-text-3">Coach Command Center</p>
              <h3 className="mt-1 text-xl font-extrabold text-white">أولويات متابعة اليوم</h3>
            </div>
            <span className="rounded-md bg-accent/12 px-3 py-1 text-xs font-black text-accent">
              5 إجراءات
            </span>
          </div>

          <div className="grid gap-4 p-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["28", "تشيكن اليوم"],
                ["5", "عملاء خطر"],
                ["96%", "أفضل التزام"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-bg/70 p-4">
                  <p className="text-2xl font-black text-white" dir="ltr">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-text-3">{label}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10">
              {clientRows.map((client) => (
                <div key={client.name} className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 bg-bg/45 p-4 last:border-b-0">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-text-1">{client.name}</p>
                      <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-text-3">
                        {client.goal}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-high">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            client.risk === "low" ? "bg-success" : client.risk === "medium" ? "bg-warning" : "bg-danger"
                          )}
                          style={{ width: `${client.adherence}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-text-2" dir="ltr">{client.adherence}%</span>
                      <span className="text-xs text-text-3">آخر تشيكن: {client.checkin}</span>
                    </div>
                  </div>
                  <span className={cn("h-fit rounded-md border px-2.5 py-1 text-xs font-black", riskStyles[client.risk as keyof typeof riskStyles])}>
                    {client.risk === "low" ? "مستقر" : client.risk === "medium" ? "تابع" : "خطر"}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-accent/15 bg-accent/[0.06] p-4">
              <p className="text-sm font-bold text-white">اقتراح ذكي</p>
              <p className="mt-1 text-sm leading-7 text-text-2">
                كريم حسن غائب 3 أيام والتزامه أقل من 50%. ابعت رسالة إعادة تنشيط وحدد مكالمة 10 دقائق قبل نهاية اليوم.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

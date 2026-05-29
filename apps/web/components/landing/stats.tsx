"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCMSContent } from "@/lib/cms";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const defaultStats = {
  items: [
    { value: 2400, suffix: "+", label: "عميل سعيد" },
    { value: 98, suffix: "%", label: "نسبة الرضا" },
    { value: 15, suffix: "+", label: "سنة خبرة" },
    { value: 50, suffix: "K+", label: "تمرين مسجل" },
  ]
};

function Counter({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [target]);

  return <span dir="ltr" className="inline-block">{value.toLocaleString("en-US")}</span>;
}

function getStatIcon(label: string) {
  const baseClass = "w-8 h-8 text-accent mb-4 mx-auto opacity-90 drop-shadow-[0_0_10px_rgba(255,30,39,0.3)]";
  if (label.includes("عميل") || label.includes("مشترك")) {
    return (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    );
  }
  if (label.includes("الرضا") || label.includes("نسبة")) {
    return (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (label.includes("خبرة") || label.includes("سنة")) {
    return (
      <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    );
  }
  return (
    <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function AnimatedStat({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-center md:border-e border-border/40 last:border-e-0 px-4 flex flex-col justify-center"
    >
      {getStatIcon(stat.label)}
      <div className="font-display font-extrabold text-white" style={{ fontSize: "var(--text-5xl)" }}>
        {isInView ? (
          <span>
            <Counter target={stat.value} />
            <span className="text-accent">{stat.suffix}</span>
          </span>
        ) : (
          <span>0{stat.suffix}</span>
        )}
      </div>
      <p className="text-text-2 mt-2 font-medium" style={{ fontSize: "var(--text-sm)" }}>
        {stat.label}
      </p>
    </motion.div>
  );
}

export function Stats() {
  const content = useCMSContent("stats", defaultStats);

  return (
    <section id="stats" className="relative py-24 bg-surface-high/30">
      {/* ── Top border accent ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {content.items.map((stat, i) => (
            <AnimatedStat key={stat.label} stat={stat} delay={i * 0.1} />
          ))}
        </div>
      </div>

      {/* ── Bottom border accent ── */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
}

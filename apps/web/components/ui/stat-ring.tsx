"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatRingProps {
  /** Progress value 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** Ring color, defaults to accent */
  color?: string;
  label?: string;
  /** Center content; defaults to the rounded percentage */
  children?: React.ReactNode;
  className?: string;
}

/** Animated circular progress ring with an accessible meter role. */
export function StatRing({
  value,
  size = 88,
  strokeWidth = 8,
  color = "var(--accent)",
  label,
  children,
  className,
}: StatRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="meter"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-high)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <span className="text-lg font-black text-text-1" dir="ltr">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    </div>
  );
}

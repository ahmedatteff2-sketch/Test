import { cn } from "@/lib/utils";

type BadgeTone = "accent" | "success" | "danger" | "warning" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  /** Optional leading dot indicator */
  dot?: boolean;
}

const toneStyles: Record<BadgeTone, string> = {
  accent: "border-accent/25 bg-accent-dim text-accent-text",
  success: "border-success/25 bg-success/10 text-success",
  danger: "border-danger/25 bg-danger/10 text-danger",
  warning: "border-warning/25 bg-warning/10 text-warning",
  info: "border-info/25 bg-info/10 text-info",
  neutral: "border-border-hover bg-surface-high text-text-2",
};

const dotStyles: Record<BadgeTone, string> = {
  accent: "bg-accent",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
  neutral: "bg-text-3",
};

/** Compact status pill used across landing and dashboards. */
export function Badge({ children, tone = "accent", className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold leading-none",
        toneStyles[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[tone])} />}
      {children}
    </span>
  );
}

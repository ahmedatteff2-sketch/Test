"use client";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "premium" | "stat";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  variant?: CardVariant;
  onClick?: () => void;
  /** Accessible label when the card is interactive (onClick set) */
  ariaLabel?: string;
}

const cardVariants: Record<CardVariant, string> = {
  default: "bg-surface border border-border",
  premium: "card-premium",
  stat: "bg-surface-high border border-border",
};

export function Card({ children, className, hover, glow, variant = "default", onClick, ariaLabel }: CardProps) {
  const interactive = Boolean(onClick);
  return (
    <div
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? ariaLabel : undefined}
      className={cn(
        "rounded-[var(--radius-lg)] p-6 transition-all duration-300",
        cardVariants[variant],
        hover && "hover:border-border-hover hover:bg-surface-high cursor-pointer",
        glow && "glow-accent",
        interactive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-text-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-text-2 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

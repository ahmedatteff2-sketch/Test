"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, glow, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "rounded-[var(--radius-lg)] bg-surface border border-border p-6",
        "transition-all duration-300",
        hover && "hover:border-border-hover hover:bg-surface-high cursor-pointer",
        glow && "glow-accent",
        onClick && "cursor-pointer",
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

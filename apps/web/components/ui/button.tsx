"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  /** Optional leading icon rendered before children */
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[image:var(--gradient-gold)] bg-[length:200%_auto] bg-[position:0%] text-bg font-bold shadow-[var(--shadow-accent)] hover:bg-[position:100%] hover:shadow-[0_22px_55px_rgba(197,162,93,0.34)] active:brightness-95",
  secondary:
    "bg-surface-high text-text-1 border border-border hover:border-border-hover hover:bg-surface",
  ghost:
    "bg-transparent text-text-2 hover:text-text-1 hover:bg-surface-high",
  danger:
    "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
  outline:
    "bg-white/[0.02] text-text-1 border border-border-hover hover:bg-surface hover:border-accent/40 hover:text-text-1",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
  md: "px-5 py-2.5 text-base rounded-[var(--radius-md)]",
  lg: "px-8 py-3.5 text-lg rounded-[var(--radius-md)]",
  xl: "px-10 py-4 text-lg rounded-[var(--radius-lg)]",
};

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", isLoading, href, icon, className, children, disabled, ...props },
    ref
  ) {
    const combinedClassName = cn(
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      "cursor-pointer select-none",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const leadingIcon = !isLoading && icon ? <span className="inline-flex shrink-0">{icon}</span> : null;

    const loadingSpinner = isLoading && (
      <svg
        className="animate-spin h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    );

    if (href) {
      const isAnchor = href.startsWith("#");
      if (isAnchor) {
        return (
          <a
            ref={ref as any}
            href={href}
            className={combinedClassName}
            {...(props as any)}
          >
            {loadingSpinner}
            {leadingIcon}
            {children}
          </a>
        );
      }
      return (
        <Link
          ref={ref as any}
          href={href}
          className={combinedClassName}
          {...(props as any)}
        >
          {loadingSpinner}
          {leadingIcon}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={combinedClassName}
        {...props}
      >
        {loadingSpinner}
        {leadingIcon}
        {children}
      </button>
    );
  }
);


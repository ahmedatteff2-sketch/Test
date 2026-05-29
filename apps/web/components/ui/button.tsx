"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-bg hover:brightness-110 active:brightness-95 glow-accent",
  secondary:
    "bg-surface-high text-text-1 border border-border hover:border-border-hover hover:bg-surface",
  ghost:
    "bg-transparent text-text-2 hover:text-text-1 hover:bg-surface-high",
  danger:
    "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
  outline:
    "bg-transparent text-text-1 border border-border hover:bg-surface hover:text-text-1",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
  md: "px-5 py-2.5 text-base rounded-[var(--radius-md)]",
  lg: "px-8 py-3.5 text-lg rounded-[var(--radius-md)]",
};

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", isLoading, href, className, children, disabled, ...props },
    ref
  ) {
    const combinedClassName = cn(
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "cursor-pointer select-none",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

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
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {loadingSpinner}
        {children}
      </button>
    );
  }
);


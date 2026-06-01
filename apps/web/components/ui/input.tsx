"use client";

import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, hint, className, id, ...props }, ref) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = inputId ? `${inputId}-error` : undefined;
    const hintId = inputId ? `${inputId}-hint` : undefined;
    const describedBy = error ? errorId : hint ? hintId : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full px-4 py-2.5 rounded-[var(--radius-md)]",
            "bg-surface border border-border",
            "text-text-1 placeholder:text-text-3",
            "transition-all duration-200",
            "hover:border-border-hover",
            "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50",
            error && "border-danger/50 focus:ring-danger/30 focus:border-danger/50",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-danger mt-0.5">{error}</p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-text-3 mt-0.5">{hint}</p>
        )}
      </div>
    );
  }
);

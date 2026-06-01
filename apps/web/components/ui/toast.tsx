"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ToastTone = "default" | "success" | "danger" | "info";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<ToastTone, string> = {
  default: "border-border-hover bg-surface text-text-1",
  success: "border-success/30 bg-success/10 text-text-1",
  danger: "border-danger/30 bg-danger/10 text-text-1",
  info: "border-info/30 bg-info/10 text-text-1",
};

const toneDot: Record<ToastTone, string> = {
  default: "bg-accent",
  success: "bg-success",
  danger: "bg-danger",
  info: "bg-info",
};

/**
 * Wrap a subtree to enable toasts. Renders a single polite aria-live region
 * so status messages are announced to assistive tech.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, tone: ToastTone = "default") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              role="status"
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-sm font-semibold shadow-[var(--shadow-lg)] backdrop-blur-md",
                toneStyles[t.tone]
              )}
            >
              <span className={cn("h-2 w-2 shrink-0 rounded-full", toneDot[t.tone])} />
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/** Access the toast() function. Falls back to a no-op outside a provider. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { toast: () => {} };
  }
  return ctx;
}

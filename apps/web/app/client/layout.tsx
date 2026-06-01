"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthGuard, logout } from "@/lib/use-auth-guard";

const tabs = [
  {
    label: "اليوم",
    href: "/client/today",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    label: "التغذية",
    href: "/client/nutrition",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .37" />
      </svg>
    ),
  },
  {
    label: "التقدم",
    href: "/client/progress",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    label: "المجتمع",
    href: "/client/community",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: "تشيكن",
    href: "/client/checkin",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const guard = useAuthGuard("client");

  if (guard !== "authorized") {
    return (
      <div className="flex h-screen items-center justify-center bg-bg" aria-busy="true">
        <span className="sr-only">جارٍ التحقق من الجلسة…</span>
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Eagle Gym Logo" className="w-6 h-6 object-contain" />
          <span className="font-display font-bold text-lg text-white">EAGLE <span className="text-accent">GYM</span></span>
        </div>
        <button
          type="button"
          onClick={() => logout(router)}
          aria-label="تسجيل الخروج"
          className="flex items-center gap-2 rounded-full px-2 py-1 text-text-2 transition-colors hover:text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-accent text-xs font-bold" aria-hidden="true">م</span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4 py-6">
        <div className="max-w-lg mx-auto">{children}</div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-surface/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-50 px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 w-16 h-full transition-all active:scale-95 duration-150 relative",
                isActive ? "text-accent" : "text-text-2 hover:text-text-1"
              )}
            >
              <div className="relative" aria-hidden="true">
                {tab.icon}
                {tab.label === "تشيكن" && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger"></span>
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wide">{tab.label}</span>
              {tab.label === "تشيكن" && (
                <span className="sr-only">— لديك تشيكن مستحق اليوم</span>
              )}
              {isActive && (
                <span className="absolute bottom-0.5 w-7 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(197,162,93,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

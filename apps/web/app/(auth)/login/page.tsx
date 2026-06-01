"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { getApiBase } from "@/lib/config";
import { setRoleCookie, setCsrfCookie, roleHome, type Role } from "@/lib/auth";

const demoUsers: Record<string, { password: string; role: Role }> = {
  "admin@eagle.com": { password: "admin123", role: "admin" },
  "client@eagle.com": { password: "client123", role: "client" },
};

function isLocalDemo() {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

// useSyncExternalStore lets the server render `false` and the client read the
// real hostname, with no hydration mismatch and no setState-in-effect. The
// store never changes after mount, so subscribe is a no-op.
const noopSubscribe = () => () => {};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Demo affordances only exist on localhost — never on a published domain.
  const showDemo = useSyncExternalStore(
    noopSubscribe,
    () => isLocalDemo(), // client snapshot
    () => false // server snapshot
  );

  function loginAsDemo(email: keyof typeof demoUsers) {
    if (!isLocalDemo()) {
      setError("دخول الديمو السريع متاح محليًا فقط.");
      return;
    }
    const { role } = demoUsers[email];
    setRoleCookie(role);
    window.location.href = roleHome[role];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const demoUser = demoUsers[email as keyof typeof demoUsers];
      if (isLocalDemo() && demoUser?.password === password) {
        setRoleCookie(demoUser.role);
        window.location.href = roleHome[demoUser.role];
        return;
      }

      const apiBase = getApiBase();

      let res: Response;
      try {
        res = await fetch(
          `${apiBase}/auth/login`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );
      } catch {
        throw new Error("الـ API غير شغال حالياً. شغّل الباك إند أو استخدم الحساب التجريبي على localhost.");
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      const data = await res.json();
      const role: Role = data.data?.user?.role === "admin" ? "admin" : "client";
      setRoleCookie(role);
      if (data.data?.csrfToken) setCsrfCookie(data.data.csrfToken);
      window.location.href = roleHome[role];
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="relative w-16 h-16 mb-4">
          <Image src="/images/logo.png" alt="Eagle Gym Logo" fill className="object-contain" />
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-2">
          EAGLE <span className="text-accent">GYM</span>
        </h1>
        <p className="text-text-2 text-sm">سجّل دخولك لمتابعة رحلتك</p>
      </div>

      {/* Card */}
      <div className="glass rounded-[var(--radius-xl)] p-8">
        {showDemo && (
          <div className="mb-5 rounded-lg border border-accent/15 bg-accent/[0.06] p-3 text-xs leading-6 text-text-2">
            <p className="font-bold text-text-1">حسابات الديمو (محلي فقط)</p>
            <p dir="ltr" className="mt-1 text-start">admin@eagle.com / admin123</p>
            <p dir="ltr" className="text-start">client@eagle.com / client123</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo("admin@eagle.com")}
                className="rounded-md border border-accent/20 bg-bg/50 px-3 py-2 font-bold text-accent transition-colors hover:bg-accent/10"
              >
                دخول أدمن
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo("client@eagle.com")}
                className="rounded-md border border-accent/20 bg-bg/50 px-3 py-2 font-bold text-accent transition-colors hover:bg-accent/10"
              >
                دخول عميل
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
            className="text-start"
          />

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
            className="text-start"
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] px-4 py-3 text-sm text-danger"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            تسجيل الدخول
          </Button>
        </form>
      </div>

      {/* Footer text */}
      <p className="text-center text-text-3 text-xs mt-6">
        ليس لديك حساب؟ تواصل مع المدرب للتسجيل
      </p>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const demoUsers = {
  "admin@eagle.com": { password: "admin123", redirect: "/admin/dashboard" },
  "client@eagle.com": { password: "client123", redirect: "/client/today" },
};

function isLocalDemo() {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined"
        ? `http://${window.location.hostname}:8080/api`
        : "http://localhost:8080/api");

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
        const demoUser = demoUsers[email as keyof typeof demoUsers];
        if (isLocalDemo() && demoUser?.password === password) {
          window.location.href = demoUser.redirect;
          return;
        }
        throw new Error("الـ API غير شغال حالياً. شغّل الباك إند أو استخدم الحساب التجريبي على localhost.");
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      const data = await res.json();
      const role = data.data?.user?.role;

      if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/client/today";
      }
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
        <div className="mb-5 rounded-lg border border-accent/15 bg-accent/[0.06] p-3 text-xs leading-6 text-text-2">
          <p className="font-bold text-text-1">حسابات الديمو</p>
          <p dir="ltr" className="mt-1 text-start">admin@eagle.com / admin123</p>
          <p dir="ltr" className="text-start">client@eagle.com / client123</p>
        </div>

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

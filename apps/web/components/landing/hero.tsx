"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCMSContent } from "@/lib/cms";
import { cn } from "@/lib/utils";

const defaultHero = {
  headline: "ابني جسمك\nبخطة واضحة",
  subheadline:
    "تدريب أونلاين احترافي يجمع بين برنامج تمرين مخصص، نظام غذائي محسوب، متابعة يومية، وتقارير تقدم تساعدك تعرف بالضبط ماذا تعمل كل أسبوع.",
  ctaText: "ابدأ التقييم المجاني",
  metric1Value: "+2,400",
  metric1Label: "مشترك",
  metric2Value: "98%",
  metric2Label: "نسبة الالتزام",
  metric3Value: "4.9",
  metric3Label: "تقييم المشتركين",
};

const proofItems = ["خطط مخصصة", "متابعة يومية", "تغذية محسوبة", "تحليل تقدم"];

export function Hero() {
  const content = useCMSContent("hero", defaultHero);
  const headlineLines = content.headline.split("\n");

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden pt-24 pb-10 md:pt-28"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_gym_bg.png"
          alt="EAGLE GYM training floor"
          fill
          className="object-cover object-center opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.97)_0%,rgba(5,5,5,0.9)_42%,rgba(5,5,5,0.72)_72%,rgba(5,5,5,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--bg)_0%,rgba(5,5,5,0.2)_34%,rgba(5,5,5,0.64)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_70%,transparent)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-bg/55 px-3 py-2 text-xs font-bold text-accent shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md"
          >
            <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_18px_rgba(0,214,143,0.65)]" />
            منصة تدريب أونلاين بنتائج قابلة للقياس
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="max-w-[780px] text-5xl font-black leading-[1.08] text-white sm:text-6xl lg:text-7xl"
          >
            {headlineLines.map((line, idx) => (
              <span key={line} className="block">
                <span
                  className={cn(
                    idx === headlineLines.length - 1 &&
                      "bg-gradient-to-r from-accent to-[#F0C978] bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(197,162,93,0.26)]"
                  )}
                >
                  {line}
                </span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-2xl text-base leading-8 text-text-2 md:text-lg"
          >
            {content.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              href="/apply"
              size="lg"
              className="min-h-14 w-full px-7 text-base font-extrabold sm:w-auto"
            >
              {content.ctaText}
            </Button>
            <Button
              href="#pricing"
              size="lg"
              variant="outline"
              className="min-h-14 w-full rounded-lg px-7 text-base font-bold sm:w-auto"
            >
              شوف الباقات
            </Button>
          </motion.div>

          {/* Social proof — rating + subscriber avatars */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <div className="flex items-center -space-x-3 [&>span]:ring-2 [&>span]:ring-bg">
              {["أ", "م", "س", "ح"].map((initial, i) => (
                <span
                  key={initial}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface-high text-xs font-bold text-accent-text"
                  style={{ zIndex: 4 - i }}
                  aria-hidden="true"
                >
                  {initial}
                </span>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="flex text-accent" aria-hidden="true">
                  {"★★★★★"}
                </span>
                <span className="text-sm font-extrabold text-white" dir="ltr">
                  {content.metric3Value}
                </span>
              </div>
              <p className="text-xs font-semibold text-text-2">
                تقييم {content.metric1Value} مشترك أنهوا تحولهم معنا
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="mt-7 flex flex-wrap gap-2"
          >
            {proofItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-text-2 backdrop-blur-sm"
              >
                <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative ms-auto w-full max-w-[520px] overflow-hidden rounded-lg border border-white/10 bg-bg/65 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-bold text-text-3">لوحة متابعة العميل</p>
                <h2 className="mt-1 text-xl font-extrabold text-white">أسبوع قوي، تقدم واضح</h2>
              </div>
              <span className="rounded-md bg-success/12 px-3 py-1 text-xs font-black text-success">
                ملتزم 96%
              </span>
            </div>

            <div className="grid gap-4 p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  [content.metric1Value, content.metric1Label],
                  [content.metric2Value, content.metric2Label],
                  [content.metric3Value, content.metric3Label],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-2xl font-black text-white" dir="ltr">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-text-3">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-accent/15 bg-accent/[0.06] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">خطة اليوم</span>
                  <span className="text-xs font-bold text-accent">Push Day</span>
                </div>
                {["بنش بريس", "كتف أمامي", "ترايسبس"].map((exercise, index) => (
                  <div key={exercise} className="flex items-center justify-between border-t border-white/10 py-3 first:border-t-0">
                    <span className="text-sm font-semibold text-text-2">{exercise}</span>
                    <span className="rounded bg-bg/60 px-2 py-1 text-xs font-bold text-text-1">
                      {index + 3} مجموعات
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <div>
                  <p className="text-sm font-bold text-white">رسالة الكوتش</p>
                  <p className="mt-1 text-xs leading-6 text-text-2">
                    ممتاز. زود 2.5 كجم في آخر مجموعة وحافظ على نفس الريتم.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-lg font-black text-bg">
                  EG
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-bold text-text-3 transition-colors hover:text-accent md:flex"
      >
        اكتشف المزيد
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-5 rounded-full border border-white/20 p-1"
        >
          <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-accent" />
        </motion.span>
      </button>
    </section>
  );
}

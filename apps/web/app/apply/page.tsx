"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getApiBase } from "@/lib/config";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    gender: "",
    goal: "",
    experience: "",
    hasInjuries: null as boolean | null,
    injuriesDetails: "",
    hasDiseases: null as boolean | null,
    diseasesDetails: "",
    commitment: "",
  });

  const handleNext = () => {
    if (step === 1) {
      const egyptPhoneRegex = /^01[0125][0-9]{8}$/;
      if (!egyptPhoneRegex.test(formData.phone)) {
        setPhoneError("برجاء إدخال رقم هاتف مصري صحيح (مثال: 01012345678)");
        return;
      }
      setPhoneError("");
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const apiBase = getApiBase();

      const response = await fetch(`${apiBase}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          goal: formData.goal,
          experience: formData.experience,
          notes: `السن: ${formData.age} | النوع: ${formData.gender} | الالتزام: ${formData.commitment} | الإصابات: ${formData.hasInjuries ? formData.injuriesDetails : "لا يوجد"} | الأمراض: ${formData.hasDiseases ? formData.diseasesDetails : "لا يوجد"}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "فشل إرسال الطلب، يرجى المحاولة مرة أخرى.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء إرسال طلبك.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md">
          <Card className="p-8 text-center bg-surface/50 backdrop-blur-xl border-accent/20">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-text-1 mb-2">تم استلام طلبك بنجاح! 🎉</h2>
            <p className="text-text-2 mb-8">الكوتش هيراجع بياناتك وهنتواصل معاك في أقرب وقت عشان نبدأ رحلة التغيير.</p>
            <Button href="/" className="w-full" variant="outline">الرجوع للصفحة الرئيسية</Button>
          </Card>
        </motion.div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-bg relative overflow-hidden flex flex-col">
      {/* Background glow */}
      <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Navbar Minimal */}
      <nav className="p-6 relative z-10 flex items-center gap-3">
        <div className="relative w-8 h-8">
          <Image src="/images/logo.png" alt="Eagle Gym Logo" fill className="object-contain" />
        </div>
        <Link href="/" className="font-display font-bold text-2xl text-white">
          EAGLE <span className="text-accent">GYM</span>
        </Link>
      </nav>
 
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold text-text-1 mb-2">طلب انضمام للتدريب</h1>
            <p className="text-text-3">باقي خطوات بسيطة عشان نبدأ الرحلة. جاوب بصدق عشان نقدر نساعدك صح.</p>
          </div>
 
          <Card className="p-6 md:p-8 bg-surface/50 backdrop-blur-xl">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-surface-high -z-10 -translate-y-1/2" />
              <div className="absolute top-1/2 h-0.5 bg-accent -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
              {[1, 2, 3].map((s) => (
                <div key={s} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors", step >= s ? "bg-accent text-bg" : "bg-surface-high text-text-3 border border-border")}>
                  {s}
                </div>
              ))}
            </div>
 
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h3 className="text-lg font-bold text-text-1 mb-4">المعلومات الشخصية</h3>
                  <Input label="الاسم بالكامل" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="مثال: أحمد محمد" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="السن" type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="25" />
                    <div>
                      <label className="text-sm font-medium text-text-2 mb-2 block">النوع</label>
                      <div className="flex gap-2">
                        <button onClick={() => setFormData({...formData, gender: "ذكر"})} className={cn("flex-1 py-2.5 rounded-[var(--radius-md)] border text-sm transition-all", formData.gender === "ذكر" ? "bg-accent/10 border-accent text-accent" : "bg-surface-high border-border text-text-2 hover:border-accent/30")}>ذكر</button>
                        <button onClick={() => setFormData({...formData, gender: "أنثى"})} className={cn("flex-1 py-2.5 rounded-[var(--radius-md)] border text-sm transition-all", formData.gender === "أنثى" ? "bg-accent/10 border-accent text-accent" : "bg-surface-high border-border text-text-2 hover:border-accent/30")}>أنثى</button>
                      </div>
                    </div>
                  </div>
                  <Input label="رقم الواتساب (للتواصل)" type="tel" value={formData.phone} onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (phoneError) setPhoneError("");
                  }} placeholder="01xxxxxxxxx" />
                  {phoneError && (
                    <p className="text-xs text-danger mt-1 text-start">{phoneError}</p>
                  )}
                  <Button className="w-full mt-6" onClick={handleNext} disabled={!formData.name || !formData.age || !formData.phone || !formData.gender}>التالي</Button>
                </motion.div>
              )}
 
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h3 className="text-lg font-bold text-text-1 mb-4">الهدف والمستوى الرياضي</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-text-2 mb-2 block">إيه هو هدفك الأساسي؟</label>
                    <select className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})}>
                      <option value="">اختار هدفك...</option>
                      <option value="حرق دهون">حرق دهون وتنشيف</option>
                      <option value="بناء عضلات">بناء كتلة عضلية (ضخامة)</option>
                      <option value="إعادة تشكيل">إعادة تشكيل الجسم (Recomp)</option>
                      <option value="لياقة بدنية">تحسين اللياقة والصحة العامة</option>
                    </select>
                  </div>
 
                  <div>
                    <label className="text-sm font-medium text-text-2 mb-2 block">خبرتك في الجيم قد إيه؟</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["أول مرة أنزل", "أقل من 6 شهور", "من 6 شهور لسنة", "أكتر من سنة"].map((exp) => (
                        <button key={exp} onClick={() => setFormData({...formData, experience: exp})} className={cn("py-2 px-3 rounded-[var(--radius-md)] border text-xs transition-all text-start", formData.experience === exp ? "bg-accent/10 border-accent text-accent font-bold" : "bg-surface-high border-border text-text-2 hover:border-accent/30")}>
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
 
                  <div>
                    <label className="text-sm font-medium text-text-2 mb-2 block">كم يوم تقدر تتمرن في الأسبوع؟</label>
                    <select className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" value={formData.commitment} onChange={(e) => setFormData({...formData, commitment: e.target.value})}>
                      <option value="">اختار...</option>
                      <option value="3 أيام">3 أيام</option>
                      <option value="4 أيام">4 أيام</option>
                      <option value="5 أيام">5 أيام</option>
                      <option value="6 أيام">6 أيام</option>
                    </select>
                  </div>
 
                  <div className="flex gap-3 mt-6">
                    <Button variant="ghost" onClick={handleBack}>رجوع</Button>
                    <Button className="flex-1" onClick={handleNext} disabled={!formData.goal || !formData.experience || !formData.commitment}>التالي</Button>
                  </div>
                </motion.div>
              )}
 
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h3 className="text-lg font-bold text-text-1 mb-4">الحالة الصحية (مهم جداً)</h3>
                  
                  <div>
                    <label className="text-sm font-medium text-text-2 mb-2 block">هل تعاني من أي إصابات؟ (ركبة، ظهر، كتف...)</label>
                    <div className="flex gap-2 mb-3">
                      <button onClick={() => setFormData({...formData, hasInjuries: false})} className={cn("flex-1 py-2 rounded-[var(--radius-md)] border text-sm transition-all", formData.hasInjuries === false ? "bg-success/10 border-success text-success" : "bg-surface-high border-border text-text-2 hover:border-accent/30")}>لا</button>
                      <button onClick={() => setFormData({...formData, hasInjuries: true})} className={cn("flex-1 py-2 rounded-[var(--radius-md)] border text-sm transition-all", formData.hasInjuries === true ? "bg-danger/10 border-danger text-danger" : "bg-surface-high border-border text-text-2 hover:border-accent/30")}>نعم</button>
                    </div>
                    {formData.hasInjuries && (
                      <textarea value={formData.injuriesDetails} onChange={(e) => setFormData({...formData, injuriesDetails: e.target.value})} placeholder="برجاء توضيح الإصابة ومتى حدثت..." className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 min-h-[80px]" />
                    )}
                  </div>
 
                  <div>
                    <label className="text-sm font-medium text-text-2 mb-2 block">هل تعاني من أي أمراض مزمنة؟ (ضغط، سكر، قلب...)</label>
                    <div className="flex gap-2 mb-3">
                      <button onClick={() => setFormData({...formData, hasDiseases: false})} className={cn("flex-1 py-2 rounded-[var(--radius-md)] border text-sm transition-all", formData.hasDiseases === false ? "bg-success/10 border-success text-success" : "bg-surface-high border-border text-text-2 hover:border-accent/30")}>لا</button>
                      <button onClick={() => setFormData({...formData, hasDiseases: true})} className={cn("flex-1 py-2 rounded-[var(--radius-md)] border text-sm transition-all", formData.hasDiseases === true ? "bg-danger/10 border-danger text-danger" : "bg-surface-high border-border text-text-2 hover:border-accent/30")}>نعم</button>
                    </div>
                    {formData.hasDiseases && (
                      <textarea value={formData.diseasesDetails} onChange={(e) => setFormData({...formData, diseasesDetails: e.target.value})} placeholder="برجاء توضيح الحالة بالتفصيل..." className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 min-h-[80px]" />
                    )}
                  </div>
 
                  {submitError && (
                    <div className="bg-danger/10 border border-danger/20 rounded-[var(--radius-md)] px-4 py-3 text-sm text-danger mt-3 text-start">
                      {submitError}
                    </div>
                  )}
                  <div className="flex gap-3 mt-6">
                    <Button variant="ghost" onClick={handleBack} disabled={loading}>رجوع</Button>
                    <Button className="flex-1" onClick={handleSubmit} disabled={loading || formData.hasInjuries === null || (formData.hasInjuries && !formData.injuriesDetails) || formData.hasDiseases === null || (formData.hasDiseases && !formData.diseasesDetails)}>
                      {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}

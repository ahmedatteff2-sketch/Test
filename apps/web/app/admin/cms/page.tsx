"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getApiBase } from "@/lib/config";

type Section =
  | "hero"
  | "stats"
  | "about"
  | "features"
  | "how_it_works"
  | "transformations"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta";

const sectionLabels: Record<Section, string> = {
  hero: "الواجهة الرئيسية",
  stats: "الأرقام والإحصائيات",
  about: "من هو الكوتش",
  features: "المميزات",
  how_it_works: "خطوات الوصول لهدفك",
  transformations: "النتائج والتحولات",
  testimonials: "قالوا عنا (التقييمات)",
  pricing: "الباقات والأسعار",
  faq: "الأسئلة الشائعة",
  cta: "دعوة للتسجيل (CTA)",
};

interface FeatureItem {
  number: string;
  title: string;
  description: string;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface StepItem {
  num: string;
  title: string;
  desc: string;
  icon: string;
}

interface TestimonialItem {
  id: number;
  name: string;
  result: string;
  text: string;
  rating: number;
  avatar: string;
}

interface PlanItem {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function CMSPage() {
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // --- States for each section ---

  // 1. Hero
  const [heroData, setHeroData] = useState({
    headline: "ابدأ رحلتك\nلتحقيق هدفك",
    subheadline: "برامج تدريبية وتغذية مخصصة 100% لتصل لشكل الجسم المثالي",
    ctaText: "اشترك الآن",
    metric1Value: "+2,400",
    metric1Label: "مشترك",
    metric2Value: "98%",
    metric2Label: "نسبة الالتزام",
    metric3Value: "4.9★",
    metric3Label: "تقييم المشتركين",
  });

  // 2. Stats
  const [statsData, setStatsData] = useState<{ items: StatItem[] }>({
    items: [
      { value: 2400, suffix: "+", label: "عميل سعيد" },
      { value: 98, suffix: "%", label: "نسبة الرضا" },
      { value: 15, suffix: "+", label: "سنة خبرة" },
      { value: 50, suffix: "K+", label: "تمرين مسجل" },
    ],
  });
  const [selectedStatIdx, setSelectedStatIdx] = useState(0);

  // 3. About Coach
  const [aboutData, setAboutData] = useState({
    title: "مين هو الكوتش؟",
    paragraph1: "خبرة أكتر من 10 سنين في مجال الفيتنس والتغذية. ساعدت مئات الأشخاص إنهم يغيروا شكل جسمهم وحياتهم بالكامل من خلال خطط علمية مبنية على أحدث الأبحاث.",
    paragraph2: "مبدأنا هنا مش بس \"دايت قاسي\" أو \"تمرين يهلكك\"، مبدأنا هو الاستمرارية. هعلمك إزاي تفهم جسمك، تاكل اللي بتحبه ضمن احتياجك، وتتطور في أوزانك بأمان.",
    stat1Value: "10+",
    stat1Label: "سنين خبرة",
    stat2Value: "500+",
    stat2Label: "تحول ناجح",
    stat3Value: "99%",
    stat3Label: "نسبة الرضا",
    stat4Value: "24/7",
    stat4Label: "دعم ومتابعة",
  });

  // 4. Features
  const [featuresData, setFeaturesData] = useState<FeatureItem[]>([
    {
      number: "01",
      title: "خطط تدريب مخصصة",
      description: "برامج تدريبية مصممة خصيصاً لمستوى لياقتك البدنية وأهدافك، سواء كنت مبتدئاً أو متقدماً.",
    },
    {
      number: "02",
      title: "نظام غذائي مرن",
      description: "حساب السعرات والماكروز بما يتناسب مع أكلاتك المفضلة وسهل الالتزام به.",
    },
    {
      number: "03",
      title: "متابعة يومية مستمرة",
      description: "متابعة تطور الأوزان والقياسات والرد على استفساراتك بشكل مستمر لتضمن الوصول لهدفك.",
    },
    {
      number: "04",
      title: "تقييم أداء التمارين",
      description: "تعديل طريقة أدائك للتمارين عبر مراجعة الفيديوهات لضمان السلامة والفعالية.",
    },
    {
      number: "05",
      title: "دعم مجتمعي وحافز",
      description: "تواصل مع مجتمع المشتركين لتبادل الخبرات والتحفيز المستمر.",
    },
    {
      number: "06",
      title: "تحديثات دورية للمستويات",
      description: "تعديل مستمر للخطط والبرامج بناءً على تطور جسمك واستجابتك للمستويات.",
    },
  ]);
  const [selectedFeatureIdx, setSelectedFeatureIdx] = useState(0);

  // 5. How It Works
  const [howItWorksData, setHowItWorksData] = useState<{ title: string; description: string; items: StepItem[] }>({
    title: "إزاي بنوصلك لهدفك؟",
    description: "خطوات بسيطة وواضحة، هنكون معاك خطوة بخطوة.",
    items: [
      { num: "01", title: "الاستبيان الأولي", desc: "هتملا فورم تفصيلي عن حالتك، هدفك، تاريخك المرضي، والأكل اللي بتحبه.", icon: "📋" },
      { num: "02", title: "تصميم الخطة", desc: "الكوتش هيصمم لك جدول تمرين ونظام غذائي مخصصين 100% لجسمك وهدفك.", icon: "🎯" },
      { num: "03", title: "بدأ الرحلة", desc: "هتدخل على المنصة بتاعتنا، هتلاقي كل حاجة واضحة وبالفيديوهات والشرح.", icon: "🚀" },
      { num: "04", title: "المتابعة والتطور", desc: "تشيكن يومي أو أسبوعي حسب باقتك، وتعديلات مستمرة عشان نضمن النتيجة.", icon: "📈" },
    ],
  });
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);

  // 6. Transformations
  const [transformationsData, setTransformationsData] = useState({
    title: "نتائج أبطال إيجل",
    description: "قصص نجاح واقعية ومؤثرة تظهر مدى التزام المشتركين بتعليمات الكوتش والوصول للجسم المثالي.",
    featuredName: "عمر خالد",
    featuredTitle: "من 120 كيلوغرام إلى 85 كيلوغرام في 6 أشهر",
    featuredDescription: "التزام كامل ومتابعة مستمرة أدت إلى خسارة الدهون وبناء الكتلة العضلية وتحسين الصحة العامة بشكل ملحوظ.",
  });

  // 7. Testimonials
  const [testimonialsData, setTestimonialsData] = useState<{ title: string; description: string; items: TestimonialItem[] }>({
    title: "قصص نجاح تصنع الفارق",
    description: "آراء بعض المشتركين في رحلتهم لتغيير شكل أجسامهم وحياتهم مع نظام التدريب والمتابعة المتكامل.",
    items: [
      { id: 1, name: "أحمد عبد الله", result: "خسرت 22 كجم في 4 شهور", text: "التجربة مع الكوتش غيرت حياتي تماماً. نظام الدايت مرن وسهل الالتزام بيه، والتمرين كان متفصل على حجم وقتي ومستوايا الصعب في الشغل.", rating: 5, avatar: "أ" },
      { id: 2, name: "سارة محمود", result: "بناء عضل وتقليل دهون (Recomp)", text: "مكنتش متخيلة إن البنت تقدر تبني عضل من غير ما تضخم بشكل مش حلو. المتابعة وتعديل التمارين والوجبات خلاني أوصل لجسم أحلامي وصحتي بقت أحسن بكتير.", rating: 5, avatar: "س" },
      { id: 3, name: "مصطفى كريم", result: "زيادة 12 كجم كتلة عضلية", text: "أفضل استثمار عملته في صحتي وجسمي. المتابعة اليومية والاهتمام بالتفاصيل وحل مشاكل إصابة الكتف اللي كانت عندي خلاني أتمرن بأوزان أثقل وأنا مطمن.", rating: 5, avatar: "م" },
      { id: 4, name: "حسام الجيار", result: "تنشيف وظهور العضلات في 12 أسبوع", text: "الكوتش بيتابع كل تفصيلة حتى جودة النوم والضغط والمياه. المتابعة الأسبوعية بالصور والوزن وتحديث الجدول خلتني دايماً ملتزم وفي قمة الحماس.", rating: 5, avatar: "ح" },
    ],
  });
  const [selectedTestimonialIdx, setSelectedTestimonialIdx] = useState(0);

  // 8. Pricing
  const [pricingData, setPricingData] = useState<{ title: string; description: string; items: PlanItem[] }>({
    title: "استثمر في صحتك",
    description: "اختار الباقة اللي تناسب هدفك وميزانيتك.",
    items: [
      { name: "الباقة الأساسية", price: "1500", period: "شهرياً", description: "مثالية للمبتدئين اللي محتاجين توجيه.", features: ["جدول تمرين مخصص", "نظام غذائي محسوب", "تشيكن أسبوعي", "تعديل النظام مرة شهرياً"], highlighted: false },
      { name: "باقة النخبة (VIP)", price: "3500", period: "شهرياً", description: "للي عايز أفضل نتيجة في أسرع وقت مع متابعة لصيقة.", features: ["كل مميزات الباقة الأساسية", "تشيكن يومي (24/7 دعم)", "تحليل فيديوهات التمرين", "تعديلات لا نهائية على النظام", "مكملات غذائية مخصصة"], highlighted: true },
      { name: "باقة الـ 3 شهور", price: "4000", period: "3 شهور", description: "التزام طويل المدى بسعر أوفر.", features: ["نفس مميزات الباقة الأساسية", "خصم 15%", "تتبع التطور على المدى الطويل", "مكالمة زوم شهرية مع الكوتش"], highlighted: false },
    ],
  });
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);

  // 9. FAQ
  const [faqData, setFaqData] = useState<{ title: string; description: string; items: FAQItem[] }>({
    title: "الأسئلة الشائعة",
    description: "كل ما يدور في ذهنك عن البرنامج ونظام التدريب والمتابعة اليومية وإجاباتها بالتفصيل.",
    items: [
      { question: "هل نظام التغذية بيعتمد على الحرمان؟", answer: "لا طبعاً! نظام التغذية مرن وبيعتمد على حساب السعرات والماكروز (البروتين، الكارب، الدهون). بنوفرلك وجبات لذيذة وصحية من اختيارك، وتقدر تاكل أكل البيت العادي أو الأكل اللي بتحبه طالما في حدود سعراتك اليومية وهدفك." },
      { question: "هل أحتاج مكملات غذائية عشان أعمل نتيجة؟", answer: "المكملات هي 'عامل مكمل' للدايت وليست أساسية. الأساس هو الأكل الطبيعي المتوازن. إذا كنت محتاج مكملات معينة بناءً على فحص أو نقص معين، الكوتش هيرشحلك المناسب، لكن تقدر تعمل نتيجة خرافية 100% بدون أي مكملات." },
      { question: "أنا مبتدئ تماماً، هل البرنامج مناسب ليا؟", answer: "البرنامج مثالي للمبتدئين. بنصمم الخطة التدريبية خطوة بخطوة، وبنوفرلك شرح فيديو لكل تمرين عشان تعرف التكنيك الصحيح وتتفادى الإصابات. الكوتش كمان بيراجع فيديوهات تمرينك اللي بتبعتها عشان يصححلك الأداء أول بأول." },
      { question: "كيف بتتم المتابعة اليومية مع الكوتش؟", answer: "المتابعة بتتم يومياً من خلال شات المنصة، وبشكل تفصيلي من خلال 'التشيكن' اليومي اللي بتسجل فيه التزامك بالدايت والتمرين والمياه والنوم. أسبوعياً بيتم مراجعة الوزن والقياسات وصور التطور وبناءً عليها بنعدل الجداول لو محتاجة تغيير." },
      { question: "هل ينفع أتمرن في البيت لو مش متاح جيم؟", answer: "طبعاً! بنفصلك برنامج تمارين منزلية حسب الأدوات المتاحة عندك (سواء بوزن الجسم، أو أستيك المقاومة، أو دمبلز خفيفة) وبنضمنلك تحقق أقصى استفادة وجسم مثالي." },
      { question: "إيه اللي بيحصل لو وزني ثبت أو بطلت أحقق نتايج؟", answer: "هنا بييجي دور المتابعة الذكية؛ الكوتش بيحلل بياناتك الأسبوعية واليومية وبيحدد سبب الثبات (سواء قلة نوم، احتباس سوائل، أو تكيف الأيض)، وبنعدل السعرات أو التمارين فوراً لكسر الثبات والاستمرار في التطور." },
    ],
  });
  const [selectedFaqIdx, setSelectedFaqIdx] = useState(0);

  // 10. CTA
  const [ctaData, setCtaData] = useState({
    badgeText: "أماكن متاحة الآن",
    title: "جاهز تبدأ رحلة التحول؟",
    description: "الخطوة الأولى هي الأصعب — بعدها كل حاجة بتبقى أسهل. سجّل دلوقتي واحصل على استشارة مجانية.",
    ctaText: "سجّل الآن — مجاناً",
    secondaryText: "تواصل معنا",
    features: ["✓ بدون التزام", "✓ استشارة مجانية", "✓ خطة مخصصة"],
  });

  // --- Load Content on tab change ---
  useEffect(() => {
    async function loadContent() {
      // 1. Try loading from localStorage first
      const localData = localStorage.getItem(`cms_${activeSection}`);
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (activeSection === "hero") setHeroData(parsed);
          else if (activeSection === "stats") setStatsData(parsed);
          else if (activeSection === "about") setAboutData(parsed);
          else if (activeSection === "features") setFeaturesData(parsed);
          else if (activeSection === "how_it_works") setHowItWorksData(parsed);
          else if (activeSection === "transformations") setTransformationsData(parsed);
          else if (activeSection === "testimonials") setTestimonialsData(parsed);
          else if (activeSection === "pricing") setPricingData(parsed);
          else if (activeSection === "faq") setFaqData(parsed);
          else if (activeSection === "cta") setCtaData(parsed);
        } catch (e) {
          console.error("Error parsing local content", e);
        }
      }

      // 2. Try fetching from the Go API
      try {
        const res = await fetch(`${getApiBase()}/site-content/${activeSection}`);
        if (res.ok) {
          const resJson = await res.json();
          const payload = resJson.data || resJson;
          if (payload) {
            if (activeSection === "hero") setHeroData(payload);
            else if (activeSection === "stats") setStatsData(payload);
            else if (activeSection === "about") setAboutData(payload);
            else if (activeSection === "features") {
              const items = payload.items || payload;
              if (Array.isArray(items)) setFeaturesData(items);
            }
            else if (activeSection === "how_it_works") setHowItWorksData(payload);
            else if (activeSection === "transformations") setTransformationsData(payload);
            else if (activeSection === "testimonials") setTestimonialsData(payload);
            else if (activeSection === "pricing") setPricingData(payload);
            else if (activeSection === "faq") setFaqData(payload);
            else if (activeSection === "cta") setCtaData(payload);
          }
        }
      } catch (err) {
        console.warn("Backend not running or offline; using local data fallback.");
      }
    }
    loadContent();
  }, [activeSection]);

  // --- Handle Save ---
  async function handleSave() {
    setSaving(true);
    let dataToSave: any = null;

    if (activeSection === "hero") dataToSave = heroData;
    else if (activeSection === "stats") dataToSave = statsData;
    else if (activeSection === "about") dataToSave = aboutData;
    else if (activeSection === "features") dataToSave = featuresData;
    else if (activeSection === "how_it_works") dataToSave = howItWorksData;
    else if (activeSection === "transformations") dataToSave = transformationsData;
    else if (activeSection === "testimonials") dataToSave = testimonialsData;
    else if (activeSection === "pricing") dataToSave = pricingData;
    else if (activeSection === "faq") dataToSave = faqData;
    else if (activeSection === "cta") dataToSave = ctaData;

    // Save to localStorage for instant client updates
    localStorage.setItem(`cms_${activeSection}`, JSON.stringify(dataToSave));

    // Normalize for API structures
    let apiPayload = dataToSave;
    if (activeSection === "features") {
      apiPayload = { visible: true, items: featuresData };
    }

    // Save to Go Backend API
    try {
      await fetch(`${getApiBase()}/site-content/${activeSection}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
    } catch (err) {
      console.error("Failed to sync with API server:", err);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // --- Helpers to update specific indices ---
  function updateStat(idx: number, fields: Partial<StatItem>) {
    const items = [...statsData.items];
    items[idx] = { ...items[idx], ...fields };
    setStatsData({ ...statsData, items });
  }

  function updateFeature(idx: number, fields: Partial<FeatureItem>) {
    const updated = [...featuresData];
    updated[idx] = { ...updated[idx], ...fields };
    setFeaturesData(updated);
  }

  function updateStep(idx: number, fields: Partial<StepItem>) {
    const items = [...howItWorksData.items];
    items[idx] = { ...items[idx], ...fields };
    setHowItWorksData({ ...howItWorksData, items });
  }

  function updateTestimonial(idx: number, fields: Partial<TestimonialItem>) {
    const items = [...testimonialsData.items];
    items[idx] = { ...items[idx], ...fields };
    setTestimonialsData({ ...testimonialsData, items });
  }

  function updatePlan(idx: number, fields: Partial<PlanItem>) {
    const items = [...pricingData.items];
    items[idx] = { ...items[idx], ...fields };
    setPricingData({ ...pricingData, items });
  }

  function updatePlanFeature(planIdx: number, featIdx: number, text: string) {
    const items = [...pricingData.items];
    const features = [...items[planIdx].features];
    features[featIdx] = text;
    items[planIdx] = { ...items[planIdx], features };
    setPricingData({ ...pricingData, items });
  }

  function updateFaq(idx: number, fields: Partial<FAQItem>) {
    const items = [...faqData.items];
    items[idx] = { ...items[idx], ...fields };
    setFaqData({ ...faqData, items });
  }

  function updateCtaFeature(idx: number, text: string) {
    const features = [...ctaData.features];
    features[idx] = text;
    setCtaData({ ...ctaData, features });
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-1">التحكم في المحتوى</h1>
          <p className="text-text-2 text-sm mt-1">قم بتحديث جميع نصوص ومحتويات صفحات الموقع فوراً بنظام المعاينة الحية</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-success text-sm font-semibold"
            >
              ✓ تم الحفظ بنجاح
            </motion.span>
          )}
          <Button onClick={handleSave} isLoading={saving} className="bg-accent text-bg hover:bg-accent/90 px-6 font-bold">
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full">
        {(Object.keys(sectionLabels) as Section[]).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={cn(
              "px-4 py-2 rounded-[var(--radius-md)] text-xs font-bold transition-all shrink-0 cursor-pointer",
              activeSection === section
                ? "bg-accent text-bg"
                : "bg-surface-high text-text-2 hover:text-text-1"
            )}
          >
            {sectionLabels[section]}
          </button>
        ))}
      </div>

      {/* Grid container: Editor Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Editor (7 columns on large screens) */}
        <Card className="lg:col-span-6 p-6 overflow-y-auto max-h-[750px] custom-scrollbar space-y-6">
          <h3 className="font-semibold text-text-1 text-base flex items-center gap-2 border-b border-border/40 pb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            تعديل قسم {sectionLabels[activeSection]}
          </h3>

          {/* 1. HERO EDITOR */}
          {activeSection === "hero" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-2 mb-2 block">العنوان الرئيسي</label>
                <textarea
                  value={heroData.headline}
                  onChange={(e) => setHeroData({ ...heroData, headline: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                />
              </div>
              <Input
                label="العنوان الفرعي"
                value={heroData.subheadline}
                onChange={(e) => setHeroData({ ...heroData, subheadline: e.target.value })}
              />
              <Input
                label="نص زر الانتقال"
                value={heroData.ctaText}
                onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
              />
              <div className="border-t border-border/40 pt-4 mt-6">
                <h4 className="text-sm font-semibold text-text-1 mb-4">الأرقام السريعة للهيرو</h4>
                <div className="space-y-4">
                  {[
                    { label: "رقم 1", val: "metric1Value" as const, lbl: "metric1Label" as const },
                    { label: "رقم 2", val: "metric2Value" as const, lbl: "metric2Label" as const },
                    { label: "رقم 3", val: "metric3Value" as const, lbl: "metric3Label" as const },
                  ].map((m) => (
                    <div key={m.label} className="grid grid-cols-2 gap-3 border-b border-border/20 pb-3 last:border-0 last:pb-0">
                      <Input
                        label={`${m.label} (الرقم/القيمة)`}
                        value={heroData[m.val]}
                        onChange={(e) => setHeroData({ ...heroData, [m.val]: e.target.value })}
                      />
                      <Input
                        label={`${m.label} (الوصف)`}
                        value={heroData[m.lbl]}
                        onChange={(e) => setHeroData({ ...heroData, [m.lbl]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. STATS EDITOR */}
          {activeSection === "stats" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-text-3 mb-2 block uppercase tracking-wider">اختر الإحصائية المراد تعديلها</label>
                <div className="grid grid-cols-4 gap-2">
                  {statsData.items.map((stat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedStatIdx(idx)}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all truncate",
                        selectedStatIdx === idx
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-surface border-border hover:bg-surface-high text-text-2"
                      )}
                    >
                      {stat.value}{stat.suffix}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-high/30 border border-border/40 space-y-4">
                <h4 className="text-sm font-bold text-accent">تعديل الإحصائية رقم {selectedStatIdx + 1}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="القيمة الرقمية"
                    type="number"
                    value={statsData.items[selectedStatIdx]?.value || 0}
                    onChange={(e) => updateStat(selectedStatIdx, { value: parseInt(e.target.value) || 0 })}
                  />
                  <Input
                    label="اللاحقة (مثال: + أو %)"
                    value={statsData.items[selectedStatIdx]?.suffix || ""}
                    onChange={(e) => updateStat(selectedStatIdx, { suffix: e.target.value })}
                  />
                </div>
                <Input
                  label="الوصف (اسم الإحصائية)"
                  value={statsData.items[selectedStatIdx]?.label || ""}
                  onChange={(e) => updateStat(selectedStatIdx, { label: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* 3. ABOUT EDITOR */}
          {activeSection === "about" && (
            <div className="space-y-4">
              <Input
                label="عنوان القسم"
                value={aboutData.title}
                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              />
              <div>
                <label className="text-sm font-medium text-text-2 mb-2 block">الفقرة الأولى (عن الخبرة)</label>
                <textarea
                  value={aboutData.paragraph1}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph1: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 mb-2 block">الفقرة الثانية (عن الفلسفة والدايت)</label>
                <textarea
                  value={aboutData.paragraph2}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph2: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                />
              </div>

              <div className="border-t border-border/40 pt-4 mt-6">
                <h4 className="text-sm font-semibold text-text-1 mb-4">بطاقات الخبرة (أرقام صغيرة)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border/20 p-3 rounded-lg">
                    <Input label="سنة خبرة (رقم)" value={aboutData.stat1Value} onChange={(e) => setAboutData({ ...aboutData, stat1Value: e.target.value })} />
                    <Input label="سنة خبرة (نص)" value={aboutData.stat1Label} onChange={(e) => setAboutData({ ...aboutData, stat1Label: e.target.value })} />
                  </div>
                  <div className="border border-border/20 p-3 rounded-lg">
                    <Input label="عميل متحول (رقم)" value={aboutData.stat2Value} onChange={(e) => setAboutData({ ...aboutData, stat2Value: e.target.value })} />
                    <Input label="عميل متحول (نص)" value={aboutData.stat2Label} onChange={(e) => setAboutData({ ...aboutData, stat2Label: e.target.value })} />
                  </div>
                  <div className="border border-border/20 p-3 rounded-lg">
                    <Input label="نسبة الرضا (رقم)" value={aboutData.stat3Value} onChange={(e) => setAboutData({ ...aboutData, stat3Value: e.target.value })} />
                    <Input label="نسبة الرضا (نص)" value={aboutData.stat3Label} onChange={(e) => setAboutData({ ...aboutData, stat3Label: e.target.value })} />
                  </div>
                  <div className="border border-border/20 p-3 rounded-lg">
                    <Input label="الدعم (رقم)" value={aboutData.stat4Value} onChange={(e) => setAboutData({ ...aboutData, stat4Value: e.target.value })} />
                    <Input label="الدعم (نص)" value={aboutData.stat4Label} onChange={(e) => setAboutData({ ...aboutData, stat4Label: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. FEATURES EDITOR */}
          {activeSection === "features" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-text-3 mb-2 block uppercase tracking-wider">اختر الميزة لتعديلها</label>
                <div className="grid grid-cols-3 gap-2">
                  {featuresData.map((feat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFeatureIdx(idx)}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all truncate",
                        selectedFeatureIdx === idx
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-surface border-border hover:bg-surface-high text-text-2"
                      )}
                    >
                      {feat.number} - {feat.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-high/30 border border-border/40 space-y-4">
                <h4 className="text-sm font-bold text-accent">تعديل الميزة رقم {featuresData[selectedFeatureIdx]?.number}</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <Input
                      label="الرقم"
                      value={featuresData[selectedFeatureIdx]?.number || ""}
                      onChange={(e) => updateFeature(selectedFeatureIdx, { number: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      label="العنوان"
                      value={featuresData[selectedFeatureIdx]?.title || ""}
                      onChange={(e) => updateFeature(selectedFeatureIdx, { title: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 mb-2 block">الوصف والتفاصيل</label>
                  <textarea
                    value={featuresData[selectedFeatureIdx]?.description || ""}
                    onChange={(e) => updateFeature(selectedFeatureIdx, { description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. HOW IT WORKS EDITOR */}
          {activeSection === "how_it_works" && (
            <div className="space-y-6">
              <Input
                label="العنوان الرئيسي"
                value={howItWorksData.title}
                onChange={(e) => setHowItWorksData({ ...howItWorksData, title: e.target.value })}
              />
              <Input
                label="العنوان الفرعي"
                value={howItWorksData.description}
                onChange={(e) => setHowItWorksData({ ...howItWorksData, description: e.target.value })}
              />

              <div>
                <label className="text-xs font-semibold text-text-3 mb-2 block uppercase tracking-wider">اختر الخطوة لتعديلها</label>
                <div className="grid grid-cols-4 gap-2">
                  {howItWorksData.items.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedStepIdx(idx)}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all truncate",
                        selectedStepIdx === idx
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-surface border-border hover:bg-surface-high text-text-2"
                      )}
                    >
                      {step.num} - {step.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-high/30 border border-border/40 space-y-4">
                <h4 className="text-sm font-bold text-accent">تعديل الخطوة رقم {howItWorksData.items[selectedStepIdx]?.num}</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <Input
                      label="الترتيب"
                      value={howItWorksData.items[selectedStepIdx]?.num || ""}
                      onChange={(e) => updateStep(selectedStepIdx, { num: e.target.value })}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      label="أيقونة/إيموجي"
                      value={howItWorksData.items[selectedStepIdx]?.icon || ""}
                      onChange={(e) => updateStep(selectedStepIdx, { icon: e.target.value })}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      label="العنوان"
                      value={howItWorksData.items[selectedStepIdx]?.title || ""}
                      onChange={(e) => updateStep(selectedStepIdx, { title: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 mb-2 block">الوصف</label>
                  <textarea
                    value={howItWorksData.items[selectedStepIdx]?.desc || ""}
                    onChange={(e) => updateStep(selectedStepIdx, { desc: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. TRANSFORMATIONS EDITOR */}
          {activeSection === "transformations" && (
            <div className="space-y-4">
              <Input
                label="عنوان القسم"
                value={transformationsData.title}
                onChange={(e) => setTransformationsData({ ...transformationsData, title: e.target.value })}
              />
              <div>
                <label className="text-sm font-medium text-text-2 mb-2 block">وصف القسم</label>
                <textarea
                  value={transformationsData.description}
                  onChange={(e) => setTransformationsData({ ...transformationsData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                />
              </div>

              <div className="border-t border-border/40 pt-4 mt-6 space-y-4">
                <h4 className="text-sm font-semibold text-text-1 mb-2">التحول الأول (البطل المميز)</h4>
                <Input
                  label="اسم البطل"
                  value={transformationsData.featuredName}
                  onChange={(e) => setTransformationsData({ ...transformationsData, featuredName: e.target.value })}
                />
                <Input
                  label="العنوان الفرعي للتحول"
                  value={transformationsData.featuredTitle}
                  onChange={(e) => setTransformationsData({ ...transformationsData, featuredTitle: e.target.value })}
                />
                <div>
                  <label className="text-sm font-medium text-text-2 mb-2 block">تفاصيل أو مقولة البطل</label>
                  <textarea
                    value={transformationsData.featuredDescription}
                    onChange={(e) => setTransformationsData({ ...transformationsData, featuredDescription: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. TESTIMONIALS EDITOR */}
          {activeSection === "testimonials" && (
            <div className="space-y-6">
              <Input
                label="عنوان قسم التقييمات"
                value={testimonialsData.title}
                onChange={(e) => setTestimonialsData({ ...testimonialsData, title: e.target.value })}
              />
              <Input
                label="الوصف العام"
                value={testimonialsData.description}
                onChange={(e) => setTestimonialsData({ ...testimonialsData, description: e.target.value })}
              />

              <div>
                <label className="text-xs font-semibold text-text-3 mb-2 block uppercase tracking-wider">اختر التقييم لتعديله</label>
                <div className="grid grid-cols-4 gap-2">
                  {testimonialsData.items.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTestimonialIdx(idx)}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all truncate",
                        selectedTestimonialIdx === idx
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-surface border-border hover:bg-surface-high text-text-2"
                      )}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-high/30 border border-border/40 space-y-4">
                <h4 className="text-sm font-bold text-accent">تعديل تقييم المشترك: {testimonialsData.items[selectedTestimonialIdx]?.name}</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="الاسم"
                    value={testimonialsData.items[selectedTestimonialIdx]?.name || ""}
                    onChange={(e) => updateTestimonial(selectedTestimonialIdx, { name: e.target.value })}
                  />
                  <Input
                    label="الحرف الأول (للأفاتار)"
                    value={testimonialsData.items[selectedTestimonialIdx]?.avatar || ""}
                    onChange={(e) => updateTestimonial(selectedTestimonialIdx, { avatar: e.target.value })}
                  />
                  <Input
                    label="التقييم بالنجوم (1-5)"
                    type="number"
                    value={testimonialsData.items[selectedTestimonialIdx]?.rating || 5}
                    onChange={(e) => updateTestimonial(selectedTestimonialIdx, { rating: parseInt(e.target.value) || 5 })}
                  />
                </div>
                <Input
                  label="النتيجة المحققة"
                  value={testimonialsData.items[selectedTestimonialIdx]?.result || ""}
                  onChange={(e) => updateTestimonial(selectedTestimonialIdx, { result: e.target.value })}
                />
                <div>
                  <label className="text-sm font-medium text-text-2 mb-2 block">التعليق/التجربة بالتفصيل</label>
                  <textarea
                    value={testimonialsData.items[selectedTestimonialIdx]?.text || ""}
                    onChange={(e) => updateTestimonial(selectedTestimonialIdx, { text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 8. PRICING EDITOR */}
          {activeSection === "pricing" && (
            <div className="space-y-6">
              <Input
                label="عنوان قسم الأسعار"
                value={pricingData.title}
                onChange={(e) => setPricingData({ ...pricingData, title: e.target.value })}
              />
              <Input
                label="الوصف الفرعي"
                value={pricingData.description}
                onChange={(e) => setPricingData({ ...pricingData, description: e.target.value })}
              />

              <div>
                <label className="text-xs font-semibold text-text-3 mb-2 block uppercase tracking-wider">اختر الباقة لتعديلها</label>
                <div className="grid grid-cols-3 gap-2">
                  {pricingData.items.map((plan, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPlanIdx(idx)}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all truncate",
                        selectedPlanIdx === idx
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-surface border-border hover:bg-surface-high text-text-2"
                      )}
                    >
                      {plan.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-high/30 border border-border/40 space-y-4">
                <h4 className="text-sm font-bold text-accent">تعديل: {pricingData.items[selectedPlanIdx]?.name}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="اسم الباقة"
                    value={pricingData.items[selectedPlanIdx]?.name || ""}
                    onChange={(e) => updatePlan(selectedPlanIdx, { name: e.target.value })}
                  />
                  <Input
                    label="السعر (ج.م)"
                    value={pricingData.items[selectedPlanIdx]?.price || ""}
                    onChange={(e) => updatePlan(selectedPlanIdx, { price: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="المدة الزمنية (مثال: شهرياً أو 3 شهور)"
                    value={pricingData.items[selectedPlanIdx]?.period || ""}
                    onChange={(e) => updatePlan(selectedPlanIdx, { period: e.target.value })}
                  />
                  <div className="flex flex-col justify-end pb-2">
                    <label className="flex items-center gap-2 text-sm text-text-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pricingData.items[selectedPlanIdx]?.highlighted || false}
                        onChange={(e) => updatePlan(selectedPlanIdx, { highlighted: e.target.checked })}
                        className="rounded border-border text-accent focus:ring-accent bg-surface"
                      />
                      باقة مميزة/أكثر طلباً
                    </label>
                  </div>
                </div>
                <Input
                  label="الوصف الموجز"
                  value={pricingData.items[selectedPlanIdx]?.description || ""}
                  onChange={(e) => updatePlan(selectedPlanIdx, { description: e.target.value })}
                />

                <div className="border-t border-border/20 pt-4">
                  <label className="text-xs font-bold text-text-2 mb-2 block">مميزات الباقة (Features)</label>
                  <div className="space-y-2">
                    {pricingData.items[selectedPlanIdx]?.features.map((feature, fIdx) => (
                      <Input
                        key={fIdx}
                        placeholder={`الميزة رقم ${fIdx + 1}`}
                        value={feature}
                        onChange={(e) => updatePlanFeature(selectedPlanIdx, fIdx, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. FAQ EDITOR */}
          {activeSection === "faq" && (
            <div className="space-y-6">
              <Input
                label="العنوان العام للأسئلة الشائعة"
                value={faqData.title}
                onChange={(e) => setFaqData({ ...faqData, title: e.target.value })}
              />
              <Input
                label="الوصف الفرعي"
                value={faqData.description}
                onChange={(e) => setFaqData({ ...faqData, description: e.target.value })}
              />

              <div>
                <label className="text-xs font-semibold text-text-3 mb-2 block uppercase tracking-wider">اختر السؤال المراد تعديله</label>
                <div className="grid grid-cols-2 gap-2">
                  {faqData.items.map((faq, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFaqIdx(idx)}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all truncate text-start",
                        selectedFaqIdx === idx
                          ? "bg-accent/10 border-accent text-accent"
                          : "bg-surface border-border hover:bg-surface-high text-text-2"
                      )}
                    >
                      {idx + 1}. {faq.question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-high/30 border border-border/40 space-y-4">
                <h4 className="text-sm font-bold text-accent">تعديل السؤال الشائع رقم {selectedFaqIdx + 1}</h4>
                <Input
                  label="السؤال"
                  value={faqData.items[selectedFaqIdx]?.question || ""}
                  onChange={(e) => updateFaq(selectedFaqIdx, { question: e.target.value })}
                />
                <div>
                  <label className="text-sm font-medium text-text-2 mb-2 block">الإجابة</label>
                  <textarea
                    value={faqData.items[selectedFaqIdx]?.answer || ""}
                    onChange={(e) => updateFaq(selectedFaqIdx, { answer: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 10. CTA EDITOR */}
          {activeSection === "cta" && (
            <div className="space-y-4">
              <Input
                label="الملصق العلوي الصغير (Badge)"
                value={ctaData.badgeText}
                onChange={(e) => setCtaData({ ...ctaData, badgeText: e.target.value })}
              />
              <Input
                label="العنوان الرئيسي"
                value={ctaData.title}
                onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })}
              />
              <div>
                <label className="text-sm font-medium text-text-2 mb-2 block">الوصف وتفاصيل الحافز</label>
                <textarea
                  value={ctaData.description}
                  onChange={(e) => setCtaData({ ...ctaData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-surface border border-border text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="نص الزر الأساسي"
                  value={ctaData.ctaText}
                  onChange={(e) => setCtaData({ ...ctaData, ctaText: e.target.value })}
                />
                <Input
                  label="نص الزر الثانوي"
                  value={ctaData.secondaryText}
                  onChange={(e) => setCtaData({ ...ctaData, secondaryText: e.target.value })}
                />
              </div>

              <div className="border-t border-border/40 pt-4 mt-6">
                <label className="text-xs font-bold text-text-2 mb-3 block">شروط الضمان السريعة (3 نصوص)</label>
                <div className="space-y-2">
                  {ctaData.features.map((feat, idx) => (
                    <Input
                      key={idx}
                      placeholder={`الشرط رقم ${idx + 1}`}
                      value={feat}
                      onChange={(e) => updateCtaFeature(idx, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Live Preview (6 columns) */}
        <Card className="lg:col-span-6 overflow-hidden p-0 flex flex-col h-[750px] bg-bg relative">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface-high/30 z-10">
            <span className="text-xs text-text-3 flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              معاينة حية ومباشرة
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-text-3/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-text-3/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-text-3/20" />
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-bg" dir="rtl">
            {/* 1. HERO PREVIEW */}
            {activeSection === "hero" && (
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-3 py-1 text-[10px] text-accent font-bold">
                  ⚡ نظام تدريب متكامل
                </span>
                <h2 className="font-display font-extrabold text-white text-3xl md:text-4xl leading-tight whitespace-pre-line">
                  {heroData.headline.split("\n").map((line, idx) => (
                    <span key={idx} className={idx > 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#D4AF37]" : ""}>
                      {line}
                      {idx === 0 && <br />}
                    </span>
                  ))}
                </h2>
                <p className="text-text-2 text-xs md:text-sm leading-relaxed max-w-md">{heroData.subheadline}</p>
                <button className="bg-accent text-bg px-6 py-2.5 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(197, 162, 93, 0.2)]">
                  {heroData.ctaText}
                </button>
                <div className="grid grid-cols-3 gap-2 pt-4 max-w-md border-t border-border/40 mt-6">
                  {[
                    { v: heroData.metric1Value, l: heroData.metric1Label },
                    { v: heroData.metric2Value, l: heroData.metric2Label },
                    { v: heroData.metric3Value, l: heroData.metric3Label },
                  ].map((m, i) => (
                    <div key={i} className="bg-accent/5 border border-accent/10 rounded-xl p-3 text-center">
                      <div className="text-accent font-bold text-sm md:text-base font-display">{m.v}</div>
                      <div className="text-text-3 text-[9px] mt-0.5">{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. STATS PREVIEW */}
            {activeSection === "stats" && (
              <div className="space-y-8 pt-8">
                <div className="grid grid-cols-2 gap-4">
                  {statsData.items.map((stat, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedStatIdx(i)}
                      className={cn(
                        "p-4 rounded-xl border text-center transition-all cursor-pointer",
                        selectedStatIdx === i ? "border-accent bg-accent/5" : "border-border bg-surface"
                      )}
                    >
                      <div className="text-2xl font-display font-extrabold text-accent">
                        {stat.value}{stat.suffix}
                      </div>
                      <p className="text-text-2 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. ABOUT PREVIEW */}
            {activeSection === "about" && (
              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-white border-b border-accent/20 pb-2">
                  {aboutData.title}
                </h3>
                <div className="space-y-3 text-text-2 text-xs md:text-sm leading-relaxed">
                  <p>{aboutData.paragraph1}</p>
                  <p>{aboutData.paragraph2}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                  {[
                    { v: aboutData.stat1Value, l: aboutData.stat1Label },
                    { v: aboutData.stat2Value, l: aboutData.stat2Label },
                    { v: aboutData.stat3Value, l: aboutData.stat3Label },
                    { v: aboutData.stat4Value, l: aboutData.stat4Label },
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 bg-surface rounded-lg border border-border/50">
                      <p className="text-lg font-bold text-accent">{s.v}</p>
                      <p className="text-text-3 text-[10px]">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. FEATURES PREVIEW */}
            {activeSection === "features" && (
              <div className="space-y-3">
                <span className="text-accent text-[10px] font-bold block uppercase tracking-wider">ليه تختارنا</span>
                <h3 className="font-display font-bold text-text-1 text-lg md:text-xl">كل اللي محتاجه في مكان واحد</h3>
                <div className="space-y-2 mt-4">
                  {featuresData.map((feat, idx) => {
                    const isSel = selectedFeatureIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedFeatureIdx(idx)}
                        className={cn(
                          "p-3 rounded-lg border transition-all cursor-pointer",
                          isSel ? "bg-accent/5 border-accent/30" : "bg-surface border-border hover:bg-surface-high/60"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn("text-xs font-mono font-bold", isSel ? "text-accent" : "text-text-3")}>
                            {feat.number}
                          </span>
                          <div className="flex-1 h-px bg-border/40" />
                          <h4 className={cn("text-xs font-bold text-text-1", isSel && "text-accent")}>
                            {feat.title}
                          </h4>
                        </div>
                        {isSel && (
                          <p className="text-[11px] text-text-2 leading-relaxed mt-2 pr-6">
                            {feat.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. HOW IT WORKS PREVIEW */}
            {activeSection === "how_it_works" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-text-1 text-xl">{howItWorksData.title}</h3>
                  <p className="text-text-3 text-xs mt-1">{howItWorksData.description}</p>
                </div>
                <div className="space-y-3">
                  {howItWorksData.items.map((step, idx) => {
                    const isSel = selectedStepIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedStepIdx(idx)}
                        className={cn(
                          "p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer",
                          isSel ? "bg-accent/5 border-accent/30" : "bg-surface border-border"
                        )}
                      >
                        <span className="text-2xl">{step.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className={cn("text-xs font-bold text-text-1", isSel && "text-accent")}>{step.title}</h4>
                            <span className="text-xs font-display font-black text-text-3/30">{step.num}</span>
                          </div>
                          <p className="text-[11px] text-text-2 leading-relaxed mt-1">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. TRANSFORMATIONS PREVIEW */}
            {activeSection === "transformations" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-text-1 text-xl">{transformationsData.title}</h3>
                  <p className="text-text-3 text-xs mt-1">{transformationsData.description}</p>
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-surface-high border border-border">
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center text-text-3/10 text-xs font-bold">
                    [صورة التحول الخلفية]
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4 z-20">
                    <p className="text-accent font-bold text-xs mb-0.5">{transformationsData.featuredName}</p>
                    <h4 className="text-sm font-display font-bold text-white">{transformationsData.featuredTitle}</h4>
                    <p className="text-text-2 text-[10px] leading-relaxed mt-1 italic">
                      "{transformationsData.featuredDescription}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. TESTIMONIALS PREVIEW */}
            {activeSection === "testimonials" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-text-1 text-xl">{testimonialsData.title}</h3>
                  <p className="text-text-3 text-xs mt-1">{testimonialsData.description}</p>
                </div>
                <div className="relative">
                  <div className="p-5 bg-surface rounded-xl border border-accent/15 relative overflow-hidden text-center">
                    <div className="absolute top-2 end-4 text-6xl text-accent/5 font-serif select-none pointer-events-none">”</div>
                    <div className="w-12 h-12 rounded-full bg-accent/15 border-2 border-accent text-accent flex items-center justify-center text-md font-bold mx-auto mb-3 shadow-[0_0_10px_rgba(197, 162, 93, 0.15)]">
                      {testimonialsData.items[selectedTestimonialIdx]?.avatar}
                    </div>
                    <div className="flex justify-center gap-0.5 mb-2">
                      {Array.from({ length: testimonialsData.items[selectedTestimonialIdx]?.rating || 5 }).map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-accent fill-accent" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-text-1 text-[11px] leading-relaxed mb-4 italic">
                      "{testimonialsData.items[selectedTestimonialIdx]?.text}"
                    </p>
                    <h4 className="font-bold text-text-1 text-xs">{testimonialsData.items[selectedTestimonialIdx]?.name}</h4>
                    <span className="text-accent font-semibold text-[10px]">{testimonialsData.items[selectedTestimonialIdx]?.result}</span>
                  </div>
                  <div className="flex justify-center gap-1 mt-4">
                    {testimonialsData.items.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestimonialIdx(idx)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all cursor-pointer",
                          selectedTestimonialIdx === idx ? "bg-accent scale-125" : "bg-text-3/40"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 8. PRICING PREVIEW */}
            {activeSection === "pricing" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-display font-bold text-text-1 text-xl">{pricingData.title}</h3>
                  <p className="text-text-3 text-xs mt-1">{pricingData.description}</p>
                </div>
                <div className="space-y-4">
                  {pricingData.items.map((plan, idx) => {
                    const isSel = selectedPlanIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedPlanIdx(idx)}
                        className={cn(
                          "p-5 rounded-xl border relative flex flex-col transition-all cursor-pointer",
                          plan.highlighted
                            ? "bg-surface border-2 border-accent shadow-[0_0_15px_rgba(197, 162, 93, 0.1)]"
                            : "bg-surface/50 border-border"
                        )}
                      >
                        {plan.highlighted && (
                          <span className="absolute top-0 start-4 -translate-y-1/2 bg-accent text-bg px-2.5 py-0.5 text-[9px] font-bold rounded-full">
                            الأكثر طلباً 🔥
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-text-1">{plan.name}</h4>
                        <p className="text-[10px] text-text-3 mt-1">{plan.description}</p>
                        <div className="my-3">
                          <span className="text-xl font-display font-bold text-white">{plan.price} ج.م</span>
                          <span className="text-text-3 text-[10px]"> / {plan.period}</span>
                        </div>
                        {isSel && (
                          <ul className="space-y-2 border-t border-border/40 pt-3 mt-1">
                            {plan.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-2 text-[11px] text-text-2">
                                <span className="text-accent">✓</span>
                                {feat}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 9. FAQ PREVIEW */}
            {activeSection === "faq" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-text-1 text-xl">{faqData.title}</h3>
                  <p className="text-text-3 text-xs mt-1">{faqData.description}</p>
                </div>
                <div className="space-y-3">
                  {faqData.items.map((faq, idx) => {
                    const isSel = selectedFaqIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedFaqIdx(idx)}
                        className={cn(
                          "p-3.5 rounded-lg border transition-all cursor-pointer",
                          isSel ? "border-accent/30 bg-surface" : "border-border bg-surface/40 hover:bg-surface/60"
                        )}
                      >
                        <div className="flex justify-between items-center gap-3">
                          <h4 className="font-bold text-text-1 text-[11px] md:text-xs">{faq.question}</h4>
                          <span className={cn("w-4 h-4 rounded-full bg-bg flex items-center justify-center text-text-3 text-[9px] transition-transform duration-300", isSel && "rotate-180 text-accent")}>
                            ▼
                          </span>
                        </div>
                        {isSel && (
                          <p className="text-[11px] text-text-2 leading-relaxed border-t border-border/50 pt-2.5 mt-2.5">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 10. CTA PREVIEW */}
            {activeSection === "cta" && (
              <div className="space-y-6 text-center pt-6">
                <span className="inline-block bg-accent/5 border border-accent/15 rounded-full px-4 py-1 text-[10px] text-accent font-bold">
                  {ctaData.badgeText}
                </span>
                <h3 className="font-display font-extrabold text-text-1 text-2xl leading-tight">
                  {ctaData.title}
                </h3>
                <p className="text-text-2 text-xs md:text-sm leading-relaxed max-w-sm mx-auto">
                  {ctaData.description}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button className="bg-accent text-bg px-5 py-2 rounded-full text-xs font-bold shadow-lg">
                    {ctaData.ctaText}
                  </button>
                  <button className="border border-border text-text-1 px-5 py-2 rounded-full text-xs font-medium">
                    {ctaData.secondaryText}
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-border/40">
                  {ctaData.features.map((feat, idx) => (
                    <span key={idx} className="text-text-3 text-[10px] font-medium">{feat}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

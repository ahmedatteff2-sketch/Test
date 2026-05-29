"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCMSContent } from "@/lib/cms";

const defaultAbout = {
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
};

export function AboutCoach() {
  const content = useCMSContent("about", defaultAbout);

  return (
    <section id="about" className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute top-0 end-0 w-1/2 h-full bg-accent/5 rounded-l-[100px] blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto group">
              <div className="absolute inset-0 bg-accent rounded-[var(--radius-xl)] rotate-3 opacity-20 blur-[2px] transition-transform group-hover:rotate-6 duration-500" />
              <div className="absolute inset-0 border-2 border-accent rounded-[var(--radius-xl)] -rotate-3 opacity-40 shadow-[0_0_20px_rgba(255,30,39,0.25)]" />
              <div className="relative w-full h-full rounded-[var(--radius-xl)] overflow-hidden border border-white/10">
                <Image
                  src="/images/coach_portrait.png"
                  alt="Coach Portrait"
                  fill
                  className="object-cover object-center transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 inset-x-0 text-center">
                  <span className="text-xs uppercase tracking-widest font-black text-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Building Life Style Not Just A Body</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2"
          >
            <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2 block">
              عن مؤسس منصة EAGLE
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6 leading-tight">
              نبني أسلوب حياة <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#FF453A] drop-shadow-[0_0_20px_rgba(255,30,39,0.15)]">وليس مجرد جسم</span>
            </h2>
            <div className="space-y-4 text-text-2 text-base md:text-lg leading-relaxed">
              <p>{content.paragraph1}</p>
              <p>{content.paragraph2}</p>
            </div>

            {/* Coach Credentials list */}
            <div className="mt-8 space-y-3 border-t border-b border-border/40 py-6">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs shrink-0">🥇</span>
                <span className="text-sm font-semibold text-text-1">شهادات دولية معتمدة في التدريب والتغذية الرياضية (NASM, ISSA)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs shrink-0">🏋️‍♂️</span>
                <span className="text-sm font-semibold text-text-1">خبرة في تجهيز الرياضيين وتأهيل الإصابات وتخسيس السمنة المفرطة</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs shrink-0">🥗</span>
                <span className="text-sm font-semibold text-text-1">تصميم خطط مرنة تتناسب مع يومك وأكل البيت المعتاد بدون حرمان</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div>
                <p className="text-3xl md:text-4xl font-display font-black text-white mb-1">{content.stat1Value}</p>
                <p className="text-[10px] text-text-3 font-semibold uppercase">{content.stat1Label}</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-black text-accent mb-1">{content.stat2Value}</p>
                <p className="text-[10px] text-text-3 font-semibold uppercase">{content.stat2Label}</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-black text-white mb-1">{content.stat3Value}</p>
                <p className="text-[10px] text-text-3 font-semibold uppercase">{content.stat3Label}</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-black text-accent mb-1">{content.stat4Value}</p>
                <p className="text-[10px] text-text-3 font-semibold uppercase">{content.stat4Label}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

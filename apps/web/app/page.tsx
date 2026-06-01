import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { ClientCommandCenter } from "@/components/landing/client-command-center";
import { Calculator } from "@/components/landing/calculator";
import { AboutCoach } from "@/components/landing/about-coach";
import { Transformations } from "@/components/landing/transformations";
import { Testimonials } from "@/components/landing/testimonials";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";

export default function LandingPage() {
  return (
    <main className="relative bg-bg min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <AboutCoach />
      <Features />
      <ClientCommandCenter />
      <Calculator />
      <Transformations />
      <Testimonials />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}

"use client";


import TopWorkersSection from "@/components/home/TopWorkersSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ExtraStepsSection from "@/components/home/ExtraStepsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import ScrollToTop from "@/components/home/ScrollToTop";
import HeroSection from "@/components/home/HeroSection";
import FooterSection from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="pt-20 bg-white text-black dark:bg-slate-950 dark:text-white overflow-hidden">
      <HeroSection />
      <TopWorkersSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ExtraStepsSection />
      <FAQSection />
      <CTASection />
      <FooterSection/>
      <ScrollToTop />
    </main>
  );
}
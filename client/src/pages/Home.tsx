import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import WorkflowSection from "@/components/WorkflowSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PortfolioSection from "@/components/PortfolioSection";
import CTASection from "@/components/CTASection";

import Footer from "@/components/Footer";
import { useEffect } from "react";
import TechCarousel from "@/components/tools";

const Home = () => {
  // Set page title and description when component mounts
  useEffect(() => {
    document.title =
      "Central Test Agency - Tests Logiciels et Automatisation QA en Algérie | Playwright, Cypress";

    // Update meta description dynamically
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Expert en tests logiciels et automatisation QA en Algérie. Services Playwright, Cypress, tests E2E, API, régression. Qualité logicielle garantie pour vos projets digitaux."
      );
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <TechCarousel />
        <WorkflowSection />
        <AboutSection />
        <CTASection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;

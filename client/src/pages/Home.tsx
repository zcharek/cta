import React, { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import WorkflowSection from "@/components/WorkflowSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import QuizTestSelector from "@/components/QuizTestSelector";
import TechCarousel from "@/components/tools";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Home = () => {
  // Scroll automatique vers l'ancre si hash présent
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#services") {
      const el = document.getElementById("services");
      if (el) {
        // Délai plus long sur mobile pour laisser le menu se fermer
        const isMobile = window.innerWidth < 768;
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, isMobile ? 450 : 200);
      }
    } else if (hash === "#contact") {
      const el = document.getElementById("contact");
      if (el) {
        // Délai plus long sur mobile pour laisser le menu se fermer
        const isMobile = window.innerWidth < 768;
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, isMobile ? 450 : 200);
      }
    }
  }, []);

  return (
    <>
      <SEOHead 
        title="Central Test Consulting - Tests Logiciels et Automatisation QA en Algérie"
        description="Expert en tests logiciels et automatisation QA en Algérie. Services Playwright, Cypress, tests E2E, API, régression. Qualité logicielle garantie pour vos projets digitaux."
        keywords="test logiciel, automatisation QA, Playwright, Cypress, tests E2E, API testing, régression, qualité logicielle, CI/CD, Algérie, tests fonctionnels, tests automatisés"
        ogUrl="https://centraltestagency.com"
        canonical="https://centraltestagency.com"
      />
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <QuizTestSelector />
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

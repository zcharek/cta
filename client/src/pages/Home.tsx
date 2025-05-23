import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import ServicesSection from '@/components/ServicesSection';
import WorkflowSection from '@/components/WorkflowSection';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PortfolioSection from '@/components/PortfolioSection';
import CTASection from '@/components/CTASection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const Home = () => {
  // Set page title and description when component mounts
  useEffect(() => {
    document.title = 'Central Test Agency - Software Testing & UX Design Solutions';
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <WorkflowSection />
        <AboutSection />
        <TestimonialsSection />
        <PortfolioSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;

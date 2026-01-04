import React from 'react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PatternBackground from '@/components/PatternBackground';

interface ServiceLayoutProps {
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogUrl: string;
    canonical: string;
  };
  children: React.ReactNode;
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({ seo, children }) => {
  return (
    <>
      <SEOHead 
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        ogUrl={seo.ogUrl}
        canonical={seo.canonical}
      />
      <Header />
      <PatternBackground variant="light" opacity={0.1} className="py-20 md:py-24 bg-white">
      <main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      </PatternBackground>
      <Footer />
    </>
  );
};

export default ServiceLayout; 
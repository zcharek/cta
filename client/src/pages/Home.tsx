import Header from "@/components/Header";
import { ModernHero } from "@/components/ModernHero";
import { ModernServices } from "@/components/ModernServices";
import { ModernPortfolio } from "@/components/ModernPortfolio";
import { ModernContact } from "@/components/ModernContact";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import PremiumBackground from "@/components/PremiumBackground";

const Home = () => {
  // Set page title and description when component mounts
  useEffect(() => {
    document.title = "Central Test Agency - Software Testing";
  }, []);

  return (
    <>
      <PremiumBackground />
      <Header />
      <main className="relative z-10">
        <ModernHero />
        <ModernServices />
        <ModernPortfolio />
        <ModernContact />
      </main>
      <Footer />
    </>
  );
};

export default Home;

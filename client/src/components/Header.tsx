import { useState, useEffect } from "react";
import { m } from "framer-motion";
import ContactModal from "./ContactModal";
import { useLocation } from "wouter";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useLocation();

  // Handle scrolling effect for the header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handler pour le scroll vers #services
  const handleMobileServicesClick = () => {
    setIsOpen(false);
    if (location !== "/") {
      setLocation("/", { replace: false });
      // Attendre le rendu de la home avant de scroller
      setTimeout(() => {
        const el = document.querySelector("#services");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      const el = document.querySelector("#services");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}
      >
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Logo */}
              <a href="/" className="hover:opacity-80 transition-opacity duration-200">
                <m.div
                  className="text-primary font-poppins font-semibold text-2xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Central<span className="text-secondary">TestAgency</span>
                </m.div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/#services"
                className="font-medium text-foreground hover:text-primary transition-colors duration-200"
              >
                Nos services
              </a>
              <a
                href="/#about"
                className="font-medium text-foreground hover:text-primary transition-colors duration-200"
              >
                Notre ADN
              </a>
              <a
                href="/faq"
                className="font-medium text-foreground hover:text-primary transition-colors duration-200"
              >
                FAQ
              </a>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors duration-200"
              >
                Contactez-nous
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-foreground focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <i
                className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-2xl`}
              ></i>
            </button>
          </div>

          {/* Mobile Navigation */}
          <m.div
            className={`md:hidden ${isOpen ? "block" : "hidden"} pb-4`}
            initial={false}
            animate={
              isOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }
            }
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {/* Home retiré du menu mobile */}
              <button
                type="button"
                onClick={handleMobileServicesClick}
                className="font-medium text-foreground hover:text-primary transition-colors duration-200 text-left"
              >
                Services
              </button>
              <a
                href="/faq"
                className="font-medium text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </a>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsOpen(false);
                }}
                className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors duration-200 inline-block text-center"
              >
                Contact Us
              </button>
            </div>
          </m.div>
        </div>
      </header>

      {/* Modale de contact */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import ContactModal from "./ContactModal";
import { useLocation } from "wouter";
import QuizTestSelector from "./QuizTestSelector";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
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
    setTimeout(() => {
      if (location !== "/") {
        setLocation("/", { replace: false });
        setTimeout(() => {
          const el = document.querySelector("#services");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 350);
      } else {
        const el = document.querySelector("#services");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 350); // attendre la fermeture du menu
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 bg-white/70 backdrop-blur-md transition-all duration-300 ${isScrolled ? "shadow-lg shadow-gray-200/60 py-2" : "shadow-none py-4"}`}
        style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
      >
        <div className="container mx-auto flex flex-row items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          {/* Logo à gauche */}
          <div className="flex items-center">
            <a href="/" className="hover:opacity-80 transition-opacity duration-200">
              <m.div
                className="text-blue-600 font-poppins font-semibold text-2xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Central<span className="text-gray-700">TestAgency</span>
              </m.div>
            </a>
          </div>

          {/* Navigation à droite */}
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/#services"
                className="font-medium text-gray-700 relative after:content-[''] after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left hover:text-blue-600"
              >
                Nos services
              </a>
              <a
                href="/#about"
                className="font-medium text-gray-700 relative after:content-[''] after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left hover:text-blue-600"
              >
                Notre ADN
              </a>
              <a
                href="/faq"
                className="font-medium text-gray-700 relative after:content-[''] after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 after:origin-left hover:text-blue-600"
              >
                FAQ
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                Contactez-nous
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-foreground focus:outline-none ml-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Ouvrir le menu"
            >
              <span className="sr-only">Menu</span>
              <i
                className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-2xl transition-transform duration-300`}
              ></i>
            </button>
          </div>
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
          <div className="flex flex-col space-y-4 items-center">
            {/* Home retiré du menu mobile */}
            <button
              type="button"
              onClick={handleMobileServicesClick}
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 text-center"
            >
              Services
            </button>
            <a
              href="/faq"
              className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 text-center"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </a>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsOpen(false);
              }}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block text-center shadow-sm"
            >
              Contactez-nous
            </button>
          </div>
        </m.div>
      </header>

      {/* Modale de contact */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Modale Quiz */}
      {isQuizOpen && <QuizTestSelector modalOpen={isQuizOpen} setModalOpen={setIsQuizOpen} />}
    </>
  );
};

export default Header;

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { m } from 'framer-motion';

const ScrollToTop = () => {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Scroll vers le haut de la page à chaque changement de route
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const toggleVisibility = () => {
      // Afficher le bouton après avoir scrollé de 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <m.button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-brand-blue-700 to-brand-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2"
          aria-label="Retour en haut de la page"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </m.button>
      )}
    </>
  );
};

export default ScrollToTop;

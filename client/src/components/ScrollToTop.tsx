import { useEffect } from 'react';
import { useLocation } from 'wouter';

const ScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll vers le haut de la page à chaque changement de route
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default ScrollToTop;

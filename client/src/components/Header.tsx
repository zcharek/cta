import { useState, useEffect } from 'react';
import { m } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scrolling effect for the header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <m.div 
              className="text-primary font-poppins font-semibold text-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Central<span className="text-secondary">Test</span>
            </m.div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="font-medium text-foreground hover:text-primary transition-colors duration-200">Home</a>
            <a href="#services" className="font-medium text-foreground hover:text-primary transition-colors duration-200">Services</a>
            <a href="#about" className="font-medium text-foreground hover:text-primary transition-colors duration-200">About</a>
            <a href="#portfolio" className="font-medium text-foreground hover:text-primary transition-colors duration-200">Portfolio</a>
            <a href="#contact" className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors duration-200">Contact Us</a>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            type="button" 
            className="md:hidden text-foreground focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <m.div 
          className={`md:hidden ${isOpen ? 'block' : 'hidden'} pb-4`}
          initial={false}
          animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4">
            <a 
              href="#home" 
              className="font-medium text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a 
              href="#services" 
              className="font-medium text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Services
            </a>
            <a 
              href="#about" 
              className="font-medium text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a 
              href="#portfolio" 
              className="font-medium text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Portfolio
            </a>
            <a 
              href="#contact" 
              className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors duration-200 inline-block text-center"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </a>
          </div>
        </m.div>
      </div>
    </header>
  );
};

export default Header;

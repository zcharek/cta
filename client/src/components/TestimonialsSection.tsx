import { useRef, useEffect, useState } from "react";

const partners = [
  {
    name: "raja",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Logo_RAJAGROUP_without_baseline.png",
  },
  {
    name: "transformatek",
    logo: "https://avatars.githubusercontent.com/u/61881957?s=280&v=4",
  },
  {
    name: "deploily",
    logo: "https://camo.githubusercontent.com/1e959dc3972553c6155ec2c21041ff56779429a5273cdbd2c49c3d17fe4d3b11/68747470733a2f2f636f6e736f6c652e6465706c6f696c792e636c6f75642f5f6e6578742f696d6167653f75726c3d253246696d616765732532466c6f676f5f6e616d652e706e6726773d3139323026713d3735",
  },
  {
    name: "ahead digital",
    logo: "https://media.licdn.com/dms/image/v2/C4D0BAQHs8c47ONdLIg/company-logo_200_200/company-logo_200_200/0/1630580694546/aheaddigital_logo?e=2147483647&v=beta&t=13Pc9wIWlZZzNNEOzbVttLY1-LxRtiCxI_8TLSaSPhY",
  },
  {
    name: "Wamiz",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Wamiz.svg/1200px-Wamiz.svg.png",
  },
  {
    name: "ais conduite",
    logo: "https://www.ais-conduite.fr/smarty/wireframe30/media/images/logo.webp",
  },
  {
    name: "my unisoft",
    logo: "https://myunisoftcompta.fr/wp-content/uploads/2023/03/MYUNISOFT-LOGOS-RVB_05-2.png",
  },
  {
    name: "Confirmoo",
    logo: "https://play-lh.googleusercontent.com/BYH2YGVf_L8xkI7XL8cKTwbsUbTHTZn287K_dH0PQeXHgWXmKX1qxo61nAMx1JdUdkQy=w600-h300-pc0xffffff-pd",
  },
  {
    name: "Data intuition",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx3iRTVw82Xam23d11Akuo77Jfez6a-QXSvA&s",
  },
];

const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  useEffect(() => {
    let animationId: number;
    let scrollPosition = 0;
    const speed = 0.8; // Vitesse de défilement

    const autoScroll = () => {
      if (scrollRef.current && !hovered && !isScrolling) {
        scrollPosition += speed;
        
        // Calculer la largeur totale du contenu
        const container = scrollRef.current;
        const totalWidth = container.scrollWidth;
        const visibleWidth = container.clientWidth;
        
        // Si on a dépassé la moitié du contenu (car on a dupliqué les éléments)
        // on repart du début pour un effet infini
        if (scrollPosition >= totalWidth / 2) {
          scrollPosition = 0;
        }
        
        container.scrollLeft = scrollPosition;
      }
      
      animationId = requestAnimationFrame(autoScroll);
    };

    // Démarrer l'animation
    animationId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hovered, isScrolling]);

  return (
    <section
      id="testimonials"
      className="py-20 gradient-bg text-white overflow-hidden"
    >
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos partenaires
          </h2>
          <p className="text-lg text-secondary-light max-w-2xl mx-auto">
            Voici quelques entreprises avec lesquelles nous avons collaboré.
          </p>
        </div>
      </div>

      {/* Carousel amélioré avec dégradés et animations */}
      <div className="relative">
        {/* Dégradé gauche */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-600 to-transparent z-10 pointer-events-none"></div>
        
        {/* Dégradé droit */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-600 to-transparent z-10 pointer-events-none"></div>
        
        <div
          ref={scrollRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onScroll={handleScroll}
          className="flex overflow-x-hidden no-scrollbar whitespace-nowrap gap-8 px-8 py-4"
          style={{ 
            scrollBehavior: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {/* Duplication pour effet infini plus fluide */}
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="group bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 w-56 h-32 transition-all duration-500 ease-out hover:scale-105 hover:bg-white/20 cursor-pointer border border-white/20 hover:border-white/40"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-16 max-w-40 object-contain mx-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Indicateurs de scroll */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

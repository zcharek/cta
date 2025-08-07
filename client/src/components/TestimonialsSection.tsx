import { useRef, useEffect, useState, useCallback } from "react";

// Types
interface Partner {
  name: string;
  logo: string;
}

// Configuration
const SCROLL_CONFIG = {
  speed: 1,
  pauseOnHover: true,
} as const;

const LOGO_SIZES = {
  default: "max-h-20",
  large: "max-h-28 w-auto",
} as const;

const PARTNERS_NEEDING_LARGE_SIZE = ["Confirmoo", "b2bglob"] as const;

// Data
const PARTNERS: Partner[] = [
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
    logo: "https://oran.ecselexpo.com/savedIMG//oran/busness/logos/m6yujaxnXGCWQYMZQR9.png",
  },
  {
    name: "b2bglob",
    logo: "https://b2bglob.com/static/media/FullLogo_Transparent.d67a5f0d.png",
  },
];

// Utility functions
const duplicatePartners = (partners: Partner[]): Partner[] => [...partners, ...partners];

const getLogoSize = (partnerName: string): string => {
  return PARTNERS_NEEDING_LARGE_SIZE.includes(partnerName as any)
    ? LOGO_SIZES.large
    : LOGO_SIZES.default;
};

// Custom hook for auto-scroll
const useAutoScroll = (isPaused: boolean) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAmountRef = useRef(0);

  useEffect(() => {
    let animationId: number;

    const scroll = () => {
      if (scrollRef.current && !isPaused) {
        scrollAmountRef.current += SCROLL_CONFIG.speed;
        scrollRef.current.scrollLeft = scrollAmountRef.current;

        // Reset when reaching halfway point (seamless loop)
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollAmountRef.current = 0;
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return scrollRef;
};

// Components
interface PartnerLogoProps {
  partner: Partner;
  index: number;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ partner, index }) => (
  <div
    key={index}
    className="bg-white/20 p-6 rounded-xl shadow-md flex items-center justify-center flex-shrink-0 w-56 h-32"
  >
    <img
      src={partner.logo}
      alt={`Logo de ${partner.name}`}
      className={`object-contain mx-auto ${getLogoSize(partner.name)}`}
      loading="lazy"
    />
  </div>
);

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
    <p className="text-lg text-secondary-light max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

interface PartnersCarouselProps {
  partners: Partner[];
  onHoverChange: (isHovered: boolean) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const PartnersCarousel: React.FC<PartnersCarouselProps> = ({
  partners,
  onHoverChange,
  scrollRef,
}) => (
  <div
    ref={scrollRef}
    onMouseEnter={() => onHoverChange(true)}
    onMouseLeave={() => onHoverChange(false)}
    className="flex overflow-x-scroll no-scrollbar whitespace-nowrap gap-6"
    style={{ scrollBehavior: "auto" }}
  >
    {partners.map((partner, index) => (
      <PartnerLogo key={`${partner.name}-${index}`} partner={partner} index={index} />
    ))}
  </div>
);

// Main component
const TestimonialsSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useAutoScroll(isHovered);
  const duplicatedPartners = duplicatePartners(PARTNERS);

  const handleHoverChange = useCallback((hovered: boolean) => {
    setIsHovered(hovered);
  }, []);

  return (
    <section
      id="testimonials"
      className="py-20 gradient-bg text-white overflow-hidden"
      aria-label="Section partenaires"
    >
      <div className="container">
        <SectionHeader
          title="Nos partenaires"
          subtitle="Voici quelques entreprises avec lesquelles nous avons collaboré."
        />
        <PartnersCarousel
          partners={duplicatedPartners}
          onHoverChange={handleHoverChange}
          scrollRef={scrollRef}
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;

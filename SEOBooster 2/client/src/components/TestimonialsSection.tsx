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
];

const duplicatedPartners = [...partners, ...partners];

const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let scrollAmount = 0;
    let animationId: number;

    const scroll = () => {
      if (scrollRef.current && !hovered) {
        scrollAmount += 1; // vitesse scroll
        scrollRef.current.scrollLeft = scrollAmount;

        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollAmount = 0;
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [hovered]);

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

        <div
          ref={scrollRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex overflow-x-scroll no-scrollbar whitespace-nowrap gap-6"
          style={{ scrollBehavior: "auto" }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={index}
              className="bg-white/20 p-4 rounded-xl shadow-md flex items-center justify-center flex-shrink-0 w-48 h-24"
              // bg-white/20 : blanc à 20% d'opacité pour le fond
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-16 object-contain mx-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

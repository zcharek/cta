import { useRef, useEffect, useState } from "react";

const languages = [
  {
    name: "Java",
    logo: "https://www.vectorlogo.zone/logos/java/java-icon.svg",
  },
  {
    name: "TypeScript",
    logo: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
  },
  {
    name: "JavaScript",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  },
];

const tools = [
  {
    name: "Playwright",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Playwright_Logo.svg",
  },
  {
    name: "Selenium",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Selenium_Logo.png",
  },
  {
    name: "Cypress",
    logo: "https://le-testeur.com/wp-content/uploads/2024/01/logo_landscape_1.png",
  },
  {
    name: "TestNG",
    logo: "https://miro.medium.com/v2/resize:fit:875/1*6rpgzoj0Qg9j6SUnMY8kUQ.png",
  },
  {
    name: "Apache Maven",
    logo: "https://maven.apache.org/images/maven-logo-black-on-white.png",
  },

  {
    name: "Percy",
    logo: "https://images.opencollective.com/percy_io/80d9595/logo/256.png",
  },
  {
    name: "Jira",
    logo: "https://cdn.worldvectorlogo.com/logos/jira-1.svg",
  },
  {
    name: "Postman",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png",
  },
  {
    name: "Azure",
    logo: "https://www.testmanagement.com/wp-content/uploads/2021/07/microsoft-azure-devops-logo.jpeg",
  },
  {
    name: "Xray",
    logo: "https://latavernedutesteur.fr/wp-content/uploads/2019/01/xray.png",
  },
  {
    name: "Jenkins",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0uaqg0cYMOOD2SwyKrzFMHxkXb7vzLJXhew&s",
  },
  {
    name: "RestAssured",
    logo: "https://rest-assured.io/img/logo-transparent.png",
  },
];

const TechCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let scrollAmount = 0;
    let animationId: number;

    const scroll = () => {
      if (scrollRef.current && !hovered) {
        scrollAmount += 1.25;
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

  const duplicatedTools = [...tools, ...tools]; // duplication pour scroll infini

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-6xl text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Outils & Langages
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Les technologies que nous utilisons au quotidien.
        </p>
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Ligne 1 - Langages fixes */}
        <div className="flex justify-center gap-6 mb-12 select-none">
          {languages.map((lang, idx) => (
            <div
              key={idx}
              className="w-32 h-24 p-4 bg-white rounded-xl shadow-md flex items-center justify-center"
            >
              <img
                src={lang.logo}
                alt={lang.name}
                className="max-h-12 object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Ligne 2 - Outils défilants */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex overflow-x-scroll no-scrollbar whitespace-nowrap"
          style={{ scrollBehavior: "auto" }}
        >
          {duplicatedTools.map((tool, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-32 h-24 m-2 p-4 bg-white rounded-xl shadow-md flex items-center justify-center"
            >
              <img
                src={tool.logo}
                alt={tool.name}
                className="max-h-12 object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechCarousel;

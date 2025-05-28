import { m } from "framer-motion";
import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Tests Fonctionnels",
    description:
      "Nous testons chaque fonctionnalité de votre application pour vérifier qu’elle fonctionne correctement, comme prévu. L’objectif : détecter les bugs avant vos utilisateurs et garantir une expérience sans mauvaise surprise.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    altText: "Functional testing process",
  },
  {
    title: "Tests UX",
    description:
      "Nous vérifions que vos interfaces sont faciles à utiliser, accessibles à tous, et correspondent parfaitement aux attentes des utilisateurs. Nos tests garantissent aussi qu’aucun changement ne détériore l’apparence ou le fonctionnement visuel de votre site, pour une expérience utilisateur toujours optimale.",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    altText: "UX testing and design workflow",
  },
  {
    title: "Tests automatisés end-to-end",
    description:
      "Nos tests automatisés de bout en bout vérifient l’ensemble de votre application, du début à la fin, pour accélérer le développement tout en garantissant une qualité fiable et constante à chaque étape.",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    altText: "Automated testing process",
  },
  {
    title: "Tests API",
    description:
      "Nous vérifions que toutes vos connexions API fonctionnent parfaitement, en testant en détail les points d’accès, les données envoyées et les réponses reçues.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    altText: "3D software architecture visualization",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nos experts certifiés ISTQB conçoivent et réalisent des tests de
            bout en bout, sur mesure, pour garantir la qualité totale de vos
            logiciels et de l’expérience utilisateur.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                image={service.image}
                altText={service.altText}
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

"use client";

import { m } from "framer-motion";
import CaseStudyCard from "./CaseStudyCard";
import { WebflowGrid, WebflowCardWrapper } from "./WebflowGrid";

const caseStudies = [
  {
    title: "Accélérer la QA grâce aux Cloud-testing",
    description:
      "Découvrez comment le Cloud-testing permet de raccourcir les cycles de test.",
    image: "/images/cloudTest.jpg",
    altText: "Cloud-testing",
    category: "QA / Cloud Testing",
    readTime: "Lecture 4 min",
    pdf: "/pdf/cloudTesting-compressed.pdf",
  },
  {
    title: "C'est quoi le test logiciel !",
    description: "Introduction aux tests logiciel",
    image: "/images/IntroTest.jpg",
    altText: "Introduction aux tests",
    category: "Introduction",
    readTime: "Lecture 6 min",
    pdf: "/pdf/intoTesting-compressed.pdf",
  },
  {
    title: "Les erreurs les plus fréquentes dans un projet sans tests",
    description:
      "Analyse des erreurs courantes qui surviennent lorsqu’un projet logiciel est lancé sans stratégie de test.",
    image: "/images/mostError.jpg",
    altText: "Analyse des erreurs fréquentes en test logiciel",
    category: "Erreurs fréquentes",
    readTime: "12 min de lecture",
    pdf: "/pdf/mostError-compressed.pdf",
  },
  {
    title: "Comprendre la pyramide des tests",
    description:
      "Améliorer son expérience utilisateur en appliquant efficacement la pyramide des tests.",
    image: "/images/ParameterTest.jpg",
    altText: "Guide d’optimisation des paramètres de test",
    category: "Méthodologie",
    readTime: "7 min de lecture",
    pdf: "/pdf/testParameter.pdf",
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-20 bg-background relative z-10">
      <div className="container">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos publications
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accédez à des études de cas, articles et définitions utiles autour
            des tests logiciels.
          </p>
        </m.div>

        <div className="px-4">
          <WebflowGrid cols={4} gap="md">
            {caseStudies.map((caseStudy, index) => (
              <WebflowCardWrapper key={index} delay={index * 0.1}>
                <CaseStudyCard {...caseStudy} />
              </WebflowCardWrapper>
            ))}
          </WebflowGrid>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;

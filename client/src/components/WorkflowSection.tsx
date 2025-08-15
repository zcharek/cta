import { m } from "framer-motion";
import React from "react";

const workflowSteps = [
  {
    number: 1,
    title: "Analyse des exigences",
    description:
      "Nous commençons par comprendre en profondeur les besoins de votre projet, les utilisateurs cibles et les objectifs métier afin de développer une stratégie de test sur mesure.",
    icon: "fa-clipboard-list",
  },
  {
    number: 2,
    title: "Planification des tests",
    description:
      "Notre équipe conçoit un plan de test complet définissant le périmètre, l'approche, les ressources, le planning et les livrables.",
    icon: "fa-tasks",
  },
  {
    number: 3,
    title: "Exécution des tests",
    description:
      "Nous exécutons minutieusement les cas de test, documentons les résultats et identifions les problèmes avec des étapes de reproduction détaillées.",
    icon: "fa-vial",
  },
  {
    number: 4,
    title: "Rapports et recommandations",
    description:
      "Nous fournissons des rapports détaillés accompagnés d'analyses exploitables et de recommandations pour améliorer la qualité de votre produit.",
    icon: "fa-chart-line",
  },
];

const WorkflowSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Notre approche
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nous appliquons une méthodologie stricte pour assurer une couverture
            de test exhaustive et garantir des résultats de haute qualité.
          </p>
        </m.div>

        <div className="relative mt-14 mb-10 max-w-6xl mx-auto">
          {/* Timeline verticale mobile */}
          {/* Steps */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full gap-y-12 md:gap-y-0 md:gap-x-8">
            {workflowSteps.map((step, idx) => (
              <m.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * idx }}
                className="relative flex flex-col items-center w-full md:w-72 max-w-xs mx-auto"
              >
                {/* Icône */}
                <span className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-2xl shadow-xl border-4 border-white ring-4 ring-blue-100 mb-2">
                  <i className={`fas ${step.icon}`}></i>
                </span>
                {/* Titre et étape */}
                <div className="text-center mb-2 flex flex-col items-center">
                  <h3 className="text-lg font-bold text-blue-900 mb-1">{step.title}</h3>
                  <p className="text-blue-700 text-sm italic">Étape {step.number}</p>
                </div>
                {/* Carte */}
                <div className="bg-white/90 rounded-3xl shadow-2xl border border-blue-100 px-6 py-6 transition-all duration-300 w-full min-h-[180px] md:min-h-[210px] flex flex-col justify-center">
                  <div className="text-gray-800 text-xs md:text-sm leading-relaxed text-center">{step.description}</div>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;

import { WorkflowStep } from "./WorkflowStep";
import { m } from "framer-motion";
import PatternBackground from "./PatternBackground";

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
    <PatternBackground 
      variant="light" 
      opacity={0.1}
      className="py-20 bg-white"
    >
    <section className="container">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Notre approche
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une méthodologie rigoureuse pour une qualité sans compromis.
          </p>
        </m.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Ligne animée */}
          <m.div
            className="hidden md:block absolute top-7 left-1/2 -translate-x-1/2 h-1
            bg-gradient-to-r from-brand-blue-200 via-brand-blue-400 to-brand-blue-600 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "90%" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />

          {/* Steps */}
          <div
            role="list"
            className="relative z-10 flex flex-col md:flex-row gap-y-12 md:gap-x-8 justify-center"
          >
            {workflowSteps.map((step, idx) => (
              <WorkflowStep key={step.number} step={step} index={idx} />
            ))}
          </div>
        </div>
    </section>
    </PatternBackground>
  );
};

export default WorkflowSection;

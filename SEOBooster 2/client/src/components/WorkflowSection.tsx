import { m } from "framer-motion";

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
      "Notre équipe conçoit un plan de test complet définissant le périmètre, l’approche, les ressources, le planning et les livrables.",
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
      "Nous fournissons des rapports détaillés accompagnés d’analyses exploitables et de recommandations pour améliorer la qualité de votre produit.",
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {workflowSteps.map((step, index) => (
            <m.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center text-white relative mb-4">
                <span className="absolute -top-2 -right-2 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {step.number}
                </span>
                <m.i
                  className={`fas ${step.icon} text-2xl`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                    delay: index * 0.5, // Décalage progressif
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;

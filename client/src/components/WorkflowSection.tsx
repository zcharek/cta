const workflowSteps = [
  {
    number: "1",
    icon: "fa-search",
    title: "Analyse",
    description: "Étude approfondie de vos besoins et de votre application",
  },
  {
    number: "2",
    icon: "fa-cogs",
    title: "Planification",
    description: "Création d'une stratégie de tests personnalisée",
  },
  {
    number: "3",
    icon: "fa-play",
    title: "Exécution",
    description: "Réalisation des tests selon notre méthodologie",
  },
  {
    number: "4",
    icon: "fa-chart-line",
    title: "Rapport",
    description: "Livraison de résultats détaillés et recommandations",
  },
];

const WorkflowSection = () => {
  return (
    <section className="webflow-section bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notre approche
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nous appliquons une méthodologie stricte pour assurer une couverture
            de test exhaustive et garantir des résultats de haute qualité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {workflowSteps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center text-white relative mb-4">
                <span className="absolute -top-2 -right-2 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {step.number}
                </span>
                <i className={`fas ${step.icon} text-2xl`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
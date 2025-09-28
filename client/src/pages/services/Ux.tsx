import React from "react";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceHero from "@/components/ServiceHero";
import ServiceCTA from "@/components/ServiceCTA";
import QAComparison from "@/components/QAComparison";
import { generateSEOConfig } from "@/lib/seoConfig";

const Ux = () => {
  const seoConfig = generateSEOConfig('services', 'ux');

  const heroRightContent = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-white rounded-full p-3">
          <svg className="h-12 w-12 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">Avantages UX</h3>
      <div className="space-y-3">
        {['Langage naturel', 'Collaboration équipe', 'Documentation vivante', 'Multi-langages'].map((item, index) => (
          <div key={index} className="flex items-center text-white/90">
            <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const qaComparisonData = {
    manualQA: {
      title: "QA Manuel",
      priority: "Prioritaire",
      items: [
        "Tests avec de vrais utilisateurs",
        "Observation des comportements", 
        "Évaluation de l'ergonomie",
        "Tests d'accessibilité"
      ]
    },
    automatedTests: {
      title: "Tests Automatisés",
      priority: "Complémentaires",
      items: [
        "Tests de régression UI",
        "Vérification de l'accessibilité",
        "Tests de performance visuelle",
        "Validation multi-navigateurs"
      ]
    },
    approach: "Les tests UX sont principalement manuels avec des vrais utilisateurs, complétés par de l'automation pour la validation technique."
  };

  const ctaFeatures: Array<{
    icon: string;
    title: string;
    description: string;
  }> = [];

  return (
    <ServiceLayout seo={seoConfig}>
      <ServiceHero
        badge="Tests d'utilisabilité"
        title="Tests"
        subtitle="UX/UI"
        description="Les <strong>tests d'utilisabilité</strong> garantissent que votre application est <strong>facile à utiliser</strong> et offre une expérience optimale."
        gradientFrom="from-blue-600"
        gradientVia="via-blue-500" 
        gradientTo="to-blue-400"
        titleGradientFrom="from-blue-200"
        titleGradientTo="to-blue-100"
        descriptionColor="text-blue-100"
        rightContent={heroRightContent}
      />

      {/* Section définition et approche */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Qu'est-ce que les tests d'utilisabilité ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Les tests d'utilisabilité (UX) évaluent la facilité d'utilisation d'une application du point de vue de l'utilisateur final. Ils identifient les problèmes d'ergonomie et d'expérience utilisateur.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Objectifs des tests UX</h3>
              <div className="space-y-4">
                {[
                  { title: "Facilité d'utilisation", desc: "Vérifier que les utilisateurs peuvent accomplir leurs tâches facilement.", color: "bg-blue-500" },
                  { title: "Navigation intuitive", desc: "S'assurer que la navigation est logique et prévisible.", color: "bg-blue-500" },
                  { title: "Satisfaction utilisateur", desc: "Mesurer le niveau de satisfaction et d'engagement.", color: "bg-blue-500" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`${item.color} text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0`}>
                      <span className="text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <QAComparison {...qaComparisonData} />
          </div>
        </div>
      </section>

      {/* Section des outils disponibles */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos outils pour les tests d'utilisabilité
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nous combinons outils manuels et automatisés pour une évaluation complète de l'expérience utilisateur.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Playwright", icon: "https://upload.wikimedia.org/wikipedia/commons/7/75/Playwright_Logo.svg", color: "from-blue-500 to-blue-600", desc: "Tests automatisés d'interface et d'accessibilité.", link: "/#/services/playwright", badge: "Parfait pour UI →", badgeColor: "text-blue-600" },
            { name: "Cypress", icon: "https://www.cypress.io/cypress_logo_social.png", color: "from-blue-500 to-blue-600", desc: "Tests visuels avec interface développeur intuitive.", link: "/#/services/cypress", badge: "Excellent pour debugging →", badgeColor: "text-blue-600" },
            { name: "Percy", icon: "https://images.opencollective.com/percy_io/80d9595/logo/256.png", color: "from-blue-500 to-blue-600", desc: "Tests de régression visuelle automatisés.", link: "/#/services/percy", badge: "Idéal pour visuel →", badgeColor: "text-blue-600" }
          ].map((tool, index) => (
            <a key={index} href={tool.link} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
              <div className={`bg-gradient-to-br ${tool.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <img src={tool.icon} alt={tool.name} className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm">{tool.desc}</p>
              <div className={`mt-4 ${tool.badgeColor} text-sm font-medium`}>
                {tool.badge}
              </div>
            </a>
          ))}
          
          <div className="group bg-gradient-to-br from-blue-50 to-blue-50 rounded-2xl p-6 border-2 border-dashed border-blue-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tests manuels</h3>
            <p className="text-gray-600 text-sm">Sessions avec de vrais utilisateurs et experts UX.</p>
            <div className="mt-4 text-blue-600 text-sm font-medium">
              Essentiel pour UX →
            </div>
          </div>
        </div>
      </section>

      {/* Section méthodologie UX */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre méthodologie UX
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une approche structurée pour évaluer et améliorer l'expérience utilisateur.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Processus d'évaluation UX</h3>
              <div className="space-y-4">
                {[
                  { title: "Analyse heuristique", desc: "Évaluation par nos experts UX selon les principes d'utilisabilité.", color: "bg-blue-500" },
                  { title: "Tests utilisateurs", desc: "Sessions avec de vrais utilisateurs pour observer les comportements.", color: "bg-blue-500" },
                  { title: "Tests automatisés", desc: "Validation technique de l'accessibilité et de la performance.", color: "bg-blue-500" },
                  { title: "Recommandations", desc: "Rapport détaillé avec recommandations d'amélioration.", color: "bg-blue-500" }
                ].map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`${step.color} text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0`}>
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                      <p className="text-gray-600 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Métriques UX évaluées</h3>
              <div className="space-y-3">
                {[
                  { metric: "Facilité d'utilisation", method: "Manuel + Auto" },
                  { metric: "Temps de tâche", method: "Manuel" },
                  { metric: "Taux d'erreur", method: "Manuel + Auto" },
                  { metric: "Satisfaction", method: "Manuel" },
                  { metric: "Accessibilité", method: "Auto + Manuel" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.metric}</span>
                    <span className="text-sm text-gray-600">{item.method}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Critères d'évaluation</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['Clarté interface', 'Logique navigation', 'Feedback utilisateur', 'Cohérence design'].map((criteria, index) => (
                    <div key={index} className="text-blue-700">• {criteria}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCTA
        title="Besoin d'améliorer votre UX ?"
        description="Nos experts UX vous accompagnent pour créer une expérience utilisateur optimale et engageante."
        gradientFrom="from-gray-900"
        gradientVia="via-blue-900"
        gradientTo="to-blue-900"
        features={ctaFeatures}
        primaryButton={{
          text: "Voir nos autres services",
          href: "/#services",
          icon: "🛠️",
          gradientFrom: "from-blue-500",
          gradientTo: "to-blue-500",
          hoverFrom: "from-blue-600",
          hoverTo: "to-blue-600"
        }}
        secondaryButton={{
          text: "",
          href: "",
          icon: ""
        }}
      />
    </ServiceLayout>
  );
};

export default Ux; 
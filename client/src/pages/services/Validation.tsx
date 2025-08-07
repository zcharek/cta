import React from "react";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceHero from "@/components/ServiceHero";
import ServiceCTA from "@/components/ServiceCTA";
import QAComparison from "@/components/QAComparison";
import { generateSEOConfig } from "@/lib/seoConfig";

const Validation = () => {
  const seoConfig = generateSEOConfig('services', 'validation');

  const qaComparisonData = {
    manualQA: {
      title: "QA Manuel",
      priority: "Essentiel",
      items: [
        "Tests exploratoires approfondis",
        "Validation métier par des experts",
        "Tests d'acceptation utilisateur",
        "Découverte de bugs inattendus"
      ]
    },
    automatedTests: {
      title: "Tests Automatisés",
      priority: "Complémentaires",
      items: [
        "Tests de régression systématiques",
        "Validation technique répétitive",
        "Tests de performance",
        "Intégration CI/CD"
      ]
    },
    approach: "Les tests de validation combinent expertise humaine pour la validation métier et automatisation pour la couverture technique systématique."
  };

  const ctaFeatures = [
    {
      icon: "✅",
      title: "Validation complète",
      description: "Conformité métier et technique"
    },
    {
      icon: "🎯", 
      title: "Expertise métier",
      description: "Analyse par des experts QA"
    },
    {
      icon: "🔧",
      title: "Outils adaptés", 
      description: "Stack technologique optimale"
    }
  ];

  return (
    <ServiceLayout seo={seoConfig}>
      <ServiceHero
        badge="✅ Tests de validation"
        title="Tests de"
        subtitle="Validation"
        description="Les <strong>tests de validation</strong> garantissent que votre application respecte <strong>parfaitement</strong> les exigences métier et spécifications techniques."
        gradientFrom="from-blue-600"
        gradientVia="via-indigo-500" 
        gradientTo="to-purple-400"
        titleGradientFrom="from-blue-200"
        titleGradientTo="to-purple-100"
        descriptionColor="text-blue-100"
      />

      {/* Section définition et approche */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Qu'est-ce que les tests de validation ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Les tests de validation vérifient que le système développé correspond exactement aux besoins exprimés et aux spécifications définies. Ils répondent à la question : "Construisons-nous le bon produit ?"
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Objectifs des tests de validation</h3>
              <div className="space-y-4">
                {[
                  { title: "Conformité métier", desc: "Vérifier que l'application répond aux besoins utilisateurs.", color: "bg-blue-500" },
                  { title: "Respect des spécifications", desc: "S'assurer que toutes les exigences sont implémentées.", color: "bg-indigo-500" },
                  { title: "Acceptation utilisateur", desc: "Valider l'adéquation avec les attentes réelles.", color: "bg-purple-500" }
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
            Nos outils pour les tests de validation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Une sélection d'outils adaptés pour couvrir tous les aspects de la validation, du fonctionnel au technique.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Playwright", icon: "🎭", color: "from-green-500 to-green-600", desc: "Tests E2E complets avec validation multi-navigateurs.", link: "/services/playwright", badge: "Idéal pour E2E →", badgeColor: "text-green-600" },
            { name: "Cypress", icon: "🌲", color: "from-teal-500 to-teal-600", desc: "Interface visuelle pour validation interactive.", link: "/services/cypress", badge: "Parfait pour debugging →", badgeColor: "text-teal-600" },
            { name: "Selenium", icon: "🌐", color: "from-blue-500 to-blue-600", desc: "Standard industriel pour validation cross-browser.", link: "/services/selenium", badge: "Multi-navigateurs →", badgeColor: "text-blue-600" },
            { name: "Postman", icon: "📮", color: "from-orange-500 to-orange-600", desc: "Validation complète des APIs et services.", link: "/services/postman", badge: "API testing →", badgeColor: "text-orange-600" }
          ].map((tool, index) => (
            <a key={index} href={tool.link} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className={`bg-gradient-to-br ${tool.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-2xl">{tool.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{tool.desc}</p>
              <div className={`${tool.badgeColor} text-sm font-medium`}>
                {tool.badge}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Section méthodologie */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre méthodologie de validation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une approche structurée pour garantir une validation complète et efficace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🔄 Processus de validation</h3>
              <div className="space-y-4">
                {[
                  { title: "Analyse des exigences", desc: "Compréhension approfondie des spécifications métier.", color: "bg-blue-500" },
                  { title: "Planification des tests", desc: "Définition de la stratégie et des scénarios de validation.", color: "bg-indigo-500" },
                  { title: "Exécution des tests", desc: "Tests manuels et automatisés selon la stratégie définie.", color: "bg-purple-500" },
                  { title: "Validation des résultats", desc: "Analyse des résultats et validation avec les parties prenantes.", color: "bg-blue-600" }
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Types de validation</h3>
              <div className="space-y-3">
                {[
                  { type: "Validation fonctionnelle", coverage: "Comportements métier" },
                  { type: "Validation d'interface", coverage: "Ergonomie et UX" },
                  { type: "Validation des données", coverage: "Intégrité et cohérence" },
                  { type: "Validation de performance", coverage: "Temps de réponse" },
                  { type: "Validation de sécurité", coverage: "Conformité sécuritaire" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.type}</span>
                    <span className="text-sm text-gray-600">{item.coverage}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🎯 Critères de succès</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['Conformité 100%', 'Zéro défaut critique', 'Validation métier', 'Acceptation utilisateur'].map((criteria, index) => (
                    <div key={index} className="text-blue-700">• {criteria}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCTA
        title="Besoin de valider votre application ?"
        description="Nos experts en validation vous accompagnent pour garantir la conformité totale de votre produit."
        gradientFrom="from-gray-900"
        gradientVia="via-blue-900"
        gradientTo="to-indigo-900"
        features={ctaFeatures}
        primaryButton={{
          text: "Planifier une validation",
          href: "/#contact",
          icon: "✅",
          gradientFrom: "from-blue-500",
          gradientTo: "to-indigo-500",
          hoverFrom: "from-blue-600",
          hoverTo: "to-indigo-600"
        }}
        secondaryButton={{
          text: "Voir nos autres services",
          href: "/#services",
          icon: "🛠️"
        }}
      />
    </ServiceLayout>
  );
};

export default Validation; 
import React from "react";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceHero from "@/components/ServiceHero";
import ServiceCTA from "@/components/ServiceCTA";
import { generateSEOConfig } from "@/lib/seoConfig";

const Cypress = () => {
  const seoConfig = generateSEOConfig('services', 'cypress');

  const heroRightContent = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-white rounded-full p-3">
          <svg className="h-12 w-12 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.998 0C5.366 0 0 5.367 0 12a11.992 11.992 0 0 0 12 12c6.633 0 12-5.367 12-12-.001-6.633-5.412-12-12.002-12zM6.37 14.575c.392.523.916.742 1.657.742.35 0 .699-.044 1.004-.175.306-.13.655-.306 1.09-.567l1.223 1.745c-.48.306-1.003.567-1.572.785A6.067 6.067 0 0 1 8.027 17c-1.093 0-2.014-.306-2.763-.872C4.506 15.562 4 14.575 4 13.282c0-.742.175-1.396.523-1.963.35-.567.829-1.047 1.441-1.396.61-.35 1.31-.61 2.1-.785.786-.175 1.658-.24 2.632-.24V7.714c-1.658.043-2.936.24-3.814.61-.916.35-1.310 1.135-1.310 2.31 0 .61.216 1.09.61 1.483l-1.31 1.31c-.35-.35-.523-.785-.523-1.31 0-1.047.35-1.92 1.047-2.632C5.585 8.891 6.676 8.498 8.027 8.498c1.745 0 3.1.35 4.02 1.047.916.7 1.396 1.658 1.396 2.893 0 .567-.13 1.09-.35 1.572-.24.48-.567.916-.96 1.31-.35.35-.785.654-1.31.916-.48.24-1.047.35-1.658.35-.567 0-1.047-.087-1.441-.24-.35-.175-.654-.35-.916-.61l1.31-1.745z"/>
          </svg>
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">✨ Avantages Cypress</h3>
      <div className="space-y-3">
        {['Interface développeur', 'Time-travel debugging', 'Tests en temps réel', 'Screenshots auto'].map((item, index) => (
          <div key={index} className="flex items-center text-white/90">
            <div className="w-2 h-2 bg-teal-300 rounded-full mr-3"></div>
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const ctaFeatures = [
    {
      icon: "🌲",
      title: "Interface intuitive",
      description: "Debugging visuel exceptionnel"
    },
    {
      icon: "⚡", 
      title: "Tests en temps réel",
      description: "Rechargement automatique"
    },
    {
      icon: "🔧",
      title: "Setup simple", 
      description: "Configuration minimale requise"
    }
  ];

  return (
    <ServiceLayout seo={seoConfig}>
      <ServiceHero
        badge="🌲 Modern E2E Testing"
        title="Cypress"
        subtitle="Testing"
        description="Tests E2E modernes avec <strong>Cypress</strong>, l'outil qui révolutionne l'automatisation avec une <strong>interface développeur</strong> exceptionnelle."
        gradientFrom="from-teal-600"
        gradientVia="via-green-500" 
        gradientTo="to-cyan-400"
        titleGradientFrom="from-green-200"
        titleGradientTo="to-cyan-100"
        descriptionColor="text-teal-100"
        primaryButton={{
          text: "Voir une démo",
          href: "#demo",
          icon: "🚀",
          bgColor: "bg-white",
          hoverColor: "hover:bg-teal-50"
        }}
        secondaryButton={{
          text: "Architecture",
          href: "#architecture",
          icon: "🏗️"
        }}
        rightContent={heroRightContent}
      />

      {/* Section Avantages avec icônes */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Cypress ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Cypress transforme l'expérience de développement de tests avec des outils visuels puissants.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "👁️",
              title: "Interface développeur unique",
              description: "Test Runner visuel avec debugging en temps réel et time-travel.",
              color: "from-teal-500 to-teal-600"
            },
            {
              icon: "⚡",
              title: "Rechargement automatique",
              description: "Tests qui se relancent automatiquement à chaque modification.",
              color: "from-green-500 to-green-600"
            },
            {
              icon: "📸",
              title: "Screenshots et vidéos",
              description: "Capture automatique des échecs avec timeline détaillée.",
              color: "from-cyan-500 to-cyan-600"
            },
            {
              icon: "🎯",
              title: "Sélecteurs intelligents",
              description: "Attente automatique des éléments et retry logic intégré.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "🔧",
              title: "Configuration minimale",
              description: "Prêt à l'emploi avec des conventions intelligentes.",
              color: "from-indigo-500 to-indigo-600"
            },
            {
              icon: "🚀",
              title: "API intuitive",
              description: "Syntaxe naturelle proche du comportement utilisateur.",
              color: "from-purple-500 to-purple-600"
            }
          ].map((advantage, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className={`bg-gradient-to-br ${advantage.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-2xl">{advantage.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture avec schéma */}
      <section id="architecture" className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Architecture Cypress
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une architecture unique qui s'exécute dans le navigateur pour un debugging optimal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🏗️ Composants clés</h3>
              <div className="space-y-4">
                {[
                  { title: "Test Runner", desc: "Interface graphique pour exécution et debugging visuel.", color: "bg-teal-500" },
                  { title: "Command Log", desc: "Timeline interactive de toutes les actions de test.", color: "bg-green-500" },
                  { title: "Application Preview", desc: "Vue en temps réel de l'application testée.", color: "bg-cyan-500" },
                  { title: "Network Tab", desc: "Monitoring des requêtes HTTP et réponses.", color: "bg-blue-500" }
                ].map((component, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`${component.color} text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0`}>
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{component.title}</h4>
                      <p className="text-gray-600 text-sm">{component.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Workflow Cypress</h3>
              <div className="space-y-3">
                {[
                  { step: "Lancement Test Runner", status: "🖥️ Interface graphique" },
                  { step: "Sélection des tests", status: "📁 Navigation fichiers" },
                  { step: "Exécution en temps réel", status: "👁️ Debugging visuel" },
                  { step: "Time-travel debugging", status: "⏰ Navigation temporelle" },
                  { step: "Capture des résultats", status: "📸 Screenshots/Vidéos" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.step}</span>
                    <span className="text-sm text-gray-600">{item.status}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                <h4 className="font-semibold text-teal-900 mb-2">🎯 Points forts</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['Debugging visuel', 'Time-travel', 'Rechargement auto', 'API intuitive'].map((strength, index) => (
                    <div key={index} className="text-teal-700">• {strength}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow de test */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Workflow de test avec Cypress
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un processus de développement optimisé avec feedback visuel immédiat.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Écriture",
              description: "Tests avec syntaxe naturelle et API intuitive",
              icon: "✍️",
              color: "from-teal-500 to-teal-600"
            },
            {
              step: "2", 
              title: "Debugging",
              description: "Interface visuelle avec time-travel debugging",
              icon: "🔍",
              color: "from-green-500 to-green-600"
            },
            {
              step: "3",
              title: "Exécution",
              description: "Tests en temps réel avec rechargement automatique",
              icon: "🚀",
              color: "from-cyan-500 to-cyan-600"
            },
            {
              step: "4",
              title: "Analyse",
              description: "Screenshots, vidéos et command log détaillé",
              icon: "📊",
              color: "from-blue-500 to-blue-600"
            }
          ].map((workflow, index) => (
            <div key={index} className="text-center">
              <div className={`bg-gradient-to-br ${workflow.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <span className="text-white text-2xl">{workflow.icon}</span>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
                <div className={`bg-gradient-to-r ${workflow.color} text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3`}>
                  <span className="font-bold text-sm">{workflow.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{workflow.title}</h3>
                <p className="text-gray-600 text-sm">{workflow.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Time-travel debugging */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Time-travel Debugging
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              La fonctionnalité signature de Cypress qui révolutionne le debugging des tests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">⏰ Fonctionnalités</h3>
              <div className="space-y-4">
                {[
                  { title: "Snapshots automatiques", desc: "Capture de l'état DOM à chaque commande.", color: "bg-teal-500" },
                  { title: "Navigation temporelle", desc: "Retour en arrière pour inspecter chaque étape.", color: "bg-green-500" },
                  { title: "Inspection interactive", desc: "Hover sur les commandes pour voir les changements.", color: "bg-cyan-500" },
                  { title: "État des éléments", desc: "Visualisation des propriétés et attributs en temps réel.", color: "bg-blue-500" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`${feature.color} text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0`}>
                      <span className="text-sm font-bold">⏰</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Avantages du Time-travel</h3>
              <div className="space-y-4">
                {[
                  { benefit: "Debugging ultra-rapide", impact: "10x plus rapide" },
                  { benefit: "Compréhension immédiate", impact: "Cause racine visible" },
                  { benefit: "Pas de console.log", impact: "Debugging visuel" },
                  { benefit: "Collaboration améliorée", impact: "Partage de screenshots" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.benefit}</span>
                    <span className="text-sm text-teal-600 font-semibold">{item.impact}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💡 Cas d'usage</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Identifier pourquoi un élément n'est pas cliquable</div>
                  <div>• Comprendre les changements d'état DOM</div>
                  <div>• Analyser les timings et les animations</div>
                  <div>• Débugger les interactions complexes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceCTA
        title="Prêt à révolutionner vos tests avec Cypress ?"
        description="Nos experts Cypress vous accompagnent pour créer des tests visuels et intuitifs."
        gradientFrom="from-gray-900"
        gradientVia="via-teal-900"
        gradientTo="to-green-900"
        features={ctaFeatures}
        primaryButton={{
          text: "Demander une démo",
          href: "/#contact",
          icon: "🚀",
          gradientFrom: "from-teal-500",
          gradientTo: "to-green-500",
          hoverFrom: "from-teal-600",
          hoverTo: "to-green-600"
        }}
        secondaryButton={{
          text: "Voir nos autres services",
          href: "/#services",
          icon: "📋"
        }}
      />
    </ServiceLayout>
  );
};

export default Cypress; 
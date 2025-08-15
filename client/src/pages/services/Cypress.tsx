import React from "react";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceHero from "@/components/ServiceHero";
import ServiceCTA from "@/components/ServiceCTA";
import { generateSEOConfig } from "@/lib/seoConfig";

const Cypress = () => {
  const seoConfig = generateSEOConfig('services', 'cypress');

  const heroRightContent = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div>
        <div>
          <svg className="h-12 w-12 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          </svg>
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">Avantages Cypress</h3>
      <div className="space-y-3">
        {['Interface développeur', 'Time-travel debugging', 'Tests en temps réel', 'Screenshots auto'].map((item, index) => (
          <div key={index} className="flex items-center text-white/90">
            <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <ServiceLayout seo={seoConfig}>
      <ServiceHero
        badge="Modern E2E Testing"
        title="Cypress"
        subtitle="Testing"
        description="Tests E2E modernes avec <strong>Cypress</strong>, l'outil qui révolutionne l'automatisation avec une <strong>interface développeur</strong> exceptionnelle."
        gradientFrom="from-blue-600"
        gradientVia="via-blue-500" 
        gradientTo="to-blue-400"
        titleGradientFrom="from-blue-200"
        titleGradientTo="to-blue-100"
        descriptionColor="text-blue-100"
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
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "⚡",
              title: "Rechargement automatique",
              description: "Tests qui se relancent automatiquement à chaque modification.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "📸",
              title: "Screenshots et vidéos",
              description: "Capture automatique des échecs avec timeline détaillée.",
              color: "from-blue-500 to-blue-600"
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
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "🚀",
              title: "API intuitive",
              description: "Syntaxe naturelle proche du comportement utilisateur.",
              color: "from-blue-500 to-blue-600"
            }
          ].map((advantage, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
              <div className={`${advantage.color}`}>
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture avec schéma */}
      <section id="architecture" className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Composants clés</h3>
              <div className="space-y-4">
                {[
                  { title: "Test Runner", desc: "Interface graphique pour exécution et debugging visuel.", color: "bg-blue-500" },
                  { title: "Command Log", desc: "Timeline interactive de toutes les actions de test.", color: "bg-blue-500" },
                  { title: "Application Preview", desc: "Vue en temps réel de l'application testée.", color: "bg-blue-500" },
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow Cypress</h3>
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
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Points forts</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['Debugging visuel', 'Time-travel', 'Rechargement auto', 'API intuitive'].map((strength, index) => (
                    <div key={index} className="text-blue-700">• {strength}</div>
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
              
              color: "from-blue-500 to-blue-600"
            },
            {
              step: "2", 
              title: "Debugging",
              description: "Interface visuelle avec time-travel debugging",
              
              color: "from-blue-500 to-blue-600"
            },
            {
              step: "3",
              title: "Exécution",
              description: "Tests en temps réel avec rechargement automatique",
              
              color: "from-blue-500 to-blue-600"
            },
            {
              step: "4",
              title: "Analyse",
              description: "Screenshots, vidéos et command log détaillé",
              
              color: "from-blue-500 to-blue-600"
            }
          ].map((workflow, index) => (
            <div key={index} className="text-center">
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
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Fonctionnalités</h3>
              <div className="space-y-4">
                {[
                  { title: "Snapshots automatiques", desc: "Capture de l'état DOM à chaque commande.", color: "bg-blue-500" },
                  { title: "Navigation temporelle", desc: "Retour en arrière pour inspecter chaque étape.", color: "bg-blue-500" },
                  { title: "Inspection interactive", desc: "Hover sur les commandes pour voir les changements.", color: "bg-blue-500" },
                  { title: "État des éléments", desc: "Visualisation des propriétés et attributs en temps réel.", color: "bg-blue-500" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`${feature.color} text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0`}>
                      <span className="text-sm font-bold"></span>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Avantages du Time-travel</h3>
              <div className="space-y-4">
                {[
                  { benefit: "Debugging ultra-rapide", impact: "10x plus rapide" },
                  { benefit: "Compréhension immédiate", impact: "Cause racine visible" },
                  { benefit: "Pas de console.log", impact: "Debugging visuel" },
                  { benefit: "Collaboration améliorée", impact: "Partage de screenshots" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.benefit}</span>
                    <span className="text-sm text-blue-600 font-semibold">{item.impact}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Cas d'usage</h4>
                <div className="text-sm text-blue-700 space-y-1">
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
        gradientVia="via-blue-900"
        gradientTo="to-blue-900"
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
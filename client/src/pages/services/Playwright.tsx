import React from "react";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceHero from "@/components/ServiceHero";
import ServiceCTA from "@/components/ServiceCTA";
import { generateSEOConfig } from "@/lib/seoConfig";

const Playwright = () => {
  const seoConfig = generateSEOConfig('services', 'playwright');

  const heroRightContent = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-center mb-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/75/Playwright_Logo.svg"
          alt="Playwright"
          className="h-16 w-16 object-contain"
        />
      </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">Capacités Playwright</h3>
      <div className="space-y-3">
        {['Tests multi-navigateurs', 'Exécution parallèle', 'Screenshots & Vidéos', 'API moderne & stable'].map((item, index) => (
          <div key={index} className="flex items-center text-white/90">
            <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const ctaFeatures: Array<{
    icon: string;
    title: string;
    description: string;
  }> = [];

  return (
    <ServiceLayout seo={seoConfig}>
      <ServiceHero
        badge="Test Automation"
        title="Playwright"
        subtitle="Testing"
        description="Automatisez vos tests E2E avec <strong>Playwright</strong>, le framework moderne pour des tests <strong>multi-navigateurs</strong> fiables et rapides."
        gradientFrom="from-blue-600"
        gradientVia="via-blue-500" 
        gradientTo="to-blue-700"
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
            Pourquoi choisir Playwright ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Playwright révolutionne l'automatisation des tests avec une approche moderne et des capacités avancées.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "🌐",
              title: "Multi-navigateurs natif",
              description: "Support complet de Chromium, Firefox et Safari avec une seule API.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "⚡",
              title: "Exécution ultra-rapide",
              description: "Tests parallèles par défaut et optimisations automatiques.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "🎯",
              title: "Sélecteurs intelligents",
              description: "Auto-waiting et sélecteurs robustes qui s'adaptent aux changements.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "📸",
              title: "Debugging visuel",
              description: "Screenshots automatiques, vidéos et traces détaillées.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "🔧",
              title: "Configuration zéro",
              description: "Prêt à l'emploi avec des paramètres intelligents par défaut.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: "🚀",
              title: "CI/CD intégré",
              description: "Optimisé pour l'intégration continue avec reporting avancé.",
              color: "from-blue-500 to-blue-600"
            }
          ].map((advantage, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
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
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Architecture Playwright
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une architecture moderne pensée pour la performance et la fiabilité.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Composants clés</h3>
              <div className="space-y-4">
                {[
                  { title: "Test Runner", desc: "Moteur d'exécution optimisé avec parallélisation native.", color: "bg-blue-500" },
                  { title: "Browser Contexts", desc: "Isolation complète entre les tests pour éviter les interférences.", color: "bg-blue-500" },
                  { title: "Auto-waiting", desc: "Attente intelligente des éléments sans timeouts manuels.", color: "bg-blue-500" },
                  { title: "Trace Viewer", desc: "Debugging visuel avec timeline interactive des actions.", color: "bg-blue-500" }
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow Playwright</h3>
              <div className="space-y-3">
                {[
                  { step: "Configuration", status: "✅ Auto-détection" },
                  { step: "Lancement navigateurs", status: "⚡ Parallèle" },
                  { step: "Exécution tests", status: "🎯 Auto-waiting" },
                  { step: "Capture artifacts", status: "📸 Automatique" },
                  { step: "Génération rapport", status: "📊 HTML/JSON" }
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
                  {['API moderne', 'Multi-langages', 'CI/CD ready', 'Debugging avancé'].map((strength, index) => (
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
            Workflow de test avec Playwright
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un processus optimisé de l'écriture à l'exécution des tests.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Écriture",
              description: "Tests avec API intuitive et sélecteurs robustes",
              color: "from-blue-500 to-blue-600"
            },
            {
              step: "2", 
              title: "Configuration",
              description: "Setup automatique multi-navigateurs et environnements",
              color: "from-blue-500 to-blue-600"
            },
            {
              step: "3",
              title: "Exécution",
              description: "Tests parallèles avec auto-waiting intelligent",
              color: "from-blue-500 to-blue-600"
            },
            {
              step: "4",
              title: "Analyse",
              description: "Rapports détaillés avec traces et captures",
              color: "from-blue-500 to-blue-600"
            }
          ].map((workflow, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
                <div className={`bg-gradient-to-r ${workflow.color} text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3`}>
                  <span className="font-bold text-sm">{workflow.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{workflow.title}</h3>
                <p className="text-gray-600 text-sm">{workflow.description}</p>
              </div>
          ))}
        </div>
      </section>

      <ServiceCTA
        title="Prêt à automatiser avec Playwright ?"
        description="Nos experts Playwright vous accompagnent pour créer une suite de tests moderne et fiable."
        gradientFrom="from-gray-900"
        gradientVia="via-blue-900"
        gradientTo="to-blue-900"
        features={ctaFeatures}
        primaryButton={{
          text: "Voir nos autres outils",
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

export default Playwright; 
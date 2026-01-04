import React from "react";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceHero from "@/components/ServiceHero";
import ServiceCTA from "@/components/ServiceCTA";
import { cooperationModels } from "@/components/tools";
import { generateSEOConfig } from "@/lib/seoConfig";

type CooperationModel = {
  title: string;
  subtitle: string;
  color: string;
  points: string[];
};

const Selenium = () => {
  const seoConfig = generateSEOConfig('services', 'selenium');

  const heroRightContent = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-white rounded-full p-3">
          <svg className="h-12 w-12 text-brand-blue-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">Avantages Selenium</h3>
      <div className="space-y-3">
        {['Standard W3C WebDriver', 'Support multi-navigateurs', 'Écosystème mature', 'Selenium Grid intégré'].map((item, index) => (
          <div key={index} className="flex items-center text-white/90">
            <div className="w-2 h-2 bg-brand-blue-400 rounded-full mr-3"></div>
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
  }> = [
    {
      icon: "🏗️",
      title: "Architecture robuste",
      description: "Conception d'architectures Selenium scalables et maintenables"
    },
    {
      icon: "⚡",
      title: "Performance optimale",
      description: "Optimisation des temps d'exécution et stabilité des tests"
    },
    {
      icon: "🌐",
      title: "Grid distribué",
      description: "Mise en place de Selenium Grid pour tests parallèles"
    }
  ];

  return (
    <ServiceLayout seo={seoConfig}>
      <ServiceHero
        badge="Industry Standard"
        title="Selenium"
        subtitle="WebDriver"
        description="Le <strong>standard industriel</strong> pour l'automatisation web avec <strong>WebDriver</strong> et support multi-navigateurs complet."
        gradientFrom="from-brand-blue-900"
        gradientVia="via-brand-blue-600" 
        gradientTo="to-brand-blue-500"
        titleGradientFrom="from-brand-blue-200"
        titleGradientTo="to-brand-blue-100"
        descriptionColor="text-brand-blue-100"
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
            Pourquoi choisir Selenium ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Selenium reste le choix de référence pour l'automatisation web grâce à sa maturité, sa flexibilité et son écosystème complet.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-navigateurs</h3>
            <p className="text-gray-600 text-sm">Support natif de Chrome, Firefox, Safari, Edge avec WebDriver standardisé.</p>
          </div>
          
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Langages multiples</h3>
            <p className="text-gray-600 text-sm">Java, Python, C#, JavaScript, Ruby - choisissez votre langage préféré.</p>
          </div>
          
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Selenium Grid</h3>
            <p className="text-gray-600 text-sm">Tests distribués et parallélisés sur multiple machines et environnements.</p>
          </div>
          
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Écosystème riche</h3>
            <p className="text-gray-600 text-sm">Intégrations avec TestNG, JUnit, frameworks et outils de CI/CD.</p>
          </div>
        </div>
      </section>

      {/* Section Architecture avec schéma */}
      <section className="mb-20" id="architecture">
        <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Architecture Selenium
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez l'architecture modulaire de Selenium avec WebDriver, Grid et son écosystème complet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Composants principaux</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-brand-blue-50 rounded-xl border-l-4 border-brand-blue-600">
                    <div className="bg-brand-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                      🚗
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">WebDriver API</h4>
                      <p className="text-sm text-gray-600">Standard W3C pour contrôle navigateur</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-brand-blue-50 rounded-xl border-l-4 border-brand-blue-600">
                    <div className="bg-brand-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                      🌐
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Selenium Grid</h4>
                      <p className="text-sm text-gray-600">Distribution et parallélisation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-brand-blue-50 rounded-xl border-l-4 border-brand-blue-600">
                    <div className="bg-brand-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                      🔧
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Drivers</h4>
                      <p className="text-sm text-gray-600">ChromeDriver, GeckoDriver, etc.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-brand-blue-50 rounded-xl border-l-4 border-brand-blue-600">
                    <div className="bg-brand-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                      ☁️
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Cloud Integration</h4>
                      <p className="text-sm text-gray-600">BrowserStack, Sauce Labs, AWS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Flux d'exécution</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Initialisation WebDriver</h4>
                      <p className="text-gray-600 text-sm">Lancement du driver spécifique au navigateur cible.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Communication JSON Wire</h4>
                      <p className="text-gray-600 text-sm">Envoi de commandes via protocole HTTP/JSON.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Exécution navigateur</h4>
                      <p className="text-gray-600 text-sm">Actions réalisées dans le navigateur réel.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Retour résultats</h4>
                      <p className="text-gray-600 text-sm">Réponses et états transmis au script de test.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Workflow de test */}
      <section className="mb-20" id="workflow">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Workflow Selenium
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Du développement local au déploiement en production avec Selenium Grid et intégrations CI/CD.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="group cursor-pointer flex flex-col h-full">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300 flex-1 flex flex-col">
                <div className="text-3xl mb-4">💻</div>
                <h3 className="text-lg font-bold mb-2">Développement</h3>
                <p className="text-brand-blue-100 text-sm">Scripts et Page Objects</p>
              </div>
              <div className="mt-4 bg-brand-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Langages</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Java</span>
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Python</span>
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">C#</span>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer flex flex-col h-full">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300 flex-1 flex flex-col">
                <div className="text-3xl mb-4">🧪</div>
                <h3 className="text-lg font-bold mb-2">Test Local</h3>
                <p className="text-brand-blue-100 text-sm">WebDriver local</p>
              </div>
              <div className="mt-4 bg-brand-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Navigateurs</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Chrome</span>
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Firefox</span>
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Safari</span>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer flex flex-col h-full">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300 flex-1 flex flex-col">
                <div className="text-3xl mb-4">🌐</div>
                <h3 className="text-lg font-bold mb-2">Selenium Grid</h3>
                <p className="text-brand-blue-100 text-sm">Tests distribués</p>
              </div>
              <div className="mt-4 bg-brand-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Distribution</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Hub</span>
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Nodes</span>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer flex flex-col h-full">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300 flex-1 flex flex-col">
                <div className="text-3xl mb-4">🔗</div>
                <h3 className="text-lg font-bold mb-2">CI/CD</h3>
                <p className="text-brand-blue-100 text-sm">Intégration continue</p>
              </div>
              <div className="mt-4 bg-brand-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Plateformes</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Jenkins</span>
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">GitHub</span>
                </div>
              </div>
            </div>
            
            <div className="group cursor-pointer flex flex-col h-full">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300 flex-1 flex flex-col">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-bold mb-2">Reporting</h3>
                <p className="text-brand-blue-100 text-sm">Analyses & Métriques</p>
              </div>
              <div className="mt-4 bg-brand-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Outils</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">Allure</span>
                  <span className="bg-brand-blue-200 text-brand-blue-900 px-2 py-1 rounded-full text-xs">ExtentReports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section nos services Selenium */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-brand-blue-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos services Selenium
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expertise complète pour maximiser votre investissement Selenium avec des solutions sur-mesure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🏗️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Architecture & Setup</h3>
              <p className="text-gray-600 text-sm mb-4">Conception et mise en place d'une architecture Selenium robuste et scalable.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Design patterns (Page Object, Factory)</li>
                <li>• Configuration multi-environnements</li>
                <li>• Selenium Grid setup</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🧪</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Développement de tests</h3>
              <p className="text-gray-600 text-sm mb-4">Création de suites de tests automatisés complètes et maintenables.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tests E2E cross-browser</li>
                <li>• Scripts de régression</li>
                <li>• Data-driven testing</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Formation équipes</h3>
              <p className="text-gray-600 text-sm mb-4">Formation approfondie aux bonnes pratiques Selenium et WebDriver.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• WebDriver API mastery</li>
                <li>• Design patterns avancés</li>
                <li>• Debugging et troubleshooting</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Selenium Grid</h3>
              <p className="text-gray-600 text-sm mb-4">Mise en place et optimisation de Selenium Grid pour tests distribués.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Configuration Hub/Nodes</li>
                <li>• Docker containerization</li>
                <li>• Cloud integration</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Optimisation</h3>
              <p className="text-gray-600 text-sm mb-4">Amélioration des performances et stabilité de vos tests existants.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Réduction temps d'exécution</li>
                <li>• Stabilisation tests flaky</li>
                <li>• Parallélisation avancée</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intégration CI/CD</h3>
              <p className="text-gray-600 text-sm mb-4">Intégration complète dans vos pipelines de déploiement.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Jenkins/GitHub Actions</li>
                <li>• Reporting automatisé</li>
                <li>• Notifications intelligentes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section modèles de coopération */}
      <section className="mt-8 sm:mt-12 bg-gradient-to-b from-white via-gray-50 to-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-brand-blue-100 mb-20">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Nos modèles de coopération
          </h3>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez l'approche qui correspond le mieux à vos besoins et contraintes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cooperationModels.map((model: CooperationModel, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-brand-blue-100 hover:border-brand-blue-400 h-full transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className={`w-4 h-4 rounded-full mr-3 sm:mr-4 ${
                  idx === 0 ? 'bg-brand-blue-600' : 
                  idx === 1 ? 'bg-brand-blue-600' : 'bg-brand-blue-400'
                }`}></div>
                <h4 className={`text-xl sm:text-2xl font-bold text-brand-blue-900`}>
                  {model.title}
                </h4>
              </div>
              <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 text-gray-600 italic">
                {model.subtitle}
              </p>
              <ul className="space-y-2 sm:space-y-3">
                {model.points.map((point: string, i: number) => (
                  <li key={i} className="flex items-start text-gray-700">
                    <span className="text-brand-blue-600 mr-2 sm:mr-3 mt-1 text-base sm:text-lg">✓</span>
                    <span className="text-sm sm:text-base leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <ServiceCTA
        title="Prêt à optimiser vos tests avec Selenium ?"
        description="Nos experts Selenium vous accompagnent pour créer une solution d'automatisation robuste et scalable."
        gradientFrom="from-gray-900"
        gradientVia="via-brand-blue-900"
        gradientTo="to-brand-blue-900"
        features={ctaFeatures}
        secondaryButton={{
          text: "Voir nos autres services",
          href: "/#/services",
          icon: "🛠️"
        }}
      />
    </ServiceLayout>
  );
};

export default Selenium;

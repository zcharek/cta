import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cooperationModels } from "@/components/tools";

type CooperationModel = {
  title: string;
  subtitle: string;
  color: string;
  points: string[];
};

const Selenium = () => {
  return (
    <>
      <SEOHead 
        title="Selenium - Automatisation Web multi-navigateurs - Central Test Consulting"
        description="Découvrez Selenium, le standard de l'automatisation web avec support multi-navigateurs et écosystème riche."
        keywords="Selenium, WebDriver, automatisation web, tests multi-navigateurs, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/selenium"
        canonical="https://centraltestagency.com/services/selenium"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-white text-sm font-medium">🚗 Industry Standard</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Selenium
                  <span className="block bg-gradient-to-r from-emerald-200 to-teal-100 bg-clip-text text-transparent">
                    WebDriver
                  </span>
                </h1>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  Le <strong>standard industriel</strong> pour l'automatisation web avec 
                  <strong>WebDriver</strong> et support multi-navigateurs complet.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#demo"
                    className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Voir une démo
                  </a>
                  <a 
                    href="#architecture"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">🏗️</span>
                    Architecture
                  </a>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white rounded-full p-3">
                      <svg className="h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-4 text-center">✨ Avantages Selenium</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
                      <span className="text-sm">Standard W3C WebDriver</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
                      <span className="text-sm">Support multi-navigateurs</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
                      <span className="text-sm">Écosystème mature</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
                      <span className="text-sm">Selenium Grid intégré</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-navigateurs</h3>
                <p className="text-gray-600 text-sm">Support natif de Chrome, Firefox, Safari, Edge avec WebDriver standardisé.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Langages multiples</h3>
                <p className="text-gray-600 text-sm">Java, Python, C#, JavaScript, Ruby - choisissez votre langage préféré.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Selenium Grid</h3>
                <p className="text-gray-600 text-sm">Tests distribués et parallélisés sur multiple machines et environnements.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🏗️ Architecture Selenium
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
                      <div className="flex items-center p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                        <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🚗
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">WebDriver API</h4>
                          <p className="text-sm text-gray-600">Standard W3C pour contrôle navigateur</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500">
                        <div className="bg-emerald-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🌐
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Selenium Grid</h4>
                          <p className="text-sm text-gray-600">Distribution et parallélisation</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-teal-50 rounded-xl border-l-4 border-teal-500">
                        <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🔧
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Drivers</h4>
                          <p className="text-sm text-gray-600">ChromeDriver, GeckoDriver, etc.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
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
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Initialisation WebDriver</h4>
                          <p className="text-gray-600 text-sm">Lancement du driver spécifique au navigateur cible.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Communication JSON Wire</h4>
                          <p className="text-gray-600 text-sm">Envoi de commandes via protocole HTTP/JSON.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Exécution navigateur</h4>
                          <p className="text-gray-600 text-sm">Actions réalisées dans le navigateur réel.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
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
                🔄 Workflow Selenium
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Du développement local au déploiement en production avec Selenium Grid et intégrations CI/CD.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">💻</div>
                    <h3 className="text-lg font-bold mb-2">Développement</h3>
                    <p className="text-green-100 text-sm">Scripts et Page Objects</p>
                  </div>
                  <div className="mt-4 bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-900 mb-2 text-sm">Langages</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">Java</span>
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">Python</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🧪</div>
                    <h3 className="text-lg font-bold mb-2">Test Local</h3>
                    <p className="text-emerald-100 text-sm">WebDriver local</p>
                  </div>
                  <div className="mt-4 bg-emerald-50 rounded-xl p-4">
                    <h4 className="font-semibold text-emerald-900 mb-2 text-sm">Navigateurs</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs">Chrome</span>
                      <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs">Firefox</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🌐</div>
                    <h3 className="text-lg font-bold mb-2">Selenium Grid</h3>
                    <p className="text-teal-100 text-sm">Tests distribués</p>
                  </div>
                  <div className="mt-4 bg-teal-50 rounded-xl p-4">
                    <h4 className="font-semibold text-teal-900 mb-2 text-sm">Distribution</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-teal-200 text-teal-800 px-2 py-1 rounded-full text-xs">Hub</span>
                      <span className="bg-teal-200 text-teal-800 px-2 py-1 rounded-full text-xs">Nodes</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🔄</div>
                    <h3 className="text-lg font-bold mb-2">CI/CD</h3>
                    <p className="text-blue-100 text-sm">Intégration continue</p>
                  </div>
                  <div className="mt-4 bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Plateformes</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">Jenkins</span>
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">GitHub</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="text-lg font-bold mb-2">Reporting</h3>
                    <p className="text-purple-100 text-sm">Analyses & Métriques</p>
                  </div>
                  <div className="mt-4 bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">Outils</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">Allure</span>
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">ExtentReports</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section nos services Selenium */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🛠️ Nos services Selenium
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Expertise complète pour maximiser votre investissement Selenium avec des solutions sur-mesure.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
          <section className="mt-8 sm:mt-12 bg-gradient-to-b from-white via-gray-50 to-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-blue-100 mb-20">
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
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300 h-full transform hover:-translate-y-2"
                >
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className={`w-4 h-4 rounded-full mr-3 sm:mr-4 ${
                      idx === 0 ? 'bg-blue-500' : 
                      idx === 1 ? 'bg-green-500' : 'bg-blue-300'
                    }`}></div>
                    <h4 className={`text-xl sm:text-2xl font-bold text-blue-700`}>
                      {model.title}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 text-gray-600 italic">
                    {model.subtitle}
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {model.points.map((point: string, i: number) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <span className="text-green-500 mr-2 sm:mr-3 mt-1 text-base sm:text-lg">✓</span>
                        <span className="text-sm sm:text-base leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section CTA */}
          <section className="mb-20" id="demo">
            <div className="bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Prêt à optimiser vos tests avec Selenium ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts Selenium vous accompagnent pour créer une solution d'automatisation robuste et scalable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🚗</div>
                    <h3 className="font-bold mb-2">Architecture robuste</h3>
                    <p className="text-sm text-gray-300">WebDriver optimisé et Selenium Grid</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🌐</div>
                    <h3 className="font-bold mb-2">Multi-navigateurs</h3>
                    <p className="text-sm text-gray-300">Support complet Chrome, Firefox, Safari, Edge</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">⚡</div>
                    <h3 className="font-bold mb-2">Performance optimisée</h3>
                    <p className="text-sm text-gray-300">Tests parallélisés et distribués</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Demander une démo
                  </a>
                  <a 
                    href="/#services"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">📋</span>
                    Voir nos autres services
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Selenium; 
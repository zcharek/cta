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

const K6 = () => {
  return (
    <>
      <SEOHead 
        title="k6 - Tests de performance modernes - Central Test Consulting"
        description="Découvrez k6, l'outil de test de performance moderne avec JavaScript ES6+ et métriques temps réel."
        keywords="k6, tests de performance, load testing, stress testing, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/k6"
        canonical="https://centraltestagency.com/services/k6"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-white text-sm font-medium">⚡ Modern Performance</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  k6
                  <span className="block bg-gradient-to-r from-purple-200 to-indigo-100 bg-clip-text text-transparent">
                    Performance
                  </span>
                </h1>
                <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                  Tests de <strong>performance modernes</strong> avec JavaScript ES6+ 
                  et <strong>métriques temps réel</strong> pour applications cloud-native.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#demo"
                    className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Voir une démo
                  </a>
                  <a 
                    href="#architecture"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">📊</span>
                    Métriques
                  </a>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white rounded-full p-3">
                      <svg className="h-12 w-12 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-4 text-center">✨ Avantages k6</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                      <span className="text-sm">JavaScript moderne</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                      <span className="text-sm">Métriques temps réel</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                      <span className="text-sm">Cloud & on-premise</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                      <span className="text-sm">Intégration CI/CD</span>
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
                Pourquoi choisir k6 ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                k6 révolutionne les tests de performance avec une approche développeur-first et des métriques précises.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">JavaScript moderne</h3>
                <p className="text-gray-600 text-sm">Scripts de test avec ES6+, modules et syntaxe familière aux développeurs.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-violet-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Performance</h3>
                <p className="text-gray-600 text-sm">Runtime Go optimisé pour des tests haute performance avec faible empreinte.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Métriques riches</h3>
                <p className="text-gray-600 text-sm">Métriques détaillées temps réel avec seuils personnalisables et alertes.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Flexibilité</h3>
                <p className="text-gray-600 text-sm">Tests locaux, cloud k6, ou intégration avec votre infrastructure existante.</p>
              </div>
            </div>
          </section>

          {/* Section Types de tests avec schéma */}
          <section className="mb-20" id="architecture">
            <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  📊 Types de tests k6
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Découvrez les différents types de tests de performance que vous pouvez réaliser avec k6.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Types de tests</h3>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                        <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          📈
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Load Testing</h4>
                          <p className="text-sm text-gray-600">Performance en conditions normales</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                        <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🔥
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Stress Testing</h4>
                          <p className="text-sm text-gray-600">Point de rupture du système</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                        <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          ⚡
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Spike Testing</h4>
                          <p className="text-sm text-gray-600">Pics soudains de trafic</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🕐
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Soak Testing</h4>
                          <p className="text-sm text-gray-600">Stabilité sur durée prolongée</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Métriques clés</h3>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Response Time</h4>
                          <p className="text-gray-600 text-sm">Temps de réponse moyen, médian, P95, P99 pour analyser la latence.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Throughput</h4>
                          <p className="text-gray-600 text-sm">Requêtes par seconde et débit de données pour mesurer la capacité.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Error Rates</h4>
                          <p className="text-gray-600 text-sm">Taux d'erreur HTTP et échecs de validation pour la fiabilité.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Custom Metrics</h4>
                          <p className="text-gray-600 text-sm">Métriques métier personnalisées pour vos KPIs spécifiques.</p>
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
                🔄 Workflow k6
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Du développement local aux tests en production avec k6 Cloud et intégrations CI/CD.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">✍️</div>
                    <h3 className="text-lg font-bold mb-2">Script</h3>
                    <p className="text-purple-100 text-sm">JavaScript ES6+</p>
                  </div>
                  <div className="mt-4 bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">Syntaxe</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">import/export</span>
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">async/await</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🧪</div>
                    <h3 className="text-lg font-bold mb-2">Test Local</h3>
                    <p className="text-violet-100 text-sm">CLI k6 run</p>
                  </div>
                  <div className="mt-4 bg-violet-50 rounded-xl p-4">
                    <h4 className="font-semibold text-violet-900 mb-2 text-sm">Options</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-violet-200 text-violet-800 px-2 py-1 rounded-full text-xs">--vus</span>
                      <span className="bg-violet-200 text-violet-800 px-2 py-1 rounded-full text-xs">--duration</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="text-lg font-bold mb-2">Métriques</h3>
                    <p className="text-indigo-100 text-sm">Temps réel</p>
                  </div>
                  <div className="mt-4 bg-indigo-50 rounded-xl p-4">
                    <h4 className="font-semibold text-indigo-900 mb-2 text-sm">Outputs</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full text-xs">JSON</span>
                      <span className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full text-xs">InfluxDB</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">☁️</div>
                    <h3 className="text-lg font-bold mb-2">k6 Cloud</h3>
                    <p className="text-blue-100 text-sm">Tests distribués</p>
                  </div>
                  <div className="mt-4 bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">Global</span>
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">Analytics</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🔄</div>
                    <h3 className="text-lg font-bold mb-2">CI/CD</h3>
                    <p className="text-green-100 text-sm">Automatisation</p>
                  </div>
                  <div className="mt-4 bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-900 mb-2 text-sm">Intégrations</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">GitHub</span>
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">Jenkins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section nos services k6 */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🛠️ Nos services k6
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Expertise complète pour implémenter k6 et optimiser les performances de vos applications.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Stratégie de performance</h3>
                  <p className="text-gray-600 text-sm mb-4">Définition de votre stratégie de tests de performance avec k6.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Analyse des besoins</li>
                    <li>• Définition des SLOs</li>
                    <li>• Plan de tests</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-violet-500 to-violet-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Scripts k6 avancés</h3>
                  <p className="text-gray-600 text-sm mb-4">Développement de scripts k6 sophistiqués et réutilisables.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Scripts modulaires</li>
                    <li>• Scénarios complexes</li>
                    <li>• Métriques custom</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Formation équipes</h3>
                  <p className="text-gray-600 text-sm mb-4">Formation complète aux tests de performance avec k6.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• JavaScript pour k6</li>
                    <li>• Patterns de test</li>
                    <li>• Analyse de résultats</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">☁️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">k6 Cloud Setup</h3>
                  <p className="text-gray-600 text-sm mb-4">Configuration et optimisation de k6 Cloud pour vos besoins.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tests distribués globaux</li>
                    <li>• Dashboards personnalisés</li>
                    <li>• Alertes intelligentes</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Intégration CI/CD</h3>
                  <p className="text-gray-600 text-sm mb-4">Intégration de k6 dans vos pipelines de déploiement.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tests automatisés</li>
                    <li>• Seuils de performance</li>
                    <li>• Rapports détaillés</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring & Analytics</h3>
                  <p className="text-gray-600 text-sm mb-4">Mise en place de monitoring avancé avec visualisation.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Grafana dashboards</li>
                    <li>• InfluxDB integration</li>
                    <li>• Alerting Prometheus</li>
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
            <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Prêt à optimiser les performances avec k6 ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts k6 vous accompagnent pour créer une stratégie de tests de performance moderne et efficace.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">⚡</div>
                    <h3 className="font-bold mb-2">Tests modernes</h3>
                    <p className="text-sm text-gray-300">JavaScript ES6+ et runtime Go optimisé</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="font-bold mb-2">Métriques précises</h3>
                    <p className="text-sm text-gray-300">Temps réel avec seuils personnalisables</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">☁️</div>
                    <h3 className="font-bold mb-2">Cloud & on-premise</h3>
                    <p className="text-sm text-gray-300">Flexibilité totale d'infrastructure</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

export default K6; 
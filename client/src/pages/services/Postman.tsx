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

const Postman = () => {
  return (
    <>
      <SEOHead 
        title="Postman - Tests API et collaboration - Central Test Consulting"
        description="Découvrez Postman, la plateforme leader pour tester, documenter et collaborer sur vos APIs avec une interface intuitive."
        keywords="Postman, tests API, REST, GraphQL, documentation API, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/postman"
        canonical="https://centraltestagency.com/services/postman"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-500 to-pink-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-white text-sm font-medium">🚀 API Platform</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Postman
                  <span className="block bg-gradient-to-r from-orange-200 to-pink-100 bg-clip-text text-transparent">
                    API Testing
                  </span>
                </h1>
                <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                  La <strong>plateforme leader</strong> pour tester, documenter et collaborer 
                  sur vos <strong>APIs REST & GraphQL</strong> avec une interface intuitive.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#demo"
                    className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Voir une démo
                  </a>
                  <a 
                    href="#architecture"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">🏗️</span>
                    Fonctionnalités
                  </a>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white rounded-full p-3">
                      <svg className="h-12 w-12 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.527.099C6.955-.744.942 3.9.099 10.473c-.843 6.572 3.8 12.584 10.373 13.428 6.573.843 12.587-3.801 13.428-10.374C24.744 6.955 20.101.943 13.527.099zM15.5 14.5h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-4 text-center">✨ Avantages Postman</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-orange-300 rounded-full mr-3"></div>
                      <span className="text-sm">Interface intuitive</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-orange-300 rounded-full mr-3"></div>
                      <span className="text-sm">Tests automatisés</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-orange-300 rounded-full mr-3"></div>
                      <span className="text-sm">Documentation auto</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-orange-300 rounded-full mr-3"></div>
                      <span className="text-sm">Collaboration équipe</span>
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
                Pourquoi choisir Postman ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Postman simplifie le développement d'API avec des outils complets pour tester, documenter et collaborer efficacement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interface intuitive</h3>
                <p className="text-gray-600 text-sm">Interface graphique moderne pour tester vos APIs sans effort.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tests automatisés</h3>
                <p className="text-gray-600 text-sm">Scripts de test JavaScript avec assertions et workflows complexes.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Documentation auto</h3>
                <p className="text-gray-600 text-sm">Génération automatique de documentation API interactive et à jour.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Collaboration</h3>
                <p className="text-gray-600 text-sm">Workspaces partagés pour une collaboration équipe optimale.</p>
              </div>
            </div>
          </section>

          {/* Section Fonctionnalités avec schéma */}
          <section className="mb-20" id="architecture">
            <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🛠️ Fonctionnalités Postman
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Découvrez l'écosystème complet Postman pour développer, tester et maintenir vos APIs efficacement.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Outils de développement</h3>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                        <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🚀
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">API Client</h4>
                          <p className="text-sm text-gray-600">Interface pour tester vos endpoints</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                        <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          📁
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Collections</h4>
                          <p className="text-sm text-gray-600">Organisation et réutilisation des requêtes</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-pink-50 rounded-xl border-l-4 border-pink-500">
                        <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🌍
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Environments</h4>
                          <p className="text-sm text-gray-600">Gestion des variables et configs</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                        <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🎭
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Mock Servers</h4>
                          <p className="text-sm text-gray-600">Simulation d'APIs pour développement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Fonctionnalités avancées</h3>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Tests automatisés</h4>
                          <p className="text-gray-600 text-sm">Scripts JavaScript avec assertions Chai pour validation complète.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Monitoring continu</h4>
                          <p className="text-gray-600 text-sm">Surveillance automatique de vos APIs avec alertes intelligentes.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Documentation vivante</h4>
                          <p className="text-gray-600 text-sm">Génération automatique de docs interactives et toujours à jour.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">API Network</h4>
                          <p className="text-gray-600 text-sm">Découverte et partage d'APIs publiques dans l'écosystème.</p>
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
                🔄 Workflow API Testing
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Du développement local aux tests de production avec Postman, Newman CLI et intégrations CI/CD.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🎯</div>
                    <h3 className="text-lg font-bold mb-2">Design API</h3>
                    <p className="text-orange-100 text-sm">Spécification et mocking</p>
                  </div>
                  <div className="mt-4 bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-900 mb-2 text-sm">Formats</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">OpenAPI</span>
                      <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">GraphQL</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🧪</div>
                    <h3 className="text-lg font-bold mb-2">Test Manuel</h3>
                    <p className="text-red-100 text-sm">Interface interactive</p>
                  </div>
                  <div className="mt-4 bg-red-50 rounded-xl p-4">
                    <h4 className="font-semibold text-red-900 mb-2 text-sm">Méthodes</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">GET</span>
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">POST</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">⚡</div>
                    <h3 className="text-lg font-bold mb-2">Automatisation</h3>
                    <p className="text-pink-100 text-sm">Scripts et Collections</p>
                  </div>
                  <div className="mt-4 bg-pink-50 rounded-xl p-4">
                    <h4 className="font-semibold text-pink-900 mb-2 text-sm">Scripts</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs">Pre-request</span>
                      <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs">Tests</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🔄</div>
                    <h3 className="text-lg font-bold mb-2">CI/CD</h3>
                    <p className="text-purple-100 text-sm">Newman CLI</p>
                  </div>
                  <div className="mt-4 bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">Intégrations</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">Jenkins</span>
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">GitHub</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="text-lg font-bold mb-2">Monitoring</h3>
                    <p className="text-blue-100 text-sm">Surveillance continue</p>
                  </div>
                  <div className="mt-4 bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Alertes</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">Email</span>
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">Slack</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section nos services Postman */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🛠️ Nos services Postman
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Expertise complète pour optimiser vos workflows API avec Postman et améliorer votre productivité.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Setup & Configuration</h3>
                  <p className="text-gray-600 text-sm mb-4">Configuration optimale de Postman pour vos équipes et projets.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Workspaces organisation</li>
                    <li>• Environments setup</li>
                    <li>• Variables management</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📁</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Collections avancées</h3>
                  <p className="text-gray-600 text-sm mb-4">Création de collections sophistiquées avec tests automatisés.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Test scripts JavaScript</li>
                    <li>• Workflows complexes</li>
                    <li>• Data-driven testing</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Formation équipes</h3>
                  <p className="text-gray-600 text-sm mb-4">Formation complète aux bonnes pratiques Postman et API testing.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• API testing fundamentals</li>
                    <li>• Scripting avancé</li>
                    <li>• Collaboration workflows</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Intégration CI/CD</h3>
                  <p className="text-gray-600 text-sm mb-4">Intégration de vos tests Postman dans les pipelines de déploiement.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Newman CLI setup</li>
                    <li>• Pipeline automation</li>
                    <li>• Reporting avancé</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring & Alertes</h3>
                  <p className="text-gray-600 text-sm mb-4">Mise en place de monitoring continu avec alertes intelligentes.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Scheduled monitoring</li>
                    <li>• Custom alerting</li>
                    <li>• Performance tracking</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Documentation API</h3>
                  <p className="text-gray-600 text-sm mb-4">Création de documentation API interactive et professionnelle.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Auto-generated docs</li>
                    <li>• Interactive examples</li>
                    <li>• Public API publishing</li>
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
            <div className="bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Prêt à optimiser vos tests API avec Postman ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts Postman vous accompagnent pour créer des workflows API efficaces et une collaboration optimale.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🚀</div>
                    <h3 className="font-bold mb-2">Setup rapide</h3>
                    <p className="text-sm text-gray-300">Collections et environnements prêts en quelques heures</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">⚡</div>
                    <h3 className="font-bold mb-2">Tests automatisés</h3>
                    <p className="text-sm text-gray-300">Scripts JavaScript avancés et CI/CD intégration</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">👥</div>
                    <h3 className="font-bold mb-2">Collaboration équipe</h3>
                    <p className="text-sm text-gray-300">Workspaces partagés et documentation vivante</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

export default Postman; 
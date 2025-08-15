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

const Percy = () => {
  return (
    <>
      <SEOHead 
        title="Percy - Tests visuels automatisés - Central Test Consulting"
        description="Découvrez Percy, la plateforme leader pour les tests visuels automatisés avec détection intelligente des régressions."
        keywords="Percy, tests visuels, visual testing, régression visuelle, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/percy"
        canonical="https://centraltestagency.com/services/percy"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-500 to-orange-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-white text-sm font-medium">👁️ Visual Testing</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Percy
                  <span className="block bg-gradient-to-r from-pink-200 to-orange-100 bg-clip-text text-transparent">
                    Visual Testing
                  </span>
                </h1>
                <p className="text-xl text-pink-100 mb-8 leading-relaxed">
                  Tests <strong>visuels automatisés</strong> avec détection intelligente 
                  des <strong>régressions visuelles</strong> pour une UI parfaite.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#demo"
                    className="inline-flex items-center px-8 py-4 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Voir une démo
                  </a>
                  <a 
                    href="#architecture"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">👁️</span>
                    Fonctionnalités
                  </a>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white rounded-full p-3">
                      <svg className="h-12 w-12 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-4 text-center">✨ Avantages Percy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-pink-300 rounded-full mr-3"></div>
                      <span className="text-sm">Détection automatique</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-pink-300 rounded-full mr-3"></div>
                      <span className="text-sm">Cross-browser testing</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-pink-300 rounded-full mr-3"></div>
                      <span className="text-sm">Responsive testing</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-pink-300 rounded-full mr-3"></div>
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
                Pourquoi choisir Percy ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Percy automatise la détection des régressions visuelles pour garantir une expérience utilisateur parfaite.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Détection intelligente</h3>
                <p className="text-gray-600 text-sm">IA avancée pour détecter les vraies régressions et ignorer les faux positifs.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cross-browser</h3>
                <p className="text-gray-600 text-sm">Tests simultanés sur Chrome, Firefox, Safari et Edge automatiquement.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Responsive</h3>
                <p className="text-gray-600 text-sm">Validation automatique sur toutes les tailles d'écran et appareils.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Intégration native</h3>
                <p className="text-gray-600 text-sm">Intégration transparente avec vos outils de développement existants.</p>
              </div>
            </div>
          </section>

          {/* Section nos services Percy */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🛠️ Nos services Percy
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Expertise complète pour implémenter Percy et automatiser vos tests visuels efficacement.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Stratégie visuelle</h3>
                  <p className="text-gray-600 text-sm mb-4">Définition de votre stratégie de tests visuels avec Percy.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Analyse des besoins UI</li>
                    <li>• Sélection des composants critiques</li>
                    <li>• Plan de couverture visuelle</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-rose-500 to-rose-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Setup & Configuration</h3>
                  <p className="text-gray-600 text-sm mb-4">Configuration optimale de Percy pour vos projets.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• SDK integration</li>
                    <li>• Baseline management</li>
                    <li>• Threshold configuration</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Formation équipes</h3>
                  <p className="text-gray-600 text-sm mb-4">Formation complète aux tests visuels avec Percy.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visual testing fundamentals</li>
                    <li>• Best practices Percy</li>
                    <li>• Review workflows</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Intégration CI/CD</h3>
                  <p className="text-gray-600 text-sm mb-4">Intégration de Percy dans vos pipelines de développement.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Automated visual testing</li>
                    <li>• PR integration</li>
                    <li>• Approval workflows</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Tests responsive</h3>
                  <p className="text-gray-600 text-sm mb-4">Validation visuelle sur tous les devices et résolutions.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Multi-device testing</li>
                    <li>• Breakpoint validation</li>
                    <li>• Mobile-first approach</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Debugging avancé</h3>
                  <p className="text-gray-600 text-sm mb-4">Outils et techniques pour résoudre les problèmes visuels.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visual diff analysis</li>
                    <li>• False positive reduction</li>
                    <li>• Performance optimization</li>
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
            <div className="bg-gradient-to-br from-gray-900 via-pink-900 to-orange-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Prêt à automatiser vos tests visuels avec Percy ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts Percy vous accompagnent pour créer une stratégie de tests visuels robuste et automatisée.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">👁️</div>
                    <h3 className="font-bold mb-2">Détection intelligente</h3>
                    <p className="text-sm text-gray-300">IA avancée pour régressions visuelles</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🌐</div>
                    <h3 className="font-bold mb-2">Cross-browser</h3>
                    <p className="text-sm text-gray-300">Tests simultanés sur tous navigateurs</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">📱</div>
                    <h3 className="font-bold mb-2">Responsive</h3>
                    <p className="text-sm text-gray-300">Validation sur toutes les résolutions</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

export default Percy; 
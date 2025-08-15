import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Stress = () => {
  return (
    <>
      <SEOHead 
        title="Tests de Stress - Central Test Consulting"
        description="Tests de stress pour pousser votre système au-delà de ses limites normales et identifier son point de rupture."
        keywords="tests de stress, point de rupture, limites système, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/stress"
        canonical="https://centraltestagency.com/services/stress"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-rose-500 to-pink-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">💥 Tests de stress</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests de
                <span className="block bg-gradient-to-r from-red-200 to-pink-100 bg-clip-text text-transparent">
                  Stress
                </span>
              </h1>
              <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests de stress</strong> poussent votre système 
                <strong>au-delà de ses limites</strong> pour identifier son point de rupture.
              </p>
            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que les tests de stress ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Les tests de stress évaluent le comportement d'un système lorsqu'il est soumis à une charge extrême, au-delà de sa capacité normale, pour identifier son point de rupture et sa capacité de récupération.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">💥 Objectifs des tests de stress</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Point de rupture</h4>
                        <p className="text-gray-600 text-sm">Identifier la limite absolue du système avant défaillance.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Capacité de récupération</h4>
                        <p className="text-gray-600 text-sm">Évaluer la capacité du système à se rétablir après stress.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Robustesse système</h4>
                        <p className="text-gray-600 text-sm">Tester la stabilité dans des conditions extrêmes.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">⚖️ QA Manuel vs Automation</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
                      QA Manuel (Observation critique)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Surveillance du comportement système</li>
                      <li>• Analyse des défaillances</li>
                      <li>• Évaluation de la récupération</li>
                      <li>• Interprétation des anomalies</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés (Indispensable)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Génération de charge extrême</li>
                      <li>• Collecte de métriques critiques</li>
                      <li>• Tests de rupture contrôlés</li>
                      <li>• Simulation de pics de trafic</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      💡 <strong>Notre approche :</strong> Automation pour générer la charge extrême, surveillance manuelle experte pour analyser les défaillances et la récupération.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section des outils disponibles */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos outils pour les tests de stress
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nous utilisons des outils puissants pour générer une charge extrême et analyser les défaillances.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <a href="/services/k6" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">k6</h3>
                <p className="text-gray-600 text-sm">Génération de charge extrême avec scripts avancés.</p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  Excellent pour stress →
                </div>
              </a>
              
              <a href="/services/postman" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📮</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Postman</h3>
                <p className="text-gray-600 text-sm">Tests de stress API avec monitoring temps réel.</p>
                <div className="mt-4 text-orange-600 text-sm font-medium">
                  Parfait pour APIs →
                </div>
              </a>
              
              <div className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-dashed border-red-300">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">🔥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Surveillance experte</h3>
                <p className="text-gray-600 text-sm">Analyse des défaillances et récupération système.</p>
                <div className="mt-4 text-red-600 text-sm font-medium">
                  Critique pour stress →
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 via-red-900 to-pink-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Besoin de tests de stress ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts vous accompagnent pour tester les limites de votre système et sa capacité de récupération.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">💥</div>
                    <h3 className="font-bold mb-2">Charge extrême</h3>
                    <p className="text-sm text-gray-300">Tests au-delà des limites normales</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🎯</div>
                    <h3 className="font-bold mb-2">Point de rupture</h3>
                    <p className="text-sm text-gray-300">Identification des limites absolues</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🔄</div>
                    <h3 className="font-bold mb-2">Récupération</h3>
                    <p className="text-sm text-gray-300">Évaluation de la résilience</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">💬</span>
                    Discuter de vos besoins
                  </a>
                  <a 
                    href="/#services"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">🛠️</span>
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

export default Stress; 
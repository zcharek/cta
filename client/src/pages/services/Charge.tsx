import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Charge = () => {
  return (
    <>
      <SEOHead 
        title="Tests de Charge - Outils spécialisés - Central Test Consulting"
        description="Découvrez nos outils spécialisés pour les tests de charge : k6, JMeter, Gatling et plus encore."
        keywords="tests de charge, performance testing, k6, JMeter, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/charge"
        canonical="https://centraltestagency.com/services/charge"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section de recommandation */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">⚡ Tests de charge</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests de
                <span className="block bg-gradient-to-r from-purple-200 to-indigo-100 bg-clip-text text-transparent">
                  Charge
                </span>
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests de charge</strong> sont réalisés avec nos <strong>outils spécialisés</strong>. 
                Découvrez l'outil le plus adapté à vos besoins.
              </p>
              

            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que les tests de charge ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Les tests de charge évaluent la capacité d'un système à supporter un nombre spécifique d'utilisateurs simultanés ou de transactions dans des conditions normales d'utilisation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">⚡ Objectifs des tests de charge</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Performance sous charge</h4>
                        <p className="text-gray-600 text-sm">Mesurer les temps de réponse avec un nombre attendu d'utilisateurs.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-violet-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Stabilité système</h4>
                        <p className="text-gray-600 text-sm">Vérifier que le système reste stable sur la durée.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Goulots d'étranglement</h4>
                        <p className="text-gray-600 text-sm">Identifier les points faibles avant la mise en production.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">⚖️ QA Manuel vs Automation</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
                      QA Manuel (Fonctionnel)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Observation du comportement utilisateur</li>
                      <li>• Tests exploratoires sous charge</li>
                      <li>• Validation de l'expérience dégradée</li>
                      <li>• Analyse qualitative des performances</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Simulation de milliers d'utilisateurs</li>
                      <li>• Mesures précises et répétables</li>
                      <li>• Tests de régression performance</li>
                      <li>• Monitoring continu en production</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      💡 <strong>Notre approche :</strong> QA manuel pour l'analyse comportementale, automation pour la simulation massive et les métriques précises.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section des outils recommandés */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos outils pour automatiser les tests de charge
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Les tests de charge nécessitent une automation complète pour simuler des milliers d'utilisateurs simultanés.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <a href="/services/k6" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">k6</h3>
                <p className="text-gray-600 text-sm">Outil moderne de performance testing avec JavaScript ES6+.</p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  Excellent pour charge →
                </div>
              </a>
              
              <a href="/services/postman" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📮</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Postman</h3>
                <p className="text-gray-600 text-sm">Tests de charge API avec collections et monitoring.</p>
                <div className="mt-4 text-orange-600 text-sm font-medium">
                  Parfait pour APIs →
                </div>
              </a>
              
              <a href="/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests de charge UI avec simulation utilisateurs réels.</p>
                <div className="mt-4 text-green-600 text-sm font-medium">
                  Idéal pour UI →
                </div>
              </a>
            </div>
          </section>

          {/* Section explication approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Notre approche des tests de charge
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Nous adaptons nos outils et méthodes selon le type de charge à tester.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Types de tests de charge</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Load Testing</h4>
                        <p className="text-gray-600 text-sm">Tests avec charge normale attendue en production.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-violet-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Stress Testing</h4>
                        <p className="text-gray-600 text-sm">Tests au-delà des limites normales pour trouver le point de rupture.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Spike Testing</h4>
                        <p className="text-gray-600 text-sm">Tests avec pics soudains de charge utilisateur.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Volume Testing</h4>
                        <p className="text-gray-600 text-sm">Tests avec grandes quantités de données.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Outils selon le contexte</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">APIs / Microservices</span>
                      <span className="text-sm text-gray-600">k6, Postman</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Applications Web</span>
                      <span className="text-sm text-gray-600">k6, Playwright</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Systèmes complexes</span>
                      <span className="text-sm text-gray-600">k6, JMeter</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">CI/CD Pipelines</span>
                      <span className="text-sm text-gray-600">k6, Postman</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Métriques clés</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-blue-700">• Temps de réponse</div>
                      <div className="text-blue-700">• Throughput</div>
                      <div className="text-blue-700">• Taux d'erreur</div>
                      <div className="text-blue-700">• Utilisation CPU</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Besoin de tests de charge ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts vous conseillent sur les meilleurs outils pour vos besoins de performance spécifiques.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">⚡</div>
                    <h3 className="font-bold mb-2">Performance</h3>
                    <p className="text-sm text-gray-300">Tests de charge modernes et précis</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="font-bold mb-2">Métriques</h3>
                    <p className="text-sm text-gray-300">Rapports détaillés en temps réel</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🔧</div>
                    <h3 className="font-bold mb-2">Optimisation</h3>
                    <p className="text-sm text-gray-300">Recommandations d'amélioration</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">💬</span>
                    Discuter de vos besoins
                  </a>
                  <a 
                    href="/services/k6"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">🚀</span>
                    Voir k6
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

export default Charge; 
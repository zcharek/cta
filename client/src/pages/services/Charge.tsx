import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PatternBackground from "@/components/PatternBackground";

const Charge = () => {
  return (
    <>
      <SEOHead 
        title="Tests de Charge - Outils spécialisés - Central Test Agency"
        description="Découvrez nos outils spécialisés pour les tests de charge : k6, JMeter, Gatling et plus encore."
        keywords="tests de charge, performance testing, k6, JMeter, Central Test Agency"
        ogUrl="https://centraltestagency.com/#/services/charge"
        canonical="https://centraltestagency.com/#/services/charge"
      />
      <Header />
      <PatternBackground variant="light" opacity={0.1} className="py-20 md:py-24 bg-white">
      <main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section de recommandation */}
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue-900 via-brand-blue-600 to-brand-blue-500 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -trangray-y-32 trangray-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full trangray-y-24 -trangray-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">Tests de charge</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests de
                <span className="block bg-gradient-to-r from-brand-blue-200 to-brand-blue-100 bg-clip-text text-transparent">
                  Charge
                </span>
              </h1>
              <p className="text-xl text-brand-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests de charge</strong> sont réalisés avec nos <strong>outils spécialisés</strong>. 
                Découvrez l'outil le plus adapté à vos besoins.
              </p>
              

            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Objectifs des tests de charge</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Performance sous charge</h4>
                        <p className="text-gray-600 text-sm">Mesurer les temps de réponse avec un nombre attendu d'utilisateurs.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Stabilité système</h4>
                        <p className="text-gray-600 text-sm">Vérifier que le système reste stable sur la durée.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
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
                      <span className="bg-brand-blue-100 text-brand-blue-900 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
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
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-brand-blue-100 text-brand-blue-900 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Simulation de milliers d'utilisateurs</li>
                      <li>• Mesures précises et répétables</li>
                      <li>• Tests de régression performance</li>
                      <li>• Monitoring continu en production</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-brand-blue-50 to-brand-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      <strong>Notre approche :</strong> QA manuel pour l'analyse comportementale, automation pour la simulation massive et les métriques précises.
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
              <a href="/#/services/k6" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/K6-logo.svg/1058px-K6-logo.svg.png" alt="k6" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">k6</h3>
                <p className="text-gray-600 text-sm">Outil moderne de performance testing avec JavaScript ES6+.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Excellent pour charge →
                </div>
              </a>
              
              <a href="/#/services/postman" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png" alt="Postman" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Postman</h3>
                <p className="text-gray-600 text-sm">Tests de charge API avec collections et monitoring.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Parfait pour APIs →
                </div>
              </a>
              
              <a href="/#/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Playwright_Logo.svg" alt="Playwright" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests de charge UI avec simulation utilisateurs réels.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Idéal pour UI →
                </div>
              </a>
            </div>
          </section>

          {/* Section explication approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
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
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Load Testing</h4>
                        <p className="text-gray-600 text-sm">Tests avec charge normale attendue en production.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Stress Testing</h4>
                        <p className="text-gray-600 text-sm">Tests au-delà des limites normales pour trouver le point de rupture.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Spike Testing</h4>
                        <p className="text-gray-600 text-sm">Tests avec pics soudains de charge utilisateur.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
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
                  
                  <div className="mt-6 p-4 bg-brand-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Métriques clés</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-brand-blue-900">• Temps de réponse</div>
                      <div className="text-brand-blue-900">• Throughput</div>
                      <div className="text-brand-blue-900">• Taux d'erreur</div>
                      <div className="text-brand-blue-900">• Utilisation CPU</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 via-brand-blue-900 to-brand-blue-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -trangray-y-32 trangray-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full trangray-y-24 -trangray-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Besoin de tests de charge ?
                </h2>
                <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
                  Nos experts vous conseillent sur les meilleurs outils pour vos besoins de performance spécifiques.
                </p>
                
                
                <div className="flex justify-center">
                  <a 
                    href="/#services"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-blue-600 to-brand-blue-600 text-white font-semibold rounded-xl hover:from-brand-blue-900 hover:to-brand-blue-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-trangray-y-1"
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
      </PatternBackground>
      <Footer />
    </>
  );
};

export default Charge; 
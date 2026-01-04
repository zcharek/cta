import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PatternBackground from "@/components/PatternBackground";

const MonteeCharge = () => {
  return (
    <>
      <SEOHead 
        title="Tests de Montée en Charge - Central Test Agency"
        description="Tests de montée en charge pour évaluer la capacité progressive de votre système sous une charge croissante d'utilisateurs."
        keywords="tests montée en charge, scalabilité, performance progressive, Central Test Agency"
        ogUrl="https://centraltestagency.com/#/services/monteecharge"
        canonical="https://centraltestagency.com/#/services/monteecharge"
      />
      <Header />
      <PatternBackground variant="light" opacity={0.1} className="py-20 md:py-24 bg-white">
      <main>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue-900 via-brand-blue-600 to-brand-blue-500 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -trangray-y-32 trangray-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full trangray-y-24 -trangray-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">Tests de montée en charge</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests de
                <span className="block bg-gradient-to-r from-brand-blue-200 to-brand-blue-100 bg-clip-text text-transparent">
                  Montée en Charge
                </span>
              </h1>
              <p className="text-xl text-brand-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests de montée en charge</strong> évaluent comment votre système 
                réagit à une <strong>charge progressive</strong> d'utilisateurs.
              </p>
            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que les tests de montée en charge ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Les tests de montée en charge évaluent la capacité d'un système à supporter une augmentation progressive du nombre d'utilisateurs simultanés, identifiant le point de saturation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Objectifs de la montée en charge</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Point de saturation</h4>
                        <p className="text-gray-600 text-sm">Identifier le nombre maximum d'utilisateurs supportés.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Scalabilité progressive</h4>
                        <p className="text-gray-600 text-sm">Évaluer la dégradation des performances sous charge croissante.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Planification capacité</h4>
                        <p className="text-gray-600 text-sm">Dimensionner l'infrastructure selon les besoins futurs.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">⚖️ QA Manuel vs Automation</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-brand-blue-100 text-brand-blue-900 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
                      QA Manuel (Observation)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Observation du comportement système</li>
                      <li>• Analyse des logs et métriques</li>
                      <li>• Validation de l'expérience dégradée</li>
                      <li>• Interprétation des résultats</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-brand-blue-100 text-brand-blue-900 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés (Essentiel)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Simulation progressive d'utilisateurs</li>
                      <li>• Collecte automatique de métriques</li>
                      <li>• Tests répétables et précis</li>
                      <li>• Montée en charge programmée</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-brand-blue-50 to-brand-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      <strong>Notre approche :</strong> Automation indispensable pour la simulation progressive, QA manuel pour l'analyse et l'interprétation des résultats.
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
                Nos outils pour les tests de montée en charge
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nous utilisons des outils d'automation spécialisés pour simuler une montée progressive de la charge.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <a href="/#/services/k6" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/K6-logo.svg/1058px-K6-logo.svg.png" alt="k6" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">k6</h3>
                <p className="text-gray-600 text-sm">Outil moderne avec scripts de montée progressive avancés.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Excellent pour progression →
                </div>
              </a>
              
              <a href="/#/services/postman" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png" alt="Postman" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Postman</h3>
                <p className="text-gray-600 text-sm">Tests de montée en charge API avec monitoring intégré.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Parfait pour APIs →
                </div>
              </a>
              
              <div className="group bg-gradient-to-br from-brand-blue-50 to-brand-blue-50 rounded-2xl p-6 border-2 border-dashed border-brand-blue-400">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl"></span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analyse experte</h3>
                <p className="text-gray-600 text-sm">Interprétation des métriques et recommandations.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Essentiel pour analyse →
                </div>
              </div>
            </div>
          </section>

          {/* Section méthodologie montée en charge */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Notre méthodologie de montée en charge
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Une approche progressive pour identifier les limites de votre système.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Processus de montée</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Configuration baseline</h4>
                        <p className="text-gray-600 text-sm">Établissement des métriques de référence avec charge minimale.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Montée progressive</h4>
                        <p className="text-gray-600 text-sm">Augmentation graduelle du nombre d'utilisateurs virtuels.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Identification seuils</h4>
                        <p className="text-gray-600 text-sm">Détection des points de dégradation et de saturation.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Analyse et recommandations</h4>
                        <p className="text-gray-600 text-sm">Rapport avec recommandations de scalabilité.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Métriques surveillées</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Temps de réponse</span>
                      <span className="text-sm text-gray-600">ms (évolution)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Throughput</span>
                      <span className="text-sm text-gray-600">req/sec (capacité)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Taux d'erreur</span>
                      <span className="text-sm text-gray-600">% (stabilité)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Ressources système</span>
                      <span className="text-sm text-gray-600">CPU, RAM, I/O</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-brand-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Phases de montée</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-brand-blue-900">
                        <div className="w-3 h-3 bg-brand-blue-500 rounded-full mr-2"></div>
                        <span><strong>Phase 1 :</strong> Montée linéaire</span>
                      </div>
                      <div className="flex items-center text-brand-blue-900">
                        <div className="w-3 h-3 bg-brand-blue-500 rounded-full mr-2"></div>
                        <span><strong>Phase 2 :</strong> Plateau de stabilité</span>
                      </div>
                      <div className="flex items-center text-brand-blue-900">
                        <div className="w-3 h-3 bg-brand-blue-500 rounded-full mr-2"></div>
                        <span><strong>Phase 3 :</strong> Point de saturation</span>
                      </div>
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
                  Besoin de tests de montée en charge ?
                </h2>
                <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
                  Nos experts vous accompagnent pour identifier les limites de votre système et planifier sa scalabilité.
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

export default MonteeCharge; 
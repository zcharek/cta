import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Regression = () => {
  return (
    <>
      <SEOHead 
        title="Tests de Régression - Central Test Consulting"
        description="Tests de régression pour s'assurer que l'existant fonctionne après chaque modification. Automatisation et surveillance continue de la qualité."
        keywords="tests régression, tests automatisés, surveillance qualité, automatisation tests, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/regression"
        canonical="https://centraltestagency.com/services/regression"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">🔄 Tests de régression</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests de
                <span className="block bg-gradient-to-r from-amber-200 to-orange-100 bg-clip-text text-transparent">
                  Régression
                </span>
              </h1>
              <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests de régression</strong> s'assurent que les nouvelles modifications 
                n'affectent pas les <strong>fonctionnalités existantes</strong>.
              </p>
            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-amber-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que les tests de régression ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Les tests de régression vérifient qu'une modification récente n'a pas introduit de bugs dans les fonctionnalités existantes déjà validées, garantissant la stabilité du système.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🔄 Objectifs des tests de régression</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Prévention des régressions</h4>
                        <p className="text-gray-600 text-sm">Détecter les bugs introduits par les nouvelles modifications.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Stabilité continue</h4>
                        <p className="text-gray-600 text-sm">Maintenir la qualité des fonctionnalités existantes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Confiance déploiement</h4>
                        <p className="text-gray-600 text-sm">Assurer la sécurité des mises en production.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">⚖️ QA Manuel vs Automation</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
                      QA Manuel (Ciblé)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Tests exploratoires post-modification</li>
                      <li>• Validation des parcours critiques</li>
                      <li>• Tests d'impact sur l'UX</li>
                      <li>• Vérification des cas limites</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés (Prioritaire)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Suite de tests automatisés</li>
                      <li>• Exécution rapide et répétable</li>
                      <li>• Intégration CI/CD</li>
                      <li>• Couverture complète du code</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      💡 <strong>Notre approche :</strong> Automation prioritaire pour l'exécution répétée, QA manuel pour les vérifications ciblées et l'impact utilisateur.
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
                Nos outils pour les tests de régression
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nous privilégions l'automation pour une exécution rapide et systématique des tests de régression.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <a href="/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests E2E automatisés robustes et fiables.</p>
                <div className="mt-4 text-green-600 text-sm font-medium">
                  Excellent pour E2E →
                </div>
              </a>
              
              <a href="/services/cypress" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🌲</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cypress</h3>
                <p className="text-gray-600 text-sm">Tests modernes avec debugging visuel intégré.</p>
                <div className="mt-4 text-teal-600 text-sm font-medium">
                  Parfait pour debugging →
                </div>
              </a>
              
              <a href="/services/selenium" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🚗</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Selenium</h3>
                <p className="text-gray-600 text-sm">Standard industriel pour tests multi-navigateurs.</p>
                <div className="mt-4 text-orange-600 text-sm font-medium">
                  Idéal pour couverture →
                </div>
              </a>
              
              <div className="group bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-dashed border-amber-300">
                <div className="bg-gradient-to-br from-amber-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tests manuels</h3>
                <p className="text-gray-600 text-sm">Validation ciblée des impacts utilisateur.</p>
                <div className="mt-4 text-amber-600 text-sm font-medium">
                  Complémentaire →
                </div>
              </div>
            </div>
          </section>

          {/* Section méthodologie régression */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-amber-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Notre méthodologie de régression
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Une approche systématique pour détecter et prévenir les régressions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🔄 Processus de régression</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Analyse d'impact</h4>
                        <p className="text-gray-600 text-sm">Identification des zones potentiellement affectées par les modifications.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Sélection des tests</h4>
                        <p className="text-gray-600 text-sm">Choix intelligent des tests à exécuter selon l'impact.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Exécution automatisée</h4>
                        <p className="text-gray-600 text-sm">Lancement de la suite de tests de régression.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Rapport et suivi</h4>
                        <p className="text-gray-600 text-sm">Analyse des résultats et correction des régressions détectées.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Types de tests de régression</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Smoke tests</span>
                      <span className="text-sm text-gray-600">Validation rapide</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Tests fonctionnels</span>
                      <span className="text-sm text-gray-600">Parcours critiques</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Tests d'intégration</span>
                      <span className="text-sm text-gray-600">Interactions système</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Tests E2E</span>
                      <span className="text-sm text-gray-600">Parcours complets</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-900 mb-2">🎯 Stratégies de sélection</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-amber-700">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span><strong>Tous les tests :</strong> Version majeure</span>
                      </div>
                      <div className="flex items-center text-amber-700">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                        <span><strong>Tests ciblés :</strong> Modification mineure</span>
                      </div>
                      <div className="flex items-center text-amber-700">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                        <span><strong>Smoke tests :</strong> Hotfix urgent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Besoin de tests de régression ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts vous accompagnent pour sécuriser vos déploiements et prévenir les régressions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🔄</div>
                    <h3 className="font-bold mb-2">Automation</h3>
                    <p className="text-sm text-gray-300">Tests automatisés répétables</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🚀</div>
                    <h3 className="font-bold mb-2">CI/CD</h3>
                    <p className="text-sm text-gray-300">Intégration continue</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🛡️</div>
                    <h3 className="font-bold mb-2">Sécurité</h3>
                    <p className="text-sm text-gray-300">Déploiements sécurisés</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

export default Regression; 
import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PatternBackground from "@/components/PatternBackground";

const Regression = () => {
  return (
    <>
      <SEOHead 
        title="Tests de Régression - Central Test Agency"
        description="Tests de régression pour s'assurer que l'existant fonctionne après chaque modification. Automatisation et surveillance continue de la qualité."
        keywords="tests régression, tests automatisés, surveillance qualité, automatisation tests, Central Test Agency"
        ogUrl="https://centraltestagency.com/#/services/regression"
        canonical="https://centraltestagency.com/#/services/regression"
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
                <span className="text-white text-sm font-medium">Tests de régression</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests de
                <span className="block bg-gradient-to-r from-brand-blue-200 to-brand-blue-100 bg-clip-text text-transparent">
                  Régression
                </span>
              </h1>
              <p className="text-xl text-brand-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests de régression</strong> s'assurent que les nouvelles modifications 
                n'affectent pas les <strong>fonctionnalités existantes</strong>.
              </p>
            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Objectifs des tests de régression</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Prévention des régressions</h4>
                        <p className="text-gray-600 text-sm">Détecter les bugs introduits par les nouvelles modifications.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Stabilité continue</h4>
                        <p className="text-gray-600 text-sm">Maintenir la qualité des fonctionnalités existantes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
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
                      <span className="bg-brand-blue-100 text-brand-blue-900 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
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
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-brand-blue-100 text-brand-blue-900 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés (Prioritaire)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Suite de tests automatisés</li>
                      <li>• Exécution rapide et répétable</li>
                      <li>• Intégration CI/CD</li>
                      <li>• Couverture complète du code</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-brand-blue-50 to-brand-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      <strong>Notre approche :</strong> Automation prioritaire pour l'exécution répétée, QA manuel pour les vérifications ciblées et l'impact utilisateur.
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
              <a href="/#/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Playwright_Logo.svg" alt="Playwright" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests E2E automatisés robustes et fiables.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Excellent pour E2E →
                </div>
              </a>
              
              <a href="/#/services/cypress" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://www.cypress.io/cypress_logo_social.png" alt="Cypress" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cypress</h3>
                <p className="text-gray-600 text-sm">Tests modernes avec debugging visuel intégré.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Parfait pour debugging →
                </div>
              </a>
              
              <a href="/#/services/selenium" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Selenium_Logo.png" alt="Selenium" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Selenium</h3>
                <p className="text-gray-600 text-sm">Standard industriel pour tests multi-navigateurs.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Idéal pour couverture →
                </div>
              </a>
              
              <div className="group bg-gradient-to-br from-brand-blue-50 to-brand-blue-50 rounded-2xl p-6 border-2 border-dashed border-brand-blue-400">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tests manuels</h3>
                <p className="text-gray-600 text-sm">Validation ciblée des impacts utilisateur.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Complémentaire →
                </div>
              </div>
            </div>
          </section>

          {/* Section méthodologie régression */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Processus de régression</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Analyse d'impact</h4>
                        <p className="text-gray-600 text-sm">Identification des zones potentiellement affectées par les modifications.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Sélection des tests</h4>
                        <p className="text-gray-600 text-sm">Choix intelligent des tests à exécuter selon l'impact.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Exécution automatisée</h4>
                        <p className="text-gray-600 text-sm">Lancement de la suite de tests de régression.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Types de tests de régression</h3>
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
                  
                  <div className="mt-6 p-4 bg-brand-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Stratégies de sélection</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-brand-blue-900">
                        <div className="w-3 h-3 bg-brand-blue-500 rounded-full mr-2"></div>
                        <span><strong>Tous les tests :</strong> Version majeure</span>
                      </div>
                      <div className="flex items-center text-brand-blue-900">
                        <div className="w-3 h-3 bg-brand-blue-500 rounded-full mr-2"></div>
                        <span><strong>Tests ciblés :</strong> Modification mineure</span>
                      </div>
                      <div className="flex items-center text-brand-blue-900">
                        <div className="w-3 h-3 bg-brand-blue-500 rounded-full mr-2"></div>
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
            <div className="bg-gradient-to-br from-gray-900 via-brand-blue-900 to-brand-blue-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -trangray-y-32 trangray-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full trangray-y-24 -trangray-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Besoin de tests de régression ?
                </h2>
                <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
                  Nos experts vous accompagnent pour sécuriser vos déploiements et prévenir les régressions.
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

export default Regression; 
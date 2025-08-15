import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Integration = () => {
  return (
    <>
      <SEOHead 
        title="Tests d'Intégration - Outils spécialisés - Central Test Consulting"
        description="Découvrez nos outils spécialisés pour les tests d'intégration : Postman, RestAssured, Playwright et plus encore."
        keywords="tests d'intégration, API testing, Postman, RestAssured, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/integration"
        canonical="https://centraltestagency.com/services/integration"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section de recommandation */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-pink-500 to-rose-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">🔗 Tests d'intégration</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests d'
                <span className="block bg-gradient-to-r from-red-200 to-pink-100 bg-clip-text text-transparent">
                  Intégration
                </span>
              </h1>
              <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests d'intégration</strong> sont réalisés avec nos <strong>outils spécialisés</strong>. 
                Découvrez l'outil le plus adapté à vos besoins.
              </p>
              

            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que les tests d'intégration ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Les tests d'intégration vérifient que les différents composants d'une application (UI, API, base de données, services externes) communiquent correctement entre eux.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🔗 Objectifs de l'intégration</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Communication inter-modules</h4>
                        <p className="text-gray-600 text-sm">Vérifier que les modules échangent correctement les données.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Flux de données</h4>
                        <p className="text-gray-600 text-sm">S'assurer que les données transitent sans corruption entre systèmes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Interfaces système</h4>
                        <p className="text-gray-600 text-sm">Valider le bon fonctionnement des APIs et interfaces.</p>
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
                      <li>• Tests exploratoires des flux métier</li>
                      <li>• Validation des scénarios complexes</li>
                      <li>• Tests d'acceptation utilisateur</li>
                      <li>• Découverte d'incohérences métier</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Tests d'APIs répétitifs</li>
                      <li>• Validation des contrats d'interface</li>
                      <li>• Tests de régression automatique</li>
                      <li>• Monitoring continu des intégrations</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      💡 <strong>Notre approche :</strong> QA manuel pour les flux métier complexes, automation pour les tests d'APIs et la surveillance continue.
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
                Nos outils pour automatiser les tests d'intégration
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Après la validation manuelle des flux métier, nous automatisons les tests d'intégration avec des outils spécialisés.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <a href="/services/postman" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📮</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Postman</h3>
                <p className="text-gray-600 text-sm">Plateforme complète pour tester les APIs et leurs intégrations.</p>
                <div className="mt-4 text-orange-600 text-sm font-medium">
                  Parfait pour intégration →
                </div>
              </a>
              
              <a href="/services/restassured" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">☕</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">RestAssured</h3>
                <p className="text-gray-600 text-sm">Tests d'intégration API Java avec syntaxe fluide.</p>
                <div className="mt-4 text-amber-600 text-sm font-medium">
                  Excellent pour Java →
                </div>
              </a>
              
              <a href="/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests d'intégration E2E multi-navigateurs.</p>
                <div className="mt-4 text-green-600 text-sm font-medium">
                  Parfait pour E2E →
                </div>
              </a>
              
              <a href="/services/cypress" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🌲</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cypress</h3>
                <p className="text-gray-600 text-sm">Tests d'intégration avec debugging avancé.</p>
                <div className="mt-4 text-teal-600 text-sm font-medium">
                  Idéal pour debugging →
                </div>
              </a>
            </div>
          </section>

          {/* Section explication approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-red-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Notre approche des tests d'intégration
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Nous adaptons nos outils et méthodes selon le type d'intégration à tester.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Types d'intégration</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Intégration API</h4>
                        <p className="text-gray-600 text-sm">Tests des communications entre services et APIs.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Intégration système</h4>
                        <p className="text-gray-600 text-sm">Tests des interactions entre composants système.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Intégration E2E</h4>
                        <p className="text-gray-600 text-sm">Tests bout-en-bout des flux complets.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Outils selon le type</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">APIs REST/GraphQL</span>
                      <span className="text-sm text-gray-600">Postman, RestAssured</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Microservices</span>
                      <span className="text-sm text-gray-600">Postman, k6</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Applications Web</span>
                      <span className="text-sm text-gray-600">Playwright, Cypress</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Systèmes Legacy</span>
                      <span className="text-sm text-gray-600">Selenium, TestNG</span>
                    </div>
                  </div>
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
                  Besoin de tests d'intégration ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts vous conseillent sur les meilleurs outils pour vos besoins d'intégration spécifiques.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">💬</span>
                    Discuter de vos besoins
                  </a>
                  <a 
                    href="/services/postman"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">🚀</span>
                    Voir Postman
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

export default Integration; 
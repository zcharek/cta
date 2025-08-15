import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Compatibilite = () => {
  return (
    <>
      <SEOHead 
        title="Tests de Compatibilité - Central Test Consulting"
        description="Tests de compatibilité multi-navigateurs et multi-plateformes pour garantir un fonctionnement optimal sur tous les environnements."
        keywords="tests compatibilité, multi-navigateurs, multi-plateformes, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/compatibilite"
        canonical="https://centraltestagency.com/services/compatibilite"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">🌐 Tests de compatibilité</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests de
                <span className="block bg-gradient-to-r from-blue-200 to-teal-100 bg-clip-text text-transparent">
                  Compatibilité
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests de compatibilité</strong> garantissent que votre application 
                fonctionne parfaitement sur <strong>tous les environnements</strong>.
              </p>
            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que les tests de compatibilité ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Les tests de compatibilité vérifient que votre application fonctionne correctement sur différents navigateurs, systèmes d'exploitation, appareils et résolutions d'écran.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🌐 Objectifs de la compatibilité</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Multi-navigateurs</h4>
                        <p className="text-gray-600 text-sm">Vérifier le fonctionnement sur Chrome, Firefox, Safari, Edge.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Multi-appareils</h4>
                        <p className="text-gray-600 text-sm">Tester sur desktop, tablette, mobile et différentes résolutions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Multi-OS</h4>
                        <p className="text-gray-600 text-sm">Compatibilité Windows, macOS, Linux, iOS, Android.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">⚖️ QA Manuel vs Automation</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
                      QA Manuel (Essentiel)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Tests exploratoires multi-appareils</li>
                      <li>• Validation de l'expérience utilisateur</li>
                      <li>• Tests sur appareils physiques</li>
                      <li>• Vérification des rendus visuels</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés (Efficaces)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Tests multi-navigateurs automatisés</li>
                      <li>• Screenshots comparatifs</li>
                      <li>• Tests de régression rapides</li>
                      <li>• Validation fonctionnelle massive</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      💡 <strong>Notre approche :</strong> Automation pour la couverture massive, QA manuel pour la validation de l'expérience sur appareils réels.
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
                Nos outils pour les tests de compatibilité
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nous combinons automation et tests manuels pour une couverture complète de compatibilité.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <a href="/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests multi-navigateurs avec API unifiée moderne.</p>
                <div className="mt-4 text-green-600 text-sm font-medium">
                  Excellent pour automation →
                </div>
              </a>
              
              <a href="/services/selenium" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🚗</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Selenium</h3>
                <p className="text-gray-600 text-sm">Standard industriel avec support multi-navigateurs.</p>
                <div className="mt-4 text-orange-600 text-sm font-medium">
                  Parfait pour couverture →
                </div>
              </a>
              
              <a href="/services/cypress" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🌲</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cypress</h3>
                <p className="text-gray-600 text-sm">Tests modernes avec debugging visuel avancé.</p>
                <div className="mt-4 text-teal-600 text-sm font-medium">
                  Idéal pour debugging →
                </div>
              </a>
              
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-dashed border-blue-300">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tests manuels</h3>
                <p className="text-gray-600 text-sm">Validation sur appareils physiques réels.</p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  Essentiel pour UX →
                </div>
              </div>
            </div>
          </section>

          {/* Section méthodologie compatibilité */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Notre méthodologie de compatibilité
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Une approche structurée pour garantir une compatibilité maximale.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🔄 Processus de test</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Analyse du marché cible</h4>
                        <p className="text-gray-600 text-sm">Identification des navigateurs et appareils prioritaires.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Tests automatisés</h4>
                        <p className="text-gray-600 text-sm">Couverture massive avec nos outils d'automation.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Validation manuelle</h4>
                        <p className="text-gray-600 text-sm">Tests sur appareils physiques pour l'expérience réelle.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Rapport de compatibilité</h4>
                        <p className="text-gray-600 text-sm">Documentation des problèmes et recommandations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Environnements testés</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Navigateurs Desktop</span>
                      <span className="text-sm text-gray-600">Chrome, Firefox, Safari, Edge</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Navigateurs Mobile</span>
                      <span className="text-sm text-gray-600">Safari iOS, Chrome Android</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Systèmes d'exploitation</span>
                      <span className="text-sm text-gray-600">Windows, macOS, Linux</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Appareils mobiles</span>
                      <span className="text-sm text-gray-600">iOS, Android</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Résolutions</span>
                      <span className="text-sm text-gray-600">Desktop, Tablet, Mobile</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📊 Métriques évaluées</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-blue-700">• Rendu visuel</div>
                      <div className="text-blue-700">• Fonctionnalités</div>
                      <div className="text-blue-700">• Performance</div>
                      <div className="text-blue-700">• Responsive design</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Besoin de tests de compatibilité ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts vous accompagnent pour garantir une compatibilité parfaite sur tous les environnements.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🌐</div>
                    <h3 className="font-bold mb-2">Multi-navigateurs</h3>
                    <p className="text-sm text-gray-300">Tests sur tous les navigateurs populaires</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">📱</div>
                    <h3 className="font-bold mb-2">Multi-appareils</h3>
                    <p className="text-sm text-gray-300">Validation sur appareils physiques</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="font-bold mb-2">Rapport détaillé</h3>
                    <p className="text-sm text-gray-300">Analyse complète de compatibilité</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

export default Compatibilite; 
import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Accessibilite = () => {
  return (
    <>
      <SEOHead 
        title="Tests d'Accessibilité - Central Test Consulting"
        description="Tests d'accessibilité pour garantir que votre application est utilisable par tous, y compris les personnes en situation de handicap."
        keywords="tests accessibilité, handicap, WCAG, inclusion, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/accessibilite"
        canonical="https://centraltestagency.com/services/accessibilite"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">♿ Tests d'accessibilité</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests d'
                <span className="block bg-gradient-to-r from-green-200 to-teal-100 bg-clip-text text-transparent">
                  Accessibilité
                </span>
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests d'accessibilité</strong> garantissent que votre application 
                est <strong>utilisable par tous</strong>, sans exception.
              </p>
            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que les tests d'accessibilité ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Les tests d'accessibilité vérifient que votre application peut être utilisée par tous, y compris les personnes en situation de handicap (visuel, auditif, moteur, cognitif).
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">♿ Objectifs de l'accessibilité</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Conformité WCAG</h4>
                        <p className="text-gray-600 text-sm">Respecter les standards internationaux d'accessibilité web.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Inclusion universelle</h4>
                        <p className="text-gray-600 text-sm">Permettre l'accès à tous les utilisateurs, sans discrimination.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Conformité légale</h4>
                        <p className="text-gray-600 text-sm">Respecter les obligations légales d'accessibilité numérique.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">⚖️ QA Manuel vs Automation</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
                      QA Manuel (Indispensable)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Tests avec technologies d'assistance</li>
                      <li>• Navigation au clavier uniquement</li>
                      <li>• Tests avec lecteurs d'écran</li>
                      <li>• Évaluation expérience utilisateur</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés (Complémentaires)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Scan automatique WCAG</li>
                      <li>• Détection des problèmes techniques</li>
                      <li>• Validation des contrastes</li>
                      <li>• Tests de régression accessibilité</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      💡 <strong>Notre approche :</strong> L'accessibilité nécessite principalement des tests manuels avec de vrais utilisateurs et technologies d'assistance.
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
                Nos outils pour les tests d'accessibilité
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nous combinons outils automatisés et expertise manuelle pour une évaluation complète de l'accessibilité.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <a href="/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests automatisés d'accessibilité avec axe-core.</p>
                <div className="mt-4 text-green-600 text-sm font-medium">
                  Excellent pour automation →
                </div>
              </a>
              
              <a href="/services/cypress" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🌲</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cypress</h3>
                <p className="text-gray-600 text-sm">Tests d'accessibilité avec plugins spécialisés.</p>
                <div className="mt-4 text-teal-600 text-sm font-medium">
                  Parfait pour intégration →
                </div>
              </a>
              
              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-dashed border-green-300">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">🦮</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Technologies d'assistance</h3>
                <p className="text-gray-600 text-sm">Tests avec lecteurs d'écran et outils spécialisés.</p>
                <div className="mt-4 text-green-600 text-sm font-medium">
                  Essentiel pour accessibilité →
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border-2 border-dashed border-blue-300">
                <div className="bg-gradient-to-br from-blue-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tests utilisateurs</h3>
                <p className="text-gray-600 text-sm">Sessions avec utilisateurs en situation de handicap.</p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  Indispensable pour validation →
                </div>
              </div>
            </div>
          </section>

          {/* Section méthodologie accessibilité */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Notre méthodologie d'accessibilité
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Une approche complète basée sur les standards WCAG et l'expertise utilisateur.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🔄 Processus d'évaluation</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Audit automatisé</h4>
                        <p className="text-gray-600 text-sm">Scan initial avec outils automatisés pour identifier les problèmes techniques.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Tests manuels experts</h4>
                        <p className="text-gray-600 text-sm">Évaluation par nos experts en accessibilité avec technologies d'assistance.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Tests utilisateurs</h4>
                        <p className="text-gray-600 text-sm">Validation avec de vrais utilisateurs en situation de handicap.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Rapport WCAG</h4>
                        <p className="text-gray-600 text-sm">Documentation détaillée avec recommandations de conformité.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Critères WCAG évalués</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Perceptible</span>
                      <span className="text-sm text-gray-600">Contrastes, alt-text, audio</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Utilisable</span>
                      <span className="text-sm text-gray-600">Clavier, navigation, timing</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Compréhensible</span>
                      <span className="text-sm text-gray-600">Lisible, prévisible, aide</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Robuste</span>
                      <span className="text-sm text-gray-600">Compatible technologies</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">🎯 Niveaux de conformité</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-green-700">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                        <span><strong>A :</strong> Niveau minimum</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span><strong>AA :</strong> Standard recommandé</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                        <span><strong>AAA :</strong> Niveau optimal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Besoin de tests d'accessibilité ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts vous accompagnent pour rendre votre application accessible à tous et conforme aux standards.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">♿</div>
                    <h3 className="font-bold mb-2">Conformité WCAG</h3>
                    <p className="text-sm text-gray-300">Respect des standards internationaux</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🦮</div>
                    <h3 className="font-bold mb-2">Technologies d'assistance</h3>
                    <p className="text-sm text-gray-300">Tests avec lecteurs d'écran</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">👥</div>
                    <h3 className="font-bold mb-2">Tests utilisateurs</h3>
                    <p className="text-sm text-gray-300">Validation avec vrais utilisateurs</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

export default Accessibilite; 
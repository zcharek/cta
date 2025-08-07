import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Acceptation = () => {
  return (
    <>
      <SEOHead 
        title="Tests d'Acceptation - Central Test Consulting"
        description="Tests d'acceptation pour valider que votre système répond aux exigences métier et aux attentes des utilisateurs finaux."
        keywords="tests d'acceptation, validation métier, exigences utilisateur, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/acceptation"
        canonical="https://centraltestagency.com/services/acceptation"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">✅ Tests d'acceptation</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests d'
                <span className="block bg-gradient-to-r from-emerald-200 to-teal-100 bg-clip-text text-transparent">
                  Acceptation
                </span>
              </h1>
              <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests d'acceptation</strong> valident que votre système 
                répond aux <strong>exigences métier</strong> et aux attentes utilisateurs.
              </p>
            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que les tests d'acceptation ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Les tests d'acceptation vérifient que le système développé répond aux exigences métier et aux critères d'acceptation définis par les utilisateurs finaux et les parties prenantes.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">✅ Objectifs des tests d'acceptation</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Validation métier</h4>
                        <p className="text-gray-600 text-sm">Vérifier que le système répond aux besoins métier.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Critères d'acceptation</h4>
                        <p className="text-gray-600 text-sm">Valider les critères définis avec les parties prenantes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Satisfaction utilisateur</h4>
                        <p className="text-gray-600 text-sm">S'assurer que le produit final satisfait les utilisateurs.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">⚖️ QA Manuel vs Automation</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
                      QA Manuel (Prioritaire)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Tests exploratoires métier</li>
                      <li>• Validation avec utilisateurs finaux</li>
                      <li>• Évaluation de l'expérience globale</li>
                      <li>• Tests d'acceptation utilisateur (UAT)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés (Support)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Tests de régression automatisés</li>
                      <li>• Validation des scénarios critiques</li>
                      <li>• Tests de non-régression</li>
                      <li>• Smoke tests avant UAT</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      💡 <strong>Notre approche :</strong> Tests principalement manuels avec les utilisateurs finaux, supportés par l'automation pour la validation technique préalable.
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
                Nos outils pour les tests d'acceptation
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Nous combinons tests manuels avec utilisateurs et automation pour la validation complète.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <a href="/services/cucumber" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🥒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cucumber</h3>
                <p className="text-gray-600 text-sm">BDD avec scénarios en langage naturel pour l'acceptation.</p>
                <div className="mt-4 text-green-600 text-sm font-medium">
                  Parfait pour BDD →
                </div>
              </a>
              
              <a href="/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests E2E pour valider les parcours utilisateur complets.</p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  Excellent pour E2E →
                </div>
              </a>
              
              <a href="/services/cypress" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🌲</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cypress</h3>
                <p className="text-gray-600 text-sm">Tests interactifs avec debugging visuel pour l'acceptation.</p>
                <div className="mt-4 text-teal-600 text-sm font-medium">
                  Idéal pour interaction →
                </div>
              </a>
              
              <div className="group bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-dashed border-emerald-300">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tests utilisateurs</h3>
                <p className="text-gray-600 text-sm">Sessions UAT avec utilisateurs finaux et parties prenantes.</p>
                <div className="mt-4 text-emerald-600 text-sm font-medium">
                  Essentiel pour acceptation →
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-900 via-emerald-900 to-green-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Besoin de tests d'acceptation ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts vous accompagnent pour valider que votre système répond aux exigences métier.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">✅</div>
                    <h3 className="font-bold mb-2">Validation métier</h3>
                    <p className="text-sm text-gray-300">Conformité aux exigences business</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">👥</div>
                    <h3 className="font-bold mb-2">Tests utilisateurs</h3>
                    <p className="text-sm text-gray-300">UAT avec parties prenantes</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🎯</div>
                    <h3 className="font-bold mb-2">Critères d'acceptation</h3>
                    <p className="text-sm text-gray-300">Validation des spécifications</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

export default Acceptation; 
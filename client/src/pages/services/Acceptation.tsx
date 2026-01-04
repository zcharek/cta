import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PatternBackground from "@/components/PatternBackground";

const Acceptation = () => {
  return (
    <>
      <SEOHead 
        title="Tests d'Acceptation - Central Test Agency"
        description="Tests d'acceptation pour valider que votre système répond aux exigences métier et aux attentes des utilisateurs finaux."
        keywords="tests d'acceptation, validation métier, exigences utilisateur, Central Test Agency"
        ogUrl="https://centraltestagency.com/#/services/acceptation"
        canonical="https://centraltestagency.com/#/services/acceptation"
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
                <span className="text-white text-sm font-medium">Tests d'acceptation</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tests
                <span className="block bg-gradient-to-r from-brand-blue-200 to-brand-blue-100 bg-clip-text text-transparent">
                d'Acceptation
                </span>
              </h1>
              <p className="text-xl text-brand-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Les <strong>tests d'acceptation</strong> valident que votre système 
                répond aux <strong>exigences métier</strong> et aux attentes utilisateurs.
              </p>
            </div>
          </div>

          {/* Section définition et approche */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Objectifs des tests d'acceptation</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Validation métier</h4>
                        <p className="text-gray-600 text-sm">Vérifier que le système répond aux besoins métier.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Critères d'acceptation</h4>
                        <p className="text-gray-600 text-sm">Valider les critères définis avec les parties prenantes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
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
                      <span className="bg-brand-blue-100 text-brand-blue-900 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">👤</span>
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
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="bg-brand-blue-100 text-brand-blue-900 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">🤖</span>
                      Tests Automatisés (Support)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-8">
                      <li>• Tests de régression automatisés</li>
                      <li>• Validation des scénarios critiques</li>
                      <li>• Tests de non-régression</li>
                      <li>• Smoke tests avant UAT</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-brand-blue-50 to-brand-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      <strong>Notre approche :</strong> Tests principalement manuels avec les utilisateurs finaux, supportés par l'automation pour la validation technique préalable.
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
              <a href="/#/services/cucumber" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://avatars.githubusercontent.com/u/320565?s=200&v=4" alt="Cucumber" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cucumber</h3>
                <p className="text-gray-600 text-sm">BDD avec scénarios en langage naturel pour l'acceptation.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Parfait pour BDD →
                </div>
              </a>
              
              <a href="/#/services/playwright" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Playwright_Logo.svg" alt="Playwright" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Playwright</h3>
                <p className="text-gray-600 text-sm">Tests E2E pour valider les parcours utilisateur complets.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Excellent pour E2E →
                </div>
              </a>
              
              <a href="/#/services/cypress" className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src="https://www.cypress.io/cypress_logo_social.png" alt="Cypress" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cypress</h3>
                <p className="text-gray-600 text-sm">Tests interactifs avec debugging visuel pour l'acceptation.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Idéal pour interaction →
                </div>
              </a>
              
              <div className="group bg-gradient-to-br from-brand-blue-50 to-brand-blue-50 rounded-2xl p-6 border-2 border-dashed border-brand-blue-400">
                <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tests utilisateurs</h3>
                <p className="text-gray-600 text-sm">Sessions UAT avec utilisateurs finaux et parties prenantes.</p>
                <div className="mt-4 text-brand-blue-900 text-sm font-medium">
                  Essentiel pour acceptation →
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
                  Besoin de tests d'acceptation ?
                </h2>
                <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
                  Nos experts vous accompagnent pour valider que votre système répond aux exigences métier.
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

export default Acceptation; 
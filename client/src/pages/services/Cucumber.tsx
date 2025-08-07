import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cooperationModels } from "@/components/tools";

type CooperationModel = {
  title: string;
  subtitle: string;
  color: string;
  points: string[];
};

const Cucumber = () => {
  return (
    <>
      <SEOHead 
        title="Cucumber - BDD et tests comportementaux - Central Test Consulting"
        description="Découvrez Cucumber, l'outil BDD pour écrire des tests en langage naturel avec Gherkin et collaboration équipe."
        keywords="Cucumber, BDD, Gherkin, tests comportementaux, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/cucumber"
        canonical="https://centraltestagency.com/services/cucumber"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-lime-500 to-emerald-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-white text-sm font-medium">🥒 BDD Framework</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Cucumber
                  <span className="block bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
                    BDD Testing
                  </span>
                </h1>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  Framework <strong>BDD</strong> pour écrire des tests en <strong>langage naturel</strong> 
                  avec Gherkin et collaboration équipe optimale.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#demo"
                    className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Voir une démo
                  </a>
                  <a 
                    href="#architecture"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">📝</span>
                    Gherkin
                  </a>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white rounded-full p-3">
                      <svg className="h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-4 text-center">✨ Avantages Cucumber</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
                      <span className="text-sm">Langage naturel</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
                      <span className="text-sm">Collaboration équipe</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
                      <span className="text-sm">Documentation vivante</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-green-300 rounded-full mr-3"></div>
                      <span className="text-sm">Multi-langages</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Avantages avec icônes */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir Cucumber ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Cucumber facilite la collaboration entre équipes techniques et métier avec des tests en langage naturel.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gherkin naturel</h3>
                <p className="text-gray-600 text-sm">Syntaxe Given-When-Then compréhensible par tous les métiers.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-lime-500 to-lime-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Collaboration</h3>
                <p className="text-gray-600 text-sm">Pont entre équipes techniques, QA et métier pour une vision commune.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Documentation</h3>
                <p className="text-gray-600 text-sm">Spécifications exécutables qui servent de documentation vivante.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-langages</h3>
                <p className="text-gray-600 text-sm">Support Java, JavaScript, Ruby, Python, C# et plus encore.</p>
              </div>
            </div>
          </section>

          {/* Section nos services Cucumber */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🛠️ Nos services Cucumber
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Expertise complète pour implémenter Cucumber et adopter une approche BDD efficace.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Stratégie BDD</h3>
                  <p className="text-gray-600 text-sm mb-4">Définition de votre approche BDD avec Cucumber.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Workshop BDD</li>
                    <li>• Définition des user stories</li>
                    <li>• Collaboration workflows</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-lime-500 to-lime-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Écriture Gherkin</h3>
                  <p className="text-gray-600 text-sm mb-4">Formation à l'écriture de scénarios Gherkin efficaces.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Syntaxe Given-When-Then</li>
                    <li>• Bonnes pratiques</li>
                    <li>• Templates réutilisables</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🏗️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Implémentation</h3>
                  <p className="text-gray-600 text-sm mb-4">Setup complet de Cucumber dans votre projet.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Configuration projet</li>
                    <li>• Step definitions</li>
                    <li>• Hooks et utilities</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Formation équipes</h3>
                  <p className="text-gray-600 text-sm mb-4">Formation complète aux pratiques BDD avec Cucumber.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• BDD fundamentals</li>
                    <li>• Cucumber avancé</li>
                    <li>• Collaboration techniques</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Intégration CI/CD</h3>
                  <p className="text-gray-600 text-sm mb-4">Intégration Cucumber dans vos pipelines.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pipeline automation</li>
                    <li>• Reporting avancé</li>
                    <li>• Parallel execution</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Rapports & Analytics</h3>
                  <p className="text-gray-600 text-sm mb-4">Mise en place de reporting détaillé pour vos tests BDD.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• HTML reports</li>
                    <li>• Cucumber reports</li>
                    <li>• Metrics & KPIs</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section modèles de coopération */}
          <section className="mt-8 sm:mt-12 bg-gradient-to-b from-white via-gray-50 to-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-blue-100 mb-20">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Nos modèles de coopération
              </h3>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Choisissez l'approche qui correspond le mieux à vos besoins et contraintes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {cooperationModels.map((model: CooperationModel, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-300 h-full transform hover:-translate-y-2"
                >
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className={`w-4 h-4 rounded-full mr-3 sm:mr-4 ${
                      idx === 0 ? 'bg-blue-500' : 
                      idx === 1 ? 'bg-green-500' : 'bg-blue-300'
                    }`}></div>
                    <h4 className={`text-xl sm:text-2xl font-bold text-blue-700`}>
                      {model.title}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 text-gray-600 italic">
                    {model.subtitle}
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {model.points.map((point: string, i: number) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <span className="text-green-500 mr-2 sm:mr-3 mt-1 text-base sm:text-lg">✓</span>
                        <span className="text-sm sm:text-base leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section CTA */}
          <section className="mb-20" id="demo">
            <div className="bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Prêt à adopter le BDD avec Cucumber ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts Cucumber vous accompagnent pour créer une approche BDD collaborative et efficace.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🥒</div>
                    <h3 className="font-bold mb-2">BDD naturel</h3>
                    <p className="text-sm text-gray-300">Gherkin en langage naturel pour tous</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">👥</div>
                    <h3 className="font-bold mb-2">Collaboration</h3>
                    <p className="text-sm text-gray-300">Pont entre équipes techniques et métier</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">📚</div>
                    <h3 className="font-bold mb-2">Documentation</h3>
                    <p className="text-sm text-gray-300">Spécifications exécutables et vivantes</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Demander une démo
                  </a>
                  <a 
                    href="/#services"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">📋</span>
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

export default Cucumber; 
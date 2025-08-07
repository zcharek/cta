import React from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GestionProjetAgile = () => {
  return (
    <>
      <SEOHead 
        title="Gestion de Projet Agile - Accompagnement Scrum - Central Test Consulting"
        description="Accompagnement dans la structuration d'équipes Scrum avec création de feature teams. Formation aux méthodologies agiles, ceremonies Scrum et organisation de sprints."
        keywords="gestion projet agile, Scrum, feature team, sprint, ceremonies Scrum, accompagnement agile, Central Test Consulting"
        ogUrl="https://centraltestagency.com/services/gestion-projet-agile"
        canonical="https://centraltestagency.com/services/gestion-projet-agile"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section avec design moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400 rounded-3xl p-8 md:p-12 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-white text-sm font-medium">🚀 Transformation Agile</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Gestion de Projet
                  <span className="block bg-gradient-to-r from-yellow-200 to-yellow-100 bg-clip-text text-transparent">
                    Agile
                  </span>
                </h1>
                <p className="text-xl text-orange-100 mb-8 leading-relaxed">
                  Structurez vos équipes avec des <strong>feature teams</strong> autonomes et 
                  implémentez <strong>Scrum</strong> pour une livraison continue de valeur métier.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#diagnostic"
                    className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">📊</span>
                    Diagnostic gratuit
                  </a>
                  <a 
                    href="#processus"
                    className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <span className="mr-2">⚙️</span>
                    Voir notre processus
                  </a>
                </div>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold text-lg mb-4 text-center">🎯 Nos expertises</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <span className="text-sm">Structuration Feature Teams</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <span className="text-sm">Implémentation Scrum</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <span className="text-sm">Coaching équipes & management</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                      <span className="text-sm">Amélioration continue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Bénéfices avec icônes modernes */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir l'agilité ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Transformez votre organisation avec des méthodes éprouvées qui boostent la productivité et l'engagement des équipes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Livraison rapide</h3>
                <p className="text-gray-600 text-sm">Cycles courts et itératifs pour des livraisons fréquentes de valeur métier.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Qualité accrue</h3>
                <p className="text-gray-600 text-sm">Tests intégrés et reviews régulières pour une qualité logicielle optimale.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Collaboration</h3>
                <p className="text-gray-600 text-sm">Équipes autonomes et communication renforcée entre technique et métier.</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Engagement</h3>
                <p className="text-gray-600 text-sm">Amélioration du bien-être au travail et motivation des équipes.</p>
              </div>
            </div>
          </section>

          {/* Section Feature Team avec schéma */}
          <section className="mb-20" id="feature-team">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🎯 Qu'est-ce qu'une Feature Team ?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Une équipe pluridisciplinaire et autonome, capable de livrer des fonctionnalités complètes de bout en bout.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Composition idéale</h3>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                        <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🎯
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Product Owner</h4>
                          <p className="text-sm text-gray-600">Vision produit & priorisation</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                        <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🔄
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Scrum Master</h4>
                          <p className="text-sm text-gray-600">Facilitation & amélioration continue</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          👩‍💻
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Développeurs</h4>
                          <p className="text-sm text-gray-600">Frontend, Backend, Full-stack</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                        <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🧪
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">QA Engineer</h4>
                          <p className="text-sm text-gray-600">Tests automatisés & qualité</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                        <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                          🎨
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">UX/UI Designer</h4>
                          <p className="text-sm text-gray-600">Expérience utilisateur & interface</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Principes clés</h3>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Autonomie complète</h4>
                          <p className="text-gray-600 text-sm">L'équipe peut livrer une fonctionnalité de A à Z sans dépendance externe.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Focus utilisateur</h4>
                          <p className="text-gray-600 text-sm">Chaque fonctionnalité apporte de la valeur directe aux utilisateurs finaux.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Amélioration continue</h4>
                          <p className="text-gray-600 text-sm">Rétrospectives régulières pour optimiser les processus et la collaboration.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-white text-sm font-bold">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Responsabilité partagée</h4>
                          <p className="text-gray-600 text-sm">Tous les membres sont responsables de la qualité et du succès du produit.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Sprint avec timeline interactive */}
          <section className="mb-20" id="sprint">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                📅 Organisation d'un Sprint de 2 semaines
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez comment nous structurons un sprint avec toutes les cérémonies Scrum pour maximiser la productivité.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold mb-2">Sprint Planning</h3>
                    <div className="text-blue-100 text-sm mb-4">Jour 1 • 4 heures</div>
                    <p className="text-blue-100 text-sm">Sélection des stories, estimation des tâches, définition de l'objectif du sprint.</p>
                  </div>
                  <div className="mt-4 bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Participants</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">PO</span>
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">SM</span>
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">Dev Team</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">💬</div>
                    <h3 className="text-xl font-bold mb-2">Daily Scrum</h3>
                    <div className="text-green-100 text-sm mb-4">Jours 2-9 • 15 min/jour</div>
                    <p className="text-green-100 text-sm">Synchronisation quotidienne, identification des obstacles, ajustement du plan.</p>
                  </div>
                  <div className="mt-4 bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-900 mb-2">3 Questions</h4>
                    <ul className="text-green-800 text-xs space-y-1">
                      <li>• Qu'ai-je fait hier ?</li>
                      <li>• Que vais-je faire aujourd'hui ?</li>
                      <li>• Quels obstacles ?</li>
                    </ul>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="text-xl font-bold mb-2">Sprint Review</h3>
                    <div className="text-purple-100 text-sm mb-4">Jour 10 • 2 heures</div>
                    <p className="text-purple-100 text-sm">Démonstration des fonctionnalités, collecte des feedbacks parties prenantes.</p>
                  </div>
                  <div className="mt-4 bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Livrables</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">Demo</span>
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">Feedback</span>
                    </div>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-4">🔄</div>
                    <h3 className="text-xl font-bold mb-2">Retrospective</h3>
                    <div className="text-orange-100 text-sm mb-4">Jour 10 • 1h30</div>
                    <p className="text-orange-100 text-sm">Analyse du sprint, identification des améliorations, plan d'actions.</p>
                  </div>
                  <div className="mt-4 bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-900 mb-2">Format</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">Start</span>
                      <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">Stop</span>
                      <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">Continue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Processus d'accompagnement */}
          <section className="mb-20" id="processus">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🛣️ Notre processus d'accompagnement
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Une approche progressive et personnalisée pour transformer votre organisation en profondeur.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-white">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Phase 1 : Diagnostic</h3>
                        <p className="text-orange-100">1-2 semaines</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-orange-100">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        Audit de l'organisation actuelle
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        Identification des besoins spécifiques
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        Définition du plan de transformation
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        Formation initiale aux concepts agiles
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  →
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl p-8 text-white">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Phase 2 : Mise en place</h3>
                        <p className="text-blue-100">2-4 semaines</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-blue-100">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        Constitution des feature teams
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        Définition des rôles Scrum
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        Configuration des outils collaboratifs
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                        Création du backlog produit
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg rotate-90">
                  →
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="max-w-2xl">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-8 text-white">
                    <div className="flex items-center mb-6 justify-center">
                      <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold">Phase 3 : Accompagnement</h3>
                        <p className="text-green-100">3-6 mois</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-3 text-green-100">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                          Coaching des premiers sprints
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                          Animation des cérémonies
                        </li>
                      </ul>
                      <ul className="space-y-3 text-green-100">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                          Support Product Owner
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                          Formation continue
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section CTA avec design moderne */}
          <section className="mb-20" id="diagnostic">
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Prêt à transformer votre organisation ?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Nos experts certifiés Scrum vous accompagnent dans votre transformation agile avec une approche personnalisée et des résultats mesurables.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="font-bold mb-2">Diagnostic gratuit</h3>
                    <p className="text-sm text-gray-300">Évaluation complète de votre maturité agile</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🎓</div>
                    <h3 className="font-bold mb-2">Formation certifiante</h3>
                    <p className="text-sm text-gray-300">Montée en compétences de vos équipes</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🚀</div>
                    <h3 className="font-bold mb-2">ROI mesurable</h3>
                    <p className="text-sm text-gray-300">Amélioration quantifiable de la productivité</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Demander un diagnostic gratuit
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

export default GestionProjetAgile; 
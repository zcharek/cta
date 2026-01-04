import React from "react";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceHero from "@/components/ServiceHero";
import ServiceCTA from "@/components/ServiceCTA";
import { generateSEOConfig } from "@/lib/seoConfig";
import { cooperationModels } from "@/components/tools";

type CooperationModel = {
  title: string;
  subtitle: string;
  color: string;
  points: string[];
};

const Percy = () => {
  const seo = generateSEOConfig('services', 'percy');

  const heroRightContent = (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div>
        <div>
                      <svg className="h-12 w-12 text-brand-blue-900" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    </div>
                  </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">Avantages Percy</h3>
                  <div className="space-y-3">
        {["Détection automatique", "Cross-browser testing", "Responsive testing", "Intégration CI/CD"].map((item, index) => (
          <div key={index} className="flex items-center text-white/90">
                      <div className="w-2 h-2 bg-brand-blue-400 rounded-full mr-3"></div>
            <span className="text-sm">{item}</span>
                    </div>
        ))}
                    </div>
                  </div>
  );

  return (
    <ServiceLayout seo={seo}>
      <ServiceHero
        badge="Visual Testing"
        title="Percy"
        subtitle="Visual Testing"
        description="Tests <strong>visuels automatisés</strong> avec détection intelligente des <strong>régressions visuelles</strong> pour une UI parfaite."
        gradientFrom="from-brand-blue-900"
        gradientVia="via-brand-blue-600"
        gradientTo="to-brand-blue-500"
        titleGradientFrom="from-brand-blue-200"
        titleGradientTo="to-brand-blue-100"
        descriptionColor="text-brand-blue-100"
        secondaryButton={{ text: "Architecture", href: "#architecture", icon: "🏗️" }}
        rightContent={heroRightContent}
      />

          {/* Section Avantages avec icônes */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir Percy ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Percy automatise la détection des régressions visuelles pour garantir une expérience utilisateur parfaite.
              </p>
            </div>
            
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "👁️",
              title: "Détection intelligente",
              description: "IA avancée pour détecter les vraies régressions et ignorer les faux positifs.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "🌐",
              title: "Cross-browser",
              description: "Tests simultanés sur Chrome, Firefox, Safari et Edge automatiquement.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "📱",
              title: "Responsive",
              description: "Validation automatique sur toutes les tailles d'écran et appareils.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "⚡",
              title: "Intégration native",
              description: "Intégration transparente avec vos outils de développement existants.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "🔧",
              title: "Configuration zéro",
              description: "Prêt à l'emploi avec des paramètres intelligents par défaut.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "🚀",
              title: "CI/CD intégré",
              description: "Optimisé pour l'intégration continue avec reporting avancé.",
              color: "from-brand-blue-600 to-brand-blue-900"
            }
          ].map((advantage, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-trangray-y-2 border border-gray-100">
              <div className={`bg-gradient-to-br ${advantage.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-2xl">{advantage.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture avec schéma */}
      <section id="architecture" className="mb-20">
        <div className="bg-gradient-to-br from-gray-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Architecture Percy
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une architecture moderne pensée pour la détection intelligente des régressions visuelles.
            </p>
              </div>
              
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Composants clés</h3>
              <div className="space-y-4">
                {[
                  { title: "Visual Engine", desc: "Moteur de comparaison d'images avec IA avancée.", color: "bg-brand-blue-600" },
                  { title: "Browser Automation", desc: "Capture automatique sur tous les navigateurs.", color: "bg-brand-blue-600" },
                  { title: "Smart Diffing", desc: "Détection intelligente des changements visuels.", color: "bg-brand-blue-600" },
                  { title: "Review Interface", desc: "Interface de validation des changements détectés.", color: "bg-brand-blue-600" }
                ].map((component, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`${component.color} text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0`}>
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{component.title}</h4>
                      <p className="text-gray-600 text-sm">{component.desc}</p>
                    </div>
                </div>
                ))}
              </div>
              </div>
              
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow Percy</h3>
              <div className="space-y-3">
                {[
                  { step: "Capture", status: "📸 Automatique" },
                  { step: "Comparaison", status: "🤖 IA avancée" },
                  { step: "Détection", status: "👁️ Smart diffing" },
                  { step: "Review", status: "✅ Interface web" },
                  { step: "Approbation", status: "🚀 CI/CD ready" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.step}</span>
                    <span className="text-sm text-gray-600">{item.status}</span>
                </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-brand-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Points forts</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['IA avancée', 'Multi-browser', 'Responsive', 'CI/CD ready'].map((strength, index) => (
                    <div key={index} className="text-brand-blue-900">• {strength}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow de test */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Workflow de test avec Percy
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un processus optimisé de la capture à l'approbation des changements visuels.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Configuration",
              description: "Setup Percy avec SDK et configuration projet",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "2", 
              title: "Capture",
              description: "Screenshots automatiques sur tous les navigateurs",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "3",
              title: "Comparaison",
              description: "IA avancée pour détecter les changements visuels",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "4",
              title: "Review",
              description: "Interface web pour valider les changements détectés",
              color: "from-brand-blue-600 to-brand-blue-900"
            }
          ].map((workflow, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
              <div className={`bg-gradient-to-r ${workflow.color} text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3`}>
                <span className="font-bold text-sm">{workflow.step}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{workflow.title}</h3>
              <p className="text-gray-600 text-sm">{workflow.description}</p>
            </div>
          ))}
            </div>
          </section>

          {/* Section nos services Percy */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-brand-blue-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Nos services Percy
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Expertise complète pour implémenter Percy et automatiser vos tests visuels efficacement.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Stratégie visuelle</h3>
                  <p className="text-gray-600 text-sm mb-4">Définition de votre stratégie de tests visuels avec Percy.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Analyse des besoins UI</li>
                    <li>• Sélection des composants critiques</li>
                    <li>• Plan de couverture visuelle</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-rose-500 to-rose-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Setup & Configuration</h3>
                  <p className="text-gray-600 text-sm mb-4">Configuration optimale de Percy pour vos projets.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• SDK integration</li>
                    <li>• Baseline management</li>
                    <li>• Threshold configuration</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Formation équipes</h3>
                  <p className="text-gray-600 text-sm mb-4">Formation complète aux tests visuels avec Percy.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visual testing fundamentals</li>
                    <li>• Best practices Percy</li>
                    <li>• Review workflows</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Intégration CI/CD</h3>
                  <p className="text-gray-600 text-sm mb-4">Intégration de Percy dans vos pipelines de développement.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Automated visual testing</li>
                    <li>• PR integration</li>
                    <li>• Approval workflows</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Tests responsive</h3>
                  <p className="text-gray-600 text-sm mb-4">Validation visuelle sur tous les devices et résolutions.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Multi-device testing</li>
                    <li>• Breakpoint validation</li>
                    <li>• Mobile-first approach</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Debugging avancé</h3>
                  <p className="text-gray-600 text-sm mb-4">Outils et techniques pour résoudre les problèmes visuels.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Visual diff analysis</li>
                    <li>• False positive reduction</li>
                    <li>• Performance optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section modèles de coopération */}
          <section className="mt-8 sm:mt-12 bg-gradient-to-b from-white via-gray-50 to-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-brand-blue-100 mb-20">
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
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-brand-blue-100 hover:border-brand-blue-400 h-full transform hover:-trangray-y-2"
                >
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className={`w-4 h-4 rounded-full mr-3 sm:mr-4 ${
                      idx === 0 ? 'bg-brand-blue-600' : 
                      idx === 1 ? 'bg-brand-blue-600' : 'bg-brand-blue-400'
                    }`}></div>
                    <h4 className={`text-xl sm:text-2xl font-bold text-brand-blue-900`}>
                      {model.title}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base font-medium mb-4 sm:mb-6 text-gray-600 italic">
                    {model.subtitle}
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {model.points.map((point: string, i: number) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <span className="text-brand-blue-600 mr-2 sm:mr-3 mt-1 text-base sm:text-lg">✓</span>
                        <span className="text-sm sm:text-base leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

      <ServiceCTA
        title="Prêt à automatiser vos tests visuels avec Percy ?"
        description="Nos experts Percy vous accompagnent pour créer une stratégie de tests visuels robuste et automatisée."
        gradientFrom="from-gray-900"
        gradientVia="via-brand-blue-900"
        gradientTo="to-brand-blue-900"
        features={[]}
        secondaryButton={{ text: "Voir nos autres services", href: "/#services", icon: "📋" }}
      />
    </ServiceLayout>
  );
};

export default Percy; 
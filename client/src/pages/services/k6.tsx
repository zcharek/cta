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

const K6 = () => {
  const seo = generateSEOConfig('services', 'k6');

  const heroRightContent = (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div>
        <div>
                      <svg className="h-12 w-12 text-brand-blue-900" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">Avantages k6</h3>
                  <div className="space-y-3">
        {["JavaScript moderne", "Métriques temps réel", "Cloud & on-premise", "Intégration CI/CD"].map((item, index) => (
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
        badge="Modern Performance"
        title="k6"
        subtitle="Performance"
        description="Tests de <strong>performance modernes</strong> avec JavaScript ES6+ et <strong>métriques temps réel</strong> pour applications cloud-native."
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
                Pourquoi choisir k6 ?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                k6 révolutionne les tests de performance avec une approche développeur-first et des métriques précises.
              </p>
            </div>
            
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "⚡",
              title: "JavaScript moderne",
              description: "Scripts de test avec ES6+, modules et syntaxe familière aux développeurs.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "🚀",
              title: "Performance",
              description: "Runtime Go optimisé pour des tests haute performance avec faible empreinte.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "📊",
              title: "Métriques riches",
              description: "Métriques détaillées temps réel avec seuils personnalisables et alertes.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "☁️",
              title: "Flexibilité",
              description: "Tests locaux, cloud k6, ou intégration avec votre infrastructure existante.",
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
              Architecture k6
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une architecture moderne pensée pour la performance et la scalabilité.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Composants clés</h3>
                    <div className="space-y-4">
                {[
                  { title: "JavaScript Runtime", desc: "Moteur V8 optimisé pour l'exécution des scripts de test.", color: "bg-brand-blue-600" },
                  { title: "Go Engine", desc: "Runtime Go haute performance pour la gestion des requêtes.", color: "bg-brand-blue-600" },
                  { title: "Metrics Engine", desc: "Collecte et analyse des métriques en temps réel.", color: "bg-brand-blue-600" },
                  { title: "Cloud Platform", desc: "Infrastructure distribuée pour tests à grande échelle.", color: "bg-brand-blue-600" }
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow k6</h3>
              <div className="space-y-3">
                {[
                  { step: "Script", status: "📝 JavaScript ES6+" },
                  { step: "Exécution", status: "⚡ Runtime Go" },
                  { step: "Métriques", status: "📊 Temps réel" },
                  { step: "Cloud", status: "☁️ Distribué" },
                  { step: "Rapport", status: "📈 HTML/JSON" }
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
                  {['JavaScript moderne', 'Haute performance', 'Cloud ready', 'Métriques avancées'].map((strength, index) => (
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
            Workflow de test avec k6
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un processus optimisé de l'écriture à l'analyse des tests de performance.
              </p>
            </div>
            
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Écriture",
              description: "Scripts JavaScript ES6+ avec API intuitive",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "2", 
              title: "Configuration",
              description: "Setup des scénarios et seuils de performance",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "3",
              title: "Exécution",
              description: "Tests locaux ou cloud avec métriques temps réel",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "4",
              title: "Analyse",
              description: "Rapports détaillés et alertes automatiques",
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

          {/* Section nos services k6 */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-brand-blue-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Nos services k6
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Expertise complète pour implémenter k6 et optimiser les performances de vos applications.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Stratégie de performance</h3>
                  <p className="text-gray-600 text-sm mb-4">Définition de votre stratégie de tests de performance avec k6.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Analyse des besoins</li>
                    <li>• Définition des SLOs</li>
                    <li>• Plan de tests</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Scripts k6 avancés</h3>
                  <p className="text-gray-600 text-sm mb-4">Développement de scripts k6 sophistiqués et réutilisables.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Scripts modulaires</li>
                    <li>• Scénarios complexes</li>
                    <li>• Métriques custom</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Formation équipes</h3>
                  <p className="text-gray-600 text-sm mb-4">Formation complète aux tests de performance avec k6.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• JavaScript pour k6</li>
                    <li>• Patterns de test</li>
                    <li>• Analyse de résultats</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">☁️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">k6 Cloud Setup</h3>
                  <p className="text-gray-600 text-sm mb-4">Configuration et optimisation de k6 Cloud pour vos besoins.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tests distribués globaux</li>
                    <li>• Dashboards personnalisés</li>
                    <li>• Alertes intelligentes</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Intégration CI/CD</h3>
                  <p className="text-gray-600 text-sm mb-4">Intégration de k6 dans vos pipelines de déploiement.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tests automatisés</li>
                    <li>• Seuils de performance</li>
                    <li>• Rapports détaillés</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring & Analytics</h3>
                  <p className="text-gray-600 text-sm mb-4">Mise en place de monitoring avancé avec visualisation.</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Grafana dashboards</li>
                    <li>• InfluxDB integration</li>
                    <li>• Alerting Prometheus</li>
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
        title="Prêt à optimiser vos tests de performance avec k6 ?"
        description="Nos experts k6 vous accompagnent pour créer des tests de performance modernes et efficaces."
        gradientFrom="from-gray-900"
        gradientVia="via-brand-blue-900"
        gradientTo="to-brand-blue-900"
        secondaryButton={{ text: "Voir nos autres services", href: "/#services", icon: "📋" }}
      />
    </ServiceLayout>
  );
};

export default K6; 
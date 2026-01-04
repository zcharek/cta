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

const Cucumber = () => {
  const seo = generateSEOConfig('services', 'cucumber');

  const heroRightContent = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div>
        <div>
          <svg className="h-12 w-12 text-brand-blue-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">Avantages Cucumber</h3>
      <div className="space-y-3">
        {["Langage naturel", "Collaboration équipe", "Documentation vivante", "Multi-langages"].map((item, index) => (
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
        badge="BDD Framework"
        title="Cucumber"
        subtitle="BDD Testing"
        description="Framework <strong>BDD</strong> pour écrire des tests en <strong>langage naturel</strong> avec Gherkin et collaboration équipe optimale."
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
            Pourquoi choisir Cucumber ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Cucumber facilite la collaboration entre équipes techniques et métier avec des tests en langage naturel.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "📝",
              title: "Gherkin naturel",
              description: "Syntaxe Given-When-Then compréhensible par tous les métiers.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "👥",
              title: "Collaboration",
              description: "Pont entre équipes techniques, QA et métier pour une vision commune.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "📚",
              title: "Documentation",
              description: "Spécifications exécutables qui servent de documentation vivante.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "🌐",
              title: "Multi-langages",
              description: "Support Java, JavaScript, Ruby, Python, C# et plus encore.",
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
              Architecture Cucumber
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une architecture moderne pensée pour la collaboration et la lisibilité des tests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Composants clés</h3>
              <div className="space-y-4">
                {[
                  { title: "Gherkin Parser", desc: "Parseur de syntaxe Given-When-Then en langage naturel.", color: "bg-brand-blue-600" },
                  { title: "Step Definitions", desc: "Mappage des étapes Gherkin vers le code d'implémentation.", color: "bg-brand-blue-600" },
                  { title: "Test Runner", desc: "Exécuteur de tests avec support multi-langages.", color: "bg-brand-blue-600" },
                  { title: "Report Generator", desc: "Génération de rapports HTML avec documentation vivante.", color: "bg-brand-blue-600" }
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow Cucumber</h3>
              <div className="space-y-3">
                {[
                  { step: "Gherkin", status: "📝 Langage naturel" },
                  { step: "Parsing", status: "🔍 Analyse syntaxe" },
                  { step: "Mapping", status: "🔗 Step definitions" },
                  { step: "Exécution", status: "⚡ Test runner" },
                  { step: "Rapport", status: "📊 Documentation" }
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
                  {['Langage naturel', 'Collaboration', 'Documentation', 'Multi-langages'].map((strength, index) => (
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
            Workflow de test avec Cucumber
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un processus optimisé de la spécification à l'exécution des tests BDD.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Spécification",
              description: "Écriture des scénarios en Gherkin avec l'équipe",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "2", 
              title: "Implémentation",
              description: "Développement des step definitions en code",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "3",
              title: "Exécution",
              description: "Tests automatisés avec validation des scénarios",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "4",
              title: "Documentation",
              description: "Rapports HTML avec spécifications vivantes",
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

      {/* Section nos services Cucumber */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-brand-blue-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos services Cucumber
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expertise complète pour implémenter Cucumber et adopter une approche BDD efficace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
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
        title="Prêt à adopter le BDD avec Cucumber ?"
        description="Nos experts Cucumber vous accompagnent pour créer une approche BDD collaborative et efficace."
        gradientFrom="from-gray-900"
        gradientVia="via-brand-blue-900"
        gradientTo="to-brand-blue-900"
        features={[]}
        secondaryButton={{ text: "Voir nos autres services", href: "/#services", icon: "📋" }}
      />
    </ServiceLayout>
  );
};

export default Cucumber;
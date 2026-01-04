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

const RestAssured = () => {
  const seo = generateSEOConfig('services', 'restassured');

  const heroRightContent = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div>
        <div>
          <svg className="h-12 w-12 text-brand-blue-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218"/>
          </svg>
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-4 text-center">Avantages RestAssured</h3>
      <div className="space-y-3">
        {["Syntaxe fluide", "Intégration Java", "Validations avancées", "JSON/XML support"].map((item, index) => (
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
        badge="Java API Testing"
        title="RestAssured"
        subtitle="API Testing"
        description="Bibliothèque <strong>Java puissante</strong> pour tester vos APIs REST avec une <strong>syntaxe fluide</strong> et intuitive."
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
            Pourquoi choisir RestAssured ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            RestAssured simplifie les tests d'API avec une approche Java native et une syntaxe expressive.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "💬",
              title: "Syntaxe fluide",
              description: "API expressive given().when().then() pour des tests lisibles.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "✅",
              title: "Validations",
              description: "Assertions puissantes pour JSON, XML, headers et status codes.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "⚡",
              title: "Performance",
              description: "Exécution rapide et optimisée pour les tests d'intégration.",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              icon: "☕",
              title: "Écosystème Java",
              description: "Intégration parfaite avec TestNG, JUnit et Maven/Gradle.",
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
              Architecture RestAssured
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une architecture moderne pensée pour la simplicité et la puissance des tests API.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Composants clés</h3>
              <div className="space-y-4">
                {[
                  { title: "Request Builder", desc: "Construction fluide des requêtes HTTP avec given().when().", color: "bg-brand-blue-600" },
                  { title: "Response Validator", desc: "Validation puissante des réponses avec then().", color: "bg-brand-blue-600" },
                  { title: "JSON/XML Parser", desc: "Parsing automatique et validation des formats de données.", color: "bg-brand-blue-600" },
                  { title: "Authentication", desc: "Support natif de l'authentification OAuth, Basic, etc.", color: "bg-brand-blue-600" }
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow RestAssured</h3>
              <div className="space-y-3">
                {[
                  { step: "Setup", status: "⚙️ Configuration" },
                  { step: "Request", status: "📤 given().when()" },
                  { step: "Validation", status: "✅ then().assertThat()" },
                  { step: "Extraction", status: "🔍 extract().response()" },
                  { step: "Reporting", status: "📊 HTML/JSON" }
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
                  {['Syntaxe fluide', 'Validations avancées', 'Java natif', 'Performance'].map((strength, index) => (
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
            Workflow de test avec RestAssured
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un processus optimisé de l'écriture à l'exécution des tests API Java.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Écriture",
              description: "Tests avec syntaxe fluide given().when().then()",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "2", 
              title: "Configuration",
              description: "Setup des headers, auth et paramètres de test",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "3",
              title: "Exécution",
              description: "Tests automatisés avec validation des réponses",
              color: "from-brand-blue-600 to-brand-blue-900"
            },
            {
              step: "4",
              title: "Rapport",
              description: "Génération de rapports détaillés avec métriques",
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

      {/* Section nos services RestAssured */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-brand-blue-50 to-brand-blue-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos services RestAssured
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expertise complète pour implémenter RestAssured et automatiser vos tests d'API Java.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🏗️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Architecture API Testing</h3>
              <p className="text-gray-600 text-sm mb-4">Conception d'architecture de tests API robuste avec RestAssured.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Structure de projet optimale</li>
                <li>• Patterns de test</li>
                <li>• Configuration avancée</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🧪</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tests API complets</h3>
              <p className="text-gray-600 text-sm mb-4">Développement de suites de tests API complètes et maintenables.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• REST API testing</li>
                <li>• JSON/XML validation</li>
                <li>• Authentication handling</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Formation équipes</h3>
              <p className="text-gray-600 text-sm mb-4">Formation complète aux bonnes pratiques RestAssured.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Syntaxe fluide mastery</li>
                <li>• Advanced validations</li>
                <li>• Best practices</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intégration CI/CD</h3>
              <p className="text-gray-600 text-sm mb-4">Intégration RestAssured dans vos pipelines Maven/Gradle.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maven/Gradle setup</li>
                <li>• TestNG/JUnit integration</li>
                <li>• Reporting automation</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rapports & Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">Mise en place de reporting détaillé pour vos tests API.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Allure reporting</li>
                <li>• ExtentReports</li>
                <li>• Custom dashboards</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Optimisation</h3>
              <p className="text-gray-600 text-sm mb-4">Amélioration des performances et stabilité des tests API.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Performance optimization</li>
                <li>• Parallel execution</li>
                <li>• Data-driven testing</li>
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
        title="Prêt à optimiser vos tests API avec RestAssured ?"
        description="Nos experts RestAssured vous accompagnent pour créer des tests API Java robustes et maintenables."
        gradientFrom="from-gray-900"
        gradientVia="via-brand-blue-900"
        gradientTo="to-brand-blue-900"
        secondaryButton={{ text: "Voir nos autres services", href: "/#services", icon: "📋" }}
      />
    </ServiceLayout>
  );
};

export default RestAssured;
import { useState, useEffect } from "react";

const services = [
  {
    title: "Tests Fonctionnels",
    icon: "🔧",
    description: "Validation complète de toutes les fonctionnalités de votre application",
    detailedDescription: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir nos services de tests fonctionnels ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Validation exhaustive</h4>
            <p>
              Test complet de chaque fonctionnalité selon les spécifications 
              métier pour garantir la conformité totale.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Détection précoce des bugs</h4>
            <p>
              Identification des défauts avant la mise en production 
              pour réduire les coûts de correction.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests de cas limites</h4>
            <p>
              Validation des comportements dans des conditions extrêmes 
              et des scénarios d'erreur complexes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Couverture multi-plateforme</h4>
            <p>
              Tests sur différents navigateurs, systèmes d'exploitation 
              et appareils pour une compatibilité maximale.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Documentation détaillée</h4>
            <p>
              Rapports complets avec reproduction des bugs et 
              recommandations d'amélioration.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests de régression</h4>
            <p>
              Validation que les nouvelles fonctionnalités n'impactent 
              pas les fonctionnalités existantes.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Notre approche des tests fonctionnels
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Analyse des exigences :</strong> Étude approfondie de vos 
            spécifications pour créer des plans de tests adaptés.
          </li>
          <li>
            <strong>Conception de cas de tests :</strong> Création de scénarios 
            couvrant tous les parcours utilisateurs critiques.
          </li>
          <li>
            <strong>Exécution méthodique :</strong> Tests manuels et automatisés 
            selon une approche structurée et répétable.
          </li>
          <li>
            <strong>Traçabilité complète :</strong> Lien direct entre exigences, 
            cas de tests et résultats pour une couverture optimale.
          </li>
        </ul>
      </>
    ),
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
  },
  {
    title: "Tests End-to-End",
    icon: "📄",
    description: "Validation complète des parcours utilisateurs de bout en bout",
    detailedDescription: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir nos services de tests end-to-end ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Parcours utilisateur complets</h4>
            <p>
              Simulation des vrais parcours utilisateurs du début à la fin 
              pour valider l'expérience globale.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Intégration système</h4>
            <p>
              Test des interactions entre tous les composants, APIs, 
              bases de données et services externes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Automatisation intelligente</h4>
            <p>
              Scripts automatisés robustes pour exécution répétable 
              et intégration continue.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests cross-browser</h4>
            <p>
              Validation sur multiples navigateurs et appareils 
              pour garantir la compatibilité universelle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Gestion des données</h4>
            <p>
              Stratégies de données de test pour scénarios réalistes 
              sans compromettre les données de production.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Monitoring en temps réel</h4>
            <p>
              Surveillance des performances et détection des anomalies 
              pendant l'exécution des tests.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Notre méthodologie end-to-end
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Cartographie des parcours :</strong> Identification et 
            modélisation de tous les flux utilisateurs critiques.
          </li>
          <li>
            <strong>Architecture de tests :</strong> Conception d'une 
            infrastructure de tests scalable et maintenable.
          </li>
          <li>
            <strong>Développement progressif :</strong> Création itérative 
            de suites de tests avec feedback continu.
          </li>
          <li>
            <strong>Intégration CI/CD :</strong> Insertion dans vos pipelines 
            pour validation automatique à chaque déploiement.
          </li>
        </ul>
      </>
    ),
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
  },
  {
    title: "Tests Full-Cycle",
    icon: "🔄",
    description: "Accompagnement complet sur tout le cycle de développement",
    detailedDescription: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir nos services de tests full-cycle ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Intégration native DevOps</h4>
            <p>
              Tests intégrés dans chaque phase du cycle de développement 
              pour une qualité continue.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Shift-left testing</h4>
            <p>
              Anticipation des tests dès la conception pour détecter 
              les problèmes le plus tôt possible.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Automatisation progressive</h4>
            <p>
              Montée en puissance graduelle de l'automatisation 
              selon la maturité du projet.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Feedback continu</h4>
            <p>
              Retours immédiats aux équipes de développement 
              pour correction rapide des défauts.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Métriques qualité</h4>
            <p>
              Tableaux de bord en temps réel pour suivre 
              l'évolution de la qualité du produit.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Formation équipes</h4>
            <p>
              Accompagnement et montée en compétence de vos équipes 
              sur les pratiques de test.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Notre approche full-cycle
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Planification stratégique :</strong> Définition de la 
            stratégie de test alignée sur vos objectifs business.
          </li>
          <li>
            <strong>Implémentation progressive :</strong> Mise en place 
            graduelle des processus et outils de test.
          </li>
          <li>
            <strong>Optimisation continue :</strong> Amélioration constante 
            des pratiques basée sur les retours d'expérience.
          </li>
          <li>
            <strong>Gouvernance qualité :</strong> Mise en place de standards 
            et processus pour maintenir un niveau de qualité élevé.
          </li>
        </ul>
      </>
    ),
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
  },
  {
    title: "Tests de Régression",
    icon: "💎",
    description: "Validation que les nouvelles modifications n'impactent pas l'existant",
    detailedDescription: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir nos services de tests de régression ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Protection de l'existant</h4>
            <p>
              Garantie que les nouvelles fonctionnalités ne dégradent 
              pas les fonctionnalités déjà validées.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Automatisation intelligente</h4>
            <p>
              Suites de tests automatisés optimisées pour exécution 
              rapide et couverture maximale.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Sélection de tests optimale</h4>
            <p>
              Algorithmes intelligents pour identifier les tests 
              les plus pertinents selon les modifications.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Exécution parallèle</h4>
            <p>
              Infrastructure cloud pour exécuter les tests en parallèle 
              et réduire le temps de feedback.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Analyse d'impact</h4>
            <p>
              Évaluation précise des zones impactées par les modifications 
              pour cibler les tests nécessaires.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Reporting avancé</h4>
            <p>
              Rapports détaillés avec tendances et recommandations 
              d'amélioration de la couverture.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Notre stratégie de tests de régression
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Baseline de référence :</strong> Établissement d'une 
            suite de tests de référence couvrant les fonctionnalités critiques.
          </li>
          <li>
            <strong>Maintenance adaptative :</strong> Évolution de la suite 
            de tests selon les modifications de l'application.
          </li>
          <li>
            <strong>Priorisation intelligente :</strong> Classification des tests 
            par criticité et fréquence d'exécution optimale.
          </li>
          <li>
            <strong>Intégration continue :</strong> Exécution automatique 
            déclenchée par les commits et merge requests.
          </li>
        </ul>
      </>
    ),
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
  },
  {
    title: "Tests d'Intégration",
    icon: "🔗",
    description: "Validation des interactions entre composants et systèmes",
    detailedDescription: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir nos services de tests d'intégration ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Tests API complets</h4>
            <p>
              Validation approfondie de tous les endpoints, contrats 
              et formats de données entre services.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Microservices testing</h4>
            <p>
              Stratégies spécialisées pour tester les architectures 
              distribuées et communications inter-services.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests de contrats</h4>
            <p>
              Validation des accords entre services producteurs 
              et consommateurs avec frameworks spécialisés.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Simulation d'environnements</h4>
            <p>
              Mocking et stubbing intelligents pour isoler 
              les composants en cours de test.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests de données</h4>
            <p>
              Validation de l'intégrité des données lors des 
              échanges entre systèmes différents.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Monitoring d'intégration</h4>
            <p>
              Surveillance continue des points d'intégration 
              en production avec alertes proactives.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Notre approche des tests d'intégration
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Cartographie d'architecture :</strong> Analyse complète 
            des interactions entre tous les composants du système.
          </li>
          <li>
            <strong>Stratégie de test pyramide :</strong> Équilibrage optimal 
            entre tests unitaires, d'intégration et end-to-end.
          </li>
          <li>
            <strong>Environnements dédiés :</strong> Mise en place 
            d'environnements de test isolés et reproductibles.
          </li>
          <li>
            <strong>Automatisation CI/CD :</strong> Intégration dans les 
            pipelines pour validation continue des intégrations.
          </li>
        </ul>
      </>
    ),
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
  },
  {
    title: "Tests d'Accessibilité",
    icon: "♿",
    description: "Validation de la conformité aux standards d'accessibilité",
    detailedDescription: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir nos services de tests d'accessibilité ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Conformité WCAG</h4>
            <p>
              Validation complète selon les critères WCAG 2.1 AA 
              pour garantir l'accessibilité universelle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests avec technologies assistives</h4>
            <p>
              Validation avec lecteurs d'écran, navigation clavier 
              et autres outils d'assistance réels.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Audit automatisé</h4>
            <p>
              Outils spécialisés pour détection automatique 
              des problèmes d'accessibilité dans le code.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests utilisateurs</h4>
            <p>
              Sessions avec utilisateurs en situation de handicap 
              pour validation de l'expérience réelle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Recommandations correctives</h4>
            <p>
              Guide détaillé des modifications nécessaires 
              avec exemples de code et bonnes pratiques.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Formation équipes</h4>
            <p>
              Sensibilisation et formation des équipes de développement 
              aux principes d'accessibilité.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Notre méthode d'audit d'accessibilité
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Analyse technique :</strong> Audit du code source 
            et des balises HTML pour conformité aux standards.
          </li>
          <li>
            <strong>Tests fonctionnels :</strong> Validation de tous 
            les parcours avec technologies d'assistance.
          </li>
          <li>
            <strong>Évaluation UX :</strong> Analyse de l'expérience 
            utilisateur pour personnes en situation de handicap.
          </li>
          <li>
            <strong>Plan d'action :</strong> Roadmap priorisée pour 
            mise en conformité progressive et durable.
          </li>
        </ul>
      </>
    ),
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
  },
];

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<null | (typeof services)[0]>(null);

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedService]);

  return (
    <section id="services" className="webflow-section bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Nos services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nos experts certifiés ISTQB conçoivent et réalisent des tests de
            bout en bout, sur mesure, pour garantir la qualité totale de vos
            logiciels et de l'expérience utilisateur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => setSelectedService(service)}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 group"
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-800 transition-colors">
                <span>En savoir plus</span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal détaillée */}
        {selectedService && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedService(null)}
          >
            <div
              className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-t-2xl relative">
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl font-bold transition-colors"
                >
                  ×
                </button>
                
                <div className="flex items-center gap-6">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <span className="text-4xl">{selectedService.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedService.title}
                    </h2>
                    <p className="text-blue-100 text-lg">
                      Solutions professionnelles de test logiciel
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 text-gray-800 leading-relaxed space-y-8">
                {selectedService.detailedDescription}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
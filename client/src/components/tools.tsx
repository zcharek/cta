import { useState, useEffect } from "react";

const tools = [
  {
    name: "Playwright",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Playwright_Logo.svg",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir les services de test Playwright ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Flux utilisateurs complexes</h4>
            <p>
              Playwright gère facilement les scénarios multi-étapes et
              interactions, pour des tests automatisés précis.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">
              Compatibilité multi-navigateurs
            </h4>
            <p>
              Assurez un fonctionnement parfait sur Chrome, Firefox, Safari,
              etc., avec un test cross-browser fiable.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">
              Applications gourmandes en données
            </h4>
            <p>
              Validez efficacement les traitements de gros volumes de données et
              garantissez leur intégrité.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">
              Installation simple et intégration CI/CD
            </h4>
            <p>
              Outil facile à configurer, idéal pour une intégration rapide dans
              vos pipelines d'intégration continue.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">
              Support des contenus dynamiques et SPA
            </h4>
            <p>
              Testez sans effort les applications monopages avec contenu
              dynamique.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Grande rapidité d'exécution</h4>
            <p>
              Tests parallèles et multi-navigateurs pour gagner du temps et
              améliorer la productivité QA.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Nos services Playwright
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Conseil en automatisation :</strong> Accompagnement expert
            pour démarrer ou optimiser vos tests Playwright.
          </li>
          <li>
            <strong>Stratégie d'automatisation :</strong> Conception sur-mesure
            de votre plan de tests pour garantir efficacité et fiabilité.
          </li>
          <li>
            <strong>Création de solution clé en main :</strong> Développement
            complet d'une solution Playwright adaptée à vos besoins.
          </li>
          <li>
            <strong>Optimisation de solutions existantes :</strong> Amélioration
            et mise à niveau de vos tests automatisés actuels.
          </li>
          <li>
            <strong>Intégration CI/CD :</strong> Insertion fluide des tests dans
            vos pipelines DevOps pour accélérer les livraisons.
          </li>
          <li>
            <strong>Support et maintenance :</strong> Assistance continue pour
            maintenir vos tests à jour et performants.
          </li>
        </ul>
      </>
    ),
  },
  {
    name: "Selenium",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Selenium_Logo.png",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir les services de test Selenium ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Polyvalence linguistique</h4>
            <p>
              Support natif de Java, Python, C#, Ruby et JavaScript pour 
              s'adapter à votre stack technique existant.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Écosystème mature</h4>
            <p>
              Framework établi avec une large communauté, documentation 
              extensive et multiples ressources d'apprentissage.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests distribués</h4>
            <p>
              Selenium Grid permet l'exécution parallèle sur plusieurs 
              machines et navigateurs pour optimiser les temps d'exécution.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Intégration CI/CD avancée</h4>
            <p>
              Compatible avec Jenkins, GitLab CI, Azure DevOps et autres 
              plateformes pour automatisation complète.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Applications legacy</h4>
            <p>
              Idéal pour tester des applications web anciennes et 
              maintenir la compatibilité avec systèmes existants.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Flexibilité maximale</h4>
            <p>
              Contrôle fin des interactions navigateur et personnalisation 
              avancée des scénarios de test complexes.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Nos services Selenium
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Migration et modernisation :</strong> Transition depuis 
            d'anciens frameworks vers Selenium avec préservation des investissements.
          </li>
          <li>
            <strong>Architecture Selenium Grid :</strong> Mise en place de 
            grilles de test distribuées pour parallélisation optimale.
          </li>
          <li>
            <strong>Framework sur-mesure :</strong> Développement de frameworks 
            Selenium adaptés à votre architecture et processus métier.
          </li>
          <li>
            <strong>Formation et accompagnement :</strong> Montée en compétence 
            de vos équipes sur les bonnes pratiques Selenium.
          </li>
          <li>
            <strong>Maintenance et évolution :</strong> Support continu et 
            mise à jour de vos suites de tests Selenium existantes.
          </li>
          <li>
            <strong>Optimisation des performances :</strong> Accélération 
            des temps d'exécution et amélioration de la stabilité des tests.
          </li>
        </ul>
      </>
    ),
  },
  {
    name: "Cypress",
    logo: "https://le-testeur.com/wp-content/uploads/2024/01/logo_landscape_1.png",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir les services de test Cypress ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Interface développeur intuitive</h4>
            <p>
              Test runner visuel avec débogage en temps réel et inspection 
              des éléments pour un développement de tests efficace.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests flaky-proof</h4>
            <p>
              Attentes automatiques et retry logic intégrés pour éliminer 
              les tests instables et améliorer la fiabilité.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Écosystème JavaScript natif</h4>
            <p>
              Intégration parfaite avec React, Vue, Angular et autres 
              frameworks JavaScript modernes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Mocking et stubbing avancés</h4>
            <p>
              Contrôle total des requêtes réseau et APIs pour des tests 
              isolés et déterministes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Feedback instantané</h4>
            <p>
              Rechargement automatique des tests et exécution en temps réel 
              pour un cycle de développement rapide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Applications Single Page</h4>
            <p>
              Optimisé pour tester les SPA modernes avec routage dynamique 
              et états d'application complexes.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Nos services Cypress
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Setup et configuration :</strong> Installation optimisée 
            de Cypress avec configuration des meilleures pratiques.
          </li>
          <li>
            <strong>Tests E2E sur-mesure :</strong> Développement de scénarios 
            de tests end-to-end adaptés à vos flux utilisateurs critiques.
          </li>
          <li>
            <strong>Framework de test component :</strong> Mise en place de 
            tests unitaires et d'intégration pour vos composants.
          </li>
          <li>
            <strong>Pipeline CI/CD Cypress :</strong> Intégration dans vos 
            workflows avec dashboard et reporting automatisés.
          </li>
          <li>
            <strong>Formation équipe :</strong> Accompagnement de vos développeurs 
            sur les patterns et bonnes pratiques Cypress.
          </li>
          <li>
            <strong>Stratégie de mocking :</strong> Architecture de stubs et 
            mocks pour des tests rapides et fiables.
          </li>
        </ul>
      </>
    ),
  },
  {
    name: "Postman",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir les services de test Postman ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Tests API complets</h4>
            <p>
              Validation approfondie des endpoints REST, GraphQL et SOAP 
              avec assertions automatisées et tests de contrats.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Gestion d'environnements</h4>
            <p>
              Configuration multi-environnements (dev, staging, prod) 
              avec variables dynamiques et secrets sécurisés.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Collections collaboratives</h4>
            <p>
              Partage et versioning de collections de tests avec 
              documentation intégrée pour l'équipe de développement.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Automatisation workflows</h4>
            <p>
              Chaînage d'appels API complexes avec données dynamiques 
              et validation de scénarios métier end-to-end.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Monitoring continu</h4>
            <p>
              Surveillance proactive des APIs en production avec 
              alertes automatiques et métriques de performance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests de charge API</h4>
            <p>
              Validation des performances et de la montée en charge 
              de vos APIs avec rapports détaillés.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Nos services Postman
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Architecture de tests API :</strong> Conception de 
            stratégies complètes pour validation d'APIs et microservices.
          </li>
          <li>
            <strong>Collections entreprise :</strong> Développement de 
            bibliothèques de tests réutilisables et maintenables.
          </li>
          <li>
            <strong>Intégration Newman CI/CD :</strong> Automatisation 
            des tests Postman dans vos pipelines de déploiement.
          </li>
          <li>
            <strong>Tests de contrats API :</strong> Validation de la 
            conformité aux spécifications OpenAPI et schemas.
          </li>
          <li>
            <strong>Formation et gouvernance :</strong> Accompagnement 
            des équipes sur les standards et bonnes pratiques.
          </li>
          <li>
            <strong>Monitoring et alerting :</strong> Mise en place de 
            surveillance continue avec notifications personnalisées.
          </li>
        </ul>
      </>
    ),
  },
  {
    name: "Percy",
    logo: "https://images.opencollective.com/percy_io/80d9595/logo/256.png",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">Pourquoi Percy ?</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Tests de régression visuelle automatisés.</li>
          <li>
            Intégration facile avec CI/CD et outils de test (ex: Cypress,
            Playwright).
          </li>
          <li>Suivi des changements d'interface utilisateur pixel-perfect.</li>
        </ul>
      </>
    ),
  },
  {
    name: "k6",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/K6-logo.svg/1058px-K6-logo.svg.png",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">Pourquoi k6 ?</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Tests de performance avec un scripting JavaScript moderne.</li>
          <li>Facile à intégrer dans les pipelines DevOps.</li>
          <li>
            Rapports clairs pour mesurer la charge, les temps de réponse et les
            erreurs.
          </li>
        </ul>
      </>
    ),
  },
];

const cooperationModels = [
  {
    title: "Renforcement d'équipe",
    subtitle: "(Staff augmentation)",
    color: "text-blue-700",
    points: [
      "Idéal pour les projets à court ou moyen terme.",
      "Expertise Selenide sans engagement à long terme.",
      "Ajout rapide de ressources qualifiées à votre équipe.",
      "Flexibilité selon les besoins du projet.",
    ],
  },
  {
    title: "Équipe dédiée",
    subtitle: "(Dedicated team)",
    color: "text-green-700",
    points: [
      "Idéal pour les projets à long terme évolutifs.",
      "Contrôle total sur le processus QA.",
      "Alignement précis avec vos objectifs métier.",
      "Adaptation continue à vos besoins.",
    ],
  },
  {
    title: "Externalisation",
    subtitle: "(Outsourcing)",
    color: "text-purple-700",
    points: [
      "Idéal pour externaliser totalement les tests.",
      "Élimine les coûts d'infrastructure et recrutement.",
      "Accès à une expertise QA spécialisée.",
      "Concentrez-vous sur votre cœur de métier.",
    ],
  },
];

const TechCarousel = () => {
  const [selectedTool, setSelectedTool] = useState<null | (typeof tools)[0]>(
    null,
  );

  // Désactive le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (selectedTool) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedTool]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-6xl text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frameworks de test
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez les outils que nous utilisons pour automatiser les tests
          fonctionnels, API, UI et performance.
        </p>
      </div>

      {/* Cartes avec logo + */}
      <div className="flex flex-wrap justify-center gap-6">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedTool(tool)}
            className="relative cursor-pointer w-40 h-24 p-4 bg-white rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-transform"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedTool(tool);
              }
            }}
            aria-label={`En savoir plus sur ${tool.name}`}
          >
            <img
              src={tool.logo}
              alt={tool.name}
              className="max-h-12 object-contain"
              loading="lazy"
            />
            <span className="absolute bottom-1 right-1 text-xl font-bold pointer-events-none select-none">
              +
            </span>
          </div>
        ))}
      </div>

      {/* Modale améliorée */}
      {selectedTool && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTool(null)}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
        >
          <div
            className="bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête avec gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-t-2xl relative">
              <button
                onClick={() => setSelectedTool(null)}
                aria-label="Fermer la modale"
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl font-bold transition-colors"
              >
                ×
              </button>
              
              <div className="flex items-center gap-6">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <img
                    src={selectedTool.logo}
                    alt={selectedTool.name}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div>
                  <h2
                    id="modal-title"
                    className="text-3xl font-bold mb-2"
                  >
                    {selectedTool.name}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Tests automatisés et solutions professionnelles
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div
              id="modal-desc"
              className="p-8 text-gray-800 leading-relaxed space-y-8"
            >
              {selectedTool.description}

              {/* Nos modèles de coopération */}
              <section className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                  Nos modèles de coopération
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {cooperationModels.map((model, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 h-full"
                    >
                      <div className="flex items-center mb-4">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          idx === 0 ? 'bg-blue-500' : 
                          idx === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`}></div>
                        <h4 className={`text-xl font-bold ${model.color}`}>
                          {model.title}
                        </h4>
                      </div>
                      <p className="text-sm font-medium mb-4 text-gray-600 italic">
                        {model.subtitle}
                      </p>
                      <ul className="space-y-2">
                        {model.points.map((point, i) => (
                          <li key={i} className="flex items-start text-gray-700">
                            <span className="text-green-500 mr-2 mt-1">✓</span>
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TechCarousel;
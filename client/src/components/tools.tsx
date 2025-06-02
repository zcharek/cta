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
  {
    name: "TestNG",
    logo: "https://testng.org/images/testng.png",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir les services de test TestNG ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Framework Java avancé</h4>
            <p>
              Architecture moderne avec annotations puissantes et gestion 
              sophistiquée des groupes de tests pour projets Java complexes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Exécution parallèle native</h4>
            <p>
              Support intégré de l'exécution parallèle au niveau des tests, 
              méthodes et classes pour optimiser les temps d'exécution.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Data-driven testing</h4>
            <p>
              Paramétrage flexible avec DataProvider pour tester multiple 
              jeux de données et scénarios de validation métier.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Gestion des dépendances</h4>
            <p>
              Contrôle précis de l'ordre d'exécution avec dependencies entre 
              tests et gestion des priorités pour workflows complexes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Reporting HTML riche</h4>
            <p>
              Génération automatique de rapports détaillés avec métriques, 
              graphiques et traces d'exécution pour analyse approfondie.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Intégration Maven/Gradle</h4>
            <p>
              Configuration native avec outils de build Java et intégration 
              seamless dans pipelines CI/CD existants.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Nos services TestNG
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Architecture de framework :</strong> Conception de 
            frameworks TestNG modulaires avec patterns Page Object et Factory.
          </li>
          <li>
            <strong>Migration JUnit vers TestNG :</strong> Transition complète 
            avec préservation des tests existants et optimisation des performances.
          </li>
          <li>
            <strong>Configuration TestNG Suite :</strong> Setup de suites 
            complexes avec groupes, paramètres et exécution conditionnelle.
          </li>
          <li>
            <strong>Data-driven automation :</strong> Implémentation de tests 
            paramétrés avec sources de données Excel, JSON et bases de données.
          </li>
          <li>
            <strong>Reporting et analytics :</strong> Personnalisation des 
            rapports TestNG avec métriques business et dashboards temps réel.
          </li>
          <li>
            <strong>Formation et best practices :</strong> Accompagnement 
            équipes Java sur patterns avancés et optimisation TestNG.
          </li>
        </ul>
      </>
    ),
  },
  {
    name: "Cucumber",
    logo: "https://static-00.iconduck.com/assets.00/cucumber-icon-2048x2048-fk30dxez.png",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir les services de test Cucumber ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">BDD natif</h4>
            <p>
              Développement piloté par le comportement avec syntaxe Gherkin 
              naturelle pour collaboration Product Owner - Développeur - QA.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Tests métier lisibles</h4>
            <p>
              Scénarios en langage naturel (Given/When/Then) compréhensibles 
              par toutes les parties prenantes non-techniques.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Réutilisabilité élevée</h4>
            <p>
              Bibliothèque de steps definitions partagées entre scénarios 
              pour maintenance simplifiée et consistency des tests.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Living documentation</h4>
            <p>
              Spécifications exécutables servant de documentation à jour 
              automatiquement synchronisée avec le code applicatif.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Support multi-plateforme</h4>
            <p>
              Implémentations Java, JavaScript, Ruby, Python pour intégration 
              dans tout écosystème technologique existant.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Reporting visuel</h4>
            <p>
              Rapports HTML enrichis avec statuts scénarios, captures d'écran 
              et métriques d'exécution pour stakeholders business.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Nos services Cucumber
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Stratégie BDD complète :</strong> Accompagnement dans 
            l'adoption du Behavior-Driven Development avec formation équipes.
          </li>
          <li>
            <strong>Features et scénarios métier :</strong> Rédaction de 
            spécifications Gherkin alignées sur besoins fonctionnels réels.
          </li>
          <li>
            <strong>Step definitions framework :</strong> Architecture de 
            couches d'abstraction robustes pour maintenance et évolutivité.
          </li>
          <li>
            <strong>Intégration Selenium/Playwright :</strong> Coupling 
            Cucumber avec frameworks d'automatisation pour tests E2E complets.
          </li>
          <li>
            <strong>CI/CD et reporting :</strong> Pipeline automatisé avec 
            publication rapports et métriques business pour décideurs.
          </li>
          <li>
            <strong>Gouvernance et standards :</strong> Établissement de 
            conventions d'écriture et review process pour qualité specs.
          </li>
        </ul>
      </>
    ),
  },
  {
    name: "RestAssured",
    logo: "https://avatars.githubusercontent.com/u/19369327?s=280&v=4",
    description: (
      <>
        <h3 className="text-xl font-semibold mb-2">
          Pourquoi choisir les services de test RestAssured ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">DSL Java intuitif</h4>
            <p>
              Syntaxe fluide et expressive pour tests d'API REST with 
              given/when/then pattern familier aux développeurs Java.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Validation JSON/XML native</h4>
            <p>
              Support intégré de JSONPath et XPath avec assertions puissantes 
              pour validation de structures de données complexes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Gestion d'authentification</h4>
            <p>
              Support OAuth2, Basic Auth, JWT et certificats SSL pour 
              tests sécurisés d'APIs enterprise et microservices.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Mocking et stubbing</h4>
            <p>
              Intégration WireMock pour simulation d'APIs externes et 
              tests isolés de dépendances pour stabilité accrue.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Performance et logs</h4>
            <p>
              Mesure automatique des temps de réponse avec logging détaillé 
              des requêtes/réponses pour debugging efficace.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Écosystème TestNG/JUnit</h4>
            <p>
              Intégration seamless avec frameworks de test Java existants 
              et outils de build Maven/Gradle pour CI/CD.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Nos services RestAssured
        </h3>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>
            <strong>Framework d'automatisation API :</strong> Architecture 
            complète de tests d'APIs avec patterns réutilisables et maintenables.
          </li>
          <li>
            <strong>Tests de contrats API :</strong> Validation automatisée 
            de conformité OpenAPI/Swagger avec génération de documentation.
          </li>
          <li>
            <strong>Suite de tests microservices :</strong> Stratégie globale 
            pour validation d'architectures distribuées et communication inter-services.
          </li>
          <li>
            <strong>Data-driven API testing :</strong> Implémentation de tests 
            paramétrés avec jeux de données métier et scénarios edge-case.
          </li>
          <li>
            <strong>Monitoring et alerting :</strong> Tests de santé continus 
            avec métriques SLA et notifications proactives d'anomalies.
          </li>
          <li>
            <strong>Formation et coaching :</strong> Montée en compétence 
            équipes sur patterns avancés RestAssured et API testing strategy.
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
          Frameworks et Outils d'Automatisation QA
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
            className="bg-white max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête avec gradient amélioré */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 text-white p-10 rounded-t-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <button
                onClick={() => setSelectedTool(null)}
                aria-label="Fermer la modale"
                className="absolute top-6 right-6 text-white hover:text-gray-200 text-4xl font-light transition-all duration-200 hover:scale-110 z-10"
              >
                ×
              </button>
              
              <div className="flex items-center gap-8 relative z-10">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <img
                    src={selectedTool.logo}
                    alt={selectedTool.name}
                    className="h-20 w-20 object-contain"
                  />
                </div>
                <div>
                  <h2
                    id="modal-title"
                    className="text-4xl font-bold mb-3 text-white drop-shadow-lg"
                  >
                    {selectedTool.name}
                  </h2>
                  <p className="text-purple-100 text-xl font-medium">
                    Framework professionnel de test automatisé
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu principal avec design amélioré */}
            <div
              id="modal-desc"
              className="p-10 text-gray-800 leading-relaxed"
            >
              <div className="prose prose-lg max-w-none">
                {selectedTool.description}
              </div>

              {/* Nos modèles de coopération avec design premium */}
              <section className="mt-12 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-3xl p-10 border border-purple-100">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Nos modèles de coopération
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Choisissez l'approche qui correspond le mieux à vos besoins et contraintes
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {cooperationModels.map((model, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-purple-300 h-full transform hover:-translate-y-2"
                    >
                      <div className="flex items-center mb-6">
                        <div className={`w-4 h-4 rounded-full mr-4 ${
                          idx === 0 ? 'bg-blue-500' : 
                          idx === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`}></div>
                        <h4 className={`text-2xl font-bold ${model.color}`}>
                          {model.title}
                        </h4>
                      </div>
                      <p className="text-base font-medium mb-6 text-gray-600 italic">
                        {model.subtitle}
                      </p>
                      <ul className="space-y-3">
                        {model.points.map((point, i) => (
                          <li key={i} className="flex items-start text-gray-700">
                            <span className="text-green-500 mr-3 mt-1 text-lg">✓</span>
                            <span className="text-base leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section CTA en bas */}
              <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    Besoin d'expertise avec {selectedTool.name} ?
                  </h4>
                  <p className="text-gray-600 mb-6 text-lg">
                    Nos experts certifiés peuvent vous accompagner dans l'implémentation et l'optimisation de vos tests.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => {
                        setSelectedTool(null);
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="mr-2">🚀</span>
                      Demander une consultation
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedTool(null);
                        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl border-2 border-purple-200 hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="mr-2">📋</span>
                      Voir nos services
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TechCarousel;
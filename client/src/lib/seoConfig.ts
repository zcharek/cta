// Configuration SEO centralisée pour toutes les pages
export const seoConfig = {
  // Configuration par défaut
  default: {
    title: "Central Test Agency - Tests Logiciels et Automatisation QA en Algérie",
    description: "Expert en tests logiciels et automatisation QA en Algérie. Services Playwright, Cypress, tests E2E, API, régression. Qualité logicielle garantie pour vos projets digitaux.",
    keywords: "test logiciel, automatisation QA, Playwright, Cypress, tests E2E, API testing, régression, qualité logicielle, CI/CD, Algérie, tests fonctionnels, tests automatisés",
    ogImage: "https://centraltestagency.com/generated-icon.png",
    baseUrl: "https://centraltestagency.com"
  },

  // Configuration pour les pages de services
  services: {
    // Outils
    playwright: {
      title: "Playwright - Tests E2E Modernes | Central Test Agency",
      description: "Tests automatisés avec Playwright : E2E modernes, multi-navigateurs, API unifiée. Expert Playwright en Algérie pour vos projets web.",
      keywords: "Playwright, tests E2E, automatisation, multi-navigateurs, tests modernes, Central Test Agency, Algérie"
    },
    cypress: {
      title: "Cypress - Tests E2E Intuitifs | Central Test Agency", 
      description: "Tests E2E avec Cypress : interface développeur exceptionnelle, debugging visuel, time-travel. Expert Cypress en Algérie.",
      keywords: "Cypress, tests E2E, debugging visuel, time-travel, interface développeur, Central Test Agency, Algérie"
    },
    selenium: {
      title: "Selenium - Standard Industriel Tests Web | Central Test Agency",
      description: "Tests automatisés avec Selenium : standard industriel, multi-navigateurs, WebDriver. Expert Selenium en Algérie.",
      keywords: "Selenium, WebDriver, tests multi-navigateurs, standard industriel, automatisation web, Central Test Agency, Algérie"
    },
    postman: {
      title: "Postman - Tests API Professionnels | Central Test Agency",
      description: "Tests API avec Postman : REST, GraphQL, automatisation, monitoring. Expert tests API en Algérie.",
      keywords: "Postman, tests API, REST, GraphQL, automatisation API, monitoring, Central Test Agency, Algérie"
    },
    k6: {
      title: "k6 - Tests de Performance Modernes | Central Test Agency",
      description: "Tests de performance avec k6 : JavaScript ES6+, métriques temps réel, cloud/on-premise. Expert performance en Algérie.",
      keywords: "k6, tests performance, load testing, JavaScript, métriques temps réel, Central Test Agency, Algérie"
    },
    percy: {
      title: "Percy - Tests Visuels Automatisés | Central Test Agency",
      description: "Tests de régression visuelle avec Percy : détection changements, cross-browser, responsive. Expert tests visuels en Algérie.",
      keywords: "Percy, tests visuels, régression visuelle, cross-browser, responsive, Central Test Agency, Algérie"
    },
    testng: {
      title: "TestNG - Framework Java Puissant | Central Test Agency",
      description: "Tests avec TestNG : annotations, groupes, exécution parallèle, rapports HTML. Expert TestNG Java en Algérie.",
      keywords: "TestNG, Java testing, annotations, tests parallèles, rapports HTML, Central Test Agency, Algérie"
    },
    cucumber: {
      title: "Cucumber - BDD et Gherkin | Central Test Agency",
      description: "Tests BDD avec Cucumber : langage naturel Gherkin, collaboration équipe, documentation vivante. Expert BDD en Algérie.",
      keywords: "Cucumber, BDD, Gherkin, langage naturel, collaboration équipe, documentation vivante, Central Test Agency, Algérie"
    },
    restassured: {
      title: "RestAssured - Tests API Java | Central Test Agency",
      description: "Tests API avec RestAssured : syntaxe fluide Java, validations puissantes, JSON/XML. Expert API Java en Algérie.",
      keywords: "RestAssured, API Java, syntaxe fluide, validations, JSON, XML, Central Test Agency, Algérie"
    },

    // Types de tests
    validation: {
      title: "Tests de Validation - Conformité Métier | Central Test Agency",
      description: "Tests de validation pour vérifier la conformité aux exigences métier et spécifications. Expert validation en Algérie.",
      keywords: "tests validation, conformité métier, spécifications, exigences, Central Test Agency, Algérie"
    },
    integration: {
      title: "Tests d'Intégration - Communication Systèmes | Central Test Agency", 
      description: "Tests d'intégration pour vérifier la communication entre composants et systèmes. Expert intégration en Algérie.",
      keywords: "tests intégration, communication systèmes, composants, API, Central Test Agency, Algérie"
    },
    regression: {
      title: "Tests de Régression - Stabilité Continue | Central Test Agency",
      description: "Tests de régression automatisés pour maintenir la qualité après modifications. Expert régression en Algérie.",
      keywords: "tests régression, stabilité, automatisation, CI/CD, qualité continue, Central Test Agency, Algérie"
    },
    acceptation: {
      title: "Tests d'Acceptation - Validation Utilisateur | Central Test Agency",
      description: "Tests d'acceptation utilisateur (UAT) pour valider conformité métier et satisfaction. Expert UAT en Algérie.",
      keywords: "tests acceptation, UAT, validation utilisateur, conformité métier, Central Test Agency, Algérie"
    },
    charge: {
      title: "Tests de Charge - Performance Système | Central Test Agency",
      description: "Tests de charge pour évaluer performance sous charge normale et identifier limites. Expert performance en Algérie.",
      keywords: "tests charge, performance, load testing, scalabilité, Central Test Agency, Algérie"
    },
    stress: {
      title: "Tests de Stress - Limites Système | Central Test Agency",
      description: "Tests de stress pour identifier point de rupture et capacité de récupération. Expert stress testing en Algérie.",
      keywords: "tests stress, point rupture, récupération, limites système, Central Test Agency, Algérie"
    },
    monteecharge: {
      title: "Tests Montée en Charge - Scalabilité Progressive | Central Test Agency",
      description: "Tests de montée en charge pour évaluer scalabilité progressive et point de saturation. Expert scalabilité en Algérie.",
      keywords: "montée en charge, scalabilité progressive, saturation, Central Test Agency, Algérie"
    },
    ux: {
      title: "Tests UX/UI - Expérience Utilisateur | Central Test Agency",
      description: "Tests d'utilisabilité pour garantir expérience utilisateur optimale et ergonomie. Expert UX testing en Algérie.",
      keywords: "tests UX, utilisabilité, expérience utilisateur, ergonomie, Central Test Agency, Algérie"
    },
    accessibilite: {
      title: "Tests d'Accessibilité - Conformité WCAG | Central Test Agency",
      description: "Tests d'accessibilité pour conformité WCAG et inclusion universelle. Expert accessibilité en Algérie.",
      keywords: "tests accessibilité, WCAG, inclusion, handicap, conformité, Central Test Agency, Algérie"
    },
    compatibilite: {
      title: "Tests de Compatibilité - Multi-navigateurs | Central Test Agency",
      description: "Tests de compatibilité multi-navigateurs et multi-plateformes. Expert compatibilité en Algérie.",
      keywords: "tests compatibilité, multi-navigateurs, multi-plateformes, cross-browser, Central Test Agency, Algérie"
    }
  },

  // Pages principales
  pages: {
    home: {
      title: "Central Test Agency - Tests Logiciels et Automatisation QA en Algérie",
      description: "Expert en tests logiciels et automatisation QA en Algérie. Services Playwright, Cypress, tests E2E, API, régression. Qualité logicielle garantie pour vos projets digitaux.",
      keywords: "test logiciel, automatisation QA, Playwright, Cypress, tests E2E, API testing, régression, qualité logicielle, CI/CD, Algérie, tests fonctionnels, tests automatisés"
    },
    services: {
      title: "Services Tests Logiciels - Central Test Agency",
      description: "Découvrez nos services de tests logiciels : automatisation QA, tests E2E, API, performance, accessibilité. Expertise complète en Algérie.",
      keywords: "services tests logiciels, automatisation QA, tests E2E, API testing, performance, accessibilité, Central Test Agency, Algérie"
    },
    faq: {
      title: "FAQ - Questions Fréquentes | Central Test Agency",
      description: "Réponses aux questions fréquentes sur nos services de tests logiciels et automatisation QA en Algérie.",
      keywords: "FAQ, questions fréquentes, tests logiciels, automatisation QA, Central Test Agency, Algérie"
    },
    legal: {
      title: "Mentions Légales et Confidentialité | Central Test Agency",
      description: "Mentions légales, politique de confidentialité et conditions d'utilisation de Central Test Agency.",
      keywords: "mentions légales, confidentialité, conditions utilisation, Central Test Agency, Algérie"
    }
  }
};

// Fonction utilitaire pour générer la configuration SEO complète
export const generateSEOConfig = (pageKey: string, subKey?: string) => {
  const config = subKey 
    ? seoConfig.services[subKey as keyof typeof seoConfig.services] || seoConfig.pages[pageKey as keyof typeof seoConfig.pages]
    : seoConfig.pages[pageKey as keyof typeof seoConfig.pages];
    
  if (!config) {
    return {
      title: seoConfig.default.title,
      description: seoConfig.default.description,
      keywords: seoConfig.default.keywords,
      ogUrl: seoConfig.default.baseUrl,
      canonical: seoConfig.default.baseUrl
    };
  }

  const path = subKey ? `/services/${subKey}` : pageKey === 'home' ? '' : `/${pageKey}`;
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    ogUrl: `${seoConfig.default.baseUrl}${path}`,
    canonical: `${seoConfig.default.baseUrl}${path}`
  };
}; 
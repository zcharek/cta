export type FAQCategory = "Services" | "Tarifs" | "Technique" | "Processus";

export interface FAQItem {
  id: string;
  category: FAQCategory;
  icon: string;
  question: string;
  answer: string;
}

export const faqsData: FAQItem[] = [
  {
    id: "services-1",
    category: "Services",
    icon: "🛠️",
    question: "Quels types de tests logiciels proposez-vous en Algérie ?",
    answer: "Nous proposons une gamme complète de services : tests fonctionnels, tests automatisés avec Playwright et Cypress, tests E2E, tests d'API, tests de régression, tests d'accessibilité et tests d'intégration. Tous nos services sont adaptés au marché algérien et aux standards internationaux."
  },
  {
    id: "processus-1",
    category: "Processus",
    icon: "🔄",
    question: "Combien de temps prend un projet de test logiciel ?",
    answer: "La durée dépend de la complexité de votre projet. Un audit simple peut prendre 1-2 semaines, tandis qu'une mise en place complète d'automatisation peut prendre 4-8 semaines. Nous vous fournissons toujours un planning détaillé après l'analyse de vos besoins."
  },
  {
    id: "services-2",
    category: "Services",
    icon: "🛠️",
    question: "Travaillez-vous avec des entreprises de toutes tailles ?",
    answer: "Oui, nous accompagnons aussi bien les startups que les grandes entreprises en Algérie. Nos solutions sont modulaires et s'adaptent à votre budget et vos besoins spécifiques, que vous soyez une PME ou une multinationale."
  },
  {
    id: "technique-1",
    category: "Technique",
    icon: "🤖",
    question: "Quels outils d'automatisation utilisez-vous ?",
    answer: "Nous sommes spécialisés dans Playwright, Cypress, Selenium et Postman. Nous choisissons les outils les plus adaptés à votre stack technique et vos objectifs. Nous maîtrisons également les frameworks modernes comme React, Vue, Angular."
  },
  {
    id: "services-3",
    category: "Services",
    icon: "🛠️",
    question: "Proposez-vous de la formation à vos outils ?",
    answer: "Absolument ! Nous incluons systématiquement un volet formation dans nos prestations. Vos équipes apprennent à maintenir et faire évoluer les tests que nous mettons en place. Formation en français ou arabe selon vos préférences."
  },
  {
    id: "technique-2",
    category: "Technique",
    icon: "🤖",
    question: "Comment garantissez-vous la qualité de vos tests ?",
    answer: "Nous suivons les standards ISTQB et appliquons les meilleures pratiques de l'industrie. Chaque projet inclut une documentation complète, des métriques de couverture et des rapports détaillés. Nous offrons également un support post-livraison."
  },
  {
    id: "tarifs-1",
    category: "Tarifs",
    icon: "💸",
    question: "Quels sont vos tarifs pour les services en Algérie ?",
    answer: "Nos tarifs sont compétitifs et adaptés au marché algérien. Nous proposons des devis gratuits personnalisés selon vos besoins. Possibilité de paiement en dinars algériens ou en euros selon votre préférence."
  },
  {
    id: "processus-2",
    category: "Processus",
    icon: "🔄",
    question: "Travaillez-vous à distance ou sur site ?",
    answer: "Nous proposons les deux options : intervention sur site en Algérie (Alger, Oran, Constantine) ou travail à distance. Nos méthodes agiles nous permettent une collaboration efficace quel que soit le mode de travail choisi."
  }
]; 
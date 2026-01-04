import React from 'react'
import ReactDOM from 'react-dom/client'
import { motion, LazyMotion, domAnimation } from "framer-motion";
import App from './App.tsx'
import './index.css'

// Make framer-motion available globally
declare global {
  interface Window {
    motion: typeof motion;
  }
}
window.motion = motion;

// Amélioration du SEO - Ajout de métadonnées dynamiques
const updateMetaTags = () => {
  // Mise à jour du titre
  document.title = "Central Test Agency - Tests Logiciels et Automatisation QA en Algérie";
  
  // Mise à jour de la description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      "Expert en tests logiciels et automatisation QA en Algérie. Services Playwright, Cypress, tests E2E, API, régression. Qualité logicielle garantie pour vos projets digitaux."
    );
  }

  // Ajout de métadonnées supplémentaires pour le SEO
  const addMetaTag = (name: string, content: string) => {
    if (!document.querySelector(`meta[name="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  };

  // Métadonnées pour les réseaux sociaux
  addMetaTag('twitter:card', 'summary_large_image');
  addMetaTag('twitter:title', 'Central Test Agency - Tests Logiciels et Automatisation QA en Algérie');
  addMetaTag('twitter:description', 'Expert en tests logiciels et automatisation QA en Algérie. Services Playwright, Cypress, tests E2E, API, régression.');
  addMetaTag('twitter:image', 'https://centraltestagency.com/generated-icon.png');

  // Métadonnées pour la localisation
  addMetaTag('geo.placename', 'Algérie');
  addMetaTag('geo.position', '36.7538;3.0588');
  addMetaTag('ICBM', '36.7538, 3.0588');

  // Métadonnées pour les moteurs de recherche
  addMetaTag('language', 'French');
  addMetaTag('revisit-after', '7 days');
  addMetaTag('distribution', 'global');
  addMetaTag('rating', 'general');
};

// Exécution immédiate pour le SEO
updateMetaTags();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation}>
      <App />
    </LazyMotion>
  </React.StrictMode>,
)

import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: string;
  alternateLocales?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Central Test Consulting - Tests Logiciels et Automatisation QA en Algérie",
  description = "Expert en tests logiciels et automatisation QA en Algérie. Services Playwright, Cypress, tests E2E, API, régression. Qualité logicielle garantie pour vos projets digitaux.",
  keywords = "test logiciel, automatisation QA, Playwright, Cypress, tests E2E, API testing, régression, qualité logicielle, CI/CD, Algérie, tests fonctionnels, tests automatisés",
  ogImage = "https://centraltestagency.com/generated-icon.png",
  ogUrl = "https://centraltestagency.com",
  canonical = "https://centraltestagency.com",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Central Test Consulting",
  locale = "fr_DZ",
  alternateLocales = ["en_US", "ar_DZ"]
}) => {
  useEffect(() => {
    // Nettoyage des métadonnées existantes
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Titre de la page
    document.title = title;

    // Métadonnées de base
    const setMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.setAttribute('data-seo', 'true');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Métadonnées SEO de base
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', author);

    // Open Graph
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', ogUrl, true);
    setMetaTag('og:locale', locale, true);
    setMetaTag('og:site_name', 'Central Test Consulting', true);
    setMetaTag('og:image', ogImage, true);

    // Twitter Cards
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    // Lien canonique
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('data-seo', 'true');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

  }, [title, description, keywords, ogImage, ogUrl, canonical, type, publishedTime, modifiedTime, author, locale, alternateLocales]);

  return null;
};

export default SEOHead; 
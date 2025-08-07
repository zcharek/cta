// Générateur de sitemap dynamique pour optimiser l'indexation
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const sitemapUrls: SitemapUrl[] = [
  // Pages principales
  {
    loc: 'https://centraltestagency.com/',
    lastmod: '2024-01-15',
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    loc: 'https://centraltestagency.com/services',
    lastmod: '2024-01-15',
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    loc: 'https://centraltestagency.com/faq',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: 'https://centraltestagency.com/legal',
    lastmod: '2024-01-15',
    changefreq: 'yearly',
    priority: 0.3
  },

  // Services - Outils de test (priorité haute)
  {
    loc: 'https://centraltestagency.com/services/playwright',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://centraltestagency.com/services/cypress',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://centraltestagency.com/services/selenium',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://centraltestagency.com/services/postman',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://centraltestagency.com/services/k6',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://centraltestagency.com/services/percy',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://centraltestagency.com/services/testng',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://centraltestagency.com/services/cucumber',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://centraltestagency.com/services/restassured',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.8
  },

  // Services - Types de tests (priorité moyenne-haute)
  {
    loc: 'https://centraltestagency.com/services/validation',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/integration',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/regression',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/acceptation',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/charge',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/stress',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/montee-charge',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/ux',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/accessibilite',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://centraltestagency.com/services/compatibilite',
    lastmod: '2024-01-15',
    changefreq: 'monthly',
    priority: 0.7
  }
];

// Fonction pour générer le XML du sitemap
export const generateSitemapXML = (urls: SitemapUrl[]): string => {
  const urlsXML = urls.map(url => {
    return `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${urlsXML}

</urlset>`;
};

// Fonction pour valider une URL de sitemap
export const validateSitemapUrl = (url: SitemapUrl): boolean => {
  if (!url.loc || !url.loc.startsWith('http')) {
    console.error('URL invalide:', url.loc);
    return false;
  }
  
  if (url.priority !== undefined && (url.priority < 0 || url.priority > 1)) {
    console.error('Priorité invalide (doit être entre 0 et 1):', url.priority);
    return false;
  }
  
  const validChangefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  if (url.changefreq && !validChangefreqs.includes(url.changefreq)) {
    console.error('Changefreq invalide:', url.changefreq);
    return false;
  }
  
  return true;
};

// Fonction pour trier les URLs par priorité
export const sortUrlsByPriority = (urls: SitemapUrl[]): SitemapUrl[] => {
  return [...urls].sort((a, b) => {
    const priorityA = a.priority || 0.5;
    const priorityB = b.priority || 0.5;
    return priorityB - priorityA;
  });
};

// Fonction pour générer un sitemap optimisé
export const generateOptimizedSitemap = (): string => {
  const validUrls = sitemapUrls.filter(validateSitemapUrl);
  const sortedUrls = sortUrlsByPriority(validUrls);
  return generateSitemapXML(sortedUrls);
};

// Fonction pour obtenir les URLs par catégorie
export const getUrlsByCategory = () => {
  return {
    mainPages: sitemapUrls.filter(url => url.priority === 1.0 || url.priority === 0.9),
    toolServices: sitemapUrls.filter(url => url.loc.includes('/services/') && url.priority === 0.8),
    testServices: sitemapUrls.filter(url => url.loc.includes('/services/') && url.priority === 0.7),
    otherPages: sitemapUrls.filter(url => url.priority && url.priority < 0.7)
  };
}; 
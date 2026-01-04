import { useEffect } from "react";

const ReviewsWidget = () => {
  useEffect(() => {
    // Configuration du widget
    (window as any).CACHET_THIKA_WIDGET_REVIEWS_HORIZONTAL = {
      "id": "5adccd4f-38c3-4ea3-abf6-259546664763",
      "settings": {
        "companyId": "85934d19-eb94-4563-9dad-7d322d68c23e",
        "companySlug": "central-test-agency",
        "customColors": {
          "background": "#FFFFFF",
          "text": "#111827",
          "border": "#e5e7eb",
          "stars": "#fbbf24"
        },
        "displayCount": 5,
        "showDate": true,
        "autoScroll": true,
        "scrollSpeed": "medium",
        "widgetUrl": "https://cachet-thika.com",
        "widgetApiUrl": "https://cachet-thika.com/api"
      }
    };

    // Chargement du script seulement s'il n'existe pas déjà
    const existingScript = document.querySelector('script[src="https://cachet-thika.com/widget-horizontal.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cachet-thika.com/widget-horizontal.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Nettoyage lors du démontage du composant
    return () => {
      // Ne pas supprimer le script car il pourrait être utilisé ailleurs
      // Juste nettoyer la configuration
      delete (window as any).CACHET_THIKA_WIDGET_REVIEWS_HORIZONTAL;
    };
  }, []);

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
          <p className="text-lg text-gray-600">Découvrez les témoignages de nos clients satisfaits</p>
        </div>
        <div id="cachet-thika-widget-reviews-horizontal"></div>
      </div>
    </section>
  );
};

export default ReviewsWidget;

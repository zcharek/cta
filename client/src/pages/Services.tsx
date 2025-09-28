import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Services = () => {
  return (
    <>
      <SEOHead 
        title="Services de Tests Logiciels - Central Test Consulting"
        description="Découvrez nos services complets de tests logiciels : tests fonctionnels, non-fonctionnels, validation, intégration, performance, accessibilité et plus."
        keywords="services tests logiciels, tests fonctionnels, tests non-fonctionnels, validation, intégration, performance, accessibilité, Central Test Agency"
        ogUrl="https://centraltestagency.com/services"
        canonical="https://centraltestagency.com/services"
      />
      <Header />
      <main className="py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6">Nos Services de Tests Logiciels</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre gamme complète de services de tests logiciels pour garantir la qualité de vos applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Tests Fonctionnels</h2>
              <p className="text-gray-600 mb-6">
                Vérifiez que votre application fait exactement ce qu'elle doit faire selon les spécifications.
              </p>
              <div className="space-y-4">
                <a href="/#/services/validation" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Validation</h3>
                  <p className="text-sm text-gray-600">Vérification du cahier des charges et des user stories</p>
                </a>
                <a href="/#/services/integration" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Intégration</h3>
                  <p className="text-sm text-gray-600">Tests des interactions entre modules UI/API</p>
                </a>
                <a href="/#/services/regression" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Régression</h3>
                  <p className="text-sm text-gray-600">Vérification que l'existant fonctionne après modifications</p>
                </a>
                <a href="/#/services/acceptation" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Acceptation Utilisateur</h3>
                  <p className="text-sm text-gray-600">Tests avec les clients et utilisateurs finaux</p>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Tests Non-Fonctionnels</h2>
              <p className="text-gray-600 mb-6">
                Assurez-vous que votre application fonctionne de manière optimale dans tous les contextes.
              </p>
              <div className="space-y-4">
                <a href="/#/services/charge" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Tests de Charge</h3>
                  <p className="text-sm text-gray-600">Évaluation de la capacité utilisateurs simultanés</p>
                </a>
                <a href="/#/services/stress" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Tests de Stress</h3>
                  <p className="text-sm text-gray-600">Comportement en cas de dépassement des limites</p>
                </a>
                <a href="/#/services/montee-charge" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Montée en Charge</h3>
                  <p className="text-sm text-gray-600">Stabilité des performances avec plus d'utilisateurs</p>
                </a>
                <a href="/#/services/accessibilite" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Accessibilité</h3>
                  <p className="text-sm text-gray-600">Utilisabilité pour tous les utilisateurs</p>
                </a>
                <a href="/#/services/compatibilite" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Compatibilité</h3>
                  <p className="text-sm text-gray-600">Fonctionnement sur tous les navigateurs et appareils</p>
                </a>
                <a href="/#/services/ux" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-semibold text-blue-800">Utilisabilité (UX)</h3>
                  <p className="text-sm text-gray-600">Simplicité et cohérence du parcours utilisateur</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Services; 
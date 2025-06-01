import { useState, useEffect } from "react";
import { m } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type TabType = "terms" | "privacy";

const Legal = () => {
  const [activeTab, setActiveTab] = useState<TabType>("terms");

  useEffect(() => {
    document.title = "Conditions Générales et Confidentialité | Central Test Agency";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Conditions générales d\'utilisation et politique de confidentialité de Central Test Agency. Conformes à la réglementation algérienne sur la protection des données.'
      );
    }
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-white min-h-screen">
          <div className="container">
            <m.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Conditions Générales et Confidentialité
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Informations légales conformes à la réglementation algérienne
              </p>
            </m.div>

            <div className="max-w-4xl mx-auto">
              {/* Navigation tabs */}
              <div className="flex border-b border-gray-200 mb-8">
                <button
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                    activeTab === "terms"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("terms")}
                >
                  Conditions Générales
                </button>
                <button
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                    activeTab === "privacy"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("privacy")}
                >
                  Politique de Confidentialité
                </button>
              </div>

              {/* Terms Content */}
              {activeTab === "terms" && (
                <m.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-lg max-w-none"
                >
                  <div className="bg-gray-50 p-6 rounded-xl mb-8">
                    <h2 className="text-xl font-bold mb-2">Conditions Générales d'Utilisation</h2>
                    <p className="text-sm text-gray-600">
                      Dernière mise à jour : 1er juin 2024 | Conformément au droit algérien
                    </p>
                  </div>

                  <h3>1. Identification de l'entreprise</h3>
                  <p>
                    Central Test Agency est une entreprise de services informatiques spécialisée dans les tests logiciels 
                    et l'automatisation QA, établie en Algérie conformément à la législation commerciale algérienne.
                  </p>
                  <ul>
                    <li>Raison sociale : Central Test Agency</li>
                    <li>Secteur d'activité : Services de tests logiciels et automatisation QA</li>
                    <li>Pays d'établissement : République Algérienne Démocratique et Populaire</li>
                    <li>Contact : z.charek@gmail.com</li>
                  </ul>

                  <h3>2. Objet des services</h3>
                  <p>
                    Nous proposons des services professionnels de tests logiciels incluant :
                  </p>
                  <ul>
                    <li>Tests fonctionnels et tests de régression</li>
                    <li>Automatisation de tests avec Playwright, Cypress, Selenium</li>
                    <li>Tests end-to-end et tests d'intégration</li>
                    <li>Tests d'API et tests de performance</li>
                    <li>Tests d'accessibilité et audit qualité</li>
                    <li>Formation et transfert de compétences</li>
                  </ul>

                  <h3>3. Conditions de prestation</h3>
                  <p>
                    <strong>3.1 Devis et acceptation :</strong> Chaque prestation fait l'objet d'un devis détaillé. 
                    L'acceptation du devis par le client constitue un engagement contractuel.
                  </p>
                  <p>
                    <strong>3.2 Délais :</strong> Les délais sont indicatifs et peuvent être ajustés selon la complexité 
                    du projet et la disponibilité des ressources client.
                  </p>
                  <p>
                    <strong>3.3 Facturation :</strong> Paiement possible en dinars algériens (DZD) ou en euros (EUR) 
                    selon les accords contractuels.
                  </p>

                  <h3>4. Propriété intellectuelle</h3>
                  <p>
                    Les scripts de tests, documentations et livrables développés spécifiquement pour le client 
                    lui appartiennent. Central Test Agency conserve ses méthodologies et outils propriétaires.
                  </p>

                  <h3>5. Confidentialité</h3>
                  <p>
                    Central Test Agency s'engage à maintenir la confidentialité de toutes les informations 
                    communiquées par le client dans le cadre de la prestation.
                  </p>

                  <h3>6. Responsabilité</h3>
                  <p>
                    Notre responsabilité est limitée aux services directement fournis. Le client reste responsable 
                    de ses données et de la mise en production de ses applications.
                  </p>

                  <h3>7. Droit applicable</h3>
                  <p>
                    Ces conditions sont régies par le droit algérien. Tout litige sera soumis aux tribunaux 
                    compétents d'Alger, Algérie.
                  </p>
                </m.div>
              )}

              {/* Privacy Content */}
              {activeTab === "privacy" && (
                <m.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-lg max-w-none"
                >
                  <div className="bg-gray-50 p-6 rounded-xl mb-8">
                    <h2 className="text-xl font-bold mb-2">Politique de Confidentialité</h2>
                    <p className="text-sm text-gray-600">
                      Dernière mise à jour : 1er juin 2024 | Conforme à la réglementation algérienne sur la protection des données
                    </p>
                  </div>

                  <h3>1. Collecte des données</h3>
                  <p>
                    Nous collectons uniquement les informations nécessaires à la fourniture de nos services :
                  </p>
                  <ul>
                    <li>Informations de contact (nom, prénom, email, téléphone)</li>
                    <li>Informations sur votre entreprise (nom, secteur d'activité)</li>
                    <li>Détails de votre projet et besoins techniques</li>
                    <li>Données de navigation sur notre site web (cookies techniques)</li>
                  </ul>

                  <h3>2. Utilisation des données</h3>
                  <p>
                    Vos données personnelles sont utilisées exclusivement pour :
                  </p>
                  <ul>
                    <li>Répondre à vos demandes de contact et devis</li>
                    <li>Fournir nos services de tests logiciels</li>
                    <li>Améliorer la qualité de nos prestations</li>
                    <li>Respecter nos obligations légales et contractuelles</li>
                  </ul>

                  <h3>3. Protection des données</h3>
                  <p>
                    <strong>3.1 Sécurité :</strong> Nous mettons en place des mesures techniques et organisationnelles 
                    appropriées pour protéger vos données contre tout accès non autorisé.
                  </p>
                  <p>
                    <strong>3.2 Conservation :</strong> Vos données sont conservées pendant la durée nécessaire 
                    à la réalisation des prestations et conformément aux obligations légales algériennes.
                  </p>
                  <p>
                    <strong>3.3 Localisation :</strong> Vos données sont stockées et traitées en Algérie, 
                    garantissant leur protection selon la législation nationale.
                  </p>

                  <h3>4. Partage des données</h3>
                  <p>
                    Nous ne vendons, ne louons, ni ne partageons vos données personnelles avec des tiers, 
                    sauf dans les cas suivants :
                  </p>
                  <ul>
                    <li>Obligation légale imposée par les autorités algériennes</li>
                    <li>Sous-traitants techniques nécessaires à la prestation (sous contrat de confidentialité)</li>
                    <li>Consentement explicite de votre part</li>
                  </ul>

                  <h3>5. Vos droits</h3>
                  <p>
                    Conformément à la réglementation algérienne, vous disposez des droits suivants :
                  </p>
                  <ul>
                    <li>Droit d'accès à vos données personnelles</li>
                    <li>Droit de rectification des informations inexactes</li>
                    <li>Droit d'effacement dans les conditions légales</li>
                    <li>Droit d'opposition au traitement pour motifs légitimes</li>
                  </ul>
                  <p>
                    Pour exercer ces droits, contactez-nous à : z.charek@gmail.com
                  </p>

                  <h3>6. Cookies</h3>
                  <p>
                    Notre site utilise uniquement des cookies techniques nécessaires au fonctionnement. 
                    Aucun cookie de traçage publicitaire n'est utilisé.
                  </p>

                  <h3>7. Contact</h3>
                  <p>
                    Pour toute question concernant cette politique de confidentialité ou le traitement 
                    de vos données personnelles, contactez notre responsable de la protection des données à : 
                    z.charek@gmail.com
                  </p>

                  <h3>8. Modifications</h3>
                  <p>
                    Cette politique peut être mise à jour. Les modifications importantes vous seront 
                    communiquées par email ou via notre site web.
                  </p>
                </m.div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Legal;
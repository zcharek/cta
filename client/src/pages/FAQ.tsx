import { useState, useEffect } from "react";
import { m } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";

const faqs = [
  {
    question: "Quels types de tests logiciels proposez-vous en Algérie ?",
    answer: "Nous proposons une gamme complète de services : tests fonctionnels, tests automatisés avec Playwright et Cypress, tests E2E, tests d'API, tests de régression, tests d'accessibilité et tests d'intégration. Tous nos services sont adaptés au marché algérien et aux standards internationaux."
  },
  {
    question: "Combien de temps prend un projet de test logiciel ?",
    answer: "La durée dépend de la complexité de votre projet. Un audit simple peut prendre 1-2 semaines, tandis qu'une mise en place complète d'automatisation peut prendre 4-8 semaines. Nous vous fournissons toujours un planning détaillé après l'analyse de vos besoins."
  },
  {
    question: "Travaillez-vous avec des entreprises de toutes tailles ?",
    answer: "Oui, nous accompagnons aussi bien les startups que les grandes entreprises en Algérie. Nos solutions sont modulaires et s'adaptent à votre budget et vos besoins spécifiques, que vous soyez une PME ou une multinationale."
  },
  {
    question: "Quels outils d'automatisation utilisez-vous ?",
    answer: "Nous sommes spécialisés dans Playwright, Cypress, Selenium et Postman. Nous choisissons les outils les plus adaptés à votre stack technique et vos objectifs. Nous maîtrisons également les frameworks modernes comme React, Vue, Angular."
  },
  {
    question: "Proposez-vous de la formation à vos outils ?",
    answer: "Absolument ! Nous incluons systématiquement un volet formation dans nos prestations. Vos équipes apprennent à maintenir et faire évoluer les tests que nous mettons en place. Formation en français ou arabe selon vos préférences."
  },
  {
    question: "Comment garantissez-vous la qualité de vos tests ?",
    answer: "Nous suivons les standards ISTQB et appliquons les meilleures pratiques de l'industrie. Chaque projet inclut une documentation complète, des métriques de couverture et des rapports détaillés. Nous offrons également un support post-livraison."
  },
  {
    question: "Quels sont vos tarifs pour les services en Algérie ?",
    answer: "Nos tarifs sont compétitifs et adaptés au marché algérien. Nous proposons des devis gratuits personnalisés selon vos besoins. Possibilité de paiement en dinars algériens ou en euros selon votre préférence."
  },
  {
    question: "Travaillez-vous à distance ou sur site ?",
    answer: "Nous proposons les deux options : intervention sur site en Algérie (Alger, Oran, Constantine) ou travail à distance. Nos méthodes agiles nous permettent une collaboration efficace quel que soit le mode de travail choisi."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "FAQ - Questions Fréquentes | Central Test Agency";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Questions fréquentes sur nos services de tests logiciels et automatisation QA en Algérie. Trouvez toutes les réponses sur Playwright, Cypress, tarifs et méthodes.'
      );
    }
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gray-50 min-h-screen">
          <div className="container">
            <m.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Questions Fréquentes
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Retrouvez les réponses aux questions les plus courantes sur nos 
                services de tests logiciels et d'automatisation QA en Algérie.
              </p>
            </m.div>

            <div className="max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <m.div
                  key={index}
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                    <button
                      className="w-full px-8 py-6 text-left focus:outline-none hover:bg-gray-50 transition-colors"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 pr-8">
                          {faq.question}
                        </h2>
                        <div
                          className={`transform transition-transform duration-200 ${
                            openIndex === index ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-8 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>

            <m.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-gray-600 mb-6">
                Vous ne trouvez pas la réponse à votre question ?
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="mr-2">💬</span>
                Contactez-nous
              </button>
            </m.div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Modale de contact */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FAQ;
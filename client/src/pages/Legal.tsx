import { useEffect } from "react";
import { m } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { useState } from "react";

const legalTimeline = [
  {
    id: "identite",
    icon: "🏢",
    title: "Identification",
    summary: "Qui sommes-nous ?",
    detail: (
      <>
        <p className="mb-2">Central Test Consulting, société algérienne spécialisée en tests logiciels et automatisation QA.</p>
        <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>Raison sociale : Central Test Consulting</li>
          <li>Secteur : Tests logiciels & automatisation QA</li>
          <li>Pays : Algérie</li>
          <li>Contact : centraltestagency@gmail.com</li>
        </ul>
      </>
    ),
  },
  {
    id: "services",
    icon: "🛠️",
    title: "Nos Services",
    summary: "Ce que nous proposons",
    detail: (
      <ul className="list-disc pl-5 text-sm text-gray-500">
        <li>Tests fonctionnels, régression, E2E, API, performance</li>
        <li>Automatisation (Playwright, Cypress, Selenium)</li>
        <li>Audit qualité, accessibilité, formation</li>
      </ul>
    ),
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    summary: "Vos livrables, notre expertise",
    detail: (
      <p className="text-sm text-gray-600">Les scripts, docs et livrables créés pour vous vous appartiennent. Nos méthodes et outils restent notre propriété.</p>
    ),
  },
  {
    id: "confidentialite",
    icon: "🔒",
    title: "Confidentialité",
    summary: "Vos données sont sacrées",
    detail: (
      <p className="text-sm text-gray-600">Nous garantissons la confidentialité de toutes les informations échangées dans le cadre de nos prestations.</p>
    ),
  },
  {
    id: "protection",
    icon: "🛡️",
    title: "Protection des données",
    summary: "Sécurité & conformité",
    detail: (
      <ul className="list-disc pl-5 text-sm text-gray-500">
        <li>Mesures techniques & organisationnelles strictes</li>
        <li>Données stockées et traitées en Algérie</li>
        <li>Conservation limitée à la durée légale</li>
      </ul>
    ),
  },
  {
    id: "droits",
    icon: "📝",
    title: "Vos droits",
    summary: "Contrôlez vos données",
    detail: (
      <ul className="list-disc pl-5 text-sm text-gray-500">
        <li>Accès, rectification, effacement, opposition</li>
        <li>Contact : centraltestagency@gmail.com</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    icon: "🍪",
    title: "Cookies",
    summary: "Juste l'essentiel",
    detail: (
      <p className="text-sm text-gray-600">Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du site. Aucun tracking publicitaire.</p>
    ),
  },
  {
    id: "contact",
    icon: "📧",
    title: "Contact",
    summary: "Une question ?",
    detail: (
      <p className="text-sm text-gray-600">Pour toute question légale ou sur la confidentialité, contactez notre DPO à centraltestagency@gmail.com</p>
    ),
  },
  {
    id: "modifications",
    icon: "🔄",
    title: "Modifications",
    summary: "Toujours à jour",
    detail: (
      <p className="text-sm text-gray-500">Cette page peut évoluer. Les changements majeurs seront communiqués sur le site ou par email.</p>
    ),
  },
];

const TimelineSection = ({ icon, title, summary, detail, isLast, delay }: any) => (
  <m.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="relative flex md:items-center gap-6 md:gap-10 group"
  >
    {/* Timeline line */}
    <div className="flex flex-col items-center">
      <span className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-2xl shadow-xl border-4 border-white ring-4 ring-blue-100 group-hover:shadow-blue-200 group-hover:shadow-lg transition">
        {icon}
      </span>
      {!isLast && (
        <span className="w-1 h-24 bg-gradient-to-b from-blue-100 to-blue-300 block mt-1 mb-1 mx-auto rounded-full opacity-70"></span>
      )}
    </div>
    {/* Content */}
    <div className="flex-1 md:flex md:items-center md:gap-8">
      <div className="md:w-56 mb-2 md:mb-0">
        <h3 className="text-lg font-bold text-blue-900 mb-1">{title}</h3>
        <p className="text-blue-700 text-sm italic">{summary}</p>
      </div>
      <div className="flex-1">
        <div className="bg-white/90 rounded-3xl shadow-2xl group-hover:shadow-3xl group-hover:-trangray-y-1 border border-blue-100 px-8 py-8 transition-all duration-300">
          <div className="text-gray-800 text-base md:text-lg leading-relaxed">{detail}</div>
        </div>
      </div>
    </div>
  </m.div>
);

const Legal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
          document.title = "Mentions Légales & Confidentialité | Central Test Consulting";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
              metaDescription.setAttribute('content', "Mentions légales, conditions d'utilisation et politique de confidentialité de Central Test Consulting. Conformes à la réglementation algérienne sur la protection des données.");
    }
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 relative overflow-x-hidden">
        <section className="py-16">
          <div className="container max-w-4xl mx-auto">
            <m.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-3">
                Mentions Légales & Confidentialité
              </h1>
              <p className="text-lg text-blue-700 max-w-2xl mx-auto">
                Découvrez notre engagement pour la transparence, la sécurité et la confiance.
              </p>
            </m.div>
            <div className="relative mt-14 mb-10">
              <div className="absolute left-6 md:left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 to-blue-300 opacity-60 z-0" />
              <div className="space-y-20 relative z-10">
                {legalTimeline.map((section, idx) => (
                  <div key={section.id}>
                    <div
                      className="cursor-pointer select-none flex items-center gap-3 group"
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                      <span className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-2xl shadow-xl border-4 border-white ring-4 ring-blue-100 group-hover:shadow-blue-200 group-hover:shadow-lg transition">
                        {section.icon}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-blue-900 mb-1 group-hover:underline">{section.title}</h3>
                        <p className="text-blue-700 text-sm italic">{section.summary}</p>
                      </div>
                      <span className={`transition-transform duration-300 ml-2 ${openIndex === idx ? 'rotate-90' : ''}`}>
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 8L10 12L14 8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                    {openIndex === idx && (
                      <div className="ml-16 bg-white/90 rounded-3xl shadow-2xl border border-blue-100 px-8 py-8 mt-2 transition-all duration-300">
                        <div className="text-gray-800 text-base md:text-lg leading-relaxed">{section.detail}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Legal;
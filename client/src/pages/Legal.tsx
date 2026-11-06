import Layout from "@/components/Layout";

const sections = [
  {
    title: "Identification",
    body: "Central Test Agency, société algérienne spécialisée en tests logiciels et automatisation QA. Contact : centraltestagency@gmail.com.",
  },
  {
    title: "Nos services",
    body: "Tests fonctionnels, régression, E2E, API et performance ; automatisation (Playwright, Cypress, Selenium) ; audit qualité, accessibilité et formation.",
  },
  {
    title: "Propriété intellectuelle",
    body: "Les scripts, documents et livrables créés pour vous vous appartiennent. Nos méthodes et outils restent notre propriété.",
  },
  {
    title: "Confidentialité",
    body: "Nous garantissons la confidentialité de toutes les informations échangées dans le cadre de nos prestations.",
  },
  {
    title: "Protection des données",
    body: "Mesures techniques et organisationnelles strictes. Données stockées et traitées en Algérie, conservées pendant la durée légale uniquement.",
  },
  {
    title: "Vos droits",
    body: "Vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition. Contact : centraltestagency@gmail.com.",
  },
  {
    title: "Cookies",
    body: "Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du site. Aucun tracking publicitaire.",
  },
  {
    title: "Modifications",
    body: "Cette page peut évoluer. Les changements majeurs seront communiqués sur le site ou par email.",
  },
];

export default function Legal() {
  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <a href="#" className="mb-8 inline-block text-sm text-brand-blue-600 hover:underline">
          ← Retour à l'accueil
        </a>
        <h1 className="mb-10 text-3xl font-bold text-brand-blue-900 md:text-4xl">Mentions légales & confidentialité</h1>
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="mb-2 text-lg font-semibold text-brand-blue-900">{s.title}</h2>
              <p className="text-gray-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

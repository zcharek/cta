import { useState, type FormEvent, type ReactNode } from "react";
import Layout from "@/components/Layout";

const FORMSPREE_URL = "https://formspree.io/f/manjygqn";
const CALENDLY_URL = "https://calendly.com/centraltestagency/30min";
const VETCARE_URL = "https://vetcare-dz.com";

// Icônes inline (traits), pour éviter une dépendance.
const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
    <path d={d} />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0 text-brand-blue-600" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

const services = [
  {
    title: "Gestion de projet agile",
    text: "Structuration d'équipes Scrum, feature teams et accompagnement méthodologique.",
    icon: "M17 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75",
    items: [],
  },
  {
    title: "Tests fonctionnels",
    text: "Votre application fait exactement ce qu'elle doit faire.",
    icon: "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9",
    items: ["Validation", "Intégration", "Régression", "Acceptation utilisateur"],
  },
  {
    title: "Tests non-fonctionnels",
    text: "Performance, robustesse et expérience utilisateur.",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    items: ["Charge & stress", "Montée en charge", "Accessibilité", "Compatibilité", "Utilisabilité (UX)"],
  },
  {
    title: "Automatisation",
    text: "Des tests rejoués à chaque livraison dans votre CI/CD.",
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
    items: ["Playwright", "Cypress", "Selenium", "Postman", "k6"],
  },
  {
    title: "Développement sur mesure",
    text: "Des outils métier conçus, développés et testés par des experts QA, de la maquette à la mise en production.",
    icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z",
    items: ["Applications web", "SaaS", "Outils internes"],
    link: { href: "#realisation", label: "Voir notre réalisation VetCare →" },
  },
];

const steps = [
  { title: "Analyse", text: "Comprendre votre produit, vos utilisateurs et vos objectifs." },
  { title: "Plan de test", text: "Définir le périmètre, l'approche et les livrables." },
  { title: "Exécution", text: "Dérouler les tests et documenter chaque anomalie." },
  { title: "Rapport", text: "Des résultats clairs et des recommandations concrètes." },
];

const promises = ["Consultation gratuite", "Réponse sous 24h", "Disponible 24h/7j"];

function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-red-700">{eyebrow}</p>
      <h2 className="mb-3 text-3xl font-bold text-brand-blue-900 md:text-4xl">{title}</h2>
      {children && <p className="text-gray-600">{children}</p>}
    </div>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-xl">
        <p className="mb-2 text-xl font-semibold text-brand-blue-900">Merci !</p>
        <p className="text-gray-600">Votre message est bien parti. Nous vous répondons sous 24h.</p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-100";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl bg-white p-6 shadow-xl sm:grid-cols-2 sm:p-8">
      <input name="name" required placeholder="Nom" aria-label="Nom" autoComplete="name" className={input} />
      <input name="email" type="email" required placeholder="Email" aria-label="Email" autoComplete="email" className={input} />
      <input name="company" placeholder="Entreprise" aria-label="Entreprise" autoComplete="organization" className={`${input} sm:col-span-2`} />
      <textarea
        name="message"
        required
        minLength={10}
        rows={4}
        placeholder="Décrivez votre besoin en quelques lignes"
        aria-label="Votre besoin"
        className={`${input} sm:col-span-2`}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-brand-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-700 disabled:opacity-60 sm:col-span-2"
      >
        {status === "sending" ? "Envoi…" : "Envoyer le message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2">
          L'envoi a échoué. Écrivez-nous directement à centraltestagency@gmail.com.
        </p>
      )}
    </form>
  );
}

export default function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-blue-50 via-white to-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <p className="mb-6 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-blue-700 shadow-sm ring-1 ring-brand-blue-100">
            Experts QA certifiés ISTQB
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-brand-blue-900 md:text-6xl">
            Offrez à vos utilisateurs la qualité{" "}
            <span className="text-brand-red-700">qu'ils méritent.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            Nous concevons, testons et automatisons vos produits digitaux pour des mises en production fiables et sans surprise.
          </p>
          <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="rounded-lg bg-brand-blue-900 px-8 py-4 font-semibold text-white shadow-lg shadow-brand-blue-900/20 transition hover:-translate-y-0.5 hover:bg-brand-blue-700"
            >
              Nous contacter
            </a>
            <a
              href="#services"
              className="rounded-lg border-2 border-brand-blue-900 bg-white px-8 py-4 font-semibold text-brand-blue-900 transition hover:bg-brand-blue-50"
            >
              Nos services
            </a>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-16 bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <SectionTitle eyebrow="Ce que nous faisons" title="Nos services">
            Du cadrage à la mise en production, nous sécurisons la qualité de vos applications.
          </SectionTitle>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                className={`rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg ${
                  s.link ? "border-brand-blue-300 md:col-span-2" : "border-gray-200"
                }`}
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-900 text-white">
                    <Icon d={s.icon} />
                  </span>
                  <h3 className="text-xl font-semibold text-brand-blue-900">{s.title}</h3>
                </div>
                <p className="mb-4 text-gray-600">{s.text}</p>
                {s.items.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <li key={item} className="rounded-full bg-brand-blue-50 px-3 py-1 text-sm text-brand-blue-800">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {s.link && (
                  <a href={s.link.href} className="mt-4 inline-block font-semibold text-brand-blue-700 hover:underline">
                    {s.link.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisation */}
      <section id="realisation" className="scroll-mt-16 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <SectionTitle eyebrow="Réalisation" title="Notre réalisation">
            Nous appliquons à nos propres produits la rigueur que nous apportons à ceux de nos clients.
          </SectionTitle>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <a href={VETCARE_URL} target="_blank" rel="noopener noreferrer" className="group block">
              <img
                src="/images/vetcare.png"
                alt="Page d'accueil de VetCare, logiciel de gestion de cabinet vétérinaire"
                width={1280}
                height={800}
                loading="lazy"
                className="w-full rounded-2xl border border-gray-200 shadow-xl transition group-hover:-translate-y-1 group-hover:shadow-2xl"
              />
            </a>
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-blue-600">
                SaaS · en production en Algérie
              </p>
              <h3 className="mb-3 text-2xl font-bold text-brand-blue-900">VetCare</h3>
              <p className="mb-4 text-gray-600">
                Le logiciel de gestion des cabinets vétérinaires, avec un carnet de santé gratuit partagé avec les
                propriétaires d'animaux.
              </p>
              <ul className="mb-6 space-y-2 text-gray-700">
                {["Agenda et dossiers patients", "Rappels de vaccins automatiques", "Facturation et gestion du stock"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-sm text-gray-500">Conçu, développé et testé de bout en bout par Central Test Agency.</p>
              <a
                href={VETCARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-brand-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-700"
              >
                Voir VetCare ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Approche */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <SectionTitle eyebrow="Méthode" title="Notre approche">
            Une méthodologie rigoureuse, alignée sur les standards ISTQB, pour une qualité sans compromis.
          </SectionTitle>
          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <span className="absolute left-5 right-[calc(25%-1.25rem)] top-5 hidden h-0.5 bg-brand-blue-100 lg:block" aria-hidden="true" />
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-900 font-semibold text-white ring-8 ring-gray-50">
                  {i + 1}
                </span>
                <h3 className="mb-1 font-semibold text-brand-blue-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-16 bg-brand-blue-900 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-red-700">Contact</p>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Parlons de votre projet</h2>
            <p className="mb-8 text-brand-blue-100">
              Une consultation gratuite de 30 minutes pour comprendre votre besoin et vous proposer une approche adaptée.
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-blue-900 transition hover:bg-brand-blue-50"
            >
              Réserver un créneau ↗
            </a>
            <div className="space-y-2 text-brand-blue-100">
              <p>
                ou par email :{" "}
                <a href="mailto:centraltestagency@gmail.com" className="font-semibold text-white hover:underline">
                  centraltestagency@gmail.com
                </a>
              </p>
              <p>
                ou par téléphone :{" "}
                <a href="tel:+213552235755" className="font-semibold text-white hover:underline">
                  +213 552 23 57 55
                </a>
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
}

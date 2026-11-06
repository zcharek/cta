import type { ReactNode } from "react";

const icon = "h-5 w-5 flex-shrink-0 text-brand-blue-300";

const contacts = [
  {
    label: "Nos bureaux",
    value: "384 lot Guessace Draria, Alger",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={icon} aria-hidden="true">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
      </svg>
    ),
  },
  {
    label: "Téléphone",
    value: "+213 552 23 57 55",
    href: "tel:+213552235755",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={icon} aria-hidden="true">
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "centraltestagency@gmail.com",
    href: "mailto:centraltestagency@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={icon} aria-hidden="true">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5-8-5V6l8 5 8-5v2.2Z" />
      </svg>
    ),
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="#" aria-label="Central Test Agency – accueil">
            <img src="/images/logo-dark-horizontal.svg" alt="Central Test Agency" className="h-10 w-auto" />
          </a>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="#services" className="hidden text-gray-700 hover:text-brand-blue-700 sm:inline">
              Services
            </a>
            <a href="#realisation" className="hidden text-gray-700 hover:text-brand-blue-700 sm:inline">
              Réalisation
            </a>
            <a href="#contact" className="rounded-lg bg-brand-blue-900 px-4 py-2 text-white hover:bg-brand-blue-700">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-[#1E293B] pt-12 pb-8 text-sm text-gray-400">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-3">
          {/* Présentation */}
          <div>
            <img src="/images/logo-light-horizontal.svg" alt="Central Test Agency" className="mb-4 h-12 w-auto" />
            <p className="leading-relaxed">
              Améliorer les expériences numériques grâce à des solutions de tests et d'assurance qualité expertes.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-white">Informations de contact</h2>
            <ul className="space-y-4">
              {contacts.map((c) => (
                <li key={c.label} className="flex gap-3">
                  {c.icon}
                  <div>
                    <p className="text-xs text-gray-500">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-gray-300 hover:text-white">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-gray-300">{c.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-white">Nos horaires de travail</h2>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-blue-700 px-4 py-2 font-semibold text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </svg>
              Service disponible 24H/7J
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-between gap-4 border-t border-gray-700 px-4 pt-6 sm:flex-row">
          <a
            href="https://www.linkedin.com/company/central-test-agency/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Central Test Agency sur LinkedIn"
            className="text-gray-400 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.95 1.32-1.95 2.7V21h-4V9.5Z" />
            </svg>
          </a>
          <p className="text-center">
            <a href="#/legal" className="text-brand-blue-300 hover:text-white">
              Mentions légales
            </a>
            <span className="mx-2">•</span>© {new Date().getFullYear()} Central Test Agency. Tous droits réservés.
          </p>
        </div>
      </footer>
    </>
  );
}

import { m } from "framer-motion";
import LogoCT from "./LogoCT";
import PatternBackground from "./PatternBackground";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Nos bureaux",
      content: "Alger, Algérie",
    },
    {
      icon: "fas fa-phone-alt",
      title: "Téléphone",
      content: "+33 (06) 44-71-16-78",
      link: "tel:+33644711678",
    },
    {
      icon: "fas fa-envelope",
      title: "Email",
      content: "centraltestagency@gmail.com",
      link: "mailto:centraltestagency@gmail.com",
    },
  ];

  return (
    <PatternBackground 
      variant="dark" 
      opacity={0.15}
      className="bg-[#1E293B] text-white py-8 md:py-10"
    >
    <footer className="container">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8 mb-8">
          {/* Présentation agence */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <LogoCT className="h-10 w-10" variant="light" />
              <span className="text-2xl font-lexend font-semibold text-white">
                Central<span className="text-brand-red-400">TestAgency</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Améliorer les expériences numériques grâce à des solutions de
              tests et d'assurance qualité expertes. Nous accompagnons votre
              entreprise vers l'excellence technique.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/central-test-agency/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-200 text-xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-blue-600/20"
                aria-label="Suivez-nous sur LinkedIn"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </m.div>

          {/* Liens rapides */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Liens rapides
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/#/services"
                  className="text-gray-400 hover:text-white transition-all duration-200 text-sm flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Nos services
                </a>
              </li>
              <li>
                <a
                  href="/#/faq"
                  className="text-gray-400 hover:text-white transition-all duration-200 text-sm flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/#/legal"
                  className="text-gray-400 hover:text-white transition-all duration-200 text-sm flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-brand-blue-400 mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Mentions Légales
                </a>
              </li>
            </ul>
          </div>

          {/* Informations de contact */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Contact
            </h4>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.link || '#'}
                  target={item.link?.startsWith('http') ? '_blank' : undefined}
                  rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start group hover:translate-x-1 transition-transform duration-200"
                >
                  <div className="w-8 h-8 flex items-center justify-center text-brand-blue-400 mr-3 flex-shrink-0 group-hover:text-brand-blue-300 transition-colors">
                    <i className={`${item.icon} text-base`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1 group-hover:text-brand-blue-300 transition-colors">{item.title}</p>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {item.content}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Horaires */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Disponibilité
            </h4>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-blue-800 via-brand-blue-700 to-brand-blue-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 shadow-lg border border-brand-blue-300/30">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span>Service disponible 24H/7J</span>
            </div>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center md:text-left">
              <span>&copy; {currentYear} Central Test Agency. Tous droits réservés.</span>
            </div>

            {/* Mentions légales */}
            <div className="text-sm">
              <a
                href="/#/legal"
                className="text-white hover:text-brand-blue-300 transition-colors"
              >
                Mentions Légales
              </a>
            </div>
          </div>
        </div>
    </footer>
    </PatternBackground>
  );
};

export default Footer;

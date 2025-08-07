import { m } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Nos bureaux",
      content: "Hydra, Alger\nParis, France",
    },
    {
      icon: "fas fa-phone-alt",
      title: "Phone",
      content: "+33 (06) 44-71-16-78",
    },
    {
      icon: "fas fa-envelope",
      title: "Email",
      content: "centraltestagency@gmail.com",
    },
  ];

  return (
    <footer className="bg-[#1E293B] text-white py-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 items-start">
          {/* Présentation agence */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:border-r lg:border-gray-700 pr-0 lg:pr-8 mb-8 lg:mb-0"
          >
            <div className="text-2xl font-poppins font-semibold mb-3">
              Central<span className="text-blue-400">TestConsulting</span>
            </div>
            <p className="text-gray-400 mb-3">
              Améliorer les expériences numériques grâce à des solutions de
              tests et d'assurance qualité expertes.
            </p>
          </m.div>

          {/* Informations de contact */}
          <div className="lg:border-r lg:border-gray-700 px-0 lg:px-8 mb-8 lg:mb-0 flex flex-col h-full">
            <h4 className="text-lg font-semibold mb-4">
              Informations de contact
            </h4>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center text-secondary mr-3">
                    <i className={`${item.icon} text-base`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-gray-400 whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Horaires */}
          <div className="flex flex-col items-center pt-2 lg:pt-0">
            <h4 className="text-lg font-semibold mb-2">Nos horaires de travail</h4>
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white text-sm font-semibold rounded-2xl px-4 py-1.5 shadow-md border border-blue-300/30">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-white/80' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
              Service disponible 24H/7J
            </div>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* LinkedIn à gauche */}
            <div className="mb-4 md:mb-0">
              <a
                href="https://www.linkedin.com/company/central-test-agengy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-lg"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>

            {/* Texte de copyright et lien légal à droite */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-4 text-sm text-gray-400">
                <a
                  href="/legal"
                  className="hover:text-white transition-colors"
                >
                  Mentions Légales
                </a>
                <span>•</span>
                <span>&copy; {currentYear} Central Test Consulting. Tous droits réservés.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

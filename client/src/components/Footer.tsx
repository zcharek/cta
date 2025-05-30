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
      content: "z.charek@gmail.com",
    },
  ];

  const businessHours = [
    { day: "Dimanche - Jeudi", hours: "9:00 - 18:00" },
    { day: "Vendredi - Samedi", hours: "Fermé" },
  ];

  return (
    <footer className="bg-[#1E293B] text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Présentation agence */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-2xl font-poppins font-semibold mb-6">
              Central<span className="text-secondary">TestAgency</span>
            </div>
            <p className="text-gray-400 mb-6">
              Améliorer les expériences numériques grâce à des solutions de
              tests et d'assurance qualité expertes.
            </p>
          </m.div>

          {/* Informations de contact */}
          <div>
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
          <div>
            <h4 className="text-lg font-semibold mb-4">
              Nos horaires de travail
            </h4>
            <div className="space-y-2">
              {businessHours.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-400"
                >
                  <span>{item.day} :</span>
                  <span>{item.hours}</span>
                </div>
              ))}
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

            {/* Texte de copyright à droite */}
            <p className="text-gray-400 text-sm text-right">
              &copy; {currentYear} Central Test Agency. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

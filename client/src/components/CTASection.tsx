import { useState } from "react";
import { m } from "framer-motion";
import ContactModal from "./ContactModal";
import CalendlyModal from "./CalendlyModal";

const CTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white">
      <div className="container">
        <m.div
          className="gradient-bg rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <i className="fas fa-code text-white text-6xl sm:text-9xl absolute -top-3 -right-3 sm:-top-5 sm:-right-5"></i>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Prêt à améliorer la qualité de vos logiciels ?
              </h2>
              <p className="text-base sm:text-lg text-secondary-light max-w-2xl mx-auto">
                Contactez-nous pour une consultation gratuite et découvrez comment nos experts peuvent transformer vos processus de tests.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => setIsCalendlyOpen(true)}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="mr-2">📅</span>
                  Prendre un rendez-vous
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="mr-2">💬</span>
                  Envoyer un message
                </button>
              </div>
              <p className="text-secondary-light text-xs sm:text-sm">
                Consultation gratuite de 30 minutes • Réponse sous 24h
              </p>
            </div>
          </div>
        </m.div>
      </div>

      {/* Modale de contact */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Modale Calendly */}
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </section>
  );
};

export default CTASection;
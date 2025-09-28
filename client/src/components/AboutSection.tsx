import { m } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-24 bg-gradient-to-b from-white via-gray-50 to-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-8">
              Notre ADN
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Nous sommes une équipe d'experts passionnés en assurance qualité,
              guidés par les principes rigoureux de l'ISTQB. Notre engagement
              est d'aider les entreprises à offrir des expériences digitales
              exceptionnelles grâce à des tests structurés, méthodiques et
              reconnus internationalement.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Forts d'une solide expérience dans le secteur, nous accompagnons
              des entreprises de tous domaines pour garantir des logiciels
              performants, fiables et une expérience utilisateur fluide, en
              appliquant les bonnes pratiques et standards définis par l'ISTQB.
            </p>
          </m.div>

          {/* Colonne droite avec Mission, Vision et Logo ISTQB */}
          <m.div
            className="flex flex-col items-center justify-center space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 gap-8 max-w-md w-full">
              <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-lg hover:shadow-blue-200 transition-all duration-300 p-8 relative">
                <span className="absolute -top-4 left-6 bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow">Mission</span>
                <h4 className="font-bold text-blue-900 mb-4 mt-2 text-lg"></h4>
                <p className="text-gray-700 leading-relaxed">
                  Améliorer les expériences digitales grâce à des tests
                  méticuleux et des principes centrés sur l'utilisateur.
                </p>
              </div>
              <div className="bg-white/90 border border-blue-100 rounded-2xl shadow-lg hover:shadow-blue-200 transition-all duration-300 p-8 relative">
                <span className="absolute -top-4 left-6 bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow">Vision</span>
                <h4 className="font-bold text-blue-900 mb-4 mt-2 text-lg"></h4>
                <p className="text-gray-700 leading-relaxed">
                  Devenir le partenaire de référence en assurance qualité pour
                  les entreprises innovantes à travers le monde.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center mt-8">
              <img
                src="https://isqi.org/media/19/26/7e/1686243532/istqb.jpeg"
                alt="ISTQB Certified"
                className="w-48 h-auto object-contain mb-4"
              />
              <span className="inline-block bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow">Certifié ISTQB</span>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

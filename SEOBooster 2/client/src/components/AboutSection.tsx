import { m } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Notre ADN
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Nous sommes une équipe d’experts passionnés en assurance qualité,
              guidés par les principes rigoureux de l’ISTQB. Notre engagement
              est d’aider les entreprises à offrir des expériences digitales
              exceptionnelles grâce à des tests structurés, méthodiques et
              reconnus internationalement.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Forts d’une solide expérience dans le secteur, nous accompagnons
              des entreprises de tous domaines pour garantir des logiciels
              performants, fiables et une expérience utilisateur fluide, en
              appliquant les bonnes pratiques et standards définis par l’ISTQB.
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
            <div className="grid grid-cols-1 gap-6 max-w-md w-full">
              <div>
                <h4 className="font-bold text-foreground mb-2">
                  Notre Mission
                </h4>
                <p className="text-gray-600">
                  Améliorer les expériences digitales grâce à des tests
                  méticuleux et des principes centrés sur l’utilisateur.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Notre Vision</h4>
                <p className="text-gray-600">
                  Devenir le partenaire de référence en assurance qualité pour
                  les entreprises innovantes à travers le monde.
                </p>
              </div>
            </div>

            <img
              src="https://isqi.org/media/19/26/7e/1686243532/istqb.jpeg"
              alt="ISTQB Certified"
              className="w-48 h-auto object-contain"
            />
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

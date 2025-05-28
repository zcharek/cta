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
              dédiée à aider les entreprises à offrir des expériences digitales
              exceptionnelles grâce à des tests rigoureux.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Forts d’une expérience dans le secteur, nous accompagnons des
              entreprises, tous domaines confondus, pour garantir des logiciels
              performants et une expérience utilisateur fluide.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="font-bold text-foreground mb-2">
                  Notre Mission
                </h4>
                <p className="text-gray-600">
                  Améliorer les expériences digitales grâce à des tests
                  méticuleux et des principes centrés sur l’utilisateur.
                </p>
              </m.div>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="font-bold text-foreground mb-2">Notre Vision</h4>
                <p className="text-gray-600">
                  Devenir le partenaire de référence en assurance qualité pour
                  les entreprises innovantes à travers le monde.
                </p>
              </m.div>
            </div>
            <m.a
              href="#contact"
              className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-light transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contactez-nous
            </m.a>
          </m.div>
          <m.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=900"
              alt="Our team of testing professionals"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
            <m.div
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg hidden md:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex items-center space-x-3">
                <m.div
                  className="bg-secondary rounded-full p-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                >
                  <img
                    src="istqb.webp" // <-- mets ici le bon chemin
                    alt="ISTQB Certified"
                    className="w-8 h-8" // tu peux ajuster la taille si besoin
                  />
                </m.div>
                <div>
                  <p className="font-semibold">ISTQB Certified</p>
                  <p className="text-sm text-gray-500">Quality Management</p>
                </div>
              </div>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

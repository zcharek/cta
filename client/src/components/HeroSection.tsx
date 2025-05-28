import { m } from "framer-motion";
import ThreeDElement from "./ThreeDElement";

const HeroSection = () => {
  return (
    <section id="home" className="pt-28 pb-20 lg:pt-40 lg:pb-28">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <m.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Offrez à Vos Utilisateurs la Qualité Qu’ils{" "}
              <span className="text-primary">Méritent.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Nous testons et optimisons vos produits pour garantir une
              expérience utilisateur fluide et fiable.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <m.a
                href="#services"
                className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-light transition-all duration-200 text-center shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Nos Services
              </m.a>
              <m.a
                href="#contact"
                className="px-8 py-3 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-all duration-200 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contactez-nous
              </m.a>
            </div>
          </m.div>

          <m.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
                alt="Software testing professionals analyzing data"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
              />

              {/* 3D element overlay */}
              <div className="absolute top-0 right-0 w-full h-full">
                <ThreeDElement />
              </div>

              <m.div
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <m.div
                    className="bg-success rounded-full p-2"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <i className="fas fa-check text-white"></i>
                  </m.div>
                  <div>
                    <p className="font-semibold">Zéro défaut. Zéro surprise.</p>
                    <p className="text-sm text-gray-500">
                      Testé, validé, déployé.
                    </p>
                  </div>
                </div>
              </m.div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

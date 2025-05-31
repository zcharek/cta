import ThreeDElement from "./ThreeDElement";

const HeroSection = () => {
  return (
    <section id="home" className="webflow-section pt-28 pb-20 lg:pt-40 lg:pb-28">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              Offrez à Vos Utilisateurs la Qualité Qu'ils{" "}
              <span className="text-blue-600">Méritent.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Nous testons et optimisons vos produits pour garantir une
              expérience utilisateur fluide et fiable.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#services"
                className="btn-modern px-8 py-4 bg-primary text-white text-center gradient-primary"
              >
                Nos Services
              </a>
              <a
                href="#contact"
                className="btn-modern px-8 py-4 border-2 border-primary text-primary text-center hover:bg-primary hover:text-white"
              >
                Contactez-nous
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
                alt="Software testing professionals analyzing data"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
              />

              <div className="absolute top-0 right-0 w-full h-full">
                <ThreeDElement />
              </div>

              <div className="absolute -bottom-6 -left-6 modern-card p-6 hidden md:block">
                <div className="flex items-center space-x-3">
                  <div className="bg-success rounded-full p-2">
                    <i className="fas fa-check text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Zéro défaut. Zéro surprise.</p>
                    <p className="text-sm text-gray-500">
                      Testé, validé, déployé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
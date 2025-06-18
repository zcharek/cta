import { useEffect } from "react";
import { m } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalendlyWidget from "@/components/CalendlyWidget";

const RendezVous = () => {
  useEffect(() => {
    document.title = "Prendre un rendez-vous | Central Test Agency";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Prenez rendez-vous pour une consultation gratuite sur vos besoins en tests logiciels et automatisation QA. Réservez votre créneau avec nos experts.'
      );
    }
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
          <div className="container">
            <m.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Prenez rendez-vous
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Réservez votre créneau pour une consultation gratuite avec nos experts en tests logiciels. 
                Nous analyserons vos besoins et vous proposerons des solutions adaptées.
              </p>
            </m.div>

            <m.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Consultation gratuite de 30 minutes
                  </h2>
                  <p className="text-gray-600">
                    Choisissez un créneau qui vous convient. La consultation se fera via Google Meet.
                  </p>
                </div>
                
                <CalendlyWidget 
                  url="https://calendly.com/votre-username/consultation-gratuite"
                  className="w-full"
                  style={{ height: '600px' }}
                />
              </div>
            </m.div>

            <m.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Que se passe-t-il pendant la consultation ?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 text-xl">1</span>
                    </div>
                    <p className="text-gray-700">Analyse de vos besoins et objectifs</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 text-xl">2</span>
                    </div>
                    <p className="text-gray-700">Présentation de nos solutions adaptées</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 text-xl">3</span>
                    </div>
                    <p className="text-gray-700">Devis personnalisé et planning</p>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default RendezVous; 
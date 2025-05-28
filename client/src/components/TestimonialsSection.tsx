import { m } from "framer-motion";

const partners = [
  { name: "istqb", logo: "client/images/istqb.webp" },
  { name: "DataFlow", logo: "/logos/dataflow.png" },
  { name: "Web Solutions", logo: "/logos/web-solutions.png" },
  { name: "CodeCraft", logo: "/logos/codecraft.png" },
  { name: "DevHouse", logo: "/logos/devhouse.png" },
  { name: "AppSphere", logo: "/logos/appsphere.png" },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 gradient-bg text-white">
      <div className="container">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos partenaires
          </h2>
          <p className="text-lg text-secondary-light max-w-2xl mx-auto">
            Voici quelques entreprises avec lesquelles nous avons collaboré.
          </p>
        </m.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <m.div
              key={index}
              className="bg-white/10 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center w-full h-24"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-16 object-contain"
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

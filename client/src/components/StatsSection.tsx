import AnimatedCounter from "./AnimatedCounter";
import { m } from "framer-motion";

const stats = [
  { value: 8, label: "Projets completé", suffix: "+" },
  { value: 95, label: "Client satisfait", suffix: "%" },
  { value: 5, label: "Années d'experience", suffix: "+" },
];

const StatsSection = () => {
  return (
    <section className="py-16 gradient-primary text-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
          {stats.map((stat, index) => (
            <m.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-4xl font-bold mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-secondary-light font-medium">{stat.label}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

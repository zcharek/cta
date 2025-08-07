import AnimatedCounter from "./AnimatedCounter";
import { m } from "framer-motion";

const stats = [
  { value: 8, label: "Projets completé", suffix: "+" },
  { value: 95, label: "Client satisfait", suffix: "%" },
  { value: 5, label: "Années d'experience", suffix: "+" },
];

const StatsSection = () => {
  return (
    <section className="py-4 sm:py-6 md:py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container">
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 md:gap-8 text-center">
          {stats.map((stat, index) => (
            <m.div
              key={index}
              className="flex flex-col items-center min-w-[70px] sm:min-w-[90px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-1.5">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-blue-100 font-medium text-[11px] sm:text-xs md:text-sm leading-tight">
                {stat.label}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

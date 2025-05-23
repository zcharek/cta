import AnimatedCounter from './AnimatedCounter';
import { m } from 'framer-motion';

const stats = [
  { value: 200, label: 'Projects Completed', suffix: '+' },
  { value: 98, label: 'Client Satisfaction', suffix: '%' },
  { value: 15, label: 'Years Experience', suffix: '+' },
  { value: 50, label: 'Expert Testers', suffix: '+' }
];

const StatsSection = () => {
  return (
    <section className="py-16 gradient-bg text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <m.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-4xl font-bold mb-2">
                <AnimatedCounter 
                  target={stat.value} 
                  suffix={stat.suffix} 
                />
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

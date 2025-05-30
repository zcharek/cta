import { motion as m } from 'framer-motion';
import { Code, Smartphone, Globe, Zap, Shield, Users } from 'lucide-react';

const services = [
  {
    icon: Code,
    title: 'Tests Automatisés',
    description: 'Solutions de test automatisé avancées pour accélérer vos cycles de développement.',
    features: ['CI/CD Integration', 'Tests de régression', 'Couverture complète'],
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    icon: Smartphone,
    title: 'Tests Mobiles',
    description: 'Tests complets sur tous les appareils et plateformes mobiles.',
    features: ['iOS & Android', 'Tests de performance', 'UX native'],
    gradient: 'from-green-500 to-blue-500'
  },
  {
    icon: Globe,
    title: 'Tests Web',
    description: 'Tests cross-browser et optimisation des performances web.',
    features: ['Compatibilité navigateur', 'Performance', 'Accessibilité'],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'Tests de Performance',
    description: 'Optimisation et tests de charge pour applications haute performance.',
    features: ['Tests de charge', 'Optimisation', 'Monitoring'],
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Tests de Sécurité',
    description: 'Audits de sécurité et tests de vulnérabilité complets.',
    features: ['Audit sécurité', 'Penetration testing', 'Conformité'],
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: Users,
    title: 'Tests UX',
    description: 'Évaluation approfondie de l\'expérience utilisateur et usabilité.',
    features: ['Tests utilisateur', 'Analyse UX', 'Optimisation'],
    gradient: 'from-indigo-500 to-purple-500'
  }
];

export const ModernServices = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="services">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Nos{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Des solutions de test complètes et innovantes pour transformer votre développement logiciel
          </p>
        </m.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card */}
              <div className="webflow-card p-8 h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-4 mb-6`}>
                    <service.icon className="w-full h-full text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Hover indicator */}
                  <m.div
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-t-2 border-r-2 border-black transform rotate-45" />
                    </div>
                  </m.div>
                </div>
              </div>
            </m.div>
          ))}
        </div>

        {/* CTA Section */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="webflow-card p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Prêt à transformer votre processus de test ?
            </h3>
            <p className="text-gray-400 mb-8 text-lg">
              Discutons de vos besoins et créons ensemble une solution sur mesure
            </p>
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-full transition-all duration-300"
            >
              Démarrer un projet
              <div className="w-5 h-5 border-t-2 border-r-2 border-black transform rotate-45" />
            </m.button>
          </div>
        </m.div>
      </div>
    </section>
  );
};
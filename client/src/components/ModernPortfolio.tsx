import { motion as m } from 'framer-motion';
import { ExternalLink, Calendar, Tag } from 'lucide-react';

const caseStudies = [
  {
    title: 'Cloud Testing Platform',
    description: 'Solution complète de tests automatisés dans le cloud avec intégration DevOps avancée.',
    image: '/images/cloudTest.jpg',
    category: 'Cloud Testing',
    readTime: '5 min',
    tags: ['DevOps', 'Automation', 'Cloud'],
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Introduction Testing Suite',
    description: 'Framework de test innovant pour applications web modernes avec analyse en temps réel.',
    image: '/images/IntroTest.jpg',
    category: 'Web Testing',
    readTime: '4 min',
    tags: ['Web', 'Real-time', 'Analytics'],
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Error Detection System',
    description: 'Système intelligent de détection et prévention d\'erreurs avec machine learning.',
    image: '/images/mostError.jpg',
    category: 'AI Testing',
    readTime: '6 min',
    tags: ['AI', 'Detection', 'Prevention'],
    gradient: 'from-red-500 to-orange-500'
  },
  {
    title: 'Parameter Testing Tool',
    description: 'Outil avancé de test paramétrique pour optimisation des performances applicatives.',
    image: '/images/ParameterTest.jpg',
    category: 'Performance',
    readTime: '3 min',
    tags: ['Performance', 'Optimization', 'Testing'],
    gradient: 'from-green-500 to-teal-500'
  }
];

export const ModernPortfolio = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="portfolio">
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
              Réalisations
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez comment nous transformons les défis en succès avec nos solutions innovantes
          </p>
        </m.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {caseStudies.map((study, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl"
            >
              {/* Card */}
              <div className="webflow-card p-0 h-full relative overflow-hidden">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${study.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur text-white text-sm font-medium rounded-full">
                      {study.category}
                    </span>
                  </div>
                  
                  {/* External link icon */}
                  <m.div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                  </m.div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                    {study.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {study.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Lecture {study.readTime}
                    </div>
                    
                    <m.button
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                    >
                      Voir le projet
                      <div className="w-4 h-4 border-t-2 border-r-2 border-current transform rotate-45" />
                    </m.button>
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </div>

        {/* Stats Section */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="webflow-card p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Projets réalisés', icon: '🚀' },
              { value: '99.9%', label: 'Taux de succès', icon: '🎯' },
              { value: '50+', label: 'Clients satisfaits', icon: '⭐' },
              { value: '24/7', label: 'Support technique', icon: '🛡️' }
            ].map((stat, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">
                  {stat.label}
                </div>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
};
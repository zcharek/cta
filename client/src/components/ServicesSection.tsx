import { m } from 'framer-motion';
import ServiceCard from './ServiceCard';

const services = [
  {
    title: 'Functional Testing',
    description: 'We verify that your software functions as expected, testing every feature and identifying issues before they reach your users.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
    altText: 'Functional testing process'
  },
  {
    title: 'UX Testing',
    description: 'Our comprehensive UX testing methods ensure your interfaces are intuitive, accessible, and aligned with user expectations.',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
    altText: 'UX testing and design workflow'
  },
  {
    title: 'Automated Testing',
    description: 'Our automated testing frameworks accelerate your development cycle while maintaining consistent quality standards.',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
    altText: 'Automated testing process'
  },
  {
    title: 'Performance Testing',
    description: 'We rigorously test your application\'s performance under various conditions to ensure optimal speed and responsiveness.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
    altText: 'Performance testing dashboard'
  },
  {
    title: 'Security Testing',
    description: 'Our comprehensive security testing protects your applications from vulnerabilities and ensures data protection.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
    altText: 'Security testing visualization'
  },
  {
    title: 'API Testing',
    description: 'We ensure all your API connections function properly, with detailed testing of endpoints, payloads, and responses.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
    altText: '3D software architecture visualization'
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container">
        <m.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Testing Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer end-to-end testing solutions tailored to your specific needs, ensuring your software and UX meet the highest quality standards.
          </p>
        </m.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ServiceCard 
                title={service.title}
                description={service.description}
                image={service.image}
                altText={service.altText}
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

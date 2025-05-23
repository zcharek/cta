import { m } from 'framer-motion';
import CaseStudyCard from './CaseStudyCard';

const caseStudies = [
  {
    title: 'Global Retail Platform Optimization',
    description: 'How our comprehensive testing strategy helped a major retailer improve site performance and increase conversions by 35%.',
    image: 'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    altText: 'E-commerce platform case study',
    category: 'E-commerce',
    readTime: '10 min read'
  },
  {
    title: 'Medical Software Compliance Testing',
    description: 'How we helped a healthcare provider ensure their patient management system met strict regulatory requirements.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    altText: 'Healthcare application case study',
    category: 'Healthcare',
    readTime: '8 min read'
  },
  {
    title: 'Banking App Security Testing',
    description: 'How our rigorous security testing helped a financial institution protect customer data and prevent potential breaches.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    altText: 'Banking app testing case study',
    category: 'Finance',
    readTime: '12 min read'
  },
  {
    title: 'Enterprise SaaS UX Optimization',
    description: 'How we helped a leading SaaS provider transform their user experience, resulting in 28% higher user retention.',
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    altText: 'SaaS platform UX testing case study',
    category: 'SaaS',
    readTime: '7 min read'
  }
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container">
        <m.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Case Studies</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore how our testing solutions have helped businesses across industries achieve exceptional digital experiences.
          </p>
        </m.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((caseStudy, index) => (
            <m.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CaseStudyCard 
                title={caseStudy.title}
                description={caseStudy.description}
                image={caseStudy.image}
                altText={caseStudy.altText}
                category={caseStudy.category}
                readTime={caseStudy.readTime}
              />
            </m.div>
          ))}
        </div>
        
        <m.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <m.a 
            href="/case-studies" 
            className="inline-block px-8 py-3 border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              alert('All case studies will be available after deployment.');
            }}
          >
            View All Case Studies
          </m.a>
        </m.div>
      </div>
    </section>
  );
};

export default PortfolioSection;

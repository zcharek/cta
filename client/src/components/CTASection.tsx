import { m } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <m.div 
          className="gradient-bg rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <i className="fas fa-code text-white text-9xl absolute -top-5 -right-5"></i>
          </div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Elevate Your Digital Experience?</h2>
            <p className="text-lg text-secondary-light mb-8">
              Let's discuss how our testing expertise can help you deliver exceptional software that your users will love. Contact us today for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <m.a 
                href="#contact" 
                className="px-8 py-3 bg-white text-primary rounded-md hover:bg-background transition-all duration-200 text-center shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </m.a>
              <m.a 
                href="#" 
                className="px-8 py-3 border-2 border-white text-white rounded-md hover:bg-white/10 transition-all duration-200 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </m.a>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default CTASection;

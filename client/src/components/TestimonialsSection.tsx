import { m } from 'framer-motion';

const testimonials = [
  {
    quote: "TechQA transformed our application through their rigorous testing process. They identified critical issues we had overlooked and provided clear solutions. Our product is now more stable and user-friendly thanks to their expertise.",
    author: "John Doe",
    position: "CTO, Tech Innovations",
    initials: "JD",
    rating: 5
  },
  {
    quote: "Their UX testing completely revolutionized our product. The detailed insights helped us redesign our interface, resulting in a 40% increase in user engagement and significantly reduced bounce rates.",
    author: "Jane Smith",
    position: "Product Manager, DataFlow",
    initials: "JS",
    rating: 5
  },
  {
    quote: "We've worked with TechQA for three consecutive projects. Their consistent quality, attention to detail, and ability to work within tight deadlines make them our go-to testing partner. Highly recommended!",
    author: "Michael Johnson",
    position: "CEO, Web Solutions",
    initials: "MJ",
    rating: 5
  }
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-secondary-light max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about our testing services.
          </p>
        </m.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <m.div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <m.i 
                  className="fas fa-quote-left text-secondary-light text-4xl mr-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
                <div>
                  <div className="mb-1">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <m.i 
                        key={i} 
                        className="fas fa-star text-yellow-400"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.2 + (i * 0.1) }}
                        whileHover={{ scale: 1.2, rotate: 20 }}
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold">Outstanding Service</h3>
                </div>
              </div>
              <p className="mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="mr-4 w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center text-white font-bold">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-secondary-light">{testimonial.position}</p>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

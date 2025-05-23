import { m } from 'framer-motion';

const workflowSteps = [
  {
    number: 1,
    title: 'Requirements Analysis',
    description: 'We begin by thoroughly understanding your project needs, target users, and business goals to develop a tailored testing strategy.',
    icon: 'fa-clipboard-list'
  },
  {
    number: 2,
    title: 'Test Planning',
    description: 'Our team designs a comprehensive test plan outlining scope, approach, resources, schedule, and deliverables.',
    icon: 'fa-tasks'
  },
  {
    number: 3,
    title: 'Test Execution',
    description: 'We meticulously execute the test cases, document results, and identify issues with detailed reproduction steps.',
    icon: 'fa-vial'
  },
  {
    number: 4,
    title: 'Reporting & Recommendations',
    description: 'We provide detailed reports with actionable insights and recommendations to improve your product quality.',
    icon: 'fa-chart-line'
  }
];

const WorkflowSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <m.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Testing Process</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We follow a rigorous methodology to ensure comprehensive testing coverage and exceptional results.
          </p>
        </m.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <m.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://pixabay.com/get/g78cad70e3d8ede1026d091d0ca228a299648d5a692e9388695a1a91dcdf13535ff586198c337c3a506000c7f273798ec7e9707383cb9389722276fe28b54eab4_1280.jpg" 
              alt="UX design workflow visualization" 
              className="rounded-xl shadow-xl w-full h-auto"
            />
          </m.div>
          <div>
            {workflowSteps.map((step, index) => (
              <m.div 
                key={index} 
                className="flex items-start mb-10 last:mb-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <m.div 
                  className="flex-shrink-0 mr-4 bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white relative"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="absolute -top-2 -right-2 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {step.number}
                  </span>
                  <i className={`fas ${step.icon} text-xl`}></i>
                </m.div>
                <m.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </m.div>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;

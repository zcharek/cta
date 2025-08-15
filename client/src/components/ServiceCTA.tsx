import React from 'react';

interface ServiceCTAProps {
  title: string;
  description: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  primaryButton?: {
    text: string;
    href: string;
    icon: string;
    gradientFrom: string;
    gradientTo: string;
    hoverFrom: string;
    hoverTo: string;
  };
  secondaryButton: {
    text: string;
    href: string;
    icon: string;
  };
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  title,
  description,
  gradientFrom,
  gradientVia,
  gradientTo,
  features,
  primaryButton,
  secondaryButton
}) => {
  return (
    <section className="mb-20">
      <div className={`bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} rounded-3xl p-8 md:p-12 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -trangray-y-32 trangray-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full trangray-y-24 -trangray-x-24"></div>
        
        <div className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {title}
          </h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            {description}
          </p>
          
          {features && features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-white">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryButton && (
              <a 
                href={primaryButton.href}
                className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${primaryButton.gradientFrom} ${primaryButton.gradientTo} text-white font-semibold rounded-xl hover:${primaryButton.hoverFrom} hover:${primaryButton.hoverTo} transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-trangray-y-1`}
              >
                <span className="mr-2">{primaryButton.icon}</span>
                {primaryButton.text}
              </a>
            )}
            {secondaryButton.text && (
              <a 
                href={secondaryButton.href}
                className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                <span className="mr-2">{secondaryButton.icon}</span>
                {secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCTA; 
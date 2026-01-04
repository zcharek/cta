import React from 'react';
import PatternBackground from './PatternBackground';

interface ServiceHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  titleGradientFrom: string;
  titleGradientTo: string;
  descriptionColor: string;
  primaryButton?: {
    text: string;
    href: string;
    icon: string;
    bgColor: string;
    hoverColor: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
    icon: string;
  };
  rightContent?: React.ReactNode;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({
  badge,
  title,
  subtitle,
  description,
  gradientFrom,
  gradientVia,
  gradientTo,
  titleGradientFrom,
  titleGradientTo,
  descriptionColor,
  primaryButton,
  secondaryButton,
  rightContent
}) => {
  return (
    <PatternBackground 
      variant="dark" 
      opacity={0.15}
      className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} rounded-3xl p-8 md:p-12 mb-16`}
    >
    <div className="relative z-10">
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className={`relative z-10 flex flex-col ${rightContent ? 'lg:flex-row' : ''} items-center gap-8`}>
        <div className={`${rightContent ? 'flex-1' : 'w-full'} text-center ${rightContent ? 'lg:text-left' : ''}`}>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-white text-sm font-medium">{badge}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
            <span className={`block bg-gradient-to-r ${titleGradientFrom} ${titleGradientTo} bg-clip-text text-transparent`}>
              {subtitle}
            </span>
          </h1>
          
          <p className={`text-xl ${descriptionColor} mb-8 ${rightContent ? '' : 'max-w-3xl mx-auto'} leading-relaxed`}>
            <span dangerouslySetInnerHTML={{ __html: description }} />
          </p>
          
          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryButton && (
                <a 
                  href={primaryButton.href}
                  className={`inline-flex items-center px-8 py-4 ${primaryButton.bgColor} text-white font-semibold rounded-xl ${primaryButton.hoverColor} transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                >
                  <span className="mr-2">{primaryButton.icon}</span>
                  {primaryButton.text}
                </a>
              )}
              {secondaryButton && (
                <a 
                  href={secondaryButton.href}
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
                >
                  <span className="mr-2">{secondaryButton.icon}</span>
                  {secondaryButton.text}
                </a>
              )}
            </div>
          )}
        </div>
        
        {rightContent && (
          <div className="flex-1 max-w-md">
            {rightContent}
          </div>
        )}
      </div>
    </div>
    </PatternBackground>
  );
};

export default ServiceHero; 
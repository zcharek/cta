import { useEffect } from 'react';

interface CalendlyWidgetProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

const CalendlyWidget = ({ url, className = "", style = {} }: CalendlyWidgetProps) => {
  useEffect(() => {
    // Charger le script Calendly
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Nettoyer le script lors du démontage
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div 
      className={`calendly-inline-widget h-[500px] md:h-[600px] ${className}`}
      data-url={url}
      style={{ 
        minWidth: '280px',
        ...style 
      }}
    />
  );
};

export default CalendlyWidget; 
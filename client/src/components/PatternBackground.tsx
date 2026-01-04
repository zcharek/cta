import React from 'react';

interface PatternBackgroundProps {
  className?: string;
  opacity?: number;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
  variant?: 'light' | 'dark';
  imageSrc?: string;
  children?: React.ReactNode;
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({
  className = '',
  opacity = 0.15,
  blendMode = 'multiply',
  variant = 'light',
  imageSrc,
  children
}) => {
  // Déterminer quelle image utiliser
  const getPatternImage = () => {
    if (imageSrc) {
      return `url(${imageSrc})`;
    }
    // Utiliser les images selon le variant
    const patternPath = variant === 'dark' 
      ? '/images/pattern-dark.svg'
      : '/images/pattern-light.svg';
    return `url(${patternPath})`;
  };

  const backgroundImage = getPatternImage();

  return (
    <div className={`relative ${className}`}>
      {/* Pattern background */}
      <div
        className="absolute inset-0 bg-repeat bg-center"
        style={{
          backgroundImage: backgroundImage,
          backgroundSize: 'auto',
          opacity: opacity,
          mixBlendMode: blendMode,
          pointerEvents: 'none'
        }}
      />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PatternBackground;


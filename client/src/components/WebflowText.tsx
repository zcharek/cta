import { m } from "framer-motion";
import { ReactNode } from "react";

interface WebflowHeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  gradient?: boolean;
}

export const WebflowHeading = ({ 
  children, 
  level = 2, 
  size = 'xl', 
  className = "",
  gradient = false 
}: WebflowHeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const sizes = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-3xl md:text-4xl lg:text-5xl',
    '2xl': 'text-4xl md:text-5xl lg:text-6xl',
    '3xl': 'text-5xl md:text-6xl lg:text-7xl'
  };

  const baseClasses = `font-bold leading-tight ${sizes[size]}`;
  const textClasses = gradient 
    ? `${baseClasses} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`
    : `${baseClasses} text-foreground`;

  return (
    <Tag className={`${textClasses} ${className}`}>
      {children}
    </Tag>
  );
};

interface WebflowTextProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  muted?: boolean;
}

export const WebflowText = ({ 
  children, 
  size = 'md', 
  className = "",
  muted = false 
}: WebflowTextProps) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl'
  };

  const colorClasses = muted ? 'text-gray-600' : 'text-foreground';

  return (
    <p className={`${sizes[size]} ${colorClasses} leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

interface WebflowAnimatedTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const WebflowAnimatedText = ({ 
  children, 
  delay = 0, 
  className = "" 
}: WebflowAnimatedTextProps) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </m.div>
  );
};
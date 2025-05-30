import { m } from "framer-motion";
import { ReactNode } from "react";

interface WebflowGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WebflowGrid = ({ 
  children, 
  cols = 2, 
  gap = 'lg', 
  className = "" 
}: WebflowGridProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapSize = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={`grid ${gridCols[cols]} ${gapSize[gap]} ${className}`}>
      {children}
    </div>
  );
};

interface WebflowCardWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const WebflowCardWrapper = ({ 
  children, 
  delay = 0, 
  className = "" 
}: WebflowCardWrapperProps) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </m.div>
  );
};
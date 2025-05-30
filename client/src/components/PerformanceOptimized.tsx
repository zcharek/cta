import { memo, useMemo, useCallback } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage = memo(({ src, alt, className = "", priority = false }: OptimizedImageProps) => {
  const imageProps = useMemo(() => ({
    src,
    alt,
    className: `${className} gpu-accelerated`,
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const,
  }), [src, alt, className, priority]);

  return <img {...imageProps} />;
});

OptimizedImage.displayName = 'OptimizedImage';

interface LazyMotionWrapperProps {
  children: React.ReactNode;
  initial?: any;
  animate?: any;
  transition?: any;
  className?: string;
}

export const LazyMotionWrapper = memo(({ 
  children, 
  initial = { opacity: 0, y: 30 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.6 },
  className = ""
}: LazyMotionWrapperProps) => {
  const motionProps = useMemo(() => ({
    initial,
    whileInView: animate,
    viewport: { once: true, margin: "-10%" },
    transition,
    className: `${className} gpu-accelerated`
  }), [initial, animate, transition, className]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div {...motionProps}>
        {children}
      </m.div>
    </LazyMotion>
  );
});

LazyMotionWrapper.displayName = 'LazyMotionWrapper';

export const useOptimizedCallback = (
  callback: (...args: any[]) => any,
  deps: React.DependencyList
) => {
  return useCallback(callback, deps);
};

export const useMemoizedValue = (
  factory: () => any,
  deps: React.DependencyList
) => {
  return useMemo(factory, deps);
};
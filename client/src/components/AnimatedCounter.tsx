import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ target, suffix = '', duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          startCounter();
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasAnimated]);

  const startCounter = () => {
    const startTime = Date.now();
    const step = target / (duration / 16); // 16ms is approx 1 frame at 60fps
    
    const updateCounter = () => {
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < duration) {
        countRef.current = Math.min(countRef.current + step, target);
        setCount(Math.floor(countRef.current));
        requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  return <span ref={elementRef}>{count}{suffix}</span>;
};

export default AnimatedCounter;

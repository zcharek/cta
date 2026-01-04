import { useEffect, useRef } from "react";

interface Options {
  speed?: number;
  pauseOnHover?: boolean;
}

export function useInfiniteHorizontalScroll(
  containerRef: React.RefObject<HTMLDivElement>,
  { speed = 0.5, pauseOnHover = true }: Options = {}
) {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const scrollPositionRef = useRef(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!pauseOnHover || !isHoveredRef.current) {
        scrollPositionRef.current += (speed * deltaTime) / 16;

        const totalWidth = container.scrollWidth;
        const oneThird = totalWidth / 3;

        if (scrollPositionRef.current >= oneThird) {
          scrollPositionRef.current -= oneThird;
        }

        container.scrollLeft = scrollPositionRef.current;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [speed, pauseOnHover]);

  return {
    onMouseEnter: () => {
      isHoveredRef.current = true;
    },
    onMouseLeave: () => {
      isHoveredRef.current = false;
    },
  };
}


import { m } from "framer-motion";
import { RefObject, useEffect, useState } from "react";

interface Props {
  targetIndex: number;
  containerRef: RefObject<HTMLDivElement>;
}

export const MouseCursor = ({ targetIndex, containerRef }: Props) => {
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(10);

  useEffect(() => {
    if (!containerRef.current) return;

    const tab = containerRef.current.children[targetIndex] as HTMLElement;
    if (!tab) return;

    const rect = tab.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setTargetX(rect.left - containerRect.left + rect.width / 2);
    setTargetY(10);
  }, [targetIndex, containerRef]);

  return (
    <m.div
      className="absolute top-0 left-0 z-50 pointer-events-none"
      animate={{
        x: targetX,
        y: targetY,
        transition: {
          type: "spring",
          stiffness: 120,
          damping: 15,
        },
      }}
    >
      {/* Curseur */}
      <m.div
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3 }}
      >
        👆🏻
      </m.div>

      {/* Effet clic */}
      <m.span
        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-red-600"
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: [0, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3 }}
      />
    </m.div>
  );
};


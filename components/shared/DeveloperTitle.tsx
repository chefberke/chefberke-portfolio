"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type DeveloperTitleProps = {
  titles: string[];
};

export default function DeveloperTitle({ titles }: DeveloperTitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!titles.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div className="text-current h-5 font-mono">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            scale: 0.7, 
            filter: "blur(20px)",
            y: 20 
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            filter: "blur(0px)",
            y: 0 
          }}
          exit={{ 
            opacity: 0, 
            scale: 1.3, 
            filter: "blur(25px)",
            y: -20 
          }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {titles[currentIndex] ?? ""}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

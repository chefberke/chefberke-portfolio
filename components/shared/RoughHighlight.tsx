"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

type RoughHighlightProps = {
  children: string;
};

export default function RoughHighlight({ children }: RoughHighlightProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const annotation = annotate(ref.current, {
      type: "box",
      color: "#d4d4d4",
      strokeWidth: 1.2,
      padding: [1, 4, 1, 4],
      animationDuration: 350,
    });
    annotation.show();
    return () => annotation.hide();
  }, [children]);

  return <span ref={ref}>{children}</span>;
}

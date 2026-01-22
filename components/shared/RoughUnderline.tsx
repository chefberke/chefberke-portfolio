"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

type RoughUnderlineProps = {
  children: string;
};

export default function RoughUnderline({ children }: RoughUnderlineProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(max-width: 639px)").matches) return;
    const annotation = annotate(ref.current, {
      type: "underline",
      color: "#a3a3a3",
      strokeWidth: 2,
      padding: [2, 2, 0, 2],
      animationDuration: 400,
    });
    annotation.show();
    return () => annotation.hide();
  }, [children]);

  return (
    <span
      ref={ref}
      className="max-[639px]:underline max-[639px]:decoration-neutral-400 max-[639px]:decoration-2 max-[639px]:underline-offset-4"
    >
      {children}
    </span>
  );
}

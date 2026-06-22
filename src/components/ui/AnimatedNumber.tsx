"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

interface Props {
  value: number;
  decimals?: number;
  duration?: number;
}

export default function AnimatedNumber({ value, decimals = 0, duration = 0.9 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, duration]);

  return <span ref={ref}>{(0).toFixed(decimals)}</span>;
}

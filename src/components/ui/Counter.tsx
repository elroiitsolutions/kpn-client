'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface CounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
}

export default function Counter({
  value,
  decimals = 0,
  suffix = '',
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 35, stiffness: 90 });
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest.toFixed(decimals)}${suffix}`;
      }
    });
  }, [springValue, decimals, suffix]);

  return <span ref={ref}>0{decimals > 0 ? '.0' : ''}{suffix}</span>;
}
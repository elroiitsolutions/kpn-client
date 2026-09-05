'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ImageRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  scaleFrom?: number;
  className?: string;
}

export default function ImageReveal({
  children,
  delay = 0.1,
  duration = 0.8,
  scaleFrom = 1.08,
  className = '',
}: ImageRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.div
        initial={{
          opacity: 0,
          scale: shouldReduceMotion ? 1 : scaleFrom,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : duration,
          delay,
          ease: [0.25, 1, 0.5, 1],
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

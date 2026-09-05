'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testimonialsData } from '@/data/siteData';
import { getTestimonials, TestimonialItem } from '@/lib/cmsClient';
import RunningPillBadge from '../ui/RunningPillBadge';
import FadeIn from '../animation/FadeIn';

export default function AwardsSection() {
  const [items, setItems] = useState<TestimonialItem[]>(testimonialsData);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const fetched = await getTestimonials();
        if (fetched && fetched.length > 0) {
          setItems(fetched);
        }
      } catch (err) {
        console.warn('Failed to load testimonials, using fallback');
      }
    }
    loadTestimonials();
  }, []);

  const duplicatedData = [...items, ...items];

  return (
    <section className="py-20 lg:py-28 bg-[#f8fafc]/70 relative overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <FadeIn direction="up" className="text-center mb-16 space-y-4 flex flex-col items-center">
          <RunningPillBadge text="AWARDS & RECOGNITIONS" />
          <h2 className="text-4xl font-extrabold text-[#29247c] sm:text-5xl lg:text-6xl tracking-tight">
            What our clients say
          </h2>
        </FadeIn>

        {/* Continuous Smooth Infinite Marquee */}
        <FadeIn direction="up" delay={0.15}>
          <div className="w-full overflow-hidden py-6">
            <motion.div
              className="flex w-max gap-7 sm:gap-8 px-4"
              animate={{
                x: ['0%', '-50%'],
              }}
              transition={{
                duration: 35,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              {duplicatedData.map((item, index) => (
                <div
                  key={`${item.author}-${index}`}
                  className="shrink-0 w-[300px] sm:w-[350px] lg:w-[370px] flex flex-col group cursor-pointer"
                >
                  {/* Card Box matching reference design */}
                  <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-slate-100/60 h-[340px] sm:h-[370px] relative flex flex-col items-center text-center justify-between pb-12 hover:shadow-xl transition-all duration-300">
                    <div className="space-y-4 max-w-[300px]">
                      <h4 className="text-2xl sm:text-[26px] font-black text-[#29247c] leading-tight tracking-tight">
                        “{item.title}”
                      </h4>
                      <p className="text-sm sm:text-[15px] text-slate-500/90 leading-relaxed font-medium">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    {/* Arch Curve cutout container for avatar on bottom edge */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="h-10 w-24 bg-[#f4ebd0]/40 rounded-t-full flex items-center justify-center pt-2">
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-white transition-transform duration-300 group-hover:scale-105">
                          <img
                            src={item.avatar}
                            alt={item.author}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Details below Card */}
                  <div className="mt-10 text-center space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#f12131]">
                      {item.author}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

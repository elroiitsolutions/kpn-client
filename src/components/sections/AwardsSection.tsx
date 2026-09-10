'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
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

  // Ensure enough cards for a continuous, seamless, gapless running loop on all screen sizes
  const repeatFactor = Math.max(3, Math.ceil(8 / (items.length || 1)));
  const baseList = Array(repeatFactor).fill(items).flat();
  const duplicatedData = [...baseList, ...baseList];

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

        {/* Continuous Smooth Running Marquee with Stars & Hover Pause */}
        <FadeIn direction="up" delay={0.15}>
          <div className="w-full overflow-hidden py-6">
            <div
              className="flex w-max gap-7 sm:gap-8 px-4 animate-marquee hover:[animation-play-state:paused]"
              style={{
                animationDuration: `${Math.max(28, baseList.length * 4)}s`,
              }}
            >
              {duplicatedData.map((item, index) => (
                <div
                  key={`${item.author}-${index}`}
                  className="shrink-0 w-[300px] sm:w-[350px] lg:w-[370px] flex flex-col group cursor-pointer"
                >
                  {/* Card Box matching reference design with Golden Stars */}
                  <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-slate-100/60 min-h-[350px] sm:min-h-[380px] relative flex flex-col items-center text-center justify-between pb-12 hover:shadow-xl hover:border-amber-100/80 transition-all duration-300">
                    <div className="space-y-3.5 max-w-[300px] flex flex-col items-center">
                      {/* ⭐ Dynamic Golden Star Rating */}
                      <div className="flex items-center justify-center gap-1.5 text-amber-400 pt-1">
                        {[...Array(Number(item.rating) || 5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 sm:h-4.5 sm:w-4.5 fill-amber-400 text-amber-400 drop-shadow-xs transition-transform duration-200 group-hover:scale-110"
                          />
                        ))}
                      </div>

                      <h4 className="text-2xl sm:text-[26px] font-black text-[#29247c] leading-tight tracking-tight">
                        “{item.title}”
                      </h4>
                      <p className="text-sm sm:text-[15px] text-slate-500/90 leading-relaxed font-medium line-clamp-4">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    {/* Arch Curve cutout container for avatar on bottom edge */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="h-10 w-24 bg-[#f4ebd0]/40 rounded-t-full flex items-center justify-center pt-2">
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-white transition-transform duration-300 group-hover:scale-105">
                          <img
                            src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                            alt={item.author}
                            className="h-full w-full object-cover"
                            onError={(e: any) => {
                              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
                            }}
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
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

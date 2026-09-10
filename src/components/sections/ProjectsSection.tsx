'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { projectsData } from '@/data/siteData';
import { getHomepageCMS } from '@/lib/cmsClient';
import RunningPillBadge from '../ui/RunningPillBadge';

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>(projectsData.slice(0, 4));

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        const cms = await getHomepageCMS();
        if (isMounted && cms?.featuredProjectIds && cms.featuredProjectIds.length > 0) {
          const list = cms.featuredProjectIds
            .filter(Boolean)
            .map((p: any) => ({
              id: p._id || p.id || p.slug,
              name: p.name,
              slug: p.slug,
              location: p.location,
              bhk: p.bhk,
              type: p.propertyType || p.type || 'Apartments',
              status: p.status || 'Ongoing',
              budget: p.budget,
              image: p.image || '/images/projects/project_1.jpg',
              address: p.address,
            }));
          if (list.length > 0) {
            setFeaturedProjects(list);
          }
        }
      } catch (err) {
        console.warn('Using fallback featured projects');
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pinned Scroll: tracks the runway progress [0, 1] across desktop & mobile
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Phase transitions for 4 projects
  const y1 = useTransform(
    scrollYProgress,
    [0, 0.08, 0.333, 1],
    ['0%', '0%', '-100%', '-100%']
  );

  const y2 = useTransform(
    scrollYProgress,
    [0, 0.333, 0.413, 0.666, 1],
    ['0%', '0%', '0%', '-100%', '-100%']
  );

  const y3 = useTransform(
    scrollYProgress,
    [0, 0.666, 0.746, 1],
    ['0%', '0%', '0%', '-100%']
  );

  const yTransforms = [y1, y2, y3, null];
  const zIndices = [40, 30, 20, 10];

  return (
    <div
      ref={containerRef}
      id="projects"
      className="relative w-full bg-black"
      style={{ height: '350vh' }}
    >
      {/* Sticky Screen Viewport (100vh) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {featuredProjects.map((project, index) => {
          const y = yTransforms[index];
          const zIndex = zIndices[index];

          return (
            <motion.div
              key={project.id}
              style={y ? { y, zIndex } : { zIndex }}
              className="absolute inset-0 h-full w-full bg-black overflow-hidden shadow-2xl border-t border-neutral-900/60"
            >
              <div className="flex flex-col lg:grid lg:grid-cols-12 h-full w-full">
                
                {/* IMAGE COLUMN (Top on Mobile / Right on Desktop) */}
                <div className="order-1 lg:order-2 lg:col-span-6 h-[52vh] lg:h-full w-full relative bg-neutral-950 overflow-hidden shrink-0">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Gradient overlay for smooth transition */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

                  {/* Floating BHK Badge */}
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs font-bold text-white shadow-xl">
                    {project.bhk}
                  </div>
                </div>

                {/* DETAILS COLUMN (Bottom on Mobile / Left on Desktop) */}
                <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col justify-between p-5 sm:p-8 xl:p-16 2xl:p-20 bg-black border-t lg:border-t-0 lg:border-r border-neutral-900/80 z-20 h-[48vh] lg:h-full">
                  
                  {/* Header Top */}
                  <div className="space-y-1.5 sm:space-y-3 pt-0 lg:pt-2">
                    <RunningPillBadge text="SELECTED PROJECTS" variant="dark" />

                    <h2 className="text-xl sm:text-3xl xl:text-5xl 2xl:text-[56px] font-black text-white leading-snug lg:leading-[1.05] tracking-tight">
                      Innovative designs,
                      <br className="hidden sm:inline" />
                      {' '}lasting impressions
                    </h2>
                  </div>

                  {/* Project Details Bottom */}
                  <div className="space-y-3 sm:space-y-5 pb-1 lg:pb-4">
                    {/* Location & BHK Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#f12131] font-semibold text-xs sm:text-base">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#f12131]" />
                        <span>{project.location}</span>
                      </div>

                      <span className="rounded-full border border-white/20 bg-white/5 px-3 py-0.5 text-[10px] sm:text-xs font-bold text-white/90 lg:hidden">
                        {project.bhk}
                      </span>
                    </div>

                    <hr className="border-t border-neutral-800" />

                    {/* Outlined Number & Project Name */}
                    <div className="flex items-center justify-between gap-3 sm:gap-6">
                      <div className="flex items-end gap-3 sm:gap-6">
                        <span
                          className="text-4xl sm:text-6xl xl:text-8xl 2xl:text-[96px] font-black leading-none select-none tracking-tighter"
                          style={{
                            WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.4)',
                            color: 'transparent',
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <div className="space-y-1 pb-0.5">
                          <h3 className="text-base sm:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-white leading-tight">
                            {project.name}
                          </h3>

                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs xl:text-sm font-bold text-[#f12131] uppercase tracking-wider hover:text-white transition-colors group"
                          >
                            <span>VIEW DETAILS</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="lg:hidden shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
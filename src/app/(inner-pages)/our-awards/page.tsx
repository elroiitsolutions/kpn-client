'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { awardsData, AwardItem } from '@/data/siteData';
import { getAwards } from '@/lib/cmsClient';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';
import StaggerContainer from '@/components/animation/StaggerContainer';
import StaggerItem from '@/components/animation/StaggerItem';

export default function OurAwardsPage() {
  const [awards, setAwards] = useState<AwardItem[]>(awardsData);

  useEffect(() => {
    async function loadAwards() {
      try {
        const fetched = await getAwards();
        if (fetched && fetched.length > 0) {
          setAwards(fetched);
        }
      } catch (err) {
        console.warn('Failed to fetch awards, using fallback');
      }
    }
    loadAwards();
  }, []);
  return (
    <>
      <Navbar variant="hero" />

      <InnerPageHero
        title="Our Awards"
        breadcrumb="Our Awards"
        description="A showcase of the milestones, honors, and achievements that define our journey of excellence."
        image="/images/projects/project_4.jpg"
      />

      {/* =========================================================
          AWARDS SECTION
      ========================================================== */}
      <section className="bg-white px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1450px]">

          {/* =====================================================
              SECTION INTRO
          ====================================================== */}
          <FadeIn direction="up" className="mx-auto max-w-[850px] text-center">

            {/* Small label */}
            <RunningPillBadge text="AWARDS & RECOGNITIONS" />

            {/* Main heading */}
            <h1
              className="
                mt-10
                text-5xl
                font-extrabold
                leading-[0.95]
                tracking-[-0.05em]
                text-[#29247c]
                sm:text-6xl
                lg:text-[76px]
              "
            >
              Recognitions
              <br />
              we got
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto
                mt-10
                max-w-[760px]
                text-lg
                font-semibold
                leading-relaxed
                text-slate-700
                sm:text-xl
              "
            >
              We are a developer invested in our customers’ success and
              improving the communities we serve.
            </p>

          </FadeIn>


          {/* =====================================================
              AWARDS GRID
          ====================================================== */}
          <StaggerContainer staggerDelay={0.08} className="awards-grid mt-20 lg:mt-24">

            {(awards || []).map((award) => (
              <StaggerItem key={award.id}>
              <article
                className="
                  awards-item
                  group
                  flex
                  min-h-[330px]
                  flex-col
                  items-center
                  justify-center
                  px-6
                  py-12
                  text-center
                  transition-all
                  duration-300
                  sm:min-h-[350px]
                  sm:px-10
                  lg:min-h-[340px]
                "
              >

                {/* =================================================
                    AWARD IMAGE
                ================================================== */}
                <div
                  className="
                    flex
                    h-[125px]
                    w-full
                    items-center
                    justify-center
                  "
                >
                  <img
                    src={award.image}
                    alt={award.title}
                    className="
                      max-h-[115px]
                      max-w-[150px]
                      object-contain
                      opacity-40
                      grayscale
                      transition-all
                      duration-500
                      group-hover:scale-105
                      group-hover:opacity-100
                      group-hover:grayscale-0
                    "
                  />
                </div>


                {/* =================================================
                    YEAR
                ================================================== */}
                <p
                  className="
                    mt-4
                    text-base
                    font-semibold
                    text-slate-500
                  "
                >
                  {award.year}
                </p>


                {/* =================================================
                    TITLE
                ================================================== */}
                <h2
                  className="
                    mt-3
                    max-w-[360px]
                    text-2xl
                    font-extrabold
                    leading-[1.15]
                    tracking-[-0.02em]
                    text-[#29247c]
                    transition-colors
                    duration-300
                    group-hover:text-[#f12131]
                    sm:text-[28px]
                  "
                >
                  {award.title}
                </h2>


                {/* =================================================
                    ORGANIZATION
                ================================================== */}
                <p
                  className="
                    mt-3
                    max-w-[390px]
                    text-base
                    leading-relaxed
                    text-slate-500
                    sm:text-lg
                  "
                >
                  {award.organization}
                </p>

              </article>
              </StaggerItem>
            ))}

          </StaggerContainer>

        </div>
      </section>


      {/* =========================================================
          TESTIMONIALS
      ========================================================== */}
      <TestimonialsSection />
    </>
  );
}
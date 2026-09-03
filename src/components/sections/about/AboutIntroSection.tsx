'use client';

import Image from 'next/image';
import Link from 'next/link';
import Counter from '@/components/ui/Counter';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';
import StaggerContainer from '@/components/animation/StaggerContainer';
import StaggerItem from '@/components/animation/StaggerItem';

export default function AboutIntroSection() {
  return (
    <section className="bg-white px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">

        {/* Top content */}
        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left */}
          <StaggerItem>
            <RunningPillBadge text="ABOUT US" />
            <h2
              className="
                mt-7
                max-w-[600px]
                text-5xl
                font-black
                leading-[0.95]
                tracking-[-0.04em]
                text-[#342987]
                sm:text-6xl
                lg:text-[68px]
              "
            >
              Shaping the
              <br />
              world of things
              <br />
              to come
            </h2>
          </StaggerItem>

          {/* Right */}
          <StaggerItem className="pt-2 lg:pt-10">

            <h3
              className="
                max-w-[620px]
                text-xl
                font-bold
                leading-[1.35]
                text-[#342987]
                lg:text-2xl
              "
            >
              We’d love to share more with you, please complete this form
              and our dedicated team will get back to you shortly.
            </h3>

            <p
              className="
                mt-6
                max-w-[650px]
                text-base
                leading-[1.6]
                text-gray-600
              "
            >
              In markets from renewable energy, sports and entertainment,
              to data centers and healthcare, we work to ensure the built
              environment leaves a lasting positive impact. Together, we
              strive to make your project better than you imagined possible.
            </p>

            <Link
              href="/contact-us"
              className="
                mt-8
                inline-flex
                items-center
                gap-5
                rounded-full
                border
                border-gray-200
                py-1
                pl-6
                pr-1
                text-sm
                font-bold
                text-black
                transition-all
                hover:border-[#f12131]
              "
            >
              Meet The Team

              <span
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f12131]
                  text-white
                "
              >
                →
              </span>
            </Link>

          </StaggerItem>

        </StaggerContainer>


        {/* =========================
            IMAGE + STAT CARDS
        ========================== */}
        <FadeIn direction="up" delay={0.2} className="relative mt-16 lg:mt-20">

          <div
            className="
              relative
              mx-auto
              h-[520px]
              w-full
              overflow-hidden
              rounded-[32px]
              bg-gray-100
              lg:h-[560px]
            "
          >

            <Image
              src="/images/about/h2_img1.jpg"
              alt="KPN Promoters team"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 1400px"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/5" />

          </div>


          {/* =========================
              STAT CARDS
          ========================== */}

          <div
            className="
              absolute
              bottom-6
              right-6
              grid
              w-[340px]
              grid-cols-2
              gap-3
              lg:bottom-8
              lg:right-8
              lg:w-[520px]
              lg:gap-4
            "
          >

            {/* 40+ */}
            <div
              className="
                col-span-2
                rounded-[24px]
                bg-white
                p-7
                shadow-xl
                lg:p-9
              "
            >
              <div className="flex items-start justify-between">

                <div>
                  <div
                    className="
                      text-6xl
                      font-black
                      leading-none
                      tracking-tight
                      text-[#342987]
                    "
                  >
                    <Counter value={40} /><span className="text-[#f12131]">+</span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    projects in development
                  </p>
                </div>

                <span className="text-3xl">▥</span>

              </div>
            </div>


            {/* 18m+ */}
            <div
              className="
                rounded-[24px]
                bg-white
                p-7
                shadow-xl
                lg:p-8
              "
            >
              <div
                className="
                  text-5xl
                  font-black
                  leading-none
                  text-[#342987]
                "
              >
                <Counter value={18} suffix="m" /><span className="text-[#f12131]">+</span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                square feet of property
              </p>
            </div>


            {/* 2.5b+ */}
            <div
              className="
                rounded-[24px]
                bg-white
                p-7
                shadow-xl
                lg:p-8
              "
            >
              <div
                className="
                  text-5xl
                  font-black
                  leading-none
                  text-[#342987]
                "
              >
                <Counter value={2.5} decimals={1} suffix="b" /><span className="text-[#f12131]">+</span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                total projects cost
              </p>
            </div>

          </div>

        </FadeIn>

      </div>
    </section>
  );
}
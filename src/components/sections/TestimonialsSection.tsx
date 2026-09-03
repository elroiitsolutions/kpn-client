'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { testimonialsData } from '@/data/siteData';

const partnerLogos = [
  {
    name: 'ARCHITECT',
    type: 'triangle',
  },
  {
    name: 'HOME BUILD',
    type: 'home',
  },
  {
    name: 'HOME & GARDEN',
    type: 'garden',
  },
  {
    name: 'ARCHITECTURE',
    type: 'architecture',
  },
  {
    name: 'BRICK',
    type: 'brick',
  },
  {
    name: 'CONSTRUCTION',
    type: 'construction',
  },
];

function PartnerLogo({
  logo,
}: {
  logo: {
    name: string;
    type: string;
  };
}) {
  return (
    <div className="flex h-20 w-[180px] shrink-0 items-center justify-center">
      <div className="flex flex-col items-center justify-center text-black">
        {/* Simple logo mark */}
        {logo.type === 'triangle' && (
          <svg
            viewBox="0 0 70 45"
            className="mb-1 h-10 w-16"
            fill="currentColor"
          >
            <path d="M35 3L63 40H7L35 3Z" />
            <path
              d="M35 12L52 40H43L35 25L27 40H18L35 12Z"
              fill="white"
            />
          </svg>
        )}

        {logo.type === 'home' && (
          <svg
            viewBox="0 0 70 45"
            className="mb-1 h-10 w-16"
            fill="currentColor"
          >
            <path d="M35 3L60 18V40H10V18L35 3Z" />
            <path
              d="M35 13L48 21V34H22V21L35 13Z"
              fill="white"
            />
          </svg>
        )}

        {logo.type === 'garden' && (
          <svg
            viewBox="0 0 70 45"
            className="mb-1 h-10 w-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M12 8V38" />
            <path d="M12 8H35V38" />
            <path d="M35 14H58V38" />
            <path d="M25 18H47" />
          </svg>
        )}

        {logo.type === 'architecture' && (
          <svg
            viewBox="0 0 70 45"
            className="mb-1 h-10 w-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 40L8 10L34 4L34 40" />
            <path d="M34 15L62 10V40" />
            <path d="M8 27L34 20L62 25" />
          </svg>
        )}

        {logo.type === 'brick' && (
          <svg
            viewBox="0 0 70 45"
            className="mb-1 h-10 w-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path d="M8 35L35 7L62 35" />
            <path d="M17 27H53" />
            <path d="M24 20H46" />
          </svg>
        )}

        {logo.type === 'construction' && (
          <svg
            viewBox="0 0 70 45"
            className="mb-1 h-10 w-16"
            fill="currentColor"
          >
            <path d="M18 5H40V40H32V13H18V40H10V5H18Z" />
            <path d="M40 5L60 25V40H52V28L40 17V5Z" />
          </svg>
        )}

        <span className="whitespace-nowrap text-[11px] font-black tracking-tight">
          {logo.name}
        </span>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = testimonialsData.length;

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  // Automatic testimonial rotation
  useEffect(() => {
    const interval = window.setInterval(() => {
      next();
    }, 6000);

    return () => window.clearInterval(interval);
  }, [total]);

  const testimonial = testimonialsData[current];

  const duplicatedLogos = useMemo(
    () => [...partnerLogos, ...partnerLogos],
    []
  );

  return (
    <section className="relative z-20 w-full overflow-hidden bg-white">
      {/* =========================================================
          TESTIMONIAL AREA
      ========================================================= */}

      <div className="relative overflow-hidden bg-white">

        {/* Large light-gray curved background */}
        <div
          className="
            absolute
            left-0
            right-0
            top-[95px]
            h-[620px]
            rounded-t-[90px]
            bg-slate-50/70
          "
        />

        {/* Center white curve / badge area */}
        <div
          className="
            absolute
            left-1/2
            top-[95px]
            z-10
            h-[125px]
            w-[260px]
            -translate-x-1/2
            rounded-b-full
            bg-white
          "
        />

        {/* =====================================================
            ROTATING BADGE
        ===================================================== */}

        <div className="relative z-30 mx-auto flex h-[230px] w-[230px] items-center justify-center">

          {/* Rotating text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg
              viewBox="0 0 230 230"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <path
                  id="testimonialCirclePath"
                  d="M 115, 39 a 76,76 0 1,1 0,152 a 76,76 0 1,1 0,-152"
                />
              </defs>

              <text
                className="
                  fill-black
                  text-[9.5px]
                  font-black
                  uppercase
                  tracking-[0.115em]
                "
              >
                <textPath href="#testimonialCirclePath" startOffset="0%">
                  WHAT PEOPLE SAYS • WHAT PEOPLE SAYS • WHAT PEOPLE SAYS • WHAT PEOPLE SAYS •
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Center image with white border & quotation overlay */}
          <div
            className="
              relative
              z-20
              h-[132px]
              w-[132px]
              overflow-hidden
              rounded-full
              border-[4px]
              border-white
              bg-slate-900
              shadow-xl
            "
          >
            <img
              src="/images/roundimg.jpg"
              alt="Building"
              className="h-full w-full object-cover"
            />

            {/* Quote Icon Overlay matching reference design */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <svg
                viewBox="0 0 100 100"
                className="h-14 w-14 fill-white drop-shadow-md"
              >
                <path d="M 38,35 C 30,35 22,42 22,54 C 22,66 30,72 40,72 C 48,72 55,66 55,57 C 55,48 48,42 40,42 C 38,42 36,43 35,44 C 36,39 42,37 47,36 L 44,28 C 39,29 38,35 38,35 Z M 73,35 C 65,35 57,42 57,54 C 57,66 65,72 75,72 C 83,72 90,66 90,57 C 90,48 83,42 75,42 C 73,42 71,43 70,44 C 71,39 77,37 82,36 L 79,28 C 74,29 73,35 73,35 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* =====================================================
            TESTIMONIAL CONTENT
        ===================================================== */}

        <div className="relative z-20 mx-auto max-w-[1200px] px-6 pb-24 pt-10">

          <div className="flex items-center justify-between gap-6">

            {/* LEFT BUTTON */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              suppressHydrationWarning
              className="
                hidden
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
                shadow-sm
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-md
                md:flex
              "
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* TEXT */}
            <div className="min-h-[350px] flex-1 overflow-hidden">

              <AnimatePresence
                mode="wait"
                custom={direction}
              >
                <motion.div
                  key={current}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    x: direction > 0 ? 100 : -100,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: direction > 0 ? -100 : 100,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: 'easeInOut',
                  }}
                  className="
                    flex
                    min-h-[350px]
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >
                  <h2
                    className="
                      max-w-[850px]
                      text-3xl
                      font-bold
                      leading-[1.15]
                      tracking-[-0.04em]
                      text-[#29247c]
                      sm:text-4xl
                      md:text-5xl
                      lg:text-[52px]
                    "
                  >
                    “{testimonial.quote}”
                  </h2>

                  <div className="mt-14 text-center">
                    <p className="inline-block border-b-2 border-[#f12131] pb-1 text-lg font-bold text-black">
                      {testimonial.author}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* RIGHT BUTTON */}
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              suppressHydrationWarning
              className="
                hidden
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
                shadow-sm
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-md
                md:flex
              "
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>

          {/* Mobile controls */}
          <div className="mt-2 flex items-center justify-center gap-4 md:hidden">
            <button
              type="button"
              onClick={prev}
              suppressHydrationWarning
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-md
              "
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={next}
              suppressHydrationWarning
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-md
              "
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          PARTNER SECTION
      ========================================================= */}

      <div className="relative bg-white">

        {/* Divider */}
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="border-t border-slate-200" />
        </div>

        {/* Partner heading */}
        <div className="pt-20 text-center">
          <p
            className="
              text-[18px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#29247c]
            "
          >
            WE&apos;RE PROUD TO PARTNER WITH BEST-IN-CLASS CLIENTS
          </p>
        </div>

        {/* =====================================================
            CONTINUOUS LOGO MARQUEE
            RIGHT → LEFT
        ===================================================== */}

        <div className="mt-12 w-full overflow-hidden">

          <motion.div
            className="flex w-max items-center gap-14 pr-14 md:gap-20 md:pr-20"
            animate={{
              x: ['0%', '-50%'],
            }}
            transition={{
              duration: 24,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <PartnerLogo
                key={`${logo.name}-${index}`}
                logo={logo}
              />
            ))}
          </motion.div>

        </div>

        {/* Bottom spacing */}
        <div className="h-28" />
      </div>

      {/* =========================================================
          ROUNDED END OF WHITE SECTION
      ========================================================= */}

      <div
        className="
          h-10
          rounded-b-[42px]
          bg-white
        "
      />
    </section>
  );
}
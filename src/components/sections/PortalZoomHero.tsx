"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "LUXURY APARTMENTS",
  "GATED COMMUNITIES",
  "PREMIUM PLOTS",
  "EXCLUSIVE VILLAS",
  "FUTURE LIVING",
  "TIMELESS QUALITY",
];

export default function KPNEntryHero() {
  const [entered, setEntered] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);

  const enteredRef = useRef(false);
  const heroVisibleRef = useRef(true);

  const heroRef = useRef<HTMLElement>(null);

  const lockRef = useRef(false);
  const unlockTimerRef = useRef<number | null>(null);

  /* =========================================================
     PORTAL POSITION
     ========================================================= */

  const PORTAL_X = "50%";
  const PORTAL_Y = "49.32%";

  /* =========================================================
     INITIAL VIDEO BOX SIZE

     ⭐ CHANGE ONLY THESE TWO VALUES ⭐

     Bigger:
       520px × 300px

     Smaller:
       400px × 230px

     Very big:
       650px × 370px
     ========================================================= */

  const INITIAL_VIDEO_WIDTH = "520px";
  const INITIAL_VIDEO_HEIGHT = "300px";

  /* =========================================================
     KEEP REFS IN SYNC
     ========================================================= */

  useEffect(() => {
    enteredRef.current = entered;
  }, [entered]);

  useEffect(() => {
    heroVisibleRef.current = heroVisible;
  }, [heroVisible]);

  /* =========================================================
     CENTER WORDS
     ========================================================= */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2200);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /* =========================================================
     GET HERO POSITION
     ========================================================= */

  const getSectionTop = (element: HTMLElement | null) => {
    if (!element) return 0;

    return element.getBoundingClientRect().top + window.scrollY;
  };

  /* =========================================================
     EXACT SCROLL
     ========================================================= */

  const scrollToHero = (
    behavior: ScrollBehavior = "smooth"
  ) => {
    const hero = heroRef.current;

    if (!hero) return;

    const top = getSectionTop(hero);

    window.scrollTo({
      top,
      left: 0,
      behavior,
    });
  };

  /* =========================================================
     LOCK SCROLL
     ========================================================= */

  const lockScroll = (duration: number) => {
    lockRef.current = true;

    if (unlockTimerRef.current) {
      window.clearTimeout(unlockTimerRef.current);
    }

    unlockTimerRef.current = window.setTimeout(() => {
      lockRef.current = false;
    }, duration);
  };

  /* =========================================================
     WHEEL CONTROL

     INITIAL:
       BIG VIDEO BOX

            ↓ SCROLL

       FULLSCREEN VIDEO

            ↑ SCROLL

       BIG VIDEO BOX
     ========================================================= */

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 5) {
        return;
      }

      const hero = heroRef.current;

      if (!hero) {
        return;
      }

      const heroTop = getSectionTop(hero);
      const currentScroll = window.scrollY;

      const tolerance = 30;

      const atHero =
        Math.abs(currentScroll - heroTop) <= tolerance;

      /* =====================================================
         LOCK DURING ANIMATION
         ===================================================== */

      if (lockRef.current) {
        if (atHero) {
          event.preventDefault();
        }

        return;
      }

      /* =====================================================
         SCROLL DOWN

         BIG VIDEO BOX → FULLSCREEN
         ===================================================== */

      if (event.deltaY > 0) {
        if (atHero && !enteredRef.current) {
          event.preventDefault();

          lockScroll(1650);

          enteredRef.current = true;
          setEntered(true);

          return;
        }

        /*
          After fullscreen, normal page scrolling works.
        */

        return;
      }

      /* =====================================================
         SCROLL UP

         FULLSCREEN → BIG VIDEO BOX
         ===================================================== */

      if (event.deltaY < 0) {
        if (atHero && enteredRef.current) {
          event.preventDefault();

          lockScroll(1650);

          enteredRef.current = false;
          setEntered(false);

          heroVisibleRef.current = true;
          setHeroVisible(true);

          window.requestAnimationFrame(() => {
            scrollToHero("auto");
          });

          return;
        }

        return;
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);

      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);

  return (
    <main className="relative w-full bg-black">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        ref={heroRef}
        className="
          relative
          z-20
          h-screen
          w-full
          overflow-hidden
          bg-black
        "
      >

        {/* ===================================================
            VIDEO BOX

            INITIAL:
            520px × 300px

            SCROLL:
            520px × 300px
                  ↓
            100vw × 100vh
        =================================================== */}

        <motion.div
          initial={{
            width: INITIAL_VIDEO_WIDTH,
            height: INITIAL_VIDEO_HEIGHT,
            left: PORTAL_X,
            top: PORTAL_Y,
            x: "-50%",
            y: "-50%",
            borderRadius: "18px",
          }}
          animate={{
            width: entered
              ? "100vw"
              : INITIAL_VIDEO_WIDTH,

            height: entered
              ? "100vh"
              : INITIAL_VIDEO_HEIGHT,

            left: entered
              ? "50%"
              : PORTAL_X,

            top: entered
              ? "50%"
              : PORTAL_Y,

            x: "-50%",
            y: "-50%",

            borderRadius: entered
              ? "0px"
              : "18px",
          }}
          transition={{
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            position: "absolute",
            zIndex: 0,
            overflow: "hidden",
            background: "black",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            boxShadow: entered
              ? "none"
              : "0 25px 70px rgba(0,0,0,0.65)",
          }}
          className="
            will-change-[width,height,left,top,border-radius]
          "
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="
              absolute
              inset-0
              block
              h-full
              w-full
              object-cover
            "
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <source
              src="/entry/entryvideo.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>

        {/* ===================================================
            BLACK OVERLAY
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0.35,
          }}
          animate={{
            opacity: entered ? 0 : 0.35,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
            bg-black
          "
        />

        {/* ===================================================
            PORTAL IMAGE

            If this image contains your circular portal,
            it stays above the video during the initial state.
        =================================================== */}

        <motion.div
          initial={{
            scale: 1,
            opacity: 1,
          }}
          animate={{
            scale: entered ? 5 : 1,
            opacity: entered ? 0 : 1,
          }}
          transition={{
            duration: 1.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            transformOrigin: `${PORTAL_X} ${PORTAL_Y}`,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            z-30
            h-full
            w-full
            will-change-transform
          "
        >
          <img
            src="/entry/entryentry_portal.png"
            alt="KPN Architecture Portal"
            draggable={false}
            className="
              h-full
              w-full
              object-cover
            "
          />
        </motion.div>

        {/* ===================================================
            KPN LOGO
        =================================================== */}

        <motion.div
          initial={{
            opacity: 1,
            x: 0,
          }}
          animate={{
            opacity: entered ? 0 : 1,
            x: entered ? -80 : 0,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute
            left-[3%]
            top-[4%]
            z-50
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              rounded-xl
              bg-white
              px-4
              py-2
              shadow-lg
              md:px-5
              md:py-3
            "
          >
            <img
              src="/images/kpn_logo.webp"
              alt="KPN Promoters"
              draggable={false}
              className="
                w-[90px]
                object-contain
                md:w-[105px]
                lg:w-[120px]
              "
            />
          </div>
        </motion.div>

        {/* ===================================================
            LEFT TEXT
        =================================================== */}

        <motion.div
          initial={{
            x: 0,
            opacity: 1,
          }}
          animate={{
            x: entered ? "-120%" : "0%",
            opacity: entered ? 0 : 1,
          }}
          transition={{
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            absolute
            left-[20%]
            top-[30%]
            z-40
            -translate-y-1/2
          "
        >
          <div className="flex flex-col">

            <span
              className="
                text-[4vw]
                font-light
                leading-[0.9]
                tracking-[-0.04em]
                text-white
                md:text-[3.5vw]
                lg:text-[3vw]
              "
            >
              We
            </span>

            <span
              className="
                text-[7vw]
                font-bold
                uppercase
                leading-[0.9]
                tracking-[-0.06em]
                text-white
                md:text-[6vw]
                lg:text-[5vw]
              "
            >
              BUILD
            </span>

          </div>
        </motion.div>

        {/* ===================================================
            RIGHT TEXT
        =================================================== */}

        <motion.div
          initial={{
            x: 0,
            opacity: 1,
          }}
          animate={{
            x: entered ? "120%" : "0%",
            opacity: entered ? 0 : 1,
          }}
          transition={{
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            absolute
            right-[20%]
            top-[30%]
            z-40
            -translate-y-1/2
            text-right
          "
        >
          <div className="flex flex-col">

            <span
              className="
                text-[4vw]
                font-light
                leading-[0.9]
                tracking-[-0.04em]
                text-white
                md:text-[3.5vw]
                lg:text-[3vw]
              "
            >
              Your
            </span>

            <span
              className="
                text-[7vw]
                font-bold
                leading-[0.9]
                tracking-[-0.06em]
                text-white
                md:text-[6vw]
                lg:text-[5vw]
              "
            >
              Future
            </span>

          </div>
        </motion.div>

        {/* ===================================================
            CENTER WORDS
        =================================================== */}

        <AnimatePresence mode="wait">

          <motion.div
            key={wordIndex}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              left: PORTAL_X,
              top: PORTAL_Y,
            }}
            className="
              absolute
              z-40
              w-[62vw]
              max-w-[310px]
              -translate-x-1/2
              -translate-y-1/2
              text-center
              sm:w-[48vw]
              md:w-[30vw]
              md:max-w-[300px]
              lg:w-[20vw]
              lg:max-w-[330px]
            "
          >

            <div
              className="
                whitespace-nowrap
                text-[2.8vw]
                font-semibold
                uppercase
                leading-none
                tracking-[0.055em]
                text-white
                drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]
                sm:text-[2.3vw]
                md:text-[1.8vw]
                lg:text-[1.45vw]
              "
            >
              {words[wordIndex]}
            </div>

          </motion.div>

        </AnimatePresence>

      </section>

    </main>
  );
}
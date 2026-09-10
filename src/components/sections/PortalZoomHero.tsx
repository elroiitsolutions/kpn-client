"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function KPNEntryHero() {
  const [entered, setEntered] = useState(false);
  const [faded, setFaded] = useState(false);
  const enteredRef = useRef(false);
  const fadedRef = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lockRef = useRef(false);
  const fadeTimerRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<number | null>(null);

  /* =========================================================
     PORTAL POSITION
  ========================================================= */
  const PORTAL_X = "50%";
  const PORTAL_Y = "49.32%";

  /* =========================================================
     INITIAL VIDEO BOX SIZE
  ========================================================= */
  const INITIAL_VIDEO_WIDTH = "480px";
  const INITIAL_VIDEO_HEIGHT = "480px";

  /* =========================================================
     KEEP REFS IN SYNC & NOTIFY HERO SECTION
  ========================================================= */
  useEffect(() => {
    enteredRef.current = entered;
  }, [entered]);

  useEffect(() => {
    fadedRef.current = faded;
    if (typeof window !== 'undefined') {
      (window as any).__kpnPortalFaded = faded;
      window.dispatchEvent(new CustomEvent('kpn-portal-fade', { detail: { faded } }));
    }

    const video = videoRef.current;
    if (video) {
      if (faded) {
        // Pause portal video when faded so it does not compete for GPU video decoder
        if (!video.paused) {
          video.pause();
        }
      } else {
        // Resume portal video when portal is shown
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    }
  }, [faded]);

  /* =========================================================
     INITIAL PORTAL VIDEO AUTOPLAY
  ========================================================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const playPortalVideo = () => {
      if (video.paused && !fadedRef.current) {
        video.play().catch(() => {});
      }
    };

    playPortalVideo();

    // Fallback if browser requires initial user gesture
    const handleGesture = () => {
      playPortalVideo();
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

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
     TRIGGER ZOOM IN & SMOOTH FADE
  ========================================================= */
  const triggerZoomIn = () => {
    if (enteredRef.current) return;
    // Lock scroll for the 1.6s duration so rapid wheel ticks don't break playback
    lockScroll(1700);
    enteredRef.current = true;
    setEntered(true);

    // Zoom completes at 1.6s; smoothly fade to hero section at 1.8s
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => {
      if (enteredRef.current) {
        fadedRef.current = true;
        setFaded(true);
      }
    }, 1800);
  };

  /* =========================================================
     TRIGGER ZOOM OUT (REVERSE ANIMATION)
  ========================================================= */
  const triggerZoomOut = () => {
    lockScroll(1800);
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);

    // 1. Fade video back in
    fadedRef.current = false;
    setFaded(false);

    // 2. Zoom out back to circular box & portal image
    window.setTimeout(() => {
      enteredRef.current = false;
      setEntered(false);
    }, 150);
  };

  /* =========================================================
     WHEEL & TOUCH CONTROL
  ========================================================= */
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 5) {
        return;
      }

      // If transition is currently locked, prevent interruption
      if (lockRef.current) {
        if (!fadedRef.current) {
          event.preventDefault();
        }
        return;
      }

      /* =====================================================
         SCROLL DOWN:
         PORTAL ZOOM → FULLSCREEN VIDEO → FADE TO HERO SECTION
      ===================================================== */
      if (event.deltaY > 0) {
        // At initial opening: trigger zoom in
        if (!enteredRef.current && !fadedRef.current) {
          event.preventDefault();
          triggerZoomIn();
          return;
        }

        // If in fullscreen video after zoom completes and not yet faded: scroll down immediately fades to hero
        if (enteredRef.current && !fadedRef.current) {
          event.preventDefault();
          if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
          fadedRef.current = true;
          setFaded(true);
          return;
        }

        // After faded, normal page scrolling works naturally
        return;
      }

      /* =====================================================
         SCROLL UP:
         REVERSE ZOOM OUT TO PORTAL IMAGE
      ===================================================== */
      if (event.deltaY < 0) {
        // If at top of the page (scrollY <= 5) and faded is true: reverse zoom out
        if (fadedRef.current && window.scrollY <= 5) {
          event.preventDefault();
          triggerZoomOut();
          return;
        }

        // If in fullscreen video before fade: zoom back out to box
        if (enteredRef.current && !fadedRef.current) {
          event.preventDefault();
          triggerZoomOut();
          return;
        }
      }
    };

    // Touch support for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 30) return;
      handleWheel({ deltaY, preventDefault: () => {} } as any);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: faded ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        pointerEvents: faded ? "none" : "auto",
        visibility: faded ? "hidden" : "visible",
        transition: faded ? "visibility 0s 0.5s" : "visibility 0s 0s",
      }}
      className="fixed inset-0 z-[200] h-screen w-full overflow-hidden bg-black"
      onClick={() => {
        if (lockRef.current) return;
        if (!enteredRef.current && !fadedRef.current) {
          triggerZoomIn();
        } else if (enteredRef.current && !fadedRef.current) {
          // If already zooming/entered, click smoothly fades out
          if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
          fadedRef.current = true;
          setFaded(true);
        }
      }}
    >
        {/* ===================================================
            VIDEO BOX
            INITIAL:
            480px × 480px
            SCROLL:
            480px × 480px
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
            ease: [0.16, 0.9, 0.3, 1],
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
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            className="
              absolute
              inset-0
              block
              h-full
              w-full
              object-cover
            "
            style={{
              transform: "translateZ(0)",
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
            BLACK OVERLAY (Disabled so video is vividly visible)
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
            hidden
            inset-0
            z-10
            bg-black
          "
        />
        {/* ===================================================
            PORTAL IMAGE
            IMPORTANT FIX:
            The portal image NEVER fades while zooming.
            OLD:
              opacity: entered ? 0 : 1
            NEW:
              opacity: 1
            This keeps the original portal colors during
            the entire zoom animation.
        =================================================== */}
        <motion.div
          initial={{
            scale: 1,
            opacity: 1,
          }}
          animate={{
            scale: entered ? 9 : 1,
            // IMPORTANT:
            // Never fade the portal while zooming.
            opacity: 1,
          }}
          transition={{
            scale: {
              duration: 1.6,
              ease: [0.16, 0.9, 0.3, 1],
            },
            opacity: {
              duration: 0,
            },
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            transformOrigin: `${PORTAL_X} ${PORTAL_Y}`,
            // Prevent color fading
            filter: "none",
            opacity: 1,
            mixBlendMode: "normal",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
            pointerEvents: "none",
          }}
          className="
            absolute
            inset-0
            z-30
            h-full
            w-full
            pointer-events-none
          "
        >
          <img
            src="/entry/entryportal.original.png"
            alt="KPN Architecture Portal"
            draggable={false}
            className="
              block
              h-full
              w-full
              object-cover
            "
            style={{
              // Keep original image colors
              filter: "none",
              opacity: 1,
              mixBlendMode: "normal",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
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
{/* 
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
        </motion.div> */}
        {/* ===================================================
            RIGHT TEXT
        =================================================== */}
{/* 
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
        </motion.div> */}

      </motion.div>
  );
}
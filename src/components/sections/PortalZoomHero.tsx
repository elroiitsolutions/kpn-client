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
  const INITIAL_VIDEO_WIDTH = "300px";
  const INITIAL_VIDEO_HEIGHT = "300px";

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
        // Pause portal video after fade completes so it plays during the zoom-fade and then frees GPU
        const timer = window.setTimeout(() => {
          if (fadedRef.current && video && !video.paused) {
            video.pause();
          }
        }, 1500);
        return () => window.clearTimeout(timer);
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
     TRIGGER ZOOM IN & SIMULTANEOUS FADE
  ========================================================= */
  const triggerZoomIn = () => {
    if (enteredRef.current) return;
    // Lock scroll for transition duration
    lockScroll(1700);
    enteredRef.current = true;
    fadedRef.current = true;
    setEntered(true);
    setFaded(true);
  };

  /* =========================================================
     TRIGGER ZOOM OUT (REVERSE ANIMATION)
  ========================================================= */
  const triggerZoomOut = () => {
    lockScroll(1700);

    fadedRef.current = false;
    enteredRef.current = false;
    setFaded(false);
    setEntered(false);
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
         PORTAL ZOOM + SIMULTANEOUS FADE TO HERO SECTION
      ===================================================== */
      if (event.deltaY > 0) {
        // At initial opening: trigger zoom in and simultaneous fade
        if (!enteredRef.current && !fadedRef.current) {
          event.preventDefault();
          triggerZoomIn();
          return;
        }

        // After entered/faded, normal page scrolling works naturally
        return;
      }

      /* =====================================================
         SCROLL UP:
         REVERSE ZOOM OUT TO PORTAL IMAGE
      ===================================================== */
      if (event.deltaY < 0) {
        // If at top of the page (scrollY <= 5) and faded/entered: reverse zoom out
        if ((fadedRef.current || enteredRef.current) && window.scrollY <= 5) {
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
    };
  }, []);

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: (entered || faded) ? 0 : 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{
        pointerEvents: (entered || faded) ? "none" : "auto",
        visibility: (entered || faded) ? "hidden" : "visible",
        transition: (entered || faded) ? "visibility 0s 1.5s" : "visibility 0s 0s",
      }}
      className="fixed inset-0 z-[200] h-screen w-full overflow-hidden bg-white"
      onClick={() => {
        if (lockRef.current) return;
        if (!enteredRef.current && !fadedRef.current) {
          triggerZoomIn();
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
            background: "white",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            boxShadow: "none",
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
              backgroundColor: "white",
            }}
          >
            <source
              src="/entry/entryvideo.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>
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
'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    // Reset all horizontal timeline scroll containers
    const horizontalScrollers = document.querySelectorAll(
      '.timeline-scroll'
    );

    horizontalScrollers.forEach((element) => {
      element.scrollTo({
        left: 0,
        behavior: 'auto',
      });
    });

    // Scroll the page to the top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        group
        fixed
        bottom-5
        right-6
        z-40
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-[#f12131]
        text-white
        shadow-xl
        transition-all
        duration-300
        hover:scale-110
        hover:bg-[#d01927]
        active:scale-95
        ${
          visible
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-4 pointer-events-none scale-75'
        }
      `}
    >
      <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
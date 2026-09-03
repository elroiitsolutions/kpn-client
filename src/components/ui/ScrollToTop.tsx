'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
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

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="
        group
        fixed
        bottom-6
        right-6
        z-50
        flex
        h-12.5
        w-12.5
        items-center
        justify-center
        rounded-full
        bg-[#f12131]
        text-white
        shadow-xl
        transition-all
        hover:scale-105
        active:scale-95
      "
    >
      <ChevronUp
        className="
          h-5
          w-5
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:text-black
        "
      />
    </button>
  );
}
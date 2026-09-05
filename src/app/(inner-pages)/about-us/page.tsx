import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import AboutIntroSection from '@/components/sections/about/AboutIntroSection';
import TimelineSection from '@/components/sections/about/TimelineSection';
import LearnMoreSection from '@/components/sections/about/LearnMoreSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export default function AboutUsPage() {
  return (
    <div className="w-full">
      <Navbar variant="hero" />

      <InnerPageHero
        title="About us"
        breadcrumb="About us"
        description="Whether you're building, remodeling, buying, or selling, we bring seamless project execution under one roof."
        image="/images/about/about-bc.jpg"
      />

      <AboutIntroSection />

      <TimelineSection />

      <LearnMoreSection />

      <TestimonialsSection />
    </div>
  );
}
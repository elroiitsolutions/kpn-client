import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';
import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Our Venture - KPN Promoters',
};

export default function OurVenturePage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="Our Venture"
        breadcrumb="Our Venture"
        description="Join a network of trusted partners bringing innovative solutions to more markets. Let's achieve success together."
        image="/images/projects/project_5.jpg"
      />

      <AssociatePageTemplate title="Our Venture" />

    </>
  );
}
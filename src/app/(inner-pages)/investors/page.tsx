import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';
import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';

export default function InvestorsPage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="Investors"
        breadcrumb="Investors"
        description="Join a network of trusted partners bringing innovative solutions to more markets. Let's achieve success together."
        image="/images/projects/project_4.jpg"
      />

      <AssociatePageTemplate title="Investors" />

    </>
  );
}
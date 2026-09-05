import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';
import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';
export const metadata = {
  title: 'NRI Services - KPN Promoters',
};

export default function NRIPage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="NRI"
        breadcrumb="NRI"
        description="Join a network of trusted partners bringing innovative solutions to more markets. Let's achieve success together."
        image="/images/projects/project_6.jpg"
      />

      <AssociatePageTemplate title="NRI" />

    </>
  );
}
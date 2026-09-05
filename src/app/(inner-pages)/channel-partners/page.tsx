import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';
import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Channel Partners - KPN Promoters',
};

export default function ChannelPartnersPage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="Channel Partners"
        breadcrumb="Channel Partners"
        description="Join a network of trusted partners bringing innovative solutions to more markets. Let's achieve success together."
        image="/images/projects/project_7.jpg"
      />

      <AssociatePageTemplate title="Channel Partners" />

    </>
  );
}
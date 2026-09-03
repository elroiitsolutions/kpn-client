import InnerFooter from '@/components/layout/InnerFooter';
import ScrollToTop from '@/components/ui/ScrollToTop';

export default function InnerPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <main className="flex-grow bg-white rounded-b-[40px] sm:rounded-b-[50px] lg:rounded-b-[60px] relative z-10 shadow-xl flex flex-col">
        {children}
      </main>
      <InnerFooter />
      <ScrollToTop />
    </div>
  );
}
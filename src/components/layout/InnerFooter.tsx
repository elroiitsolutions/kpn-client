'use client';

import Link from 'next/link';
import FadeIn from '../animation/FadeIn';
import StaggerContainer from '../animation/StaggerContainer';
import StaggerItem from '../animation/StaggerItem';

export default function Footer() {
  return (
    <section className="relative overflow-hidden -mt-16 sm:-mt-20 z-0">

      {/* =====================================================
          FULL BACKGROUND IMAGE
      ===================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/about/about-img.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/45" />


      {/* =====================================================
          DREAM HOME CTA
      ===================================================== */}
      <div className="relative z-10 flex min-h-[650px] items-start justify-center px-4 pt-16 sm:px-6 lg:px-8">

        <FadeIn direction="up" className="pt-8 text-center">

          <h2 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[70px]">
            Your dream
            <br />
            home awaits
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-white sm:text-base">
            Whether you&apos;re exploring our homes or envisioning something
            custom, we&apos;re here to bring your dream to life.
          </p>

        </FadeIn>

      </div>


      {/* =====================================================
          FOOTER CARD
      ===================================================== */}
      <footer className="relative z-20 -mt-32 px-4 pb-8 sm:px-6 lg:px-8">

        <FadeIn direction="up" distance={30} className="mx-auto w-full max-w-[1500px] rounded-[38px] bg-white px-8 py-12 shadow-2xl sm:px-12 sm:py-14 lg:px-16 lg:py-16">

          {/* =================================================
              MAIN CONTENT
          ================================================= */}
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 lg:grid-cols-12">

            {/* LOGO + DESCRIPTION */}
            <StaggerItem className="lg:col-span-4 lg:border-r lg:border-slate-200 lg:pr-12">

              <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
                <img
                  src="/images/kpn_logo.webp"
                  alt="KPN Promoters Pvt Ltd"
                  className="h-14 w-auto object-contain"
                />
              </Link>

              <p className="mt-20 max-w-[350px] text-sm leading-relaxed text-slate-400">
                We are creators of transformative spaces that inspire,
                innovate, and endure.
              </p>

            </StaggerItem>


            {/* NAVIGATION */}
            <StaggerItem className="grid grid-cols-2 gap-x-10 gap-y-6 py-10 lg:col-span-3 lg:px-10 lg:py-0">

              <div className="space-y-6">

                <Link
                  href="/about-us"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href="/why-choose-us"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Why Choose Us
                </Link>

                <Link
                  href="/our-team"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Our Team
                </Link>

                <Link
                  href="/our-solutions"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Solutions
                </Link>

                <Link
                  href="/partners"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Partners
                </Link>

                <Link
                  href="/core-values"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Core Values
                </Link>

              </div>


              <div className="space-y-6">

                <Link
                  href="/projects"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Our Projects
                </Link>

                <Link
                  href="/blogs"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  News & Updates
                </Link>

                <Link
                  href="/terms"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Terms & Conditions
                </Link>

                <Link
                  href="/support"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Support Center
                </Link>

                <Link
                  href="/contact-us"
                  className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  Contact
                </Link>

              </div>

            </StaggerItem>


            {/* CONTACT */}
            <StaggerItem className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-10">

              <a
                href="tel:+917338834233"
                className="block w-fit border-b border-rose-500 pb-1 text-xl font-bold text-slate-900 sm:text-2xl hover:opacity-80 transition-opacity"
              >
                +91 7338834233
              </a>

              <a
                href="mailto:kpnsalesteam@gmail.com"
                className="mt-5 block w-fit border-b border-rose-500 pb-1 text-xl font-bold text-slate-900 sm:text-2xl hover:opacity-80 transition-opacity"
              >
                kpnsalesteam@gmail.com
              </a>

              <div className="mt-28 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">

                <Link href="https://www.facebook.com/kpnpromoters.in" className="hover:text-rose-600 transition-colors">
                  Facebook
                </Link>

                <span>·</span>

                <Link href="https://www.instagram.com/kpnpromotersofficial/" className="hover:text-rose-600 transition-colors">
                  Instagram
                </Link>

                <span>·</span>

                <Link href="https://www.youtube.com/@KPNPROMOTERSPVTLTD" className="hover:text-rose-600 transition-colors">
                  Youtube
                </Link>

                <span>·</span>

                <Link href="https://x.com/PromotersKpn" className="hover:text-rose-600 transition-colors">
                  Twitter
                </Link>

              </div>

            </StaggerItem>

          </StaggerContainer>


          {/* DIVIDER */}
          <div className="mt-12 border-t border-slate-200" />

          {/* SECOND DIVIDER */}
          <div className="mt-8 border-t border-slate-200" />

          {/* COPYRIGHT */}
          <div className="pt-6">

            <p className="text-xs text-slate-400">
              © 2026 KPN Promoters Pvt Ltd. All Rights Reserved.
            </p>

          </div>

        </FadeIn>

      </footer>

    </section>
  );
}
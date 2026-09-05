'use client';

import Link from 'next/link';
import FadeIn from '../animation/FadeIn';
import StaggerContainer from '../animation/StaggerContainer';
import StaggerItem from '../animation/StaggerItem';

export default function Footer() {
  return (
    <footer className="relative z-0 -mt-16 bg-neutral-950 text-white pt-28 pb-12">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Main Columns */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Brand & Sales Contact */}
          <StaggerItem className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              GET IN TOUCH
            </span>
            <div className="text-3xl font-black text-[#f12131] tracking-tight leading-none mt-4">
              +91 7338834233
            </div>
            <div className="block pt-2">
              <a
                href="mailto:kpnsalesteam@gmail.com"
                className="text-2xl font-black text-[#f12131] tracking-tight border-b-2 border-[#f12131] pb-1 inline-block hover:opacity-80 transition-all"
              >
                kpnsalesteam@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 pt-6">
              <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
              <span className="text-slate-700">•</span>
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
              <span className="text-slate-700">•</span>
              <Link href="#" className="hover:text-white transition-colors">Youtube</Link>
              <span className="text-slate-700">•</span>
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            </div>
          </StaggerItem>

          {/* Company Column */}
          <StaggerItem>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              COMPANY
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li>
                <Link href="/about-us" className="hover:text-[#f12131] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/why-choose-us" className="hover:text-[#f12131] transition-colors">Why Choose Us</Link>
              </li>
              <li>
                <Link href="/our-team" className="hover:text-[#f12131] transition-colors">Our Team</Link>
              </li>
              <li>
                <Link href="/our-solutions" className="hover:text-[#f12131] transition-colors">Solutions</Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-[#f12131] transition-colors">Partners</Link>
              </li>
              <li>
                <Link href="/core-values" className="hover:text-[#f12131] transition-colors">Core Values</Link>
              </li>
            </ul>
          </StaggerItem>

          {/* Services Column */}
          <StaggerItem>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              SERVICES
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Real Estate Development</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Project Management</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Investment & Capital</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Construction Management</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Architecture & Design</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Sales & Marketing</Link>
              </li>
            </ul>
          </StaggerItem>

          {/* Pages Column */}
          <StaggerItem>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              PAGES
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Testimonials</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f12131] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom Bar: Centered Logo and Centered Copyright */}
        <FadeIn delay={0.2} direction="up">
          <div className="pt-12 flex flex-col items-center justify-center gap-6">
            <Link href="/" className="flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <img
                src="/images/kpn_logo.webp"
                alt="KPN Promoters"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm font-bold text-white text-center">
              © 2026 KPN Promoters. All Rights Reserved.
            </p>
          </div>
        </FadeIn>

      </div>
    </footer>
  );
}
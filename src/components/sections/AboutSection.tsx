'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import Counter from '../ui/Counter';
import RunningPillBadge from '../ui/RunningPillBadge';
import FadeIn from '../animation/FadeIn';
import StaggerContainer from '../animation/StaggerContainer';
import StaggerItem from '../animation/StaggerItem';
import ImageReveal from '../animation/ImageReveal';

export default function AboutSection() {
  return (
    <section className="relative z-20 -mt-6 rounded-t-[40px] mx-20 w-auto bg-white pb-20 pt-16 md:rounded-t-[60px] lg:pb-28 lg:pt-20">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Copy */}
          <StaggerContainer staggerDelay={0.12} className="space-y-6 lg:col-span-7">
            <StaggerItem>
              <RunningPillBadge text="WHO WE ARE" />
            </StaggerItem>

            <StaggerItem>
              <h2 className="text-3xl font-bold leading-[1.25] text-[#29247c] sm:text-4xl lg:text-[44px]">
                We developed landmark real estate projects that deliver lasting value to investors and communities.
              </h2>
            </StaggerItem>

            <StaggerItem>
              <p className="max-w-2xl text-base font-normal leading-relaxed text-slate-500">
                To empower businesses with cutting-edge web solutions that enhance their digital presence and drive growth. Our solutions are designed to meet the needs of modern enterprises, ensuring they thrive in today&apos;s competitive online landscape.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div>
                <Link
                  href="#contact"
                  className="inline-block text-base font-bold text-[#f12131] underline underline-offset-4 decoration-[#f12131] transition-colors hover:text-red-700 hover:scale-[1.02] transform duration-200"
                >
                  Let&apos;s create something extraordinary!
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem>
              <hr className="my-8 border-t border-slate-200/80" />

              <div className="space-y-3">
                <div className="flex items-center -space-x-3">
                  <img
                    className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-300 hover:scale-110 hover:z-10"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Client 1"
                  />
                  <img
                    className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-300 hover:scale-110 hover:z-10"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Client 2"
                  />
                  <img
                    className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-300 hover:scale-110 hover:z-10"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Client 3"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[#f12131] text-lg font-bold text-white shadow-sm">
                    +
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  More than <span className="font-bold text-slate-900">25k+</span> happy clients
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Right Stats & Video Card */}
          <div className="flex flex-col items-center justify-center lg:col-span-5 lg:items-start">
            <FadeIn direction="up" delay={0.1} className="w-full text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start text-7xl font-extrabold tracking-tight text-[#29247c] sm:text-8xl lg:text-[110px] leading-none">
                <Counter value={285} />
                <span className="text-[#f12131]">+</span>
              </div>
              <p className="mt-2 text-lg font-medium text-slate-500">
                completed projects
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.25} className="w-full">
              <ImageReveal className="relative mt-8 w-full max-w-md overflow-hidden rounded-[32px] shadow-2xl group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"
                  alt="Project Landmark"
                  className="h-[380px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#f12131] group-hover:text-white">
                  <Play className="h-6 w-6 fill-current text-black ml-1 group-hover:text-white group-hover:fill-white transition-colors" />
                </div>
              </ImageReveal>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

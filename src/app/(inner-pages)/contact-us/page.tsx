'use client';

import { useState } from 'react';
import Image from 'next/image';
import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';
import FadeIn from '@/components/animation/FadeIn';
import StaggerContainer from '@/components/animation/StaggerContainer';
import StaggerItem from '@/components/animation/StaggerItem';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(
      'Thank you for contacting us! We will get back to you shortly.'
    );
  };

  return (
    <>
      {/* =========================================================
          INNER PAGE HERO
      ========================================================= */}
      <Navbar variant="hero" />
      <InnerPageHero
        title="Contact Us"
        breadcrumb="Contact Us"
        description="Our global real estate experts are here to help you in this ever-changing market."
        image="/images/projects/project_8.jpg"
      />
      {/* =========================================================
          2. THREE CONTACT CARDS
      ========================================================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1200px]">

          <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* ---------------------------------------------------
                EMAIL
            --------------------------------------------------- */}
            <StaggerItem className="flex min-h-[300px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-md transition-shadow">

              <div>
                <h3 className="text-2xl font-bold text-[#29247c]">
                  Support email
                </h3>

                <p className="mt-2 text-sm text-slate-800">
                  kpnsalesteam@gmail.com
                </p>
              </div>

              <a
                href="mailto:kpnsalesteam@gmail.com"
                className="flex h-12 items-center justify-center rounded-full bg-[#ff202d] text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-[#ed1c2a] active:scale-98"
              >
                Email Us
              </a>

            </StaggerItem>


            {/* ---------------------------------------------------
                PHONE
            --------------------------------------------------- */}
            <StaggerItem className="flex min-h-[300px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-md transition-shadow">

              <div>
                <h3 className="text-2xl font-bold text-[#29247c]">
                  Phone number
                </h3>

                <p className="mt-2 text-sm text-slate-800">
                  +91 7338834233
                </p>
              </div>

              <a
                href="tel:+917338834233"
                className="flex h-12 items-center justify-center rounded-full bg-[#ff202d] text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-[#ed1c2a] active:scale-98"
              >
                Call Us
              </a>

            </StaggerItem>


            {/* ---------------------------------------------------
                LOCATION
            --------------------------------------------------- */}
            <StaggerItem className="flex min-h-[300px] flex-col justify-between rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-md transition-shadow">

              <div>
                <h3 className="text-2xl font-bold text-[#29247c]">
                  Location
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-800">
                  No. 48, Karanai Puducherry Rd,
                  Senthil Nagar, Urapakkam, Chennai -
                  603 210.
                </p>
              </div>

              <a
                href="#map-section"
                className="flex h-12 items-center justify-center rounded-full bg-[#ff202d] text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-[#ed1c2a] active:scale-98"
              >
                Visit Us
              </a>

            </StaggerItem>

          </StaggerContainer>

        </div>
      </section>

      {/* =========================================================
          CONTACT FORM + MAP
      ========================================================= */}
      <section id="map-section" className="overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1400px]">

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8">

            {/* =====================================================
                LEFT SIDE - FORM (SLIDES IN FROM LEFT)
            ===================================================== */}
            <FadeIn direction="left" distance={40} duration={0.8} className="lg:col-span-6">

              {/* Heading */}
              <h2
                className="
                  mb-8
                  text-4xl
                  font-bold
                  tracking-tight
                  text-[#29247c]
                  sm:text-5xl
                  lg:text-[48px]
                  lg:leading-[1.05]
                "
              >
                Leave a message
              </h2>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <input
                    type="text"
                    required
                    placeholder="First Name*"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="
                      h-[54px]
                      w-full
                      rounded-full
                      border-0
                      bg-[#f3f3f3]
                      px-7
                      text-sm
                      text-slate-800
                      outline-none
                      placeholder:text-slate-500
                      transition
                      focus:bg-[#eeeeee]
                      focus:ring-2
                      focus:ring-[#f12131]/30
                    "
                  />

                  <input
                    type="text"
                    required
                    placeholder="Last Name*"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="
                      h-[54px]
                      w-full
                      rounded-full
                      border-0
                      bg-[#f3f3f3]
                      px-7
                      text-sm
                      text-slate-800
                      outline-none
                      placeholder:text-slate-500
                      transition
                      focus:bg-[#eeeeee]
                      focus:ring-2
                      focus:ring-[#f12131]/30
                    "
                  />

                </div>

                {/* Email */}
                <input
                  type="email"
                  required
                  placeholder="Email*"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="
                    h-[54px]
                    w-full
                    rounded-full
                    border-0
                    bg-[#f3f3f3]
                    px-7
                    text-sm
                    text-slate-800
                    outline-none
                    placeholder:text-slate-500
                    transition
                    focus:bg-[#eeeeee]
                    focus:ring-2
                    focus:ring-[#f12131]/30
                  "
                />

                {/* Message */}
                <textarea
                  required
                  rows={6}
                  placeholder="Message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="
                    min-h-[170px]
                    w-full
                    resize-none
                    rounded-[28px]
                    border-0
                    bg-[#f3f3f3]
                    px-7
                    py-6
                    text-sm
                    text-slate-800
                    outline-none
                    placeholder:text-slate-500
                    transition
                    focus:bg-[#eeeeee]
                    focus:ring-2
                    focus:ring-[#f12131]/30
                  "
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className="
                    group
                    flex
                    h-[54px]
                    items-center
                    gap-5
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    pl-7
                    pr-2
                    text-sm
                    font-bold
                    text-black
                    shadow-sm
                    transition-all
                    hover:shadow-md
                    active:scale-98
                  "
                >
                  <span>Submit</span>

                  <span
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f12131]
                      text-white
                      transition-transform
                      duration-300
                      group-hover:rotate-45
                    "
                  >
                    ↗
                  </span>
                </button>

              </form>

              {/* ===================================================
                  OFFICE THUMBNAILS
              =================================================== */}
              <div className="mt-16 flex items-center gap-6">

                <div
                  className="
                    relative
                    h-[72px]
                    w-[150px]
                    overflow-hidden
                    rounded-full
                    shadow-sm
                  "
                >
                  <Image
                    src="/images/about/about-img.jpg"
                    alt="KPN Promoters office"
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div
                  className="
                    relative
                    h-[72px]
                    w-[150px]
                    overflow-hidden
                    rounded-full
                    shadow-sm
                  "
                >
                  <Image
                    src="/images/hero/h1_bg.jpg"
                    alt="KPN Promoters project"
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

              </div>

            </FadeIn>

            {/* =====================================================
                RIGHT SIDE - GOOGLE MAP (SLIDES IN FROM RIGHT)
            ===================================================== */}
            <FadeIn
              direction="right"
              distance={40}
              duration={0.8}
              delay={0.1}
              className="
                h-[500px]
                overflow-hidden
                rounded-[28px]
                bg-slate-100
                shadow-lg
                lg:col-span-6
                lg:h-[640px]
              "
            >
              <iframe
                title="KPN Promoters Contact Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.7854619438317!2d80.06316277578278!3d12.857147717326888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f77864f14c27%3A0x882a1708f519543e!2sUrapakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </FadeIn>

          </div>

        </div>
      </section>
    </>
  );
}
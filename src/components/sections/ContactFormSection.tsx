'use client';

import { useState } from 'react';
import RunningPillBadge from '../ui/RunningPillBadge';
import FadeIn from '../animation/FadeIn';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiry: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry! Our sales team will reach out.');
  };

  return (
    <section
      className="relative z-10 bg-white pb-20 pt-10 rounded-b-[40px] md:rounded-b-[60px]"
      id="contact"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Background Wrapper with KPN-Marvel-Township-Urapakkam.jpg */}
        <FadeIn direction="up" distance={30}>
          <div
            className="relative rounded-[40px] overflow-hidden bg-cover bg-center py-20 px-6 sm:px-12 md:px-20 lg:py-28 shadow-xl"
            style={{
              backgroundImage: "url('/images/contact_bg.jpg')",
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#0f172a]/35" />

            {/* Form Card */}
            <div className="relative z-10 mx-auto max-w-4xl rounded-[32px] bg-white p-8 md:p-14 shadow-2xl overflow-hidden">
              {/* Left Building Outline */}
              <img
                src="/images/building/h1_shape.png"
                alt="Building blueprint left"
                className="absolute bottom-0 left-0 h-40 sm:h-52 md:h-64 w-auto opacity-60 pointer-events-none object-contain select-none z-0"
              />
              {/* Right Building Outline */}
              <img
                src="/images/building/h1_shape.png"
                alt="Building blueprint right"
                className="absolute bottom-0 right-0 h-40 sm:h-52 md:h-64 w-auto opacity-60 pointer-events-none object-contain select-none z-0 scale-x-[-1]"
              />

              <div className="relative z-10">
                <div className="text-center max-w-xl mx-auto mb-10 space-y-4 flex flex-col items-center">
                  <RunningPillBadge text="ENQUIRY • GET IN TOUCH" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#29247c] tracking-tight leading-snug">
                    Get specialist advice for residential, commercial or property
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      required
                      placeholder="Your Name*"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      suppressHydrationWarning
                      className="w-full rounded-full border border-slate-100 bg-slate-50/80 px-6 py-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400/60 focus:border-transparent transition-all"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email*"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      suppressHydrationWarning
                      className="w-full rounded-full border border-slate-100 bg-slate-50/80 px-6 py-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400/60 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Row 2: Phone and Inquiry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number*"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      suppressHydrationWarning
                      className="w-full rounded-full border border-slate-100 bg-slate-50/80 px-6 py-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400/60 focus:border-transparent transition-all"
                    />
                    <div className="relative">
                      <select
                        value={formData.inquiry}
                        onChange={(e) =>
                          setFormData({ ...formData, inquiry: e.target.value })
                        }
                        suppressHydrationWarning
                        className="w-full rounded-full border border-slate-100 bg-slate-50/80 px-6 py-4 text-sm text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400/60 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          You inquiry about...
                        </option>
                        <option value="residential" className="text-slate-800">
                          Residential Property
                        </option>
                        <option value="commercial" className="text-slate-800">
                          Commercial Property
                        </option>
                        <option value="jv" className="text-slate-800">
                          Our Venture
                        </option>
                        <option value="other" className="text-slate-800">
                          General Inquiry
                        </option>
                      </select>
                      {/* Dropdown Arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-slate-400">
                        <svg
                          className="fill-current h-4 w-4"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.218 0.209-0.509 0.314-0.79 0.314s-0.572-0.105-0.79-0.314l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                    <div className="text-left space-y-0.5">
                      <p className="text-sm font-semibold text-[#29247c]">
                        We&apos;re excited to connect with you!
                      </p>
                      <p className="text-xs text-slate-400">
                        Required fields are marked *
                      </p>
                    </div>
                    <button
                      type="submit"
                      suppressHydrationWarning
                      className="w-full sm:w-auto rounded-full bg-[#f12131] py-3 pl-8 pr-3 flex items-center justify-between text-white font-bold text-sm shadow-md transition-all hover:bg-red-600 hover:scale-102 active:scale-98"
                    >
                      <span>Get A Call Back</span>
                      <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-[#f12131] ml-4 transition-transform duration-300 group-hover:scale-110">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12 h14 M12 5 l7 7 l-7 7"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
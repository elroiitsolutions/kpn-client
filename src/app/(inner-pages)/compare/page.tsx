'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData } from '@/data/siteData';
import { useWishlistCompare } from '@/context/WishlistCompareContext';
import { Scale, Trash2, Heart, ArrowRight, CheckCircle, Building, MapPin, Tag } from 'lucide-react';
import FadeIn from '@/components/animation/FadeIn';

export default function ComparePage() {
  const { compareIds, toggleCompare, clearCompare, toggleWishlist, isInWishlist } = useWishlistCompare();

  const comparedProjects = projectsData.filter((p) => compareIds.includes(p.id));

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title="Compare Projects"
        breadcrumb="Compare"
        description="Side-by-side analysis of key specifications, pricing, amenities, and location details to help you choose your ideal home."
        image="/images/projects/project_1.jpg"
      />

      <section className="bg-slate-50 min-h-screen px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          {comparedProjects.length === 0 ? (
            <FadeIn direction="up">
              <div className="rounded-[36px] border border-slate-200/80 bg-white p-12 text-center shadow-xl max-w-2xl mx-auto my-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[#f12131] mb-6">
                  <Scale className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#29247c]">
                  No Projects Selected for Comparison
                </h2>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  Browse our projects list and click the compare icon on up to 3 projects to evaluate them side-by-side.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-full bg-[#f12131] px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-[#d91d2c] hover:scale-105 active:scale-95"
                  >
                    Browse Projects <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn direction="up">
              <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#29247c]">
                    Comparing {comparedProjects.length} Project{comparedProjects.length > 1 ? 's' : ''}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    You can select up to 3 projects for comparison.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={clearCompare}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-[#f12131] transition-all shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Clear All
                  </button>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-full bg-[#29247c] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#382b88] transition-all shadow-sm"
                  >
                    + Add More Projects
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto rounded-[32px] border border-slate-200/80 bg-white shadow-xl">
                <table className="w-full min-w-[768px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="w-1/4 p-6 text-sm font-extrabold uppercase tracking-wider text-slate-500">
                        Feature / Property
                      </th>
                      {comparedProjects.map((project) => (
                        <th key={project.id} className="w-1/4 p-6 relative group align-top">
                          <button
                            onClick={() => toggleCompare(project.id)}
                            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-[#f12131] transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <div className="relative h-44 w-full overflow-hidden rounded-2xl mb-4 shadow-md">
                            <img
                              src={project.image}
                              alt={project.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-3 left-3 rounded-full bg-[#f12131] px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
                              {project.bhk}
                            </span>
                          </div>

                          <h3 className="text-xl font-extrabold text-[#29247c]">
                            {project.name}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#f12131]" /> {project.location}
                          </p>

                          <div className="mt-4 flex items-center gap-2">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="flex-1 rounded-full bg-[#f12131] py-2.5 text-center text-xs font-extrabold text-white hover:bg-[#d91d2c] transition-all shadow-sm"
                            >
                              View Project
                            </Link>
                            <button
                              onClick={() => toggleWishlist(project.id)}
                              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                                isInWishlist(project.id)
                                  ? 'bg-[#f12131] border-[#f12131] text-white'
                                  : 'border-slate-200 text-slate-700 hover:bg-red-50 hover:text-[#f12131]'
                              }`}
                              title="Wishlist"
                            >
                              <Heart className={`h-4 w-4 ${isInWishlist(project.id) ? 'fill-white' : ''}`} />
                            </button>
                          </div>
                        </th>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <th key={idx} className="w-1/4 p-6 border-l border-dashed border-slate-200 bg-slate-50/20 text-center align-middle">
                          <Link
                            href="/projects"
                            className="inline-flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#29247c] transition-colors p-8"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-slate-300">
                              +
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Select Project</span>
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        <Tag className="inline h-4 w-4 mr-2 text-[#29247c]" /> Project Status
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id} className="p-6 font-extrabold text-[#29247c]">
                          <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs text-emerald-700 border border-emerald-200">
                            {project.status}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        <Building className="inline h-4 w-4 mr-2 text-[#29247c]" /> Category / Type
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id} className="p-6 font-semibold text-slate-800">
                          {project.type || 'Apartments'}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Configuration
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id} className="p-6 font-extrabold text-slate-900">
                          {project.bhk}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Address / Area
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id} className="p-6 text-slate-700 font-medium leading-relaxed">
                          {project.address}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Budget / Pricing
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id} className="p-6 font-extrabold text-lg text-[#f12131]">
                          ₹{project.budget}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Highlights & Overview
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id} className="p-6 text-slate-600 text-xs leading-relaxed">
                          {project.description}
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Key Features
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id} className="p-6">
                          <ul className="space-y-2 text-xs font-semibold text-slate-700">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Prime Location Access
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> CMDA & RERA Approved
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> 24/7 Security & Gated
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> High ROI Potential
                            </li>
                          </ul>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Inquire Now
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id} className="p-6">
                          <Link
                            href="/contact-us"
                            className="block w-full text-center rounded-full bg-[#29247c] py-3 text-xs font-extrabold text-white hover:bg-[#382b88] transition-all shadow-md"
                          >
                            Schedule Site Visit
                          </Link>
                        </td>
                      ))}
                      {Array.from({ length: 3 - comparedProjects.length }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}
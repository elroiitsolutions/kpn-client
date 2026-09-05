'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData } from '@/data/siteData';
import { useWishlistCompare } from '@/context/WishlistCompareContext';
import { Heart, Trash2, Scale, ArrowRight, MapPin } from 'lucide-react';
import FadeIn from '@/components/animation/FadeIn';

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist, clearWishlist, toggleCompare, isInCompare } = useWishlistCompare();

  const savedProjects = projectsData.filter((p) => wishlistIds.includes(p.id));

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title="Your Saved Wishlist"
        breadcrumb="Wishlist"
        description="Your handpicked collection of preferred properties. Save, compare, and inquire anytime."
        image="/images/projects/project_2.jpg"
      />

      <section className="bg-slate-50 min-h-screen px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          {savedProjects.length === 0 ? (
            <FadeIn direction="up">
              <div className="rounded-[36px] border border-slate-200/80 bg-white p-12 text-center shadow-xl max-w-2xl mx-auto my-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[#f12131] mb-6">
                  <Heart className="h-10 w-10 fill-[#f12131]" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#29247c]">
                  Your Wishlist is Empty
                </h2>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  You haven't saved any projects to your wishlist yet. Explore our developments and click the heart icon to save your favorites.
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
                    Saved Projects ({savedProjects.length})
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Manage your saved shortlist or send an inquiry.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={clearWishlist}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-[#f12131] transition-all shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Clear Wishlist
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative overflow-hidden rounded-[32px] bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-4 left-4 rounded-full bg-[#f12131] px-4 py-1.5 text-xs font-extrabold text-white shadow-md">
                        {project.bhk}
                      </span>
                      <button
                        onClick={() => toggleWishlist(project.id)}
                        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-md hover:bg-red-500 hover:text-white transition-all"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-200">
                            {project.status}
                          </span>
                          <span className="text-[#f12131] text-sm font-extrabold">₹{project.budget}</span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-[#29247c]">
                          {project.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-[#f12131]" /> {project.location}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="flex-1 text-center rounded-full bg-[#29247c] py-3 text-xs font-extrabold text-white hover:bg-[#382b88] transition-all shadow-md"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => toggleCompare(project.id)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                            isInCompare(project.id)
                              ? 'bg-[#382b88] border-[#382b88] text-white'
                              : 'border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-[#382b88]'
                          }`}
                          title="Compare"
                        >
                          <Scale className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}
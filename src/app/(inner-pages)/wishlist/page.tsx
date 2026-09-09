'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData, ProjectItem } from '@/data/siteData';
import { getProjects } from '@/lib/cmsClient';
import { useWishlistCompare } from '@/context/WishlistCompareContext';
import { Heart, Trash2, Scale, ArrowRight, MapPin } from 'lucide-react';
import FadeIn from '@/components/animation/FadeIn';

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist, clearWishlist, toggleCompare, isInCompare } =
    useWishlistCompare();

  const [allProjects, setAllProjects] = useState<ProjectItem[]>(projectsData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamic() {
      try {
        const data = await getProjects();
        if (isMounted && data && data.length > 0) {
          const mergedMap = new Map<string, ProjectItem>();
          projectsData.forEach((p) => {
            mergedMap.set(p.id, p);
            if (p.slug) mergedMap.set(p.slug, p);
          });
          data.forEach((p: any) => {
            const pid = p._id || p.id;
            mergedMap.set(pid, p);
            if (p.slug) mergedMap.set(p.slug, p);
          });
          setAllProjects(Array.from(new Set(Array.from(mergedMap.values()))));
        }
      } catch (err) {
        console.warn('[WishlistPage] Failed to fetch dynamic projects:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDynamic();
    return () => {
      isMounted = false;
    };
  }, []);

  const savedProjects = useMemo(() => {
    if (!wishlistIds || wishlistIds.length === 0) return [];
    const matched: ProjectItem[] = [];
    const seenSlugs = new Set<string>();

    wishlistIds.forEach((wid) => {
      const found = allProjects.find(
        (p: any) =>
          p.id === wid ||
          p._id === wid ||
          p.slug === wid ||
          (p.slug && wid.includes(p.slug))
      );
      if (found && !seenSlugs.has(found.slug || found.id)) {
        seenSlugs.add(found.slug || found.id);
        matched.push(found);
      }
    });

    return matched;
  }, [allProjects, wishlistIds]);

  const handleRemoveWishlist = (project: any) => {
    const candidates = [project.id, project._id, project.slug].filter(Boolean);
    const matchedId = candidates.find((c) => wishlistIds.includes(c));
    if (matchedId) {
      toggleWishlist(matchedId);
    } else {
      toggleWishlist(project.id);
    }
  };

  const isProjectInCompare = (project: any) => {
    return (
      isInCompare(project.id) ||
      (project._id && isInCompare(project._id)) ||
      (project.slug && isInCompare(project.slug))
    );
  };

  const handleToggleCompare = (project: any) => {
    toggleCompare(project.id || project._id || project.slug);
  };

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title="Your Saved Wishlist"
        breadcrumb="Wishlist"
        description="Your handpicked collection of preferred properties. Save, compare, and inquire anytime."
        image="/images/projects/project_2.jpg"
      />

      <section className="bg-slate-50 min-h-screen px-4 py-16 sm:px-6 lg:px-10 lg:py-24 font-sans">
        <div className="mx-auto max-w-[1500px]">
          {isLoading && wishlistIds.length > 0 && savedProjects.length === 0 ? (
            <div className="rounded-[36px] border border-slate-200/80 bg-white p-16 text-center shadow-xl max-w-2xl mx-auto my-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#29247c] border-t-transparent mx-auto mb-4" />
              <h3 className="text-xl font-black text-[#29247c] font-heading">
                Loading Your Wishlist...
              </h3>
            </div>
          ) : savedProjects.length === 0 ? (
            <FadeIn direction="up">
              <div className="rounded-[36px] border border-slate-200/80 bg-white p-12 text-center shadow-xl max-w-2xl mx-auto my-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[#f12131] mb-6">
                  <Heart className="h-10 w-10 fill-[#f12131]" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#29247c] font-heading">
                  Your Wishlist is Empty
                </h2>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  You haven't saved any projects to your wishlist yet. Explore our developments (Villas, Apartments, and Plots) and click the heart icon to save your favorites.
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
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#29247c] font-heading">
                    Saved Properties ({savedProjects.length})
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Manage your saved shortlist, compare specifications, or schedule a site visit.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-[#f12131] transition-all shadow-sm cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" /> Clear Wishlist
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedProjects.map((project) => (
                  <div
                    key={project.id || project.slug}
                    className="group relative overflow-hidden rounded-[32px] bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                      <img
                        src={project.image || '/images/projects/project_1.jpg'}
                        alt={project.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-1">
                        <span className="rounded-full bg-[#f12131] px-4 py-1.5 text-xs font-extrabold text-white shadow-md">
                          {project.bhk}
                        </span>
                        <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                          {project.type || (project as any).propertyType || 'Property'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveWishlist(project)}
                        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md backdrop-blur-md hover:bg-red-500 hover:text-white transition-all cursor-pointer z-10"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-200">
                            {project.status || 'Ongoing'}
                          </span>
                          <span className="text-[#f12131] text-sm font-extrabold font-heading">
                            {String(project.budget || '').startsWith('₹')
                              ? project.budget
                              : `₹ ${project.budget}`}
                          </span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-[#29247c] font-heading">
                          {project.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-[#f12131] shrink-0" /> {project.location}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="flex-1 text-center rounded-full bg-[#29247c] hover:bg-[#1f1b63] py-3 text-xs font-extrabold text-white transition-all shadow-md"
                        >
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleCompare(project)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all cursor-pointer ${
                            isProjectInCompare(project)
                              ? 'bg-[#382b88] border-[#382b88] text-white'
                              : 'border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-[#382b88]'
                          }`}
                          title={isProjectInCompare(project) ? 'Remove from Compare' : 'Add to Compare'}
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
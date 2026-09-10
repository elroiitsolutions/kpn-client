'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData, ProjectItem } from '@/data/siteData';
import { getProjects } from '@/lib/cmsClient';
import { useWishlistCompare } from '@/context/WishlistCompareContext';
import {
  Scale,
  Trash2,
  Heart,
  ArrowRight,
  CheckCircle,
  Building,
  MapPin,
  Tag,
  Home,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import FadeIn from '@/components/animation/FadeIn';

export default function ComparePage() {
  const { compareIds, toggleCompare, clearCompare, toggleWishlist, isInWishlist } =
    useWishlistCompare();

  const [allProjects, setAllProjects] = useState<ProjectItem[]>(projectsData);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live dynamic projects from backend CMS API with fallback to siteData
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicProjects() {
      try {
        const data = await getProjects();
        if (isMounted && data && data.length > 0) {
          // Merge dynamic projects with static siteData to guarantee all IDs match
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
        console.warn('[ComparePage] Could not load dynamic projects:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDynamicProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter compared projects based on compareIds (supporting id, _id, or slug)
  const comparedProjects = useMemo(() => {
    if (!compareIds || compareIds.length === 0) return [];
    
    // Find unique matched projects
    const matched: ProjectItem[] = [];
    const seenSlugs = new Set<string>();

    compareIds.forEach((cid) => {
      const found = allProjects.find(
        (p: any) =>
          p.id === cid ||
          p._id === cid ||
          p.slug === cid ||
          (p.slug && cid.includes(p.slug))
      );
      if (found && !seenSlugs.has(found.slug || found.id)) {
        seenSlugs.add(found.slug || found.id);
        matched.push(found);
      }
    });

    return matched;
  }, [allProjects, compareIds]);

  const handleRemoveCompare = (project: any) => {
    // Find which matching ID exists in compareIds and remove it
    const candidates = [project.id, project._id, project.slug].filter(Boolean);
    const matchedId = candidates.find((c) => compareIds.includes(c));
    if (matchedId) {
      toggleCompare(matchedId);
    } else {
      toggleCompare(project.id);
    }
  };

  const isProjectInWishlist = (project: any) => {
    return (
      isInWishlist(project.id) ||
      (project._id && isInWishlist(project._id)) ||
      (project.slug && isInWishlist(project.slug))
    );
  };

  const handleToggleWishlist = (project: any) => {
    toggleWishlist(project.id || project._id || project.slug);
  };

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title="Compare Projects"
        breadcrumb="Compare"
        description="Side-by-side analysis of key specifications, pricing, amenities, and location details to help you choose your ideal home."
        image="/images/projects/project_1.jpg"
      />

      <section className="bg-slate-50 min-h-screen px-4 py-16 sm:px-6 lg:px-10 lg:py-24 font-sans">
        <div className="mx-auto max-w-[1500px]">
          {isLoading && compareIds.length > 0 && comparedProjects.length === 0 ? (
            /* Loading State */
            <div className="rounded-[36px] border border-slate-200/80 bg-white p-16 text-center shadow-xl max-w-2xl mx-auto my-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#29247c] border-t-transparent mx-auto mb-4" />
              <h3 className="text-xl font-black text-[#29247c] font-heading">
                Loading Compared Properties...
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Fetching specifications, villa details, and latest availability.
              </p>
            </div>
          ) : comparedProjects.length === 0 ? (
            /* Empty State */
            <FadeIn direction="up">
              <div className="rounded-[36px] border border-slate-200/80 bg-white p-12 text-center shadow-xl max-w-2xl mx-auto my-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[#f12131] mb-6">
                  <Scale className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#29247c] font-heading">
                  No Projects Selected for Comparison
                </h2>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  Browse our properties (Villas, Apartments, or Plots) and click the scale icon on up to 3 properties to evaluate them side-by-side.
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
            /* Comparison Table */
            <FadeIn direction="up">
              <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#29247c] font-heading">
                      Comparing {comparedProjects.length} Property{comparedProjects.length > 1 ? 'ies' : ''}
                    </h2>
                    <span className="rounded-full bg-indigo-50 border border-indigo-200/80 px-3 py-1 text-xs font-black text-[#29247c]">
                      {comparedProjects.map((p) => p.type || (p as any).propertyType).join(' vs ')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Side-by-side comparison of pricing, configuration, location, and structural highlights.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={clearCompare}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-[#f12131] transition-all shadow-sm cursor-pointer"
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
                      <th className="w-1/4 p-6 text-xs font-extrabold uppercase tracking-wider text-slate-500 font-heading">
                        Feature / Property
                      </th>
                      {comparedProjects.map((project) => (
                        <th key={project.id || project.slug} className="w-1/4 p-6 relative group align-top">
                          <button
                            type="button"
                            onClick={() => handleRemoveCompare(project)}
                            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-[#f12131] transition-colors cursor-pointer z-10"
                            title="Remove from comparison"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-4 shadow-md bg-slate-100">
                            <img
                              src={project.image || '/images/projects/project_1.jpg'}
                              alt={project.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 flex flex-col gap-1">
                              <span className="rounded-full bg-[#f12131] px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
                                {project.bhk}
                              </span>
                              <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                {project.type || (project as any).propertyType || 'Property'}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xl font-extrabold text-[#29247c] font-heading">
                            {project.name}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#f12131] shrink-0" /> {project.location}
                          </p>

                          <div className="mt-4 flex items-center gap-2">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="flex-1 rounded-full bg-[#f12131] py-2.5 text-center text-xs font-extrabold text-white hover:bg-[#d91d2c] transition-all shadow-sm"
                            >
                              View Details
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleToggleWishlist(project)}
                              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all cursor-pointer ${
                                isProjectInWishlist(project)
                                  ? 'bg-[#f12131] border-[#f12131] text-white'
                                  : 'border-slate-200 text-slate-700 hover:bg-red-50 hover:text-[#f12131]'
                              }`}
                              title="Wishlist"
                            >
                              <Heart className={`h-4 w-4 ${isProjectInWishlist(project) ? 'fill-white' : ''}`} />
                            </button>
                          </div>
                        </th>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <th
                          key={idx}
                          className="w-1/4 p-6 border-l border-dashed border-slate-200 bg-slate-50/20 text-center align-middle"
                        >
                          <Link
                            href="/projects"
                            className="inline-flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#29247c] transition-colors p-8 group"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-slate-300 group-hover:border-[#29247c] group-hover:bg-indigo-50 transition-all">
                              +
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider font-heading">
                              Select Property
                            </span>
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {/* Row: Status */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        <Tag className="inline h-4 w-4 mr-2 text-[#29247c]" /> Project Status
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id || project.slug} className="p-6 font-extrabold text-[#29247c]">
                          <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs text-emerald-700 border border-emerald-200 font-bold">
                            {project.status || 'Ongoing'}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    {/* Row: Property Type */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        <Building className="inline h-4 w-4 mr-2 text-[#29247c]" /> Category / Type
                      </td>
                      {comparedProjects.map((project) => {
                        const pType = project.type || (project as any).propertyType || 'Apartments';
                        return (
                          <td key={project.id || project.slug} className="p-6 font-extrabold text-slate-800">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                              pType === 'Villas'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : pType === 'Plots'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {pType}
                            </span>
                          </td>
                        );
                      })}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    {/* Row: Configuration */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        <Home className="inline h-4 w-4 mr-2 text-[#29247c]" /> Configuration
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id || project.slug} className="p-6 font-extrabold text-slate-900 text-base">
                          {project.bhk}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    {/* Row: Units / Inventory Scale */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        <Layers className="inline h-4 w-4 mr-2 text-[#29247c]" /> Structure & Units
                      </td>
                      {comparedProjects.map((project) => {
                        const pType = project.type || (project as any).propertyType || 'Apartments';
                        const unitsCount =
                          project.totalUnits ||
                          (project as any).details?.units ||
                          (pType === 'Villas' ? '12 Luxury Villas' : pType === 'Plots' ? '28 Plots' : '25 Units');

                        return (
                          <td key={project.id || project.slug} className="p-6 text-slate-800 font-bold text-xs">
                            <div>{unitsCount}</div>
                            {project.availableUnits ? (
                              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                                {project.availableUnits} Available
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    {/* Row: Budget / Pricing */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Budget / Pricing
                      </td>
                      {comparedProjects.map((project) => {
                        const budgetDisplay = String(project.budget || '').startsWith('₹')
                          ? project.budget
                          : `₹ ${project.budget}`;
                        return (
                          <td key={project.id || project.slug} className="p-6 font-black text-xl text-[#f12131] font-heading">
                            {budgetDisplay}
                          </td>
                        );
                      })}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    {/* Row: Address / Area */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Address / Location
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id || project.slug} className="p-6 text-slate-700 font-medium text-xs leading-relaxed">
                          <strong className="block font-bold text-slate-900 mb-0.5">{project.location}</strong>
                          {project.address || project.location}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    {/* Row: Overview Description */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Overview & Highlights
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id || project.slug} className="p-6 text-slate-600 text-xs leading-relaxed">
                          {project.description ||
                            `${project.name} is a premier ${project.type || (project as any).propertyType || 'development'} offering premium amenities, strategic location connectivity, and high appreciation value.`}
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    {/* Row: Key Features */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Key Features
                      </td>
                      {comparedProjects.map((project) => {
                        const pType = project.type || (project as any).propertyType || 'Apartments';
                        return (
                          <td key={project.id || project.slug} className="p-6">
                            <ul className="space-y-2 text-xs font-semibold text-slate-700">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                {pType === 'Villas'
                                  ? 'Private Garden & Terrace Living'
                                  : pType === 'Plots'
                                  ? 'Immediate Construction & Clear Title'
                                  : 'RCC Framed Earthquake Resistant'}
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                CMDA / DTCP & RERA Approved
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                24/7 Gated Security & Blacktop Roads
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                100% Vaastu Compliant Layout
                              </li>
                            </ul>
                          </td>
                        );
                      })}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
                        <td key={idx} className="p-6 bg-slate-50/10"></td>
                      ))}
                    </tr>

                    {/* Row: Inquire & Book */}
                    <tr>
                      <td className="p-6 font-bold text-slate-700 bg-slate-50/30">
                        Take Action
                      </td>
                      {comparedProjects.map((project) => (
                        <td key={project.id || project.slug} className="p-6">
                          <div className="space-y-2">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="block w-full text-center rounded-full bg-[#f12131] hover:bg-[#d91d2c] py-2.5 text-xs font-black text-white transition-all shadow-md"
                            >
                              Explore Units & Book
                            </Link>
                            <Link
                              href="/contact-us"
                              className="block w-full text-center rounded-full bg-[#29247c] hover:bg-[#1f1b63] py-2 text-[11px] font-bold text-white transition-all shadow-sm"
                            >
                              Schedule Site Visit
                            </Link>
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProjects.length) }).map((_, idx) => (
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
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData } from '@/data/siteData';
import { MapPin, ChevronDown, Heart, Scale } from 'lucide-react';
import FadeIn from '@/components/animation/FadeIn';
import { useWishlistCompare } from '@/context/WishlistCompareContext';

export default function ProjectsPage() {
  const { toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useWishlistCompare();
  // Category tabs state: 'All' | 'Apartments' | 'Plots'"
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 4;

  // Filter dropdown state
  const [filters, setFilters] = useState({
    status: 'All',
    type: 'All',
    location: 'All',
    budget: 'All',
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      // Category tab filter
      if (selectedCategory !== 'All' && project.type !== selectedCategory) {
        return false;
      }
      // Status filter
      if (
        appliedFilters.status !== 'All' &&
        project.status !== appliedFilters.status
      ) {
        return false;
      }
      // Type filter
      if (
        appliedFilters.type !== 'All' &&
        project.type !== appliedFilters.type
      ) {
        return false;
      }
      // Location filter
      if (
        appliedFilters.location !== 'All' &&
        !project.location.includes(appliedFilters.location)
      ) {
        return false;
      }
      // Budget filter
      if (
        appliedFilters.budget !== 'All' &&
        project.budget !== appliedFilters.budget
      ) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, appliedFilters]);

  // Paginated Projects slice for current page
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage, ITEMS_PER_PAGE]);

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title="Our Projects"
        breadcrumb="Projects"
        description="Explore landmark real estate developments engineered for modern luxury living and lasting value."
        image="/images/projects/project_6.jpg"
      />

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1500px]">

          {/* =========================================================
              CATEGORY TOGGLE TABS (APARTMENTS & PLOTS)
          ========================================================= */}
          <FadeIn direction="up" className="mb-12 flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              {['All', 'Apartments', 'Plots', 'Commercial', 'Industrial', 'Villas'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                    if (cat !== 'All') {
                      setFilters((prev) => ({ ...prev, type: cat }));
                      setAppliedFilters((prev) => ({ ...prev, type: cat }));
                    } else {
                      setFilters((prev) => ({ ...prev, type: 'All' }));
                      setAppliedFilters((prev) => ({ ...prev, type: 'All' }));
                    }
                  }}
                  className={`h-12 px-7 rounded-full text-sm font-extrabold transition-all duration-300 ${selectedCategory === cat
                      ? 'bg-[#f12131] text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                >
                  {cat === 'All' ? 'All Projects' : cat}
                </button>
              ))}
            </div>

            <p className="text-sm font-semibold text-slate-500">
              Showing <span className="text-slate-900 font-bold">{paginatedProjects.length}</span> of {filteredProjects.length} Projects (Page {currentPage} of {totalPages})
            </p>
          </FadeIn>

          {/* =========================================================
              MAIN TWO-COLUMN GRID (PROJECT CARDS + STICKY FILTER)
          ========================================================= */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

            {/* -----------------------------------------------------
                LEFT COLUMN: PROJECT CARDS LIST
            ----------------------------------------------------- */}
            <div className="space-y-8 lg:col-span-8">
              {filteredProjects.length === 0 ? (
                <div className="rounded-[32px] border border-dashed border-slate-300 p-16 text-center">
                  <h3 className="text-xl font-bold text-slate-800">
                    No projects found matching your criteria
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Try clearing filters to see more properties.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setCurrentPage(1);
                      setFilters({
                        status: 'All',
                        type: 'All',
                        location: 'All',
                        budget: 'All',
                      });
                      setAppliedFilters({
                        status: 'All',
                        type: 'All',
                        location: 'All',
                        budget: 'All',
                      });
                    }}
                    className="mt-6 rounded-full bg-[#f12131] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                paginatedProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="
                      group
                      relative
                      block
                      h-[390px]
                      w-full
                      overflow-hidden
                      rounded-[32px]
                      bg-slate-200
                      shadow-lg
                      transition-all
                      duration-500
                      hover:shadow-2xl
                      sm:h-[520px]
                      lg:h-[625px]
                    "
                  >
                    {/* Main project image */}
                    <img
                      src={project.image}
                      alt={project.name}
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        object-center
                        transition-transform
                        duration-700
                        group-hover:scale-[1.03]
                      "
                    />

                    {/* =====================================================
                        RIGHT FLOATING PANEL
                    ====================================================== */}
                    <div
                      className="
                        absolute
                        bottom-3
                        right-3
                        top-3
                        z-10
                        w-[48%]
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-white/30
                        shadow-xl
                        sm:bottom-4
                        sm:right-4
                        sm:top-4
                        sm:w-[48%]
                      "
                    >
                      {/* =================================================
                          NORMAL STATE - BLURRED IMAGE
                      ================================================= */}
                      <img
                        src={project.image}
                        alt=""
                        aria-hidden="true"
                        className="
                          absolute
                          inset-0
                          h-full
                          w-full
                          scale-110
                          object-cover
                          object-center
                          blur-[18px]
                          transition-opacity
                          duration-500
                          group-hover:opacity-0
                        "
                      />

                      {/* Normal glass background */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-white/20
                          backdrop-blur-[3px]
                          transition-opacity
                          duration-500
                          group-hover:opacity-0
                        "
                      />

                      {/* =================================================
                          HOVER RED BACKGROUND
                      ================================================= */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-[#f12131]
                          opacity-0
                          transition-opacity
                          duration-500
                          group-hover:opacity-100
                        "
                      />

                      {/* =================================================
                          CONTENT
                      ================================================= */}
                      <div
                        className="
                          relative
                          flex
                          h-full
                          flex-col
                          justify-between
                          p-6
                          sm:p-8
                          lg:p-10
                        "
                      >
                        {/* TOP BADGE & ACTION BUTTONS */}
                        <div className="flex items-center justify-between">
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-full
                              bg-[#f12131]
                              px-6
                              py-3
                              text-xs
                              font-black
                              tracking-wide
                              text-white
                              shadow-md
                              transition-all
                              duration-500
                              group-hover:bg-white
                              group-hover:text-black
                            "
                          >
                            {project.bhk}
                          </span>

                          {/* Wishlist & Compare Buttons */}
                          <div className="flex items-center gap-2 z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(project.id);
                              }}
                              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 ${
                                isInWishlist(project.id)
                                  ? 'bg-[#f12131] text-white scale-110'
                                  : 'bg-white/80 text-slate-800 hover:bg-white hover:text-[#f12131]'
                              }`}
                              title={isInWishlist(project.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            >
                              <Heart className={`h-5 w-5 ${isInWishlist(project.id) ? 'fill-white' : ''}`} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleCompare(project.id);
                              }}
                              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 ${
                                isInCompare(project.id)
                                  ? 'bg-[#382b88] text-white scale-110'
                                  : 'bg-white/80 text-slate-800 hover:bg-white hover:text-[#382b88]'
                              }`}
                              title={isInCompare(project.id) ? 'Remove from Compare' : 'Add to Compare'}
                            >
                              <Scale className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* BOTTOM CONTENT */}
                        <div className="space-y-6">
                          {/* Location */}
                          <div className="flex items-center gap-3">
                            <MapPin
                              className="
                                h-5
                                w-5
                                shrink-0
                                text-[#f12131]
                                transition-colors
                                duration-500
                                group-hover:text-black
                              "
                            />
                            <span
                              className="
                                text-base
                                font-bold
                                text-white
                                drop-shadow-md
                                transition-colors
                                duration-500
                                sm:text-lg
                                group-hover:text-black
                                group-hover:drop-shadow-none
                              "
                            >
                              {project.location}
                            </span>
                          </div>

                          {/* Divider */}
                          <div
                            className="
                              h-px
                              w-full
                              bg-white/60
                              transition-colors
                              duration-500
                              group-hover:bg-black
                            "
                          />

                          {/* Project name */}
                          <h3
                            className="
                              text-3xl
                              font-extrabold
                              tracking-tight
                              text-white
                              drop-shadow-lg
                              transition-colors
                              duration-500
                              sm:text-4xl
                              lg:text-[44px]
                              lg:leading-tight
                              group-hover:text-black
                              group-hover:drop-shadow-none
                            "
                          >
                            {project.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}

              {/* Dynamic Pagination Controls */}
              {filteredProjects.length > 0 && (
                <div className="flex items-center gap-3 pt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold shadow-md transition-all ${currentPage === page
                          ? 'bg-[#f12131] text-white scale-105'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  {currentPage < totalPages && (
                    <button
                      onClick={() => {
                        setCurrentPage((prev) => prev + 1);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-extrabold text-slate-700 shadow-md border border-slate-200 transition-all hover:bg-slate-100"
                    >
                      &gt;
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* -----------------------------------------------------
                RIGHT COLUMN: STICKY FILTER SIDEBAR
            ----------------------------------------------------- */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6 rounded-[32px] border border-slate-100 bg-slate-50/90 p-8 shadow-sm">
                <h3 className="text-2xl font-extrabold tracking-tight text-[#29247c]">
                  Filter
                </h3>

                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="h-14 w-full appearance-none rounded-full border border-slate-200 bg-white px-7 text-sm font-bold text-slate-700 outline-none transition focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20 cursor-pointer"
                    >
                      <option value="All">Project Status</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Upcoming">Upcoming</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* Type Dropdown */}
                  <div className="relative">
                    <select
                      value={filters.type}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFilters({ ...filters, type: val });
                        if (val === 'Apartments' || val === 'Plots') {
                          setSelectedCategory(val);
                        } else {
                          setSelectedCategory('All');
                        }
                      }}
                      className="h-14 w-full appearance-none rounded-full border border-slate-200 bg-white px-7 text-sm font-bold text-slate-700 outline-none transition focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20 cursor-pointer"
                    >
                      <option value="All">Project Type</option>
                      <option value="Apartments">Apartments</option>
                      <option value="Plots">Plots</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Villas">Villas</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* Location Dropdown */}
                  <div className="relative">
                    <select
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                      className="h-14 w-full appearance-none rounded-full border border-slate-200 bg-white px-7 text-sm font-bold text-slate-700 outline-none transition focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20 cursor-pointer"
                    >
                      <option value="All">Project Location</option>
                      <option value="Urapakkam">Urapakkam, Chennai</option>
                      <option value="Guduvanchery">Guduvanchery, Chennai</option>
                      <option value="Vandalur">Vandalur, Chennai</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* Budget Dropdown */}
                  <div className="relative">
                    <select
                      value={filters.budget}
                      onChange={(e) =>
                        setFilters({ ...filters, budget: e.target.value })
                      }
                      className="h-14 w-full appearance-none rounded-full border border-slate-200 bg-white px-7 text-sm font-bold text-slate-700 outline-none transition focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20 cursor-pointer"
                    >
                      <option value="All">Project Budget</option>
                      <option value="20L - 40L">20L - 40L</option>
                      <option value="40L - 60L">40L - 60L</option>
                      <option value="60L - 80L">60L - 80L</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="h-14 w-full rounded-full bg-[#f12131] text-base font-extrabold text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg hover:scale-[1.02]"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}

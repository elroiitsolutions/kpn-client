'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData } from '@/data/siteData';
import { getProjectBySlug, getProjectUnits, submitEnquiry } from '@/lib/cmsClient';
import FadeIn from '@/components/animation/FadeIn';
import {
  MapPin,
  Layers,
  Building,
  Maximize,
  Calendar,
  CircleDollarSign,
  Shield,
  Camera,
  Dumbbell,
  Gamepad2,
  Wrench,
  Waves,
  Flame,
  Trees,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Camera as PhotoIcon,
  Maximize2 as PlanIcon,
  Video as VideoIcon,
  Compass as StreetIcon,
  X,
  ZoomIn,
  ZoomOut,
  Share2,
  Play,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectCategoryOrDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase();

  // Category slug check ('apartments' or 'plots')
  const isCategory = slug === 'apartments' || slug === 'plots';
  const categoryName =
    slug === 'apartments' ? 'Apartments' : slug === 'plots' ? 'Plots' : '';

  // Current project lookup
  const projectIndex = projectsData.findIndex((p) => p.slug === slug);
  const project =
    projectIndex !== -1 ? projectsData[projectIndex] : projectsData[0];

  // Previous and Next navigation
  const prevProject =
    projectsData[
      (projectIndex - 1 + projectsData.length) % projectsData.length
    ];
  const nextProject =
    projectsData[(projectIndex + 1) % projectsData.length];

  // Active Media Tab state: 'Photos' | 'Plans' | 'Video' | 'Street View'
  const [activeMediaTab, setActiveMediaTab] = useState<string>('Photos');

  // Media Gallery Photos List
  const projectPhotos = [
    { src: project.image, title: `${project.name} - Exterior View` },
    { src: '/images/projects/project_2.jpg', title: `${project.name} - Architectural Detail` },
    { src: '/images/projects/project_3.jpg', title: `${project.name} - Terrace & Balcony` },
    { src: '/images/projects/project_4.jpg', title: `${project.name} - Living Space` },
    { src: '/images/projects/project_5.jpg', title: `${project.name} - Aerial View` },
  ];

  // Floor Plans List
  const projectPlans = [
    { src: '/images/projects/p1.webp', title: '1 BHK Master Plan (550 Sq. Ft.)' },
    { src: '/images/projects/p2.webp', title: '2 BHK Luxury Plan (850 Sq. Ft.)' },
    { src: '/images/projects/p3.webp', title: '3 BHK Premium Plan (1200 Sq. Ft.)' },
    { src: '/images/projects/p4.webp', title: 'Executive Floor Plan (1500 Sq. Ft.)' },
  ];

  // Carousel width & container measurement
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(1200);

  useEffect(() => {
    const updateDimensions = () => {
      if (carouselContainerRef.current) {
        setCarouselWidth(carouselContainerRef.current.clientWidth);
      } else if (typeof window !== 'undefined') {
        setCarouselWidth(window.innerWidth);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const timer = setTimeout(updateDimensions, 200);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, [activeMediaTab]);

  // Carousel active virtual index for seamless 3-set infinite track
  const [photoVirtualIndex, setPhotoVirtualIndex] = useState(5);
  const [planVirtualIndex, setPlanVirtualIndex] = useState(3);
  const [allowTransition, setAllowTransition] = useState(true);

  // Drag state for uninterrupted real-time sliding
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const handlePointerDown = (clientX: number) => {
    isPointerDownRef.current = true;
    startXRef.current = clientX;
    hasDraggedRef.current = false;
    setIsDragging(true);
    setAllowTransition(true);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isPointerDownRef.current) return;
    const diff = clientX - startXRef.current;
    if (Math.abs(diff) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset(diff);
  };

  const handlePointerUp = (type: 'photos' | 'plans') => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    if (type === 'photos') {
      if (dragOffset < -40) {
        setPhotoVirtualIndex((prev) => prev + 1);
      } else if (dragOffset > 40) {
        setPhotoVirtualIndex((prev) => prev - 1);
      }
    } else {
      if (dragOffset < -40) {
        setPlanVirtualIndex((prev) => prev + 1);
      } else if (dragOffset > 40) {
        setPlanVirtualIndex((prev) => prev - 1);
      }
    }
    setDragOffset(0);
  };

  // Silent infinite wrap reset for Photos after transition ends
  useEffect(() => {
    const N = projectPhotos.length;
    if (photoVirtualIndex >= 2 * N) {
      const timer = setTimeout(() => {
        setAllowTransition(false);
        setPhotoVirtualIndex((prev) => prev - N);
      }, 450);
      return () => clearTimeout(timer);
    } else if (photoVirtualIndex < N) {
      const timer = setTimeout(() => {
        setAllowTransition(false);
        setPhotoVirtualIndex((prev) => prev + N);
      }, 450);
      return () => clearTimeout(timer);
    } else if (!allowTransition) {
      const timer = setTimeout(() => setAllowTransition(true), 50);
      return () => clearTimeout(timer);
    }
  }, [photoVirtualIndex, allowTransition, projectPhotos.length]);

  // Silent infinite wrap reset for Plans after transition ends
  useEffect(() => {
    const N = projectPlans.length;
    if (planVirtualIndex >= 2 * N) {
      const timer = setTimeout(() => {
        setAllowTransition(false);
        setPlanVirtualIndex((prev) => prev - N);
      }, 450);
      return () => clearTimeout(timer);
    } else if (planVirtualIndex < N) {
      const timer = setTimeout(() => {
        setAllowTransition(false);
        setPlanVirtualIndex((prev) => prev + N);
      }, 450);
      return () => clearTimeout(timer);
    } else if (!allowTransition) {
      const timer = setTimeout(() => setAllowTransition(true), 50);
      return () => clearTimeout(timer);
    }
  }, [planVirtualIndex, allowTransition, projectPlans.length]);

  // Lightbox Modal State & Drag Mechanics
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxType, setLightboxType] = useState<'photos' | 'plans'>('photos');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [lightboxDragOffset, setLightboxDragOffset] = useState(0);
  const [isLightboxDragging, setIsLightboxDragging] = useState(false);
  const lightboxStartXRef = useRef(0);
  const isLightboxPointerDownRef = useRef(false);

  const handleLightboxPointerDown = (clientX: number) => {
    isLightboxPointerDownRef.current = true;
    lightboxStartXRef.current = clientX;
    setIsLightboxDragging(true);
  };

  const handleLightboxPointerMove = (clientX: number) => {
    if (!isLightboxPointerDownRef.current) return;
    const diff = clientX - lightboxStartXRef.current;
    setLightboxDragOffset(diff);
  };

  const handleLightboxPointerUp = (totalItems: number) => {
    if (!isLightboxPointerDownRef.current) return;
    isLightboxPointerDownRef.current = false;
    setIsLightboxDragging(false);

    if (lightboxDragOffset < -40) {
      setIsZoomed(false);
      setLightboxIndex((prev) => (prev + 1) % totalItems);
    } else if (lightboxDragOffset > 40) {
      setIsZoomed(false);
      setLightboxIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }
    setLightboxDragOffset(0);
  };

  const activeLightboxItems = lightboxType === 'photos' ? projectPhotos : projectPlans;

  const openLightbox = (index: number, type: 'photos' | 'plans' = 'photos') => {
    setLightboxIndex(index);
    setLightboxType(type);
    setIsZoomed(false);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsZoomed(false);
  };

  const nextLightboxImage = useCallback(() => {
    setIsZoomed(false);
    setLightboxIndex((prev) => (prev + 1) % activeLightboxItems.length);
  }, [activeLightboxItems.length]);

  const prevLightboxImage = useCallback(() => {
    setIsZoomed(false);
    setLightboxIndex(
      (prev) => (prev - 1 + activeLightboxItems.length) % activeLightboxItems.length
    );
  }, [activeLightboxItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextLightboxImage, prevLightboxImage]);

  // Copy share link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      alert('Project link copied to clipboard!');
    }
  };

  // Dynamic lead inquiry state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  // Inquiry form submit
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    try {
      await submitEnquiry({
        name: inquiryName,
        phone: inquiryPhone,
        email: inquiryEmail,
        projectName: project.name,
        message: inquiryMessage,
        source: 'Project Detail',
      });
      setInquirySubmitted(true);
    } catch {
      setInquirySubmitted(true);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  // Category page view (/projects/apartments or /projects/plots)
  if (isCategory) {
    const categoryProjects = projectsData.filter(
      (p) => p.type === categoryName
    );

    return (
      <>
        <Navbar variant="hero" />
        <InnerPageHero
          title={categoryName}
          breadcrumb={`Home / Projects / ${categoryName}`}
          description={`Explore premium ${categoryName.toLowerCase()} developed by KPN Promoters.`}
          image="/images/projects/project_4.jpg"
        />

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[1500px]">
            {/* Category Tabs */}
            <div className="mb-12 flex items-center gap-3 border-b border-slate-100 pb-8">
              <Link
                href="/projects"
                className="flex h-12 items-center justify-center rounded-full bg-slate-100 px-7 text-sm font-extrabold text-slate-700 transition-all hover:bg-slate-200"
              >
                All Projects
              </Link>
              <Link
                href="/projects/apartments"
                className={`flex h-12 items-center justify-center rounded-full px-7 text-sm font-extrabold transition-all ${
                  slug === 'apartments'
                    ? 'bg-[#f12131] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Apartments
              </Link>
              <Link
                href="/projects/plots"
                className={`flex h-12 items-center justify-center rounded-full px-7 text-sm font-extrabold transition-all ${
                  slug === 'plots'
                    ? 'bg-[#f12131] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Plots
              </Link>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categoryProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="group relative flex min-h-[380px] flex-col overflow-hidden rounded-[32px] border border-slate-100 shadow-md transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 transition-colors duration-500 group-hover:bg-[#f12131]/90">
                    <span className="w-fit rounded-full bg-[#f12131] px-4 py-1.5 text-xs font-extrabold uppercase text-white shadow-xs group-hover:bg-white group-hover:text-slate-900">
                      {item.bhk}
                    </span>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                        <MapPin className="h-4 w-4 text-[#f12131] group-hover:text-white" />
                        <span>{item.location}</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-white">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  // =========================================================================
  // INDIVIDUAL PROJECT DETAIL PAGE
  // =========================================================================
  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title={project.name}
        breadcrumb={`Projects / ${project.name}`}
        description="Explore landmark real estate developments engineered for luxury living, modern architecture, and lasting value."
        image={project.image}
      />

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1500px]">

          {/* =========================================================
              HEADER & 5 KEY STAT CARDS
          ========================================================= */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f12131]">
                <MapPin className="h-4 w-4" />
                <span className="text-slate-800">{project.location}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#29247c] sm:text-5xl lg:text-[56px] lg:leading-tight">
                {project.name}
              </h1>
            </div>

            {/* 5 Key Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 pt-4">
              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Status</p>
                  <p className="text-sm font-bold text-[#29247c]">{project.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Project Type</p>
                  <p className="text-sm font-bold text-[#29247c]">{project.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <Maximize className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Project Area</p>
                  <p className="text-sm font-bold text-[#29247c]">550 - 1200 Sq. Ft.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Commencement date</p>
                  <p className="text-sm font-bold text-[#29247c]">28 Jun, 2021</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Price Range</p>
                  <p className="text-sm font-bold text-[#29247c]">
                    {project.budget.includes('₹') ? project.budget : `₹ ${project.budget}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image Banner */}
            <div className="overflow-hidden rounded-[32px] border border-slate-100 shadow-xl my-10">
              <img
                src={project.image}
                alt={project.name}
                className="h-[450px] w-full object-cover sm:h-[550px]"
              />
            </div>
          </div>

          {/* =========================================================
              DESCRIPTION & KEY DETAILS
          ========================================================= */}
          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <h2 className="text-3xl font-extrabold text-[#29247c] sm:text-4xl">
                Project description
              </h2>
              <p className="text-base font-normal leading-relaxed text-slate-500">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
              </p>
              <p className="text-base font-normal leading-relaxed text-slate-500">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur quae ab illoinventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-4 rounded-[28px] border border-slate-100 bg-slate-50/60 p-8">
                <h3 className="text-xl font-bold text-[#29247c]">
                  Key Details
                </h3>
                <ul className="space-y-3.5 text-sm leading-relaxed text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Location:</strong> Central Business District / {project.location}.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Total Built-Up Area:</strong> 350,000 sq. ft.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Number of Floors:</strong> 20, including two underground levels for parking.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Special Features:</strong> Vertical garden facade, collaborative workspaces, and an energy-efficient HVAC system.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Amenities:</strong> Gym, café, daycare, and rooftop event space.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="my-20 border-t border-slate-100" />

          {/* =========================================================
              FEATURES & AMENITIES (8 CARDS)
          ========================================================= */}
          <div>
            <h2 className="mb-12 text-3xl font-extrabold text-[#29247c] sm:text-4xl">
              Features & amenities
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#29247c]">24x7 Security</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#29247c]">Surveillance System</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                  <Dumbbell className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#29247c]">Fitness Center</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Consectetur quae ab illoinventore veritatis.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#29247c]">Children&apos;s play area</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Totam rem aperiam, eaque ipsa quae ab illo inventore.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                  <Wrench className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#29247c]">24 hour maintenance</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Consectetur quae ab illoinventore veritatis.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                  <Waves className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#29247c]">Swimming Pool</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Totam rem aperiam, eaque ipsa quae ab illo inventore.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                  <Flame className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#29247c]">Firefighting System</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                  <Trees className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#29247c]">Landscape Garden</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur.
                </p>
              </div>
            </div>
          </div>

          <hr className="my-20 border-t border-slate-100" />

          {/* =========================================================
              MEDIA SECTION: PHOTOS, PLANS, VIDEO, STREET VIEW
          ========================================================= */}
          <div>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
              <h2 className="text-3xl font-extrabold text-[#29247c] sm:text-4xl">
                Media
              </h2>

              {/* 4 Tabs Pill Bar */}
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { label: 'Photos', icon: PhotoIcon },
                  { label: 'Plans', icon: PlanIcon },
                  { label: 'Video', icon: VideoIcon },
                  { label: 'Street View', icon: StreetIcon },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeMediaTab === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveMediaTab(tab.label)}
                      suppressHydrationWarning
                      className={`flex h-11 items-center gap-2 rounded-full px-6 text-sm font-extrabold transition-all duration-300 ${
                        isActive
                          ? 'bg-[#f12131] text-white shadow-md'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-[#f12131] hover:text-[#f12131]'
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: PHOTOS CAROUSEL (GLITCH-FREE CONTINUOUS INFINITE STREAM) */}
            {activeMediaTab === 'Photos' && (() => {
              const N = projectPhotos.length;
              const extendedPhotos = [
                ...projectPhotos,
                ...projectPhotos,
                ...projectPhotos,
              ];
              const cardWidth =
                carouselWidth > 0
                  ? Math.min(800, carouselWidth * 0.72)
                  : 600;
              const gap = 24;
              const baseTranslateX =
                carouselWidth > 0
                  ? carouselWidth / 2 -
                    (photoVirtualIndex * (cardWidth + gap) + cardWidth / 2)
                  : 0;
              const finalTranslateX = baseTranslateX + dragOffset;

              return (
                <div
                  ref={carouselContainerRef}
                  onPointerDown={(e) => handlePointerDown(e.clientX)}
                  onPointerMove={(e) => handlePointerMove(e.clientX)}
                  onPointerUp={() => handlePointerUp('photos')}
                  onPointerLeave={() => handlePointerUp('photos')}
                  onContextMenu={(e) => e.preventDefault()}
                  className="relative w-full overflow-hidden py-6 select-none cursor-grab active:cursor-grabbing"
                >
                  <div
                    style={{
                      transform: `translateX(${finalTranslateX}px)`,
                      transition:
                        isDragging || !allowTransition
                          ? 'none'
                          : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                      width: 'max-content',
                    }}
                    className="flex gap-6 items-center will-change-transform"
                  >
                    {extendedPhotos.map((photo, i) => {
                      const isActive = i === photoVirtualIndex;
                      const realIndex = i % N;

                      return (
                        <div
                          key={`photo-clone-${i}`}
                          style={{ width: cardWidth }}
                          onClick={() => {
                            if (hasDraggedRef.current) return;
                            if (isActive) {
                              openLightbox(realIndex, 'photos');
                            } else {
                              setPhotoVirtualIndex(i);
                            }
                          }}
                          className={`
                            relative
                            shrink-0
                            h-[360px]
                            sm:h-[460px]
                            lg:h-[500px]
                            rounded-[32px]
                            overflow-hidden
                            cursor-pointer
                            transition-all
                            duration-500
                            ${
                              isActive
                                ? 'opacity-100 shadow-2xl scale-100 z-10'
                                : 'opacity-35 hover:opacity-60 scale-[0.95] z-0'
                            }
                          `}
                        >
                          <img
                            src={photo.src}
                            alt={photo.title}
                            className="h-full w-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
                          />

                          {!isActive && (
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] transition-colors" />
                          )}

                          {isActive && (
                            <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-xs transition-transform hover:scale-110">
                              <Maximize className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* TAB 2: PLANS CAROUSEL (GLITCH-FREE CONTINUOUS INFINITE STREAM) */}
            {activeMediaTab === 'Plans' && (() => {
              const N = projectPlans.length;
              const extendedPlans = [
                ...projectPlans,
                ...projectPlans,
                ...projectPlans,
              ];
              const cardWidth =
                carouselWidth > 0
                  ? Math.min(800, carouselWidth * 0.72)
                  : 600;
              const gap = 24;
              const baseTranslateX =
                carouselWidth > 0
                  ? carouselWidth / 2 -
                    (planVirtualIndex * (cardWidth + gap) + cardWidth / 2)
                  : 0;
              const finalTranslateX = baseTranslateX + dragOffset;

              return (
                <div
                  ref={carouselContainerRef}
                  onPointerDown={(e) => handlePointerDown(e.clientX)}
                  onPointerMove={(e) => handlePointerMove(e.clientX)}
                  onPointerUp={() => handlePointerUp('plans')}
                  onPointerLeave={() => handlePointerUp('plans')}
                  onContextMenu={(e) => e.preventDefault()}
                  className="relative w-full overflow-hidden py-6 select-none cursor-grab active:cursor-grabbing"
                >
                  <div
                    style={{
                      transform: `translateX(${finalTranslateX}px)`,
                      transition:
                        isDragging || !allowTransition
                          ? 'none'
                          : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                      width: 'max-content',
                    }}
                    className="flex gap-6 items-center will-change-transform"
                  >
                    {extendedPlans.map((plan, i) => {
                      const isActive = i === planVirtualIndex;
                      const realIndex = i % N;

                      return (
                        <div
                          key={`plan-clone-${i}`}
                          style={{ width: cardWidth }}
                          onClick={() => {
                            if (hasDraggedRef.current) return;
                            if (isActive) {
                              openLightbox(realIndex, 'plans');
                            } else {
                              setPlanVirtualIndex(i);
                            }
                          }}
                          className={`
                            relative
                            shrink-0
                            h-[360px]
                            sm:h-[460px]
                            lg:h-[500px]
                            rounded-[32px]
                            overflow-hidden
                            cursor-pointer
                            transition-all
                            duration-500
                            ${
                              isActive
                                ? 'opacity-100 shadow-2xl scale-100 z-10'
                                : 'opacity-35 hover:opacity-60 scale-[0.95] z-0'
                            }
                          `}
                        >
                          <img
                            src={plan.src}
                            alt={plan.title}
                            className="h-full w-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
                          />

                          {!isActive && (
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] transition-colors" />
                          )}

                          {isActive && (
                            <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-xs transition-transform hover:scale-110">
                              <Maximize className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* TAB 3: VIDEO */}
            {activeMediaTab === 'Video' && (
              <div className="relative overflow-hidden rounded-[32px] border border-slate-100 shadow-xl">
                {!isVideoPlaying ? (
                  <div className="group relative h-[450px] sm:h-[550px] w-full">
                    <img
                      src={project.image}
                      alt="Video cover"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    
                    {/* Big Red Play Button */}
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      aria-label="Play Project Video Walkthrough"
                      suppressHydrationWarning
                      className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f12131] text-white shadow-2xl transition-transform duration-300 hover:scale-115 hover:bg-[#d81928]"
                    >
                      <Play className="h-8 w-8 fill-current ml-1" />
                    </button>
                  </div>
                ) : (
                  <div className="relative h-[450px] sm:h-[550px] w-full bg-black">
                    <video
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    >
                      <source src="/images/videos/hero-bg.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: 360 STREET VIEW */}
            {activeMediaTab === 'Street View' && (
              <div className="h-[480px] sm:h-[600px] w-full overflow-hidden rounded-[32px] border border-slate-100 shadow-xl">
                <iframe
                  title={`${project.name} 360 Interactive Street View`}
                  src={
                    project.streetViewUrl ||
                    "https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469"
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <hr className="my-20 border-t border-slate-100" />

          {/* =========================================================
              LOCATION & MAP
          ========================================================= */}
          <div className="overflow-hidden">
            <h2 className="mb-12 text-3xl font-extrabold text-[#29247c] sm:text-4xl">
              Location
            </h2>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* ADDRESS & TRANSPORT (SLIDES IN FROM LEFT) */}
              <FadeIn direction="left" distance={40} duration={0.8} className="space-y-8 rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm sm:p-10 lg:col-span-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    ADDRESS
                  </p>
                  <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <p className="max-w-[280px] text-2xl font-extrabold leading-tight text-[#29247c]">
                      {project.address || `${project.name}, ${project.location}`}
                    </p>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        project.address || `${project.name} ${project.location}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-12 items-center gap-3 rounded-full border border-slate-200 bg-white pl-6 pr-2 text-sm font-bold text-slate-900 shadow-xs transition hover:shadow-md"
                    >
                      <span>Get Direction</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform group-hover:rotate-45">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                </div>

                <hr className="border-t border-slate-100" />

                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-[#29247c]">
                    Key transport
                  </h3>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Coast</p>
                      <p className="text-base font-extrabold text-slate-900">300m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">University</p>
                      <p className="text-base font-extrabold text-slate-900">750m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Supermarket</p>
                      <p className="text-base font-extrabold text-slate-900">500m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Park</p>
                      <p className="text-base font-extrabold text-slate-900">1120m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Railway station</p>
                      <p className="text-base font-extrabold text-slate-900">1750m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Airport</p>
                      <p className="text-base font-extrabold text-slate-900">3158m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Bus station</p>
                      <p className="text-base font-extrabold text-slate-900">450m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Bank</p>
                      <p className="text-base font-extrabold text-slate-900">415m</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Hospital</p>
                      <p className="text-base font-extrabold text-slate-900">350m</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* LOCATION MAP (SLIDES IN FROM RIGHT) */}
              <FadeIn direction="right" distance={40} duration={0.8} delay={0.1} className="h-[480px] overflow-hidden rounded-[32px] border border-slate-100 bg-slate-100 shadow-md sm:h-[580px] lg:col-span-6">
                <iframe
                  title={`${project.name} Location Map`}
                  src={
                    project.mapEmbedUrl ||
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.7854619438317!2d80.06316277578278!3d12.857147717326888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f77864f14c27%3A0x882a1708f519543e!2sUrapakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </FadeIn>
            </div>
          </div>

          <hr className="my-20 border-t border-slate-100" />

          {/* =========================================================
              REQUEST INFORMATION FORM & BOTTOM NAVIGATION
          ========================================================= */}
          <FadeIn direction="up">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-10 text-3xl font-extrabold text-[#29247c] sm:text-4xl">
                Request more information
              </h2>

              {inquirySubmitted ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-8 text-center shadow-xs">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-xl">
                    ✓
                  </div>
                  <h3 className="text-xl font-black text-emerald-900">
                    Thank you for your enquiry!
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-emerald-700">
                    Our sales advisor has received your request for {project.name} and will get in touch with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="Your Full Name*"
                      suppressHydrationWarning
                      className="h-14 w-full rounded-full border-0 bg-slate-100/80 px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30"
                    />
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="Phone Number (e.g. +91 98765 43210)*"
                      suppressHydrationWarning
                      className="h-14 w-full rounded-full border-0 bg-slate-100/80 px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30"
                    />
                  </div>

                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="Email Address (Optional)"
                    suppressHydrationWarning
                    className="h-14 w-full rounded-full border-0 bg-slate-100/80 px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30"
                  />

                  <textarea
                    rows={4}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Tell us what you are looking for (e.g. 2 BHK, villa plot, site visit timeline)..."
                    suppressHydrationWarning
                    className="w-full resize-none rounded-[28px] border-0 bg-slate-100/80 p-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30"
                  />

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingInquiry}
                      suppressHydrationWarning
                      className="group flex h-14 items-center gap-5 rounded-full border border-slate-200 bg-white pl-8 pr-2 text-sm font-extrabold text-slate-900 shadow-md transition hover:shadow-lg disabled:opacity-50"
                    >
                      <span>{isSubmittingInquiry ? 'Submitting...' : 'Submit Enquiry'}</span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </FadeIn>

            {/* Bottom Project Navigation */}
            <div className="mt-24">
              <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white p-2 sm:px-8 sm:py-4 shadow-sm">
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="flex items-center gap-2 text-sm font-extrabold text-slate-800 transition hover:text-[#f12131]"
                >
                  <ArrowLeft className="h-4 w-4 text-[#f12131]" />
                  <span>previous project</span>
                </Link>

                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="flex items-center gap-2 text-sm font-extrabold text-slate-800 transition hover:text-[#f12131]"
                >
                  <span>next project</span>
                  <ChevronRight className="h-4 w-4 text-[#f12131]" />
                </Link>
              </div>
            </div>

        </div>
      </section>

      {/* =============================================================
          FULLSCREEN LIGHTBOX MODAL (Matching Screenshot 2)
      ============================================================= */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black/92 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Top Bar: Counter on left, Controls on right */}
          <div className="flex items-center justify-between text-white">
            <div className="text-sm font-medium tracking-wider text-white/80">
              {lightboxIndex + 1} / {activeLightboxItems.length}
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Toggle zoom"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                aria-label="Share project"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <Share2 className="h-5 w-5" />
              </button>

              {/* Close (X) Button */}
              <button
                onClick={closeLightbox}
                aria-label="Close fullscreen lightbox"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Main Image Area with Left & Right Chevrons & Real-time Drag Animation */}
          <div
            onPointerDown={(e) => handleLightboxPointerDown(e.clientX)}
            onPointerMove={(e) => handleLightboxPointerMove(e.clientX)}
            onPointerUp={() => handleLightboxPointerUp(activeLightboxItems.length)}
            onPointerLeave={() => handleLightboxPointerUp(activeLightboxItems.length)}
            onContextMenu={(e) => e.preventDefault()}
            className="relative flex flex-1 items-center justify-center overflow-hidden my-4 select-none cursor-grab active:cursor-grabbing"
          >
            {/* Left Chevron */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightboxImage();
              }}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xs transition-all hover:bg-white/25 hover:scale-110"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            {/* Active Display Image with Real-time Drag & Smooth Slide Transition */}
            <div
              style={{
                transform: `translateX(${lightboxDragOffset}px) scale(${isZoomed ? 1.5 : 1})`,
                transition: isLightboxDragging
                  ? 'none'
                  : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="relative will-change-transform"
            >
              <img
                src={activeLightboxItems[lightboxIndex].src}
                alt={activeLightboxItems[lightboxIndex].title}
                className="max-h-[75vh] sm:max-h-[82vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl pointer-events-none"
              />
            </div>

            {/* Right Chevron */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightboxImage();
              }}
              aria-label="Next photo"
              className="absolute right-2 sm:right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xs transition-all hover:bg-white/25 hover:scale-110"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>

          {/* Bottom Title / Caption */}
          <div className="text-center">
            <p className="text-sm font-medium text-white/90">
              {activeLightboxItems[lightboxIndex].title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

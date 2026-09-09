'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Building2,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Compass,
  Layers,
  Loader2,
  ExternalLink,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface ProjectFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'basic' | 'units' | 'media' | 'plans' | 'amenities' | 'specs' | 'nearby' | 'faqs'>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    propertyType: initialData?.propertyType || 'Apartments',
    status: initialData?.status || 'Ongoing',
    city: initialData?.city || 'Chennai',
    location: initialData?.location || '',
    address: initialData?.address || '',
    bhk: initialData?.bhk || '1 & 2 BHK',
    budget: initialData?.budget || '₹ 25L Onwards',
    pricePerSqFt: initialData?.pricePerSqFt || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    handoverTimeline: initialData?.handoverTimeline || '',
    commencementDate: initialData?.commencementDate || '',
    totalUnits: initialData?.totalUnits || 0,
    availableUnits: initialData?.availableUnits || 0,
    image: initialData?.image || '/images/projects/apt_lenid.jpg',
    galleryImages: initialData?.galleryImages || [],
    walkthroughVideoUrl: initialData?.walkthroughVideoUrl || '',
    virtualTourUrl: initialData?.virtualTourUrl || '',
    streetViewUrl: initialData?.streetViewUrl || '',
    brochureUrl: initialData?.brochureUrl || '',
    masterPlanUrl: initialData?.masterPlanUrl || '',
    mapEmbedUrl: initialData?.mapEmbedUrl || '',
    isPublished: initialData ? initialData.isPublished : true,
    isFeatured: initialData ? initialData.isFeatured : false,
    order: initialData?.order || 1,

    // Nested Arrays & Objects
    floorPlans: initialData?.floorPlans || [
      { title: '1 BHK Master Plan', bhk: '1 BHK', sqft: '550 Sq. Ft.', imageUrl: '/images/projects/p1.webp' },
    ],
    amenities: initialData?.amenities || [
      { name: '24x7 Security', icon: 'Shield', description: 'Gated community with CCTV' },
      { name: 'Fitness Center', icon: 'Dumbbell', description: 'Equipped modern gym' },
      { name: "Children's Play Area", icon: 'Gamepad2', description: 'Safe outdoor playground' },
      { name: 'Landscape Garden', icon: 'Trees', description: 'Green park spaces' },
    ],
    specifications: initialData?.specifications || {
      structure: 'RCC Framed Structure designed for seismic compliance.',
      flooring: 'Vitrified tiles 2x2 in living, dining, and bedrooms.',
      doors: 'Teak wood main door with designer laminate.',
      windows: 'UPVC sliding windows with safety grills.',
      electrical: 'Fire-resistant concealed copper wiring.',
      plumbing: 'Branded CP fittings and sanitary ware.',
      kitchen: 'Black granite counter top with stainless steel sink.',
      others: 'Weather-proof exterior paint finish.',
    },
    nearbyLocations: initialData?.nearbyLocations || [
      { name: 'Railway Station', distance: '1.7 km', description: 'Suburban rail network' },
      { name: 'Kilambakkam Bus Terminus', distance: '3.5 km', description: 'State transport hub' },
      { name: 'Airport', distance: '22 km', description: 'Chennai Airport' },
    ],
    faqs: initialData?.faqs || [
      { question: 'Is the project approved by CMDA / DTCP?', answer: 'Yes, 100% legal approval with clear titles.', order: 1 },
      { question: 'Are bank loans available?', answer: 'Yes, pre-approved with SBI, HDFC, LIC HFL, and ICICI.', order: 2 },
    ],
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fieldName === 'brochure') {
      setIsUploadingBrochure(true);
    }

    try {
      const res = await api.upload(file, 'projects');
      if (res.url) {
        if (fieldName === 'image') {
          setFormData((prev) => ({ ...prev, image: res.url }));
        } else if (fieldName === 'gallery') {
          setFormData((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, res.url] }));
        } else if (fieldName === 'brochure') {
          setFormData((prev) => ({ ...prev, brochureUrl: res.url }));
        }
      }
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      if (fieldName === 'brochure') {
        setIsUploadingBrochure(false);
      }
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      if (isEdit) {
        await api.put(`/projects/${initialData._id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      router.push('/admin/projects');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save project. Please check required fields.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#29247c]">
              {isEdit ? `Edit: ${initialData?.name}` : 'Create New Project'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Configure real estate specs, pricing, floor plans, and amenities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex h-11 items-center px-5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-6 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : isEdit ? 'Update Project' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap gap-2 rounded-[24px] border border-slate-200/80 bg-white p-2 shadow-xs">
        {[
          { id: 'basic', label: '1. Basic Info' },
          { id: 'units', label: '2. Units & Pricing' },
          { id: 'media', label: '3. Media & Assets' },
          { id: 'plans', label: '4. Floor Plans' },
          { id: 'amenities', label: '5. Amenities' },
          { id: 'specs', label: '6. Specifications' },
          { id: 'nearby', label: '7. Nearby Landmarks' },
          { id: 'faqs', label: '8. FAQs & Maps' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#29247c] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === 'basic' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Project Name*
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. KPN Marvel Township"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. kpn-marvel-township (auto-generated if blank)"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Property Type*
              </label>
              <Select
                value={formData.propertyType}
                onValueChange={(val) => setFormData({ ...formData, propertyType: val as any })}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20 shadow-none cursor-pointer">
                  <SelectValue placeholder="Select Property Type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                  <SelectItem value="Apartments" className="rounded-xl font-bold py-2.5 text-slate-700">Apartments</SelectItem>
                  <SelectItem value="Plots" className="rounded-xl font-bold py-2.5 text-slate-700">Plots</SelectItem>
                  <SelectItem value="Villas" className="rounded-xl font-bold py-2.5 text-slate-700">Villas</SelectItem>
                  <SelectItem value="Commercial" className="rounded-xl font-bold py-2.5 text-slate-700">Commercial</SelectItem>
                  <SelectItem value="Industrial" className="rounded-xl font-bold py-2.5 text-slate-700">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Project Status*
              </label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val as any })}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20 shadow-none cursor-pointer">
                  <SelectValue placeholder="Select Project Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                  <SelectItem value="Ongoing" className="rounded-xl font-bold py-2.5 text-slate-700">Ongoing</SelectItem>
                  <SelectItem value="Upcoming" className="rounded-xl font-bold py-2.5 text-slate-700">Upcoming</SelectItem>
                  <SelectItem value="Completed" className="rounded-xl font-bold py-2.5 text-slate-700">Completed</SelectItem>
                  <SelectItem value="Sold Out" className="rounded-xl font-bold py-2.5 text-slate-700">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                City / Region
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Location Headline*
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Urapakkam, Chennai"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Full Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="No. 48, Karanai Puducherry Rd, Urapakkam"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Short Summary Description
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="1-2 sentences summarizing this project"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Full Project Description
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed overview for prospective buyers..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Handover Timeline
              </label>
              <input
                type="text"
                value={formData.handoverTimeline}
                onChange={(e) => setFormData({ ...formData, handoverTimeline: e.target.value })}
                placeholder="e.g. Ready to Construct / Dec 2026"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Commencement Date
              </label>
              <input
                type="text"
                value={formData.commencementDate}
                onChange={(e) => setFormData({ ...formData, commencementDate: e.target.value })}
                placeholder="e.g. 28 Jun, 2021"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNITS & PRICING */}
      {activeTab === 'units' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Configuration / BHK Tag*
              </label>
              <input
                type="text"
                required
                value={formData.bhk}
                onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                placeholder="e.g. 1 & 2 BHK or Plots"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Budget / Price Display*
              </label>
              <input
                type="text"
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. ₹ 19L Onwards or ₹ 2799/Sq.Ft"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Price per Sq.Ft
              </label>
              <input
                type="text"
                value={formData.pricePerSqFt}
                onChange={(e) => setFormData({ ...formData, pricePerSqFt: e.target.value })}
                placeholder="e.g. ₹ 4,500"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Total Units in Project
              </label>
              <input
                type="number"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value, 10) || 0 })}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Available Units
              </label>
              <input
                type="number"
                value={formData.availableUnits}
                onChange={(e) => setFormData({ ...formData, availableUnits: parseInt(e.target.value, 10) || 0 })}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEDIA & ASSETS */}
      {activeTab === 'media' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Main Cover Image URL / Upload*
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/projects/apt_lenid.jpg or Cloudinary URL"
                className="h-12 flex-1 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
              <label className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-slate-800 px-5 text-xs font-bold text-white hover:bg-slate-700 transition-colors">
                <Upload className="h-4 w-4" />
                <span>Upload New</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Walkthrough Video URL
              </label>
              <input
                type="text"
                value={formData.walkthroughVideoUrl}
                onChange={(e) => setFormData({ ...formData, walkthroughVideoUrl: e.target.value })}
                placeholder="YouTube URL or /images/videos/hero-bg.mp4"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                360 Street View / Virtual Tour Embed URL
              </label>
              <input
                type="text"
                value={formData.streetViewUrl}
                onChange={(e) => setFormData({ ...formData, streetViewUrl: e.target.value })}
                placeholder="Google Maps 360 embed URL"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Project Brochure (PDF)
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload a PDF brochure or enter a link. Enables the &quot;Download Brochure&quot; button on the project page.
                </p>
              </div>

              {formData.brochureUrl ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Brochure Attached
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200 self-start sm:self-auto">
                  No brochure attached
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.brochureUrl}
                  onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                  placeholder="e.g. /brouchure/DGM Monika Brouchure (4).pdf or upload below"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20 transition-all"
                />
              </div>

              <label
                className={`flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 text-xs font-bold text-white transition-all shadow-sm ${
                  isUploadingBrochure
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-[#f12131] hover:bg-red-600 active:scale-95'
                }`}
              >
                {isUploadingBrochure ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload PDF</span>
                  </>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  disabled={isUploadingBrochure}
                  onChange={(e) => handleFileUpload(e, 'brochure')}
                  className="hidden"
                />
              </label>
            </div>

            {formData.brochureUrl && (
              <div className="flex items-center justify-between rounded-xl bg-white border border-slate-200 p-3 text-xs">
                <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-slate-800 truncate block">
                      {formData.brochureUrl.split('/').pop() || 'Brochure PDF'}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {formData.brochureUrl}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={encodeURI(formData.brochureUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Preview</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, brochureUrl: '' })}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Remove brochure"
                  >
                    <X className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: FLOOR PLANS */}
      {activeTab === 'plans' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
              Floor Plans List
            </h3>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  floorPlans: [
                    ...formData.floorPlans,
                    { title: 'New Plan', bhk: '2 BHK', sqft: '850 Sq. Ft.', imageUrl: '/images/projects/p2.webp' },
                  ],
                })
              }
              className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Plan</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.floorPlans.map((plan: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <input
                  type="text"
                  placeholder="Plan Title (e.g. 2 BHK Luxury)"
                  value={plan.title}
                  onChange={(e) => {
                    const copy = [...formData.floorPlans];
                    copy[idx].title = e.target.value;
                    setFormData({ ...formData, floorPlans: copy });
                  }}
                  className="h-10 flex-1 min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Sq. Ft."
                  value={plan.sqft}
                  onChange={(e) => {
                    const copy = [...formData.floorPlans];
                    copy[idx].sqft = e.target.value;
                    setFormData({ ...formData, floorPlans: copy });
                  }}
                  className="h-10 w-28 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Plan Image URL"
                  value={plan.imageUrl}
                  onChange={(e) => {
                    const copy = [...formData.floorPlans];
                    copy[idx].imageUrl = e.target.value;
                    setFormData({ ...formData, floorPlans: copy });
                  }}
                  className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      floorPlans: formData.floorPlans.filter((_: any, i: number) => i !== idx),
                    })
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AMENITIES */}
      {activeTab === 'amenities' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
              Project Features & Amenities
            </h3>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  amenities: [
                    ...formData.amenities,
                    { name: 'Club House', icon: 'Building', description: 'Community recreation center' },
                  ],
                })
              }
              className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Amenity</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.amenities.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <input
                  type="text"
                  placeholder="Amenity Name (e.g. Swimming Pool)"
                  value={item.name}
                  onChange={(e) => {
                    const copy = [...formData.amenities];
                    copy[idx].name = e.target.value;
                    setFormData({ ...formData, amenities: copy });
                  }}
                  className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const copy = [...formData.amenities];
                    copy[idx].description = e.target.value;
                    setFormData({ ...formData, amenities: copy });
                  }}
                  className="h-10 flex-1 min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      amenities: formData.amenities.filter((_: any, i: number) => i !== idx),
                    })
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SPECIFICATIONS */}
      {activeTab === 'specs' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['structure', 'flooring', 'doors', 'windows', 'electrical', 'plumbing', 'kitchen', 'others'].map((specKey) => (
              <div key={specKey}>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  {specKey}
                </label>
                <input
                  type="text"
                  value={formData.specifications[specKey] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        [specKey]: e.target.value,
                      },
                    })
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: NEARBY LANDMARKS */}
      {activeTab === 'nearby' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
              Nearby Landmarks & Distances
            </h3>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  nearbyLocations: [
                    ...formData.nearbyLocations,
                    { name: 'Hospital', distance: '2.0 km', description: 'Emergency medical center' },
                  ],
                })
              }
              className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Landmark</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.nearbyLocations.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <input
                  type="text"
                  placeholder="Location Name"
                  value={item.name}
                  onChange={(e) => {
                    const copy = [...formData.nearbyLocations];
                    copy[idx].name = e.target.value;
                    setFormData({ ...formData, nearbyLocations: copy });
                  }}
                  className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Distance (e.g. 1.5 km)"
                  value={item.distance}
                  onChange={(e) => {
                    const copy = [...formData.nearbyLocations];
                    copy[idx].distance = e.target.value;
                    setFormData({ ...formData, nearbyLocations: copy });
                  }}
                  className="h-10 w-36 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      nearbyLocations: formData.nearbyLocations.filter((_: any, i: number) => i !== idx),
                    })
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: FAQS & MAPS */}
      {activeTab === 'faqs' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Google Maps Embed URL
              </label>
              <input
                type="text"
                value={formData.mapEmbedUrl}
                onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-5 w-5 rounded-md border-slate-300 text-[#f12131] focus:ring-[#f12131]"
                />
                <span className="text-xs font-bold text-slate-800">
                  Feature on Homepage Showcase (Sticky runway)
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
              Frequently Asked Questions
            </h3>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  faqs: [
                    ...formData.faqs,
                    { question: 'New Question?', answer: 'Answer details here...', order: formData.faqs.length + 1 },
                  ],
                })
              }
              className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.faqs.map((faq: any, idx: number) => (
              <div key={idx} className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const copy = [...formData.faqs];
                      copy[idx].question = e.target.value;
                      setFormData({ ...formData, faqs: copy });
                    }}
                    className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        faqs: formData.faqs.filter((_: any, i: number) => i !== idx),
                      })
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => {
                    const copy = [...formData.faqs];
                    copy[idx].answer = e.target.value;
                    setFormData({ ...formData, faqs: copy });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

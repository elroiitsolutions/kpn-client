'use client';

import React, { useEffect, useState } from 'react';
import { Home, Save, CheckCircle, Upload } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminHomepageCMSPage() {
  const [cms, setCms] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cmsRes, projRes] = await Promise.all([
          api.get('/cms/home'),
          api.get('/projects'),
        ]);

        if (cmsRes.success && cmsRes.data) {
          setCms(cmsRes.data);
        }
        if (projRes.success) {
          setProjects(projRes.data || []);
        }
      } catch (err) {
        console.warn('Failed to load homepage CMS data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleToggleFeatured = (projectId: string) => {
    const currentIds = (cms.featuredProjectIds || []).map((p: any) =>
      typeof p === 'object' ? p._id : p
    );

    let nextIds: string[];
    if (currentIds.includes(projectId)) {
      nextIds = currentIds.filter((id: string) => id !== projectId);
    } else {
      nextIds = [...currentIds, projectId];
    }

    setCms({ ...cms, featuredProjectIds: nextIds });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        hero: cms?.hero,
        about: cms?.about,
        cta: cms?.cta,
        featuredProjectIds: (cms?.featuredProjectIds || []).map((p: any) =>
          typeof p === 'object' && p ? p._id : p
        ),
      };
      const res = await api.put('/cms/home', payload);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save Homepage CMS');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
        Loading Homepage CMS configuration...
      </div>
    );
  }

  const featuredIds = (cms?.featuredProjectIds || []).map((p: any) =>
    typeof p === 'object' ? p._id : p
  );

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Homepage Sections CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Customize the hero banner, featured project runway, and conversion prompts.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-6 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Homepage CMS'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Homepage CMS changes saved successfully! Live website will refresh dynamically.</span>
        </div>
      )}

      {/* SECTION 1: HERO */}
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f12131]">
            SECTION 01
          </span>
          <h2 className="text-base font-black text-[#29247c]">
            Hero Banner & Video
          </h2>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Hero Heading (Main punchline)
          </label>
          <textarea
            rows={3}
            required
            value={cms?.hero?.heading || ''}
            onChange={(e) =>
              setCms({
                ...cms,
                hero: { ...cms.hero, heading: e.target.value },
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              CTA Button Text
            </label>
            <input
              type="text"
              value={cms?.hero?.buttonText || ''}
              onChange={(e) =>
                setCms({
                  ...cms,
                  hero: { ...cms.hero, buttonText: e.target.value },
                })
              }
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              CTA Button Link
            </label>
            <input
              type="text"
              value={cms?.hero?.buttonUrl || ''}
              onChange={(e) =>
                setCms({
                  ...cms,
                  hero: { ...cms.hero, buttonUrl: e.target.value },
                })
              }
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Hero Background Video URL
          </label>
          <input
            type="text"
            value={cms?.hero?.videoUrl || ''}
            onChange={(e) =>
              setCms({
                ...cms,
                hero: { ...cms.hero, videoUrl: e.target.value },
              })
            }
            placeholder="/images/videos/hero-bg.mp4 or CDN video URL"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold"
          />
        </div>
      </div>

      {/* SECTION 2: FEATURED PROJECTS SELECTOR */}
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f12131]">
            SECTION 02
          </span>
          <h2 className="text-base font-black text-[#29247c]">
            Featured Projects Runway (Homepage Sticky Scroll)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Check the projects you want displayed in the full-bleed homepage scroll showcase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const isFeatured = featuredIds.includes(proj._id);

            return (
              <div
                key={proj._id}
                onClick={() => handleToggleFeatured(proj._id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                  isFeatured
                    ? 'border-[#f12131] bg-red-50/30 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isFeatured}
                  readOnly
                  className="h-4 w-4 pointer-events-none rounded-md border-slate-300 text-[#f12131] focus:ring-[#f12131]"
                />
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                  <img src={proj.image} alt={proj.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 leading-tight">{proj.name}</p>
                  <p className="text-[10px] text-slate-400">{proj.propertyType} • {proj.budget}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: CTA BLOCK */}
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f12131]">
            SECTION 03
          </span>
          <h2 className="text-base font-black text-[#29247c]">
            Bottom Conversion Banner (Contact CTA)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Headline
            </label>
            <input
              type="text"
              value={cms?.cta?.title || ''}
              onChange={(e) =>
                setCms({
                  ...cms,
                  cta: { ...cms.cta, title: e.target.value },
                })
              }
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Subtitle / Description
            </label>
            <input
              type="text"
              value={cms?.cta?.description || ''}
              onChange={(e) =>
                setCms({
                  ...cms,
                  cta: { ...cms.cta, description: e.target.value },
                })
              }
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

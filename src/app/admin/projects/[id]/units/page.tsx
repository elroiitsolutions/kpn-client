'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UnitsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectUnitsManagerPage({ params }: UnitsPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Direct Total and Available unit counts
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [availableUnits, setAvailableUnits] = useState<number>(0);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projRes, allProjRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get('/projects?includeUnpublished=true'),
      ]);

      if (projRes.success && projRes.data) {
        setProject(projRes.data);
        setTotalUnits(projRes.data.totalUnits || 0);
        setAvailableUnits(projRes.data.availableUnits || 0);
      }
      if (allProjRes.success) {
        setAllProjects(allProjRes.data || []);
      }
    } catch (err) {
      console.warn('Failed to load project units:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Derived sold and percentage
  const total = Math.max(0, Number(totalUnits) || 0);
  const available = Math.min(total, Math.max(0, Number(availableUnits) || 0));
  const sold = Math.max(0, total - available);
  const availablePct = total > 0 ? Math.round((available / total) * 100) : 0;
  const soldPct = total > 0 ? 100 - availablePct : 0;

  const handleSaveSummary = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put(`/projects/${id}`, {
        totalUnits: total,
        availableUnits: available,
      });

      if (res.success) {
        setProject(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update units');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick adjusters
  const adjustAvailable = (delta: number) => {
    setAvailableUnits((prev) => {
      const nextVal = Math.max(0, Math.min(total, prev + delta));
      return nextVal;
    });
  };

  const handleProjectSwitch = (newId: string) => {
    if (newId && newId !== id) {
      router.push(`/admin/projects/${newId}/units`);
    }
  };

  if (isLoading && !project) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#29247c] border-t-transparent mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading project units...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/admin/projects"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-[#f12131] hover:text-[#f12131] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[#29247c] font-heading">
                {project?.name || 'Project'} • Units Manager
              </h1>
              <span className="rounded-full bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#f12131] font-heading">
                {project?.propertyType || 'Apartments'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Quickly update Total Units and Available Units across all projects.
            </p>
          </div>
        </div>

        {/* Project Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-heading mb-1">
              Switch Project:
            </label>
            <Select value={id} onValueChange={(val) => handleProjectSwitch(val)}>
              <SelectTrigger className="h-10 min-w-[220px] rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 outline-none hover:border-slate-300 focus:ring-2 focus:ring-[#f12131]/20 transition-all cursor-pointer shadow-none">
                <SelectValue placeholder="Switch Project" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl max-h-72">
                {allProjects.map((p) => (
                  <SelectItem key={p._id} value={p._id} className="text-xs font-bold py-2">
                    {p.name} ({p.propertyType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Link
            href={`/projects/${project?.slug}`}
            target="_blank"
            className="flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 hover:border-[#f12131] hover:text-[#f12131] transition-all mt-4"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden md:inline">View Public</span>
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 animate-in fade-in duration-300 shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">
            ✓ Unit counts for <strong>{project?.name}</strong> successfully updated! Total: {total}, Available: {available}.
          </span>
        </div>
      )}

      {/* PRIMARY UNIT INVENTORY CARD */}
      <form onSubmit={handleSaveSummary} className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#f12131] font-heading">
              INVENTORY MANAGEMENT
            </span>
            <h2 className="text-xl font-black text-[#29247c] font-heading mt-0.5">
              Total & Available Units
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Update unit numbers below. These directly reflect on the website project cards and details.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f12131] px-7 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Units Inventory</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Main KPI Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Units Input */}
          <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-6 focus-within:border-[#29247c] focus-within:bg-white transition-all">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 font-heading">
                Total Units
              </label>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Project Capacity</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={totalUnits}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setTotalUnits(val);
                }}
                className="w-full text-3xl font-black text-[#29247c] font-heading bg-transparent outline-none"
              />
              <span className="text-xs font-bold text-slate-400 shrink-0">Units</span>
            </div>
            <p className="mt-3 text-[11px] font-medium text-slate-500">
              Total apartments / plots in this project.
            </p>
          </div>

          {/* Available Units Input */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-6 focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-emerald-700 font-heading">
                Available Units
              </label>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-heading">
                {availablePct}% Open
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="number"
                min="0"
                max={total}
                value={availableUnits}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setAvailableUnits(val);
                }}
                className="w-full text-3xl font-black text-emerald-700 font-heading bg-transparent outline-none"
              />
              <span className="text-xs font-bold text-emerald-600 shrink-0">Units</span>
            </div>
            <p className="mt-3 text-[11px] font-medium text-emerald-800/80">
              Unsold units currently available for purchase.
            </p>
          </div>

          {/* Sold / Booked Units (Calculated) */}
          <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#f12131] font-heading">
                Sold / Booked
              </span>
              <span className="text-[10px] font-black text-[#f12131] bg-rose-100 px-2 py-0.5 rounded-full font-heading">
                {soldPct}% Sold
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-black text-[#f12131] font-heading">
                {sold}
              </span>
              <span className="text-xs font-bold text-[#f12131]/80">Units</span>
            </div>
            <p className="mt-3 text-[11px] font-medium text-rose-800/80">
              Calculated automatically (Total − Available).
            </p>
          </div>
        </div>

        {/* Quick Steppers & Adjustment Presets */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-heading">
            Quick Stock Adjustments:
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => adjustAvailable(-1)}
              className="rounded-full border border-rose-200 bg-white px-3.5 py-1.5 text-xs font-bold text-[#f12131] hover:bg-rose-50 transition-colors shadow-2xs cursor-pointer"
            >
              −1 Sold
            </button>
            <button
              type="button"
              onClick={() => adjustAvailable(1)}
              className="rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
            >
              +1 Available
            </button>
            <button
              type="button"
              onClick={() => adjustAvailable(5)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              +5 Available
            </button>
            <button
              type="button"
              onClick={() => adjustAvailable(-5)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              −5 Available
            </button>
            <button
              type="button"
              onClick={() => setAvailableUnits(0)}
              className="rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors shadow-2xs cursor-pointer"
            >
              Mark as Sold Out
            </button>
            <button
              type="button"
              onClick={() => setAvailableUnits(total)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer ml-auto"
            >
              Reset 100% Available
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-700 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Available: {available} units ({availablePct}%)
            </span>
            <span className="text-[#f12131] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#f12131]" />
              Sold: {sold} units ({soldPct}%)
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200">
            <div className="flex h-full w-full rounded-full overflow-hidden">
              <div
                style={{ width: `${availablePct}%` }}
                className="bg-emerald-500 transition-all duration-500"
              />
              <div
                style={{ width: `${soldPct}%` }}
                className="bg-[#f12131] transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

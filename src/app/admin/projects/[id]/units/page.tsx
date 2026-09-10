'use client';

import React, { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Building2,
  Layers,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getPropertyTypeConfig } from '@/components/admin/ProjectForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBreadcrumbs } from '@/lib/breadcrumbContext';
import InventoryManager, {
  Block,
  Unit,
  Plot,
  getFloorName,
} from '@/components/admin/InventoryManager';
import {
  AddUnitModal,
  AddPlotModal,
  UnitLeadAllocationModal,
  UnitsStatsBar,
  BatchFloorEditor,
  BatchPlotEditor,
  UnitCard,
  PlotCard,
  AllocatingUnit,
  UnitFormData,
  PlotFormData,
} from '@/components/admin/units';

interface UnitsPageProps {
  params: Promise<{ id: string }>;
}
export default function ProjectUnitsManagerPage({ params }: UnitsPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { setEntityTitle } = useBreadcrumbs();

  const [project, setProject] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // Active View Tab: 'status' (Quick Dropdown + Clickable Units Grid) vs 'blueprint' (Structure Generator)
  const [activeTab, setActiveTab] = useState<'status' | 'blueprint'>('status');
  // Interactive Selection State for Dropdowns
  const [selectedBlockId, setSelectedBlockId] = useState<string>('');
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'booked' | 'sold'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick Add Modal States
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);

  // Lead Enquiries State for Unit Allocation
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [allocatingUnit, setAllocatingUnit] = useState<AllocatingUnit | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);

  // Unit & Building Structure counts
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [availableUnits, setAvailableUnits] = useState<number>(0);
  const [bookedUnits, setBookedUnits] = useState<number>(0);
  const [blockedUnits, setBlockedUnits] = useState<number>(0);
  const [totalBlocks, setTotalBlocks] = useState<number>(1);
  const [totalFloors, setTotalFloors] = useState<number>(1);

  // Interactive Blueprint Inventory State
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [layoutImages, setLayoutImages] = useState<string[]>([]);

  const recalculateCounts = (currentBlocks: Block[], currentPlots: Plot[]) => {
    if (currentBlocks && currentBlocks.length > 0) {
      let tot = 0, avail = 0, bkd = 0, sld = 0;
      currentBlocks.forEach((blk: any) => {
        (blk.floors || []).forEach((fl: any) => {
          (fl.units || []).forEach((u: any) => {
            tot++;
            if (u.status === 'available') avail++;
            else if (u.status === 'booked') bkd++;
            else if (u.status === 'sold') sld++;
          });
        });
      });
      setTotalUnits(tot);
      setAvailableUnits(avail);
      setBookedUnits(bkd);
      setBlockedUnits(sld);
    } else if (currentPlots && currentPlots.length > 0) {
      const tot = currentPlots.length;
      const avail = currentPlots.filter((item: any) => item.status === 'available').length;
      const bkd = currentPlots.filter((item: any) => item.status === 'booked').length;
      const sld = currentPlots.filter((item: any) => item.status === 'sold').length;
      setTotalUnits(tot);
      setAvailableUnits(avail);
      setBookedUnits(bkd);
      setBlockedUnits(sld);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projRes, allProjRes, enqRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get('/projects?includeUnpublished=true'),
        api.get('/enquiries'),
      ]);

      if (enqRes.success && Array.isArray(enqRes.data)) {
        setEnquiries(enqRes.data);
      }

      if (projRes.success && projRes.data) {
        const p = projRes.data;
        setProject(p);
        if (p.name) setEntityTitle(id, p.name);

        const b: Block[] = Array.isArray(p.blocks) ? p.blocks : [];
        const pl: Plot[] = Array.isArray(p.plots) ? p.plots : [];
        const img = Array.isArray(p.layoutImages) ? p.layoutImages : [];
        setBlocks(b);
        setPlots(pl);
        setLayoutImages(img);

        // Initialize selected block and floor
        if (b.length > 0) {
          setSelectedBlockId(b[0].blockId);
          const firstBlockFloors = b[0].floors || [];
          if (firstBlockFloors.length > 0) {
            setSelectedFloorNumber(firstBlockFloors[0].floorNumber);
          }
          setTotalBlocks(b.length);
          setTotalFloors(Math.max(1, ...b.map((blk: any) => blk.totalFloors || (blk.floors?.length || 1))));
        } else {
          setTotalBlocks(p.totalBlocks || 1);
          setTotalFloors(p.totalFloors || 1);
        }

        // Calculate summary counts
        recalculateCounts(b, pl);
        setHasUnsavedChanges(false);
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

  // Helper to match customer enquiries for a unit/plot
  const getEnquiriesForUnit = (unitNum: string) => {
    if (!unitNum) return [];
    const clean = String(unitNum).replace(/^(Villa|Plot|Unit)\s+/i, '').trim().toLowerCase();
    return enquiries.filter((e) => {
      const matchesProj =
        !e.projectId ||
        e.projectId === id ||
        e.projectId === project?.id ||
        e.projectId === project?._id ||
        (project?.name && e.projectName && e.projectName.toLowerCase() === project.name.toLowerCase()) ||
        (project?.slug && e.projectId === project.slug);
      if (!matchesProj) return false;
      if (!e.unitNumber) return false;
      const eClean = String(e.unitNumber).replace(/^(Villa|Plot|Unit)\s+/i, '').trim().toLowerCase();
      return eClean === clean || String(e.unitNumber).toLowerCase() === String(unitNum).toLowerCase();
    });
  };

  // One-click Allocate or Release Unit to a specific Enquiry Lead
  const handleAllocateLead = async (
    enquiryId: string | undefined,
    action: 'booked' | 'sold' | 'release'
  ) => {
    if (!allocatingUnit) return;
    setIsAllocating(true);
    try {
      const res = await api.post('/enquiries/allocate-unit', {
        projectId: id,
        unitNumber: allocatingUnit.unitNumber,
        unitId: allocatingUnit.unitId,
        blockId: allocatingUnit.blockId,
        floorNumber: allocatingUnit.floorNumber,
        plotId: allocatingUnit.plotId,
        enquiryId,
        action,
      });

      if (res.success) {
        await loadData();
        setAllocatingUnit(null);
      } else {
        alert(res.message || 'Failed to allocate unit');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to allocate unit');
    } finally {
      setIsAllocating(false);
    }
  };

  // Handle Switching Block
  const handleSelectBlock = (newBlockId: string) => {
    setSelectedBlockId(newBlockId);
    const targetBlock = blocks.find((b) => b.blockId === newBlockId);
    if (targetBlock && targetBlock.floors && targetBlock.floors.length > 0) {
      setSelectedFloorNumber(targetBlock.floors[0].floorNumber);
    }
  };

  // Currently Selected Block & Floor objects
  const selectedBlock = useMemo(() => {
    return blocks.find((b) => b.blockId === selectedBlockId) || blocks[0] || null;
  }, [blocks, selectedBlockId]);

  const selectedFloor = useMemo(() => {
    if (!selectedBlock || !selectedBlock.floors) return null;
    return (
      selectedBlock.floors.find((f) => Number(f.floorNumber) === Number(selectedFloorNumber)) ||
      selectedBlock.floors[0] ||
      null
    );
  }, [selectedBlock, selectedFloorNumber]);

  // Derived counts for selected floor
  const floorUnits = useMemo(() => {
    if (!selectedFloor || !selectedFloor.units) return [];
    return selectedFloor.units;
  }, [selectedFloor]);

  const filteredFloorUnits = useMemo(() => {
    return floorUnits.filter((u) => {
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.unitNumber.toLowerCase().includes(q) ||
          (u.unitType && u.unitType.toLowerCase().includes(q)) ||
          (u.facing && u.facing.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [floorUnits, statusFilter, searchQuery]);

  // Plots filtering
  const filteredPlots = useMemo(() => {
    return plots.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.plotNumber.toLowerCase().includes(q) ||
          (p.facing && p.facing.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [plots, statusFilter, searchQuery]);

  // One-Click Status Update for a Unit
  const handleUpdateUnitStatus = (
    blockId: string,
    floorNumber: number,
    unitId: string,
    newStatus: 'available' | 'booked' | 'sold'
  ) => {
    setBlocks((prevBlocks) => {
      const nextBlocks = prevBlocks.map((blk) => {
        if (blk.blockId !== blockId) return blk;
        return {
          ...blk,
          floors: (blk.floors || []).map((fl) => {
            if (Number(fl.floorNumber) !== Number(floorNumber)) return fl;
            return {
              ...fl,
              units: (fl.units || []).map((u) => {
                if (u.unitId === unitId) {
                  return { ...u, status: newStatus };
                }
                return u;
              }),
            };
          }),
        };
      });
      recalculateCounts(nextBlocks, plots);
      return nextBlocks;
    });
    setHasUnsavedChanges(true);
  };

  // Batch Update Status for All Units on Floor
  const handleBatchFloorStatus = (
    blockId: string,
    floorNumber: number,
    newStatus: 'available' | 'booked' | 'sold'
  ) => {
    setBlocks((prevBlocks) => {
      const nextBlocks = prevBlocks.map((blk) => {
        if (blk.blockId !== blockId) return blk;
        return {
          ...blk,
          floors: (blk.floors || []).map((fl) => {
            if (Number(fl.floorNumber) !== Number(floorNumber)) return fl;
            return {
              ...fl,
              units: (fl.units || []).map((u) => ({ ...u, status: newStatus })),
            };
          }),
        };
      });
      recalculateCounts(nextBlocks, plots);
      return nextBlocks;
    });
    setHasUnsavedChanges(true);
  };

  // One-Click Status Update for a Plot
  const handleUpdatePlotStatus = (
    plotId: string,
    newStatus: 'available' | 'booked' | 'sold'
  ) => {
    setPlots((prevPlots) => {
      const nextPlots = prevPlots.map((p) => {
        if (p.plotId === plotId) {
          return { ...p, status: newStatus };
        }
        return p;
      });
      recalculateCounts(blocks, nextPlots);
      return nextPlots;
    });
    setHasUnsavedChanges(true);
  };

  // Batch Update Status for All Plots
  const handleBatchPlotsStatus = (newStatus: 'available' | 'booked' | 'sold') => {
    setPlots((prevPlots) => {
      const nextPlots = prevPlots.map((p) => ({ ...p, status: newStatus }));
      recalculateCounts(blocks, nextPlots);
      return nextPlots;
    });
    setHasUnsavedChanges(true);
  };

  // Quick Add Unit Callback from AddUnitModal
  const handleAddUnit = (data: UnitFormData) => {
    if (!data.unitNumber || !selectedBlock) return;

    const newUnit: Unit = {
      unitId: data.unitNumber,
      unitNumber: data.unitNumber,
      bhk: data.bhk,
      bathrooms: Math.max(1, data.bhk - 1),
      size: data.size,
      unitType: `${data.bhk} BHK`,
      facing: data.facing,
      status: data.status,
    };

    setBlocks((prevBlocks) => {
      const nextBlocks = prevBlocks.map((blk) => {
        if (blk.blockId !== selectedBlock.blockId) return blk;
        return {
          ...blk,
          floors: (blk.floors || []).map((fl) => {
            if (Number(fl.floorNumber) !== Number(selectedFloorNumber)) return fl;
            return {
              ...fl,
              units: [...(fl.units || []), newUnit],
            };
          }),
        };
      });
      recalculateCounts(nextBlocks, plots);
      return nextBlocks;
    });

    setHasUnsavedChanges(true);
    setShowAddUnitModal(false);
  };

  // Quick Add Plot Callback from AddPlotModal
  const handleAddPlot = (data: PlotFormData) => {
    if (!data.plotNumber) return;

    const newPlot: Plot = {
      plotId: data.plotNumber,
      plotNumber: data.plotNumber,
      size: data.size,
      facing: data.facing,
      status: data.status,
    };

    setPlots((prevPlots) => {
      const nextPlots = [...prevPlots, newPlot];
      recalculateCounts(blocks, nextPlots);
      return nextPlots;
    });

    setHasUnsavedChanges(true);
    setShowAddPlotModal(false);
  };

  // Save to Database
  const handleSaveSummary = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      let tot = 0, avail = 0, bkd = 0, sld = 0;
      if (blocks.length > 0) {
        blocks.forEach((blk: any) => {
          (blk.floors || []).forEach((fl: any) => {
            (fl.units || []).forEach((u: any) => {
              tot++;
              if (u.status === 'available') avail++;
              else if (u.status === 'booked') bkd++;
              else if (u.status === 'sold') sld++;
            });
          });
        });
      } else if (plots.length > 0) {
        tot = plots.length;
        avail = plots.filter((item: any) => item.status === 'available').length;
        bkd = plots.filter((item: any) => item.status === 'booked').length;
        sld = plots.filter((item: any) => item.status === 'sold').length;
      }

      const res = await api.put(`/projects/${id}`, {
        version: project?.version || 1,
        blocks,
        plots,
        layoutImages,
        totalUnits: tot || totalUnits,
        availableUnits: avail,
        bookedUnits: bkd,
        blockedUnits: sld,
        soldUnits: sld,
        reservedUnits: sld,
        totalBlocks: Number(totalBlocks) || (blocks.length || 1),
        totalFloors: Number(totalFloors) || 1,
      });

      if (res.success) {
        setProject(res.data);
        setSaveSuccess(true);
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('Conflict') || err.message.includes('VERSION_CONFLICT'))) {
        alert('⚠️ Inventory Conflict Detected!\n\nAnother administrator recently updated this project or allocated units. We will reload the latest inventory now so your view is up to date.');
        await loadData();
      } else {
        alert(err.message || 'Failed to update units inventory');
      }
    } finally {
      setIsSaving(false);
    }
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
          <p className="text-xs font-bold text-slate-400">Loading project inventory...</p>
        </div>
      </div>
    );
  }

  const propType = project?.propertyType || 'Apartments';
  const typeConfig = getPropertyTypeConfig(propType);
  const isPlotType = propType === 'Plots';
  const isVillaType = propType === 'Villas';

  const total = Math.max(0, Number(totalUnits) || 0);
  const available = Math.max(0, Number(availableUnits) || 0);
  const booked = Math.max(0, Number(bookedUnits) || 0);
  const blocked = Math.max(0, Number(blockedUnits) || 0);

  const availablePct = total > 0 ? Math.round((available / total) * 100) : 0;
  const bookedPct = total > 0 ? Math.round((booked / total) * 100) : 0;
  const blockedPct = total > 0 ? Math.round((blocked / total) * 100) : 0;

  // Floor stats
  const floorTotal = floorUnits.length;
  const floorAvail = floorUnits.filter((u) => u.status === 'available').length;
  const floorBooked = floorUnits.filter((u) => u.status === 'booked').length;
  const floorSold = floorUnits.filter((u) => u.status === 'sold').length;

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto w-full pb-20">
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
                {project?.name || 'Project'} • {typeConfig.unitPlural} & Inventory
              </h1>
              <span className="rounded-full bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#f12131] font-heading">
                {propType}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select {isPlotType ? 'Plots' : isVillaType ? 'Enclave and Level' : 'Tower and Floor'} to quickly view and click to update live unit availability.
            </p>
          </div>
        </div>

        {/* Project Switcher & Save Button */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-heading mb-1">
              Switch Project:
            </label>
            <Select value={id} onValueChange={(val) => handleProjectSwitch(val)}>
              <SelectTrigger className="h-10 min-w-[200px] rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 outline-none hover:border-slate-300 focus:ring-2 focus:ring-[#f12131]/20 transition-all cursor-pointer shadow-none">
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

          <button
            type="button"
            onClick={handleSaveSummary}
            disabled={isSaving}
            className={`flex h-10 items-center gap-2 rounded-full px-5 text-xs font-black text-white shadow-md transition-all cursor-pointer mt-4 shrink-0 ${
              hasUnsavedChanges
                ? 'bg-[#f12131] hover:bg-[#d81928] animate-pulse ring-2 ring-red-400/50'
                : 'bg-[#29247c] hover:bg-[#1f1b63]'
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 animate-in fade-in duration-300 shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">
            ✓ Changes saved successfully! {total} total {typeConfig.unitPlural.toLowerCase()} ({available} Available, {booked} Booked, {blocked} Sold).
          </span>
        </div>
      )}

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && !saveSuccess && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200/80 p-3.5 text-amber-900 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold">
              You have unsaved status changes! Click "Save Changes" to publish your updates.
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveSummary}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-full bg-[#f12131] hover:bg-[#d81928] text-white text-xs font-black shadow-xs transition-all cursor-pointer"
          >
            Save Now
          </button>
        </div>
      )}

      {/* Overall Inventory Metrics Card */}
      <UnitsStatsBar
        total={total}
        available={available}
        booked={booked}
        blocked={blocked}
        availablePct={availablePct}
        bookedPct={bookedPct}
        blockedPct={blockedPct}
        unitPlural={typeConfig.unitPlural}
      />

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('status')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'status'
              ? 'bg-[#29247c] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Manage Unit Status (Interactive Grid)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('blueprint')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'blueprint'
              ? 'bg-[#29247c] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="h-4 w-4 text-slate-400" />
          <span>Blueprint & Floor Generator</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE UNIT STATUS MANAGER */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {!isPlotType ? (
            /* APARTMENTS / VILLAS / COMMERCIAL INTERACTIVE CONTROLS */
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              {/* Dropdown Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                {/* 1. Tower / Block Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 font-heading flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[#29247c]" />
                    {isVillaType ? 'Select Villa Enclave / Phase' : 'Select Tower / Block'}
                  </label>
                  <Select
                    value={selectedBlockId}
                    onValueChange={(val) => handleSelectBlock(val)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 shadow-none hover:border-slate-300 focus:ring-2 focus:ring-[#f12131]/20">
                      <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl">
                      {blocks.map((b) => {
                        const blkTotal = (b.floors || []).reduce(
                          (acc, f) => acc + (f.units || []).length,
                          0
                        );
                        const blkAvail = (b.floors || []).reduce(
                          (acc, f) =>
                            acc + (f.units || []).filter((u) => u.status === 'available').length,
                          0
                        );
                        return (
                          <SelectItem key={b.blockId} value={b.blockId} className="text-xs font-bold py-2.5">
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>{b.blockName}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                {blkAvail}/{blkTotal} Avail
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Floor / Level Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 font-heading flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#29247c]" />
                    {isVillaType ? 'Select Level / Duplex Tier' : 'Select Floor'}
                  </label>
                  <Select
                    value={String(selectedFloorNumber)}
                    onValueChange={(val) => setSelectedFloorNumber(Number(val))}
                  >
                    <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 shadow-none hover:border-slate-300 focus:ring-2 focus:ring-[#f12131]/20">
                      <SelectValue placeholder="Select Floor" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl max-h-72">
                      {selectedBlock?.floors?.map((f) => {
                        const flrTotal = (f.units || []).length;
                        const flrAvail = (f.units || []).filter((u) => u.status === 'available').length;
                        return (
                          <SelectItem
                            key={f.floorNumber}
                            value={String(f.floorNumber)}
                            className="text-xs font-bold py-2.5"
                          >
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>{f.floorName || getFloorName(f.floorNumber)}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                {flrAvail}/{flrTotal} Avail
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Horizontal Floor Pills for Fast 1-Click Navigation */}
              {selectedBlock && selectedBlock.floors && selectedBlock.floors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-heading">
                    Quick Floor Switcher:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {selectedBlock.floors.map((f) => {
                      const isActive = Number(f.floorNumber) === Number(selectedFloorNumber);
                      const fAvail = (f.units || []).filter((u) => u.status === 'available').length;
                      const fTotal = (f.units || []).length;
                      return (
                        <button
                          key={f.floorNumber}
                          type="button"
                          onClick={() => setSelectedFloorNumber(f.floorNumber)}
                          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-[#29247c] text-white border-[#29247c] shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{f.floorName || getFloorName(f.floorNumber)}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            }`}
                          >
                            {fAvail}/{fTotal}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Floor Header, Batch Actions & Filters */}
              <BatchFloorEditor
                floorName={selectedFloor?.floorName || getFloorName(selectedFloorNumber)}
                blockName={selectedBlock?.blockName || 'Tower'}
                total={floorTotal}
                available={floorAvail}
                booked={floorBooked}
                sold={floorSold}
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                onStatusFilterChange={setStatusFilter}
                onSearchQueryChange={setSearchQuery}
                onBatchStatusChange={(status) =>
                  handleBatchFloorStatus(selectedBlockId, selectedFloorNumber, status)
                }
                onOpenAddUnitModal={() => setShowAddUnitModal(true)}
              />

              {/* Units Grid with 1-Click Status Selection */}
              {filteredFloorUnits.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-400">
                    No units match the current filter or search criteria on this floor.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 text-xs font-bold text-[#f12131] hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFloorUnits.map((unit) => (
                    <UnitCard
                      key={unit.unitId || unit.unitNumber}
                      unit={unit}
                      selectedBlockId={selectedBlockId}
                      selectedFloorNumber={selectedFloorNumber}
                      enquiries={getEnquiriesForUnit(unit.unitNumber)}
                      onUpdateStatus={handleUpdateUnitStatus}
                      onOpenLeadAllocation={setAllocatingUnit}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* PLOTS INTERACTIVE STATUS MANAGER */
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              {/* Plots Header, Batch Actions & Filters */}
              <BatchPlotEditor
                total={plots.length}
                available={available}
                booked={booked}
                sold={blocked}
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                onStatusFilterChange={setStatusFilter}
                onSearchQueryChange={setSearchQuery}
                onBatchStatusChange={handleBatchPlotsStatus}
                onOpenAddPlotModal={() => setShowAddPlotModal(true)}
              />

              {/* Plots Grid with 1-Click Status Buttons */}
              {filteredPlots.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-400">
                    No plots match the current filter or search criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 text-xs font-bold text-[#f12131] hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPlots.map((plot) => (
                    <PlotCard
                      key={plot.plotId || plot.plotNumber}
                      plot={plot}
                      enquiries={getEnquiriesForUnit(plot.plotNumber)}
                      onUpdateStatus={handleUpdatePlotStatus}
                      onOpenLeadAllocation={setAllocatingUnit}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BLUEPRINT & FLOOR GENERATOR */}
      {activeTab === 'blueprint' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#f12131] font-heading">
                STRUCTURE & BLUEPRINT GENERATOR
              </span>
              <h2 className="text-xl font-black text-[#29247c] font-heading mt-0.5">
                {isPlotType
                  ? 'Plots Layout & Plot Blueprint'
                  : isVillaType
                  ? 'Villa Enclaves & Duplex Structure'
                  : 'Towers, Floors & Blueprint Generator'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Define standard floor count and typical unit compositions to generate or customize entire towers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveSummary}
              disabled={isSaving}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-6 text-xs font-black text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] active:scale-95 disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>

          <InventoryManager
            propertyType={propType}
            blocks={blocks}
            plots={plots}
            layoutImages={layoutImages}
            onChange={(updates) => {
              if (updates.blocks !== undefined) {
                setBlocks(updates.blocks);
                recalculateCounts(updates.blocks, plots);
              }
              if (updates.plots !== undefined) {
                setPlots(updates.plots);
                recalculateCounts(blocks, updates.plots);
              }
              if (updates.layoutImages !== undefined) setLayoutImages(updates.layoutImages);
              if (updates.totalBlocks !== undefined) setTotalBlocks(updates.totalBlocks);
              if (updates.totalFloors !== undefined) setTotalFloors(updates.totalFloors);
              setHasUnsavedChanges(true);
            }}
          />
        </div>
      )}

      {/* Floating Save Bar when changes are made */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#29247c] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-4 border border-indigo-900 animate-in slide-in-from-bottom-5">
          <span className="text-xs font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            Unsaved status modifications
          </span>
          <button
            type="button"
            onClick={handleSaveSummary}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f12131] hover:bg-[#d81928] text-white text-xs font-black transition-all cursor-pointer shadow-md"
          >
            {isSaving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Now</span>
          </button>
        </div>
      )}

      {/* Quick Add Unit Modal */}
      <AddUnitModal
        isOpen={showAddUnitModal}
        onClose={() => setShowAddUnitModal(false)}
        onAddUnit={handleAddUnit}
        floorName={selectedFloor?.floorName || getFloorName(selectedFloorNumber)}
        blockName={selectedBlock?.blockName || 'Tower'}
      />

      {/* Quick Add Plot Modal */}
      <AddPlotModal
        isOpen={showAddPlotModal}
        onClose={() => setShowAddPlotModal(false)}
        onAddPlot={handleAddPlot}
      />

      {/* Unit Lead Allocation Modal */}
      <UnitLeadAllocationModal
        allocatingUnit={allocatingUnit}
        onClose={() => setAllocatingUnit(null)}
        onAllocateLead={handleAllocateLead}
        isAllocating={isAllocating}
      />
    </div>
  );
}

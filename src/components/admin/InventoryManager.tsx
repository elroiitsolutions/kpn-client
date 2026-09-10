'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Layers,
  Plus,
  Trash2,
  Copy,
  Edit,
  Check,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface BookedLeadInfo {
  enquiryId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  action?: 'booked' | 'sold';
  allocatedAt?: string;
}

export interface Unit {
  unitId: string;
  unitNumber: string;
  bhk: number;
  bathrooms: number;
  size: number;
  unitType: string;
  facing: string;
  status: 'available' | 'booked' | 'sold';
  position?: { row: number; col: number };
  unitPlanImages?: string[];
  bookedTo?: BookedLeadInfo;
}

export interface UnitTypeConfig {
  name: string;
  bhk: number;
  bathrooms: number;
  size: number;
  count: number;
}

export interface Floor {
  floorNumber: number;
  floorName: string;
  units: Unit[];
  floorChartImages?: string[];
}

export interface Block {
  blockId: string;
  blockName: string;
  totalFloors: number;
  floors: Floor[];
  floorPlanImages?: string[];
}

export interface Plot {
  plotId: string;
  plotNumber: string;
  size: number;
  facing?: string;
  status: 'available' | 'booked' | 'sold';
  bookedTo?: BookedLeadInfo;
}

interface BlockConfig {
  floors: number;
  pattern: 'numeric' | 'alpha' | 'hyphen';
  unitTypes: UnitTypeConfig[];
}

interface InventoryManagerProps {
  propertyType: string;
  blocks: Block[];
  plots: Plot[];
  layoutImages: string[];
  onChange: (data: {
    blocks?: Block[];
    plots?: Plot[];
    layoutImages?: string[];
    totalBlocks?: number;
    totalFloors?: number;
    totalUnits?: number;
    availableUnits?: number;
    bookedUnits?: number;
    blockedUnits?: number;
    soldUnits?: number;
  }) => void;
}

export const getFloorName = (num: number): string => {
  if (num === 0) return 'Ground Floor';
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]) + ' Floor';
};

const generateUnitsFromTypes = (
  floorNumber: number,
  unitTypes: UnitTypeConfig[],
  pattern: string
): Unit[] => {
  const units: Unit[] = [];
  let unitIndex = 1;

  unitTypes.forEach((unitType) => {
    for (let i = 0; i < unitType.count; i++) {
      let unitNumber = '';
      if (pattern === 'numeric') {
        unitNumber = `${floorNumber}${String(unitIndex).padStart(2, '0')}`;
      } else if (pattern === 'alpha') {
        unitNumber = `${floorNumber}${String.fromCharCode(64 + unitIndex)}`;
      } else {
        unitNumber = `${floorNumber}-${unitIndex}`;
      }

      units.push({
        unitId: unitNumber,
        unitNumber: unitNumber,
        bhk: unitType.bhk,
        bathrooms: unitType.bathrooms,
        size: unitType.size,
        unitType: unitType.name,
        facing: 'East',
        status: 'available',
        position: { row: Math.floor((unitIndex - 1) / 4), col: (unitIndex - 1) % 4 },
      });
      unitIndex++;
    }
  });

  return units;
};

export default function InventoryManager({
  propertyType,
  blocks = [],
  plots = [],
  layoutImages = [],
  onChange,
}: InventoryManagerProps) {
  const isPlots = propertyType === 'Plots';

  // Blocks Config State
  const [blockConfigs, setBlockConfigs] = useState<Record<string, BlockConfig>>({});
  const [expandedBlocks, setExpandedBlocks] = useState<string[]>([]);
  const [editingFloor, setEditingFloor] = useState<{ blockId: string; floorNumber: number } | null>(null);
  const [copyTargetFloors, setCopyTargetFloors] = useState<number[]>([]);
  const [isUploadingFloorImage, setIsUploadingFloorImage] = useState(false);
  const [isUploadingLayoutImage, setIsUploadingLayoutImage] = useState(false);

  // Plots Config State
  const [plotsConfig, setPlotsConfig] = useState({
    totalPlots: 24,
    defaultSize: 1200,
    pattern: 'numeric' as 'numeric' | 'alpha' | 'prefix',
    prefix: 'P-',
  });
  const [plotsPage, setPlotsPage] = useState(0);
  const PLOTS_PER_PAGE = 30;

  // Initialize block configs for existing blocks
  useEffect(() => {
    if (blocks.length > 0) {
      const initialConfigs: Record<string, BlockConfig> = {};
      blocks.forEach((b) => {
        initialConfigs[b.blockId] = {
          floors: b.totalFloors || b.floors?.length || 4,
          pattern: 'numeric',
          unitTypes: [
            { name: 'Type A', bhk: 2, bathrooms: 2, size: 950, count: 4 },
            { name: 'Type B', bhk: 3, bathrooms: 2, size: 1250, count: 2 },
          ],
        };
      });
      setBlockConfigs((prev) => ({ ...initialConfigs, ...prev }));
      if (expandedBlocks.length === 0) {
        setExpandedBlocks([blocks[0].blockId]);
      }
    }
  }, [blocks.length]);

  // Lock background scroll when editing floor modal is open
  useEffect(() => {
    if (!editingFloor) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [editingFloor]);

  const recalculateStats = (newBlocks: Block[], newPlots: Plot[]) => {
    if (isPlots) {
      const totalUnits = newPlots.length;
      const availableUnits = newPlots.filter((p) => p.status === 'available').length;
      const bookedUnits = newPlots.filter((p) => p.status === 'booked').length;
      const soldUnits = newPlots.filter((p) => p.status === 'sold').length;
      return {
        plots: newPlots,
        totalUnits,
        availableUnits,
        bookedUnits,
        blockedUnits: 0,
        soldUnits,
        totalBlocks: 0,
        totalFloors: 0,
      };
    } else {
      let totalUnits = 0;
      let availableUnits = 0;
      let bookedUnits = 0;
      let soldUnits = 0;

      newBlocks.forEach((b) => {
        (b.floors || []).forEach((f) => {
          (f.units || []).forEach((u) => {
            totalUnits++;
            if (u.status === 'available') availableUnits++;
            else if (u.status === 'booked') bookedUnits++;
            else if (u.status === 'sold') soldUnits++;
          });
        });
      });

      const totalBlocks = newBlocks.length;
      const totalFloors = Math.max(
        ...newBlocks.map((b) => b.totalFloors || (b.floors ? b.floors.length : 1)),
        1
      );

      return {
        blocks: newBlocks,
        totalUnits,
        availableUnits,
        bookedUnits,
        blockedUnits: 0,
        soldUnits,
        totalBlocks,
        totalFloors,
      };
    }
  };

  // --- BLOCK ACTIONS ---
  const addBlock = () => {
    const nextChar = String.fromCharCode(65 + blocks.length);
    const blockId = nextChar;
    const blockName = `Block ${nextChar}`;
    const newBlock: Block = {
      blockId,
      blockName,
      totalFloors: 4,
      floorPlanImages: [],
      floors: [],
    };

    const newBlocks = [...blocks, newBlock];
    setBlockConfigs((prev) => ({
      ...prev,
      [blockId]: {
        floors: 4,
        pattern: 'numeric',
        unitTypes: [
          { name: 'Type A', bhk: 2, bathrooms: 2, size: 950, count: 4 },
          { name: 'Type B', bhk: 3, bathrooms: 2, size: 1250, count: 2 },
        ],
      },
    }));
    setExpandedBlocks((prev) => [...prev, blockId]);
    onChange(recalculateStats(newBlocks, plots));
  };

  const removeBlock = (blockId: string) => {
    const newBlocks = blocks.filter((b) => b.blockId !== blockId);
    onChange(recalculateStats(newBlocks, plots));
  };

  const getBlockConfig = (blockId: string): BlockConfig => {
    return (
      blockConfigs[blockId] || {
        floors: 4,
        pattern: 'numeric',
        unitTypes: [
          { name: 'Type A', bhk: 2, bathrooms: 2, size: 950, count: 4 },
          { name: 'Type B', bhk: 3, bathrooms: 2, size: 1250, count: 2 },
        ],
      }
    );
  };

  const updateBlockConfig = (blockId: string, updates: Partial<BlockConfig>) => {
    setBlockConfigs((prev) => ({
      ...prev,
      [blockId]: { ...getBlockConfig(blockId), ...updates },
    }));
  };

  const addUnitType = (blockId: string) => {
    const config = getBlockConfig(blockId);
    const newTypeName = `Type ${String.fromCharCode(65 + config.unitTypes.length)}`;
    updateBlockConfig(blockId, {
      unitTypes: [
        ...config.unitTypes,
        { name: newTypeName, bhk: 2, bathrooms: 2, size: 1000, count: 2 },
      ],
    });
  };

  const updateUnitType = (
    blockId: string,
    index: number,
    updates: Partial<UnitTypeConfig>
  ) => {
    const config = getBlockConfig(blockId);
    const newTypes = [...config.unitTypes];
    newTypes[index] = { ...newTypes[index], ...updates };
    updateBlockConfig(blockId, { unitTypes: newTypes });
  };

  const removeUnitType = (blockId: string, index: number) => {
    const config = getBlockConfig(blockId);
    if (config.unitTypes.length <= 1) return;
    const newTypes = config.unitTypes.filter((_, i) => i !== index);
    updateBlockConfig(blockId, { unitTypes: newTypes });
  };

  const generateFloorsForBlock = (blockId: string) => {
    const config = getBlockConfig(blockId);
    const generatedFloors: Floor[] = [];

    for (let f = 1; f <= config.floors; f++) {
      generatedFloors.push({
        floorNumber: f,
        floorName: getFloorName(f),
        units: generateUnitsFromTypes(f, config.unitTypes, config.pattern),
        floorChartImages: [],
      });
    }

    const newBlocks = blocks.map((b) =>
      b.blockId === blockId
        ? { ...b, totalFloors: config.floors, floors: generatedFloors }
        : b
    );

    onChange(recalculateStats(newBlocks, plots));
  };

  // --- FLOOR EDITOR ACTIONS ---
  const currentEditingBlock = editingFloor
    ? blocks.find((b) => b.blockId === editingFloor.blockId)
    : null;
  const currentEditingFloor = currentEditingBlock
    ? currentEditingBlock.floors.find((f) => f.floorNumber === editingFloor?.floorNumber)
    : null;

  const updateCurrentFloorUnits = (newUnits: Unit[]) => {
    if (!editingFloor) return;
    const newBlocks = blocks.map((b) => {
      if (b.blockId !== editingFloor.blockId) return b;
      return {
        ...b,
        floors: b.floors.map((f) => {
          if (f.floorNumber !== editingFloor.floorNumber) return f;
          return { ...f, units: newUnits };
        }),
      };
    });
    onChange(recalculateStats(newBlocks, plots));
  };

  const handleFloorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingFloor) return;
    setIsUploadingFloorImage(true);
    try {
      const res = await api.upload(file, 'projects/floors');
      if (res.url) {
        const newBlocks = blocks.map((b) => {
          if (b.blockId !== editingFloor.blockId) return b;
          return {
            ...b,
            floors: b.floors.map((f) => {
              if (f.floorNumber !== editingFloor.floorNumber) return f;
              return {
                ...f,
                floorChartImages: [...(f.floorChartImages || []), res.url],
              };
            }),
          };
        });
        onChange(recalculateStats(newBlocks, plots));
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploadingFloorImage(false);
      e.target.value = '';
    }
  };

  const copyLayoutToOtherFloors = () => {
    if (!editingFloor || !currentEditingFloor || copyTargetFloors.length === 0) return;

    const sourceUnits = currentEditingFloor.units;
    const newBlocks = blocks.map((b) => {
      if (b.blockId !== editingFloor.blockId) return b;
      return {
        ...b,
        floors: b.floors.map((f) => {
          if (!copyTargetFloors.includes(f.floorNumber)) return f;
          // Re-generate unit numbers for the target floor using source units' specs
          const clonedUnits: Unit[] = sourceUnits.map((u, idx) => {
            const unitSuffix = u.unitNumber.replace(/^\d+/, '');
            const targetUnitNumber = `${f.floorNumber}${unitSuffix || String(idx + 1).padStart(2, '0')}`;
            return {
              ...u,
              unitId: targetUnitNumber,
              unitNumber: targetUnitNumber,
              status: 'available',
            };
          });
          return {
            ...f,
            units: clonedUnits,
            floorChartImages: currentEditingFloor.floorChartImages
              ? [...currentEditingFloor.floorChartImages]
              : [],
          };
        }),
      };
    });

    onChange(recalculateStats(newBlocks, plots));
    setCopyTargetFloors([]);
    alert(`Successfully cloned floor layout to ${copyTargetFloors.length} floor(s).`);
  };

  // --- PLOTS ACTIONS ---
  const generatePlots = () => {
    const newPlots: Plot[] = [];
    for (let i = 1; i <= plotsConfig.totalPlots; i++) {
      let plotNumber = '';
      if (plotsConfig.pattern === 'alpha') {
        plotNumber = `Plot-${String.fromCharCode(64 + Math.ceil(i / 26))}${i % 26 || 26}`;
      } else if (plotsConfig.pattern === 'prefix') {
        plotNumber = `${plotsConfig.prefix}${i}`;
      } else {
        plotNumber = `${i}`;
      }

      newPlots.push({
        plotId: `plot-${i}`,
        plotNumber,
        size: plotsConfig.defaultSize,
        facing: 'East',
        status: 'available',
      });
    }

    setPlotsPage(0);
    onChange(recalculateStats(blocks, newPlots));
  };

  const updatePlot = (plotId: string, updates: Partial<Plot>) => {
    const newPlots = plots.map((p) => (p.plotId === plotId ? { ...p, ...updates } : p));
    onChange(recalculateStats(blocks, newPlots));
  };

  const addPlot = () => {
    const nextNum = plots.length + 1;
    const newPlot: Plot = {
      plotId: `plot-${nextNum}`,
      plotNumber: `${nextNum}`,
      size: plotsConfig.defaultSize,
      facing: 'East',
      status: 'available',
    };
    onChange(recalculateStats(blocks, [...plots, newPlot]));
  };

  const removePlot = (plotId: string) => {
    const newPlots = plots.filter((p) => p.plotId !== plotId);
    onChange(recalculateStats(blocks, newPlots));
  };

  const handleLayoutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploadingLayoutImage(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const res = await api.upload(file, 'projects/layouts');
        if (res.url) urls.push(res.url);
      }
      onChange({
        layoutImages: [...layoutImages, ...urls],
      });
    } catch (err: any) {
      alert(err.message || 'Layout upload failed');
    } finally {
      setIsUploadingLayoutImage(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          PLOTS INVENTORY DESIGNER
      ========================================================= */}
      {isPlots ? (
        <div className="space-y-6">
          {/* Layout Plan Images */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-extrabold text-[#29247c] flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#f12131]" />
                  Layout & Master Plan Images
                </h4>
                <p className="text-xs text-slate-500">
                  Upload layout blueprints and plot demarcation charts for buyers to view
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer transition-colors shadow-xs">
                {isUploadingLayoutImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>Upload Layout Plan</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleLayoutImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {layoutImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {layoutImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 aspect-4/3"
                  >
                    <img src={img} alt={`Layout ${idx + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          layoutImages: layoutImages.filter((_, i) => i !== idx),
                        })
                      }
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-400 font-medium">
                No layout plan uploaded yet. Click "Upload Layout Plan" above.
              </div>
            )}
          </div>

          {/* Plot Generator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-[#29247c] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#f12131]" />
                  Plot Inventory Generator
                </h4>
                <p className="text-xs text-slate-500">
                  Quickly auto-generate plots with standardized sizes and customizable numbering
                </p>
              </div>

              <button
                type="button"
                onClick={generatePlots}
                className="flex items-center gap-2 rounded-xl bg-[#f12131] px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all self-start sm:self-auto"
              >
                <Sparkles className="h-4 w-4" />
                <span>⚡ Generate Plots</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Total Plots to Generate
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={plotsConfig.totalPlots}
                  onChange={(e) =>
                    setPlotsConfig({
                      ...plotsConfig,
                      totalPlots: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Default Size (Sq.Ft)
                </label>
                <input
                  type="number"
                  min="100"
                  value={plotsConfig.defaultSize}
                  onChange={(e) =>
                    setPlotsConfig({
                      ...plotsConfig,
                      defaultSize: parseInt(e.target.value, 10) || 1200,
                    })
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Numbering Pattern
                </label>
                <Select
                  value={plotsConfig.pattern}
                  onValueChange={(val) =>
                    setPlotsConfig({
                      ...plotsConfig,
                      pattern: val as any,
                    })
                  }
                >
                  <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20 cursor-pointer">
                    <SelectValue placeholder="Select Pattern" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                    <SelectItem value="numeric" className="text-xs font-bold py-1.5">Numeric (1, 2, 3...)</SelectItem>
                    <SelectItem value="prefix" className="text-xs font-bold py-1.5">Prefixed (P-1, P-2...)</SelectItem>
                    <SelectItem value="alpha" className="text-xs font-bold py-1.5">Alpha (Plot A-1, A-2...)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Plots List & Status Editor */}
            {plots.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>
                    Generated Plots ({plots.length} total) • Page {plotsPage + 1} of{' '}
                    {Math.ceil(plots.length / PLOTS_PER_PAGE)}
                  </span>
                  <button
                    type="button"
                    onClick={addPlot}
                    className="flex items-center gap-1.5 text-xs text-[#29247c] hover:underline font-extrabold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Single Plot</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-2.5">Plot #</th>
                        <th className="px-3 py-2.5">Size (Sq.Ft)</th>
                        <th className="px-3 py-2.5">Facing</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {plots
                        .slice(plotsPage * PLOTS_PER_PAGE, (plotsPage + 1) * PLOTS_PER_PAGE)
                        .map((plot) => (
                          <tr key={plot.plotId} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={plot.plotNumber}
                                onChange={(e) =>
                                  updatePlot(plot.plotId, { plotNumber: e.target.value })
                                }
                                className="h-8 w-24 rounded-lg border border-slate-200 px-2 font-bold text-slate-800"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={plot.size}
                                onChange={(e) =>
                                  updatePlot(plot.plotId, {
                                    size: parseInt(e.target.value, 10) || 0,
                                  })
                                }
                                className="h-8 w-24 rounded-lg border border-slate-200 px-2 font-bold text-slate-800"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <Select
                                value={plot.facing || 'East'}
                                onValueChange={(val) =>
                                  updatePlot(plot.plotId, { facing: val })
                                }
                              >
                                <SelectTrigger className="h-8 w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-800">
                                  <SelectValue placeholder="Facing" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                                  <SelectItem value="North" className="text-xs font-bold py-1">North</SelectItem>
                                  <SelectItem value="South" className="text-xs font-bold py-1">South</SelectItem>
                                  <SelectItem value="East" className="text-xs font-bold py-1">East</SelectItem>
                                  <SelectItem value="West" className="text-xs font-bold py-1">West</SelectItem>
                                  <SelectItem value="North-East" className="text-xs font-bold py-1">North-East</SelectItem>
                                  <SelectItem value="North-West" className="text-xs font-bold py-1">North-West</SelectItem>
                                  <SelectItem value="South-East" className="text-xs font-bold py-1">South-East</SelectItem>
                                  <SelectItem value="South-West" className="text-xs font-bold py-1">South-West</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2">
                              <Select
                                value={plot.status}
                                onValueChange={(val) =>
                                  updatePlot(plot.plotId, {
                                    status: val as any,
                                  })
                                }
                              >
                                <SelectTrigger
                                  className={`h-8 w-28 rounded-lg border px-2.5 text-xs font-black outline-none ${
                                    plot.status === 'available'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : plot.status === 'booked'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-red-50 text-red-700 border-red-200'
                                  }`}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                                  <SelectItem value="available" className="text-xs font-bold py-1 text-emerald-700">🟢 Available</SelectItem>
                                  <SelectItem value="booked" className="text-xs font-bold py-1 text-amber-700">🟡 Booked</SelectItem>
                                  <SelectItem value="sold" className="text-xs font-bold py-1 text-red-700">🔴 Sold</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => removePlot(plot.plotId)}
                                className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {plots.length > PLOTS_PER_PAGE && (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={plotsPage === 0}
                      onClick={() => setPlotsPage((prev) => Math.max(0, prev - 1))}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-slate-500 font-semibold">
                      Showing {plotsPage * PLOTS_PER_PAGE + 1} -{' '}
                      {Math.min((plotsPage + 1) * PLOTS_PER_PAGE, plots.length)} of {plots.length}
                    </span>
                    <button
                      type="button"
                      disabled={(plotsPage + 1) * PLOTS_PER_PAGE >= plots.length}
                      onClick={() => setPlotsPage((prev) => prev + 1)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-400 font-medium">
                No plots generated yet. Configure above and click "⚡ Generate Plots".
              </div>
            )}
          </div>
        </div>
      ) : (
        /* =========================================================
            APARTMENTS / TOWERS / BLOCKS INVENTORY DESIGNER
        ========================================================= */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-extrabold text-[#29247c] flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#f12131]" />
                Blocks & Towers Configuration
              </h4>
              <p className="text-xs text-slate-500">
                Create blocks, configure unit blueprints, and automatically generate floors & units
              </p>
            </div>

            <button
              type="button"
              onClick={addBlock}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Block</span>
            </button>
          </div>

          {blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center space-y-3">
              <Building2 className="mx-auto h-10 w-10 text-slate-400" />
              <p className="text-sm font-extrabold text-slate-700">No blocks configured yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click "Add Block" to create your first block (e.g., Block A), configure its floors, and generate units.
              </p>
              <button
                type="button"
                onClick={addBlock}
                className="inline-flex items-center gap-2 rounded-xl bg-[#f12131] px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-[#d81928] transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Create Block A</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {blocks.map((block) => {
                const isExpanded = expandedBlocks.includes(block.blockId);
                const config = getBlockConfig(block.blockId);
                const totalUnitsInBlock = (block.floors || []).reduce(
                  (acc, f) => acc + (f.units?.length || 0),
                  0
                );
                const availableUnitsInBlock = (block.floors || []).reduce(
                  (acc, f) =>
                    acc + (f.units?.filter((u) => u.status === 'available').length || 0),
                  0
                );

                return (
                  <div
                    key={block.blockId}
                    className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden"
                  >
                    {/* Block Header */}
                    <div
                      onClick={() =>
                        setExpandedBlocks((prev) =>
                          prev.includes(block.blockId)
                            ? prev.filter((id) => id !== block.blockId)
                            : [...prev, block.blockId]
                        )}
                      className="flex items-center justify-between p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#29247c] text-white font-black text-sm">
                          {block.blockId}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-[#29247c]">
                              {block.blockName}
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-extrabold text-slate-700">
                              {block.totalFloors} Floors
                            </span>
                            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold">
                              {availableUnitsInBlock} / {totalUnitsInBlock} Available
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">
                            {block.floors?.length > 0
                              ? `${block.floors.length} floors generated (${totalUnitsInBlock} units)`
                              : 'Floors not yet generated'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => removeBlock(block.blockId)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                          title="Delete Block"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBlocks((prev) =>
                              prev.includes(block.blockId)
                                ? prev.filter((id) => id !== block.blockId)
                                : [...prev, block.blockId]
                            )
                          }
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Block Body */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 space-y-6">
                        {/* Blueprint & Floor Generation Setup */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                            <div>
                              <h5 className="text-xs font-black uppercase tracking-wider text-[#29247c]">
                                Floor & Unit Blueprint for {block.blockName}
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                Define standard floor count and unit compositions to generate units in 1 click
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => generateFloorsForBlock(block.blockId)}
                              className="flex items-center gap-2 rounded-xl bg-[#f12131] px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
                            >
                              <Sparkles className="h-4 w-4" />
                              <span>⚡ Generate Floors & Units</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                Total Floors in Block*
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={config.floors}
                                onChange={(e) =>
                                  updateBlockConfig(block.blockId, {
                                    floors: parseInt(e.target.value, 10) || 1,
                                  })
                                }
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                                Numbering Pattern
                              </label>
                              <Select
                                value={config.pattern}
                                onValueChange={(val) =>
                                  updateBlockConfig(block.blockId, {
                                    pattern: val as any,
                                  })
                                }
                              >
                                <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20 cursor-pointer">
                                  <SelectValue placeholder="Select Pattern" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                                  <SelectItem value="numeric" className="text-xs font-bold py-1.5">Numeric (101, 102... 201, 202)</SelectItem>
                                  <SelectItem value="alpha" className="text-xs font-bold py-1.5">Alpha (1A, 1B... 2A, 2B)</SelectItem>
                                  <SelectItem value="hyphen" className="text-xs font-bold py-1.5">Hyphenated (1-1, 1-2... 2-1, 2-2)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Unit Types Blueprint Matrix */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                Typical Floor Unit Types
                              </label>
                              <button
                                type="button"
                                onClick={() => addUnitType(block.blockId)}
                                className="flex items-center gap-1 text-[11px] font-extrabold text-[#29247c] hover:underline"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Add Unit Type</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {config.unitTypes.map((type, idx) => (
                                <div
                                  key={idx}
                                  className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center rounded-xl border border-slate-200 bg-white p-2.5"
                                >
                                  <div className="font-extrabold text-xs text-slate-800 px-2">
                                    {type.name}
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block sm:hidden">BHK</span>
                                    <Select
                                      value={String(type.bhk)}
                                      onValueChange={(val) =>
                                        updateUnitType(block.blockId, idx, {
                                          bhk: parseInt(val, 10) || 1,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="h-8 w-full rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 px-2">
                                        <SelectValue placeholder="BHK" />
                                      </SelectTrigger>
                                      <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                                        <SelectItem value="1" className="text-xs font-bold py-1">1 BHK</SelectItem>
                                        <SelectItem value="2" className="text-xs font-bold py-1">2 BHK</SelectItem>
                                        <SelectItem value="3" className="text-xs font-bold py-1">3 BHK</SelectItem>
                                        <SelectItem value="4" className="text-xs font-bold py-1">4 BHK</SelectItem>
                                        <SelectItem value="5" className="text-xs font-bold py-1">5 BHK</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block sm:hidden">Bathrooms</span>
                                    <input
                                      type="number"
                                      min="1"
                                      max="6"
                                      value={type.bathrooms}
                                      onChange={(e) =>
                                        updateUnitType(block.blockId, idx, {
                                          bathrooms: parseInt(e.target.value, 10) || 1,
                                        })
                                      }
                                      placeholder="Baths"
                                      className="h-8 w-full rounded-lg border border-slate-200 text-xs font-bold px-2 text-slate-700"
                                      title="Bathrooms"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block sm:hidden">Size Sq.Ft</span>
                                    <input
                                      type="number"
                                      min="100"
                                      value={type.size}
                                      onChange={(e) =>
                                        updateUnitType(block.blockId, idx, {
                                          size: parseInt(e.target.value, 10) || 0,
                                        })
                                      }
                                      placeholder="Size Sq.Ft"
                                      className="h-8 w-full rounded-lg border border-slate-200 text-xs font-bold px-2 text-slate-700"
                                      title="Size (Sq.Ft)"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block sm:hidden">Count/Floor</span>
                                    <input
                                      type="number"
                                      min="1"
                                      max="50"
                                      value={type.count}
                                      onChange={(e) =>
                                        updateUnitType(block.blockId, idx, {
                                          count: parseInt(e.target.value, 10) || 1,
                                        })
                                      }
                                      placeholder="Count/Floor"
                                      className="h-8 w-full rounded-lg border border-slate-200 text-xs font-bold px-2 text-slate-700"
                                      title="Count of this unit type per floor"
                                    />
                                  </div>
                                  <div className="flex justify-end px-2">
                                    {config.unitTypes.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeUnitType(block.blockId, idx)}
                                        className="text-slate-400 hover:text-red-600 p-1"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <p className="text-[11px] text-slate-500 font-semibold mt-2 text-right">
                              Total: {config.unitTypes.reduce((acc, t) => acc + t.count, 0)} units per floor •{' '}
                              {config.unitTypes.reduce((acc, t) => acc + t.count, 0) * config.floors} total block units
                            </p>
                          </div>
                        </div>

                        {/* Generated Floors List */}
                        {block.floors && block.floors.length > 0 ? (
                          <div className="space-y-3">
                            <h5 className="text-xs font-black uppercase tracking-wider text-[#29247c]">
                              Generated Floors & Unit Details
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {[...block.floors].reverse().map((floor) => {
                                const availCount = (floor.units || []).filter(
                                  (u) => u.status === 'available'
                                ).length;
                                return (
                                  <div
                                    key={floor.floorNumber}
                                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-[#29247c]/30 transition-all flex flex-col justify-between"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-black text-sm text-[#29247c]">
                                          {floor.floorName}
                                        </span>
                                        <span
                                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                            availCount > 0
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}
                                        >
                                          {availCount} / {floor.units?.length || 0} Avail
                                        </span>
                                      </div>

                                      <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-3">
                                        Units: {floor.units?.map((u) => u.unitNumber).join(', ')}
                                      </p>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-400 font-semibold">
                                        {floor.floorChartImages && floor.floorChartImages.length > 0
                                          ? 'Floor Plan Attached'
                                          : 'No Plan Image'}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEditingFloor({
                                            blockId: block.blockId,
                                            floorNumber: floor.floorNumber,
                                          })
                                        }
                                        className="flex items-center gap-1 text-xs font-bold text-[#f12131] hover:underline"
                                      >
                                        <Edit className="h-3 w-3" />
                                        <span>Edit Units</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-400 font-medium">
                            No floors generated yet. Click "⚡ Generate Floors & Units" above.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          FLOOR EDITOR MODAL (Units & Floor Plan Image)
      ========================================================= */}
      {editingFloor && currentEditingBlock && currentEditingFloor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#29247c]">
                  Edit {currentEditingBlock.blockName} • {currentEditingFloor.floorName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Modify unit numbers, sizes, facings, status, and upload floor chart images
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingFloor(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Floor Plan Image Section */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="text-xs font-black text-slate-800">
                      Floor Plan / Demarcation Image
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Floor layout diagram displayed to users browsing this floor
                    </p>
                  </div>

                  <label className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer transition-colors">
                    {isUploadingFloorImage ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFloorImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {currentEditingFloor.floorChartImages &&
                currentEditingFloor.floorChartImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentEditingFloor.floorChartImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-20 w-32 rounded-xl border border-slate-200 overflow-hidden bg-white"
                      >
                        <img src={img} alt="Floor" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = currentEditingFloor.floorChartImages?.filter(
                              (_, i) => i !== idx
                            );
                            const newBlocks = blocks.map((b) => {
                              if (b.blockId !== editingFloor.blockId) return b;
                              return {
                                ...b,
                                floors: b.floors.map((f) =>
                                  f.floorNumber === editingFloor.floorNumber
                                    ? { ...f, floorChartImages: newImages }
                                    : f
                                ),
                              };
                            });
                            onChange(recalculateStats(newBlocks, plots));
                          }}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-md bg-red-600 text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 font-medium italic">
                    No floor image uploaded yet for this floor.
                  </p>
                )}
              </div>

              {/* Units Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Units on this Floor ({currentEditingFloor.units?.length || 0})
                  </h5>

                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = (currentEditingFloor.units?.length || 0) + 1;
                      const newUnit: Unit = {
                        unitId: `${currentEditingFloor.floorNumber}${String(nextIndex).padStart(2, '0')}`,
                        unitNumber: `${currentEditingFloor.floorNumber}${String(nextIndex).padStart(2, '0')}`,
                        bhk: 2,
                        bathrooms: 2,
                        size: 1000,
                        unitType: 'Custom',
                        facing: 'East',
                        status: 'available',
                      };
                      updateCurrentFloorUnits([...(currentEditingFloor.units || []), newUnit]);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#29247c] hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Unit</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-2.5">Unit #</th>
                        <th className="px-3 py-2.5">BHK</th>
                        <th className="px-3 py-2.5">Size (Sq.Ft)</th>
                        <th className="px-3 py-2.5">Facing</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(currentEditingFloor.units || []).map((unit, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={unit.unitNumber}
                              onChange={(e) => {
                                const copy = [...currentEditingFloor.units];
                                copy[idx] = {
                                  ...copy[idx],
                                  unitNumber: e.target.value,
                                  unitId: e.target.value,
                                };
                                updateCurrentFloorUnits(copy);
                              }}
                              className="h-8 w-24 rounded-lg border border-slate-200 px-2 font-bold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Select
                              value={String(unit.bhk)}
                              onValueChange={(val) => {
                                const copy = [...currentEditingFloor.units];
                                copy[idx] = {
                                  ...copy[idx],
                                  bhk: parseInt(val, 10) || 1,
                                };
                                updateCurrentFloorUnits(copy);
                              }}
                            >
                              <SelectTrigger className="h-8 w-24 rounded-lg border border-slate-200 bg-white px-2 font-bold text-slate-700 text-xs">
                                <SelectValue placeholder="BHK" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                                <SelectItem value="1" className="text-xs font-bold py-1">1 BHK</SelectItem>
                                <SelectItem value="2" className="text-xs font-bold py-1">2 BHK</SelectItem>
                                <SelectItem value="3" className="text-xs font-bold py-1">3 BHK</SelectItem>
                                <SelectItem value="4" className="text-xs font-bold py-1">4 BHK</SelectItem>
                                <SelectItem value="5" className="text-xs font-bold py-1">5 BHK</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={unit.size}
                              onChange={(e) => {
                                const copy = [...currentEditingFloor.units];
                                copy[idx] = {
                                  ...copy[idx],
                                  size: parseInt(e.target.value, 10) || 0,
                                };
                                updateCurrentFloorUnits(copy);
                              }}
                              className="h-8 w-24 rounded-lg border border-slate-200 px-2 font-bold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Select
                              value={unit.facing || 'East'}
                              onValueChange={(val) => {
                                const copy = [...currentEditingFloor.units];
                                copy[idx] = { ...copy[idx], facing: val };
                                updateCurrentFloorUnits(copy);
                              }}
                            >
                              <SelectTrigger className="h-8 w-28 rounded-lg border border-slate-200 bg-white px-2 font-semibold text-slate-700 text-xs">
                                <SelectValue placeholder="Facing" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                                <SelectItem value="North" className="text-xs font-bold py-1">North</SelectItem>
                                <SelectItem value="South" className="text-xs font-bold py-1">South</SelectItem>
                                <SelectItem value="East" className="text-xs font-bold py-1">East</SelectItem>
                                <SelectItem value="West" className="text-xs font-bold py-1">West</SelectItem>
                                <SelectItem value="North-East" className="text-xs font-bold py-1">North-East</SelectItem>
                                <SelectItem value="North-West" className="text-xs font-bold py-1">North-West</SelectItem>
                                <SelectItem value="South-East" className="text-xs font-bold py-1">South-East</SelectItem>
                                <SelectItem value="South-West" className="text-xs font-bold py-1">South-West</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-3 py-2">
                            <Select
                              value={unit.status}
                              onValueChange={(val) => {
                                const copy = [...currentEditingFloor.units];
                                copy[idx] = {
                                  ...copy[idx],
                                  status: val as any,
                                };
                                updateCurrentFloorUnits(copy);
                              }}
                            >
                              <SelectTrigger
                                className={`h-8 w-28 rounded-lg border px-2.5 text-xs font-black outline-none ${
                                  unit.status === 'available'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : unit.status === 'booked'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                                <SelectItem value="available" className="text-xs font-bold py-1 text-emerald-700">🟢 Available</SelectItem>
                                <SelectItem value="booked" className="text-xs font-bold py-1 text-amber-700">🟡 Booked</SelectItem>
                                <SelectItem value="sold" className="text-xs font-bold py-1 text-red-700">🔴 Sold</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const copy = currentEditingFloor.units.filter((_, i) => i !== idx);
                                updateCurrentFloorUnits(copy);
                              }}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Copy Layout to Other Floors Tool */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-[#29247c] font-black text-xs">
                  <Copy className="h-4 w-4 text-[#f12131]" />
                  <span>Replicate this layout to other floors</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Select other floors in {currentEditingBlock.blockName} to clone this floor's units structure and plan:
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentEditingBlock.floors
                    .filter((f) => f.floorNumber !== currentEditingFloor.floorNumber)
                    .map((f) => {
                      const isSelected = copyTargetFloors.includes(f.floorNumber);
                      return (
                        <button
                          key={f.floorNumber}
                          type="button"
                          onClick={() => {
                            setCopyTargetFloors((prev) =>
                              isSelected
                                ? prev.filter((num) => num !== f.floorNumber)
                                : [...prev, f.floorNumber]
                            );
                          }}
                          className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-[#29247c] text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {f.floorName}
                        </button>
                      );
                    })}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const otherFloorNums = currentEditingBlock.floors
                        .filter((f) => f.floorNumber !== currentEditingFloor.floorNumber)
                        .map((f) => f.floorNumber);
                      setCopyTargetFloors(otherFloorNums);
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:underline"
                  >
                    Select All Floors
                  </button>

                  {copyTargetFloors.length > 0 && (
                    <button
                      type="button"
                      onClick={copyLayoutToOtherFloors}
                      className="flex items-center gap-1 rounded-lg bg-[#f12131] px-4 py-1.5 text-xs font-extrabold text-white shadow-xs hover:bg-[#d81928] transition-all"
                    >
                      <Check className="h-3 w-3" />
                      <span>Clone to {copyTargetFloors.length} Floors</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setEditingFloor(null)}
                className="rounded-xl bg-[#29247c] px-6 py-2.5 text-xs font-extrabold text-white hover:bg-[#1f1b5e] transition-colors"
              >
                Done Editing Floor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { use, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Layers,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  Building,
  Save,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';

interface UnitsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectUnitsManagerPage({ params }: UnitsPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [project, setProject] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    block: 'Block A',
    floor: 'Floor 1',
    unitNumber: '',
    type: '2 BHK',
    sizeSqFt: 850,
    facing: 'East',
    price: 4500000,
    status: 'Available',
    remarks: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projRes, unitsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/units`),
      ]);

      if (projRes.success) setProject(projRes.data);
      if (unitsRes.success) setUnits(unitsRes.data || []);
    } catch (err) {
      console.warn('Failed to load project units:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleUpdateStatus = async (unitId: string, newStatus: string) => {
    try {
      const res = await api.put(`/projects/units/${unitId}`, { status: newStatus });
      if (res.success) {
        setUnits((prev) =>
          prev.map((u) => (u._id === unitId ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update unit status');
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    try {
      const res = await api.delete(`/projects/units/${unitId}`);
      if (res.success) {
        setUnits((prev) => prev.filter((u) => u._id !== unitId));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete unit');
    }
  };

  const handleAddUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/projects/${id}/units`, newUnit);
      if (res.success && res.data) {
        setUnits((prev) => [...prev, res.data]);
        setIsModalOpen(false);
        setNewUnit({
          block: newUnit.block,
          floor: newUnit.floor,
          unitNumber: '',
          type: newUnit.type,
          sizeSqFt: newUnit.sizeSqFt,
          facing: 'East',
          price: newUnit.price,
          status: 'Available',
          remarks: '',
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add unit. Ensure unit number is unique in this floor/block.');
    }
  };

  // Group units by Block and then by Floor
  const groupedUnits = useMemo(() => {
    const groups: Record<string, Record<string, any[]>> = {};

    units.forEach((u) => {
      const block = u.block || 'Block A';
      const floor = u.floor || 'Ground Floor';

      if (!groups[block]) groups[block] = {};
      if (!groups[block][floor]) groups[block][floor] = [];

      groups[block][floor].push(u);
    });

    return groups;
  }, [units]);

  const stats = useMemo(() => {
    return {
      total: units.length,
      available: units.filter((u) => u.status === 'Available').length,
      reserved: units.filter((u) => u.status === 'Reserved').length,
      sold: units.filter((u) => u.status === 'Sold').length,
      blocked: units.filter((u) => u.status === 'Blocked').length,
    };
  }, [units]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Available':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'Reserved':
        return 'border-amber-200 bg-amber-50 text-amber-800';
      case 'Sold':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'Blocked':
        return 'border-slate-200 bg-slate-100 text-slate-700';
      default:
        return 'border-slate-200 bg-white text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#29247c]">
                {project?.name || 'Project'} • Unit Availability
              </h1>
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-extrabold uppercase text-slate-600">
                {project?.propertyType}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Manage property-wise floors, blocks, unit statuses, and pricing.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Unit</span>
        </button>
      </div>

      {/* KPI Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Units</p>
          <p className="text-2xl font-black text-[#29247c] mt-1">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Available</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.available}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Reserved</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{stats.reserved}</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">Sold</p>
          <p className="text-2xl font-black text-red-700 mt-1">{stats.sold}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Blocked</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{stats.blocked}</p>
        </div>
      </div>

      {/* Unit Availability Matrix by Block and Floor */}
      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading property unit availability matrix...
        </div>
      ) : Object.keys(groupedUnits).length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-xs">
          <Layers className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-extrabold text-slate-700">No units registered for this project</p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;Add New Unit&quot; above to configure blocks, floors, and availability.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedUnits).map(([blockName, floors]) => (
            <div
              key={blockName}
              className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xs space-y-6"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Building className="h-5 w-5 text-[#f12131]" />
                <h2 className="text-base font-black tracking-tight text-[#29247c]">
                  {blockName}
                </h2>
              </div>

              <div className="space-y-6">
                {Object.entries(floors).map(([floorName, floorUnits]) => (
                  <div key={floorName} className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      {floorName}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {floorUnits.map((unit) => (
                        <div
                          key={unit._id}
                          className={`rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between ${getStatusStyle(
                            unit.status
                          )}`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-black tracking-tight">
                                {unit.unitNumber}
                              </span>
                              <button
                                onClick={() => handleDeleteUnit(unit._id)}
                                title="Remove unit"
                                className="text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <p className="text-xs font-bold opacity-80">
                              {unit.type} {unit.sizeSqFt ? `• ${unit.sizeSqFt} sq.ft` : ''}
                            </p>
                            {unit.price ? (
                              <p className="text-xs font-extrabold opacity-90">
                                ₹ {(unit.price / 100000).toFixed(1)} Lakhs
                              </p>
                            ) : null}
                          </div>

                          {/* Quick Status Switcher */}
                          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">
                              Status:
                            </span>

                            <select
                              value={unit.status}
                              onChange={(e) => handleUpdateStatus(unit._id, e.target.value)}
                              className="h-7 rounded-lg border border-black/10 bg-white/90 px-2 text-[11px] font-bold text-slate-800 outline-none"
                            >
                              <option value="Available">Available</option>
                              <option value="Reserved">Reserved</option>
                              <option value="Sold">Sold</option>
                              <option value="Blocked">Blocked</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Unit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-black tracking-tight text-[#29247c]">
                Add Unit to {project?.name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddUnitSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Block Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={newUnit.block}
                    onChange={(e) => setNewUnit({ ...newUnit, block: e.target.value })}
                    placeholder="e.g. Block A"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Floor Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={newUnit.floor}
                    onChange={(e) => setNewUnit({ ...newUnit, floor: e.target.value })}
                    placeholder="e.g. 1st Floor"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Unit Number*
                  </label>
                  <input
                    type="text"
                    required
                    value={newUnit.unitNumber}
                    onChange={(e) => setNewUnit({ ...newUnit, unitNumber: e.target.value })}
                    placeholder="e.g. A101"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Type / Spec
                  </label>
                  <input
                    type="text"
                    value={newUnit.type}
                    onChange={(e) => setNewUnit({ ...newUnit, type: e.target.value })}
                    placeholder="e.g. 2 BHK"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Size (Sq.Ft)
                  </label>
                  <input
                    type="number"
                    value={newUnit.sizeSqFt}
                    onChange={(e) => setNewUnit({ ...newUnit, sizeSqFt: parseInt(e.target.value, 10) || 0 })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newUnit.price}
                    onChange={(e) => setNewUnit({ ...newUnit, price: parseInt(e.target.value, 10) || 0 })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newUnit.status}
                    onChange={(e) => setNewUnit({ ...newUnit, status: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 px-5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-full bg-[#f12131] text-xs font-bold text-white shadow-md hover:bg-[#d81928]"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

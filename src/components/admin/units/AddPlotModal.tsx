'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlotFormData } from './types';

interface AddPlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlot: (data: PlotFormData) => void;
}

export default function AddPlotModal({
  isOpen,
  onClose,
  onAddPlot,
}: AddPlotModalProps) {
  const [plotNumber, setPlotNumber] = useState('');
  const [size, setSize] = useState(1500);
  const [facing, setFacing] = useState('North');
  const [status, setStatus] = useState<'available' | 'booked' | 'sold'>('available');

  // Background scroll lock & Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotNumber.trim()) return;

    onAddPlot({
      plotNumber: plotNumber.trim(),
      size: Number(size) || 1500,
      facing,
      status,
    });

    // Reset
    setPlotNumber('');
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-[#29247c] font-heading">Add Plot</h3>
            <p className="text-xs text-slate-500 font-medium">Add a new plot to the master layout</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 font-heading block mb-1">
              Plot Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. P-25"
              value={plotNumber}
              onChange={(e) => setPlotNumber(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#29247c]"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 font-heading block mb-1">
              Area (Sq. Ft) *
            </label>
            <input
              type="number"
              required
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#29247c]"
            />
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 font-heading block mb-1">
              Facing Direction
            </label>
            <Select value={facing} onValueChange={setFacing}>
              <SelectTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-800 outline-none shadow-none cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                <SelectItem value="North" className="text-xs font-medium py-1.5">North</SelectItem>
                <SelectItem value="East" className="text-xs font-medium py-1.5">East</SelectItem>
                <SelectItem value="West" className="text-xs font-medium py-1.5">West</SelectItem>
                <SelectItem value="South" className="text-xs font-medium py-1.5">South</SelectItem>
                <SelectItem value="North-East" className="text-xs font-medium py-1.5">North-East</SelectItem>
                <SelectItem value="North-West" className="text-xs font-medium py-1.5">North-West</SelectItem>
                <SelectItem value="South-East" className="text-xs font-medium py-1.5">South-East</SelectItem>
                <SelectItem value="South-West" className="text-xs font-medium py-1.5">South-West</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 font-heading block mb-1">
              Initial Status
            </label>
            <Select
              value={status}
              onValueChange={(val: 'available' | 'booked' | 'sold') => setStatus(val)}
            >
              <SelectTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-800 outline-none shadow-none cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                <SelectItem value="available" className="text-xs font-bold py-1.5">🟢 Available</SelectItem>
                <SelectItem value="booked" className="text-xs font-bold py-1.5">🟡 Booked</SelectItem>
                <SelectItem value="sold" className="text-xs font-bold py-1.5">🔴 Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#29247c] hover:bg-[#1f1b63] text-white text-xs font-black cursor-pointer shadow-xs transition"
            >
              Add Plot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use strict';
import React from 'react';
import { Plus, Search, X } from 'lucide-react';

export interface BatchPlotEditorProps {
  total: number;
  available: number;
  booked: number;
  sold: number;
  statusFilter: 'all' | 'available' | 'booked' | 'sold';
  searchQuery: string;
  onStatusFilterChange: (filter: 'all' | 'available' | 'booked' | 'sold') => void;
  onSearchQueryChange: (query: string) => void;
  onBatchStatusChange: (status: 'available' | 'booked' | 'sold') => void;
  onOpenAddPlotModal: () => void;
}

export const BatchPlotEditor: React.FC<BatchPlotEditorProps> = ({
  total,
  available,
  booked,
  sold,
  statusFilter,
  searchQuery,
  onStatusFilterChange,
  onSearchQueryChange,
  onBatchStatusChange,
  onOpenAddPlotModal,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-[#29247c] font-heading">
            Plots Inventory Manager
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
            <span>
              Total: <strong className="text-slate-800 font-bold">{total}</strong> plots
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{available} Available</span>
            <span>•</span>
            <span className="text-amber-700 font-bold">{booked} Booked</span>
            <span>•</span>
            <span className="text-rose-700 font-bold">{sold} Sold</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-[11px] font-bold">
            <span className="px-2 text-slate-400 font-medium">Batch:</span>
            <button
              type="button"
              onClick={() => onBatchStatusChange('available')}
              className="px-2 py-1 rounded-lg text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer"
              title="Set all plots to Available"
            >
              All Avail
            </button>
            <button
              type="button"
              onClick={() => onBatchStatusChange('booked')}
              className="px-2 py-1 rounded-lg text-amber-700 hover:bg-amber-100 hover:text-amber-800 transition-all cursor-pointer"
              title="Set all plots to Booked"
            >
              All Booked
            </button>
            <button
              type="button"
              onClick={() => onBatchStatusChange('sold')}
              className="px-2 py-1 rounded-lg text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-all cursor-pointer"
              title="Set all plots to Sold"
            >
              All Sold
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAddPlotModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Plot</span>
          </button>
        </div>
      </div>

      {/* Status Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({total})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('available')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'available'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:text-emerald-800'
            }`}
          >
            Available ({available})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('booked')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'booked'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:text-amber-800'
            }`}
          >
            Booked ({booked})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('sold')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'sold'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:text-rose-800'
            }`}
          >
            Sold ({sold})
          </button>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search plot number..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none focus:border-[#29247c]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchPlotEditor;

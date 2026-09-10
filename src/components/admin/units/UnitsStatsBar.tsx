'use client';

import React from 'react';

interface UnitsStatsBarProps {
  total: number;
  available: number;
  booked: number;
  blocked: number;
  availablePct: number;
  bookedPct: number;
  blockedPct: number;
  unitPlural: string;
}

export default function UnitsStatsBar({
  total,
  available,
  booked,
  blocked,
  availablePct,
  bookedPct,
  blockedPct,
  unitPlural,
}: UnitsStatsBarProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total {unitPlural}
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading mt-0.5">{total}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">100% full capacity</div>
        </div>
        <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/60 p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Available</div>
          <div className="text-2xl font-black text-emerald-700 font-heading mt-0.5">{available}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">{availablePct}% open for booking</div>
        </div>
        <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Booked</div>
          <div className="text-2xl font-black text-amber-700 font-heading mt-0.5">{booked}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">{bookedPct}% reserved / in process</div>
        </div>
        <div className="rounded-xl bg-rose-50/60 border border-rose-200/60 p-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Sold / Blocked</div>
          <div className="text-2xl font-black text-rose-700 font-heading mt-0.5">{blocked}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">{blockedPct}% closed sale</div>
        </div>
      </div>

      {/* Progress distribution bar */}
      {total > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${availablePct}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Available: ${availablePct}%`}
            />
            <div
              style={{ width: `${bookedPct}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`Booked: ${bookedPct}%`}
            />
            <div
              style={{ width: `${blockedPct}%` }}
              className="bg-rose-500 h-full transition-all duration-500"
              title={`Sold: ${blockedPct}%`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

'use strict';
import React from 'react';
import { Unit } from '@/components/admin/InventoryManager';
import { AllocatingUnit } from './types';

interface UnitCardProps {
  unit: Unit;
  selectedBlockId: string;
  selectedFloorNumber: number;
  enquiries: any[];
  onUpdateStatus: (
    blockId: string,
    floorNumber: number,
    unitId: string,
    status: 'available' | 'booked' | 'sold'
  ) => void;
  onOpenLeadAllocation: (unit: AllocatingUnit) => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  unit,
  selectedBlockId,
  selectedFloorNumber,
  enquiries,
  onUpdateStatus,
  onOpenLeadAllocation,
}) => {
  const isAvailable = unit.status === 'available';
  const isBooked = unit.status === 'booked';
  const isSold = unit.status === 'sold';

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 shadow-xs flex flex-col justify-between ${
        isAvailable
          ? 'border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-500/20'
          : isBooked
          ? 'border-amber-200 bg-amber-50/30 ring-1 ring-amber-500/20'
          : 'border-slate-200 bg-slate-50/60 opacity-90'
      }`}
    >
      <div>
        {/* Unit Top Badge & Unit Number */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-heading">
              UNIT
            </span>
            <h4 className="text-lg font-black text-[#29247c] tracking-tight font-heading">
              {unit.unitNumber}
            </h4>
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {unit.bhk ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-[#29247c] border border-blue-200/60">
                {unit.bhk} BHK
              </span>
            ) : null}
            {unit.facing ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                {unit.facing}
              </span>
            ) : null}
          </div>
        </div>

        {/* Unit Specifications */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-3 border-b border-slate-100 mb-2.5">
          <span>
            Size: <strong className="text-slate-800 font-bold">{unit.size || '--'} sq.ft</strong>
          </span>
          {unit.bathrooms ? <span>{unit.bathrooms} Baths</span> : null}
        </div>

        {/* Unit Enquiry Badge */}
        {enquiries.length > 0 && (
          <button
            type="button"
            onClick={() =>
              onOpenLeadAllocation({
                unitNumber: unit.unitNumber,
                unitId: unit.unitId,
                blockId: selectedBlockId,
                floorNumber: selectedFloorNumber,
                isPlot: false,
                currentStatus: unit.status,
                bookedTo: unit.bookedTo,
                enquiries,
              })
            }
            className="w-full mb-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200/80 font-bold text-xs transition cursor-pointer shadow-2xs"
            title="Click to view all interested leads and allocate"
          >
            <span className="flex items-center gap-1.5">
              <span>🔥</span>
              <span>
                {enquiries.length} Enquir{enquiries.length > 1 ? 'ies' : 'y'}
              </span>
            </span>
            <span className="text-[10px] uppercase font-black text-orange-700 underline">
              Manage Leads →
            </span>
          </button>
        )}

        {/* Assigned Customer Info if Booked/Sold */}
        {unit.bookedTo?.customerName && (
          <div className="mb-2.5 p-2 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] space-y-1">
            <div className="flex items-center justify-between font-black text-amber-950">
              <span>{unit.status === 'sold' ? 'Sold to:' : 'Booked to:'}</span>
              <span className="font-bold">{unit.bookedTo.customerName}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 font-semibold text-[10px]">
              <span>📞 {unit.bookedTo.customerPhone}</span>
              <button
                type="button"
                onClick={() =>
                  onOpenLeadAllocation({
                    unitNumber: unit.unitNumber,
                    unitId: unit.unitId,
                    blockId: selectedBlockId,
                    floorNumber: selectedFloorNumber,
                    isPlot: false,
                    currentStatus: unit.status,
                    bookedTo: unit.bookedTo,
                    enquiries,
                  })
                }
                className="text-[#f12131] hover:underline font-bold cursor-pointer"
              >
                Manage / Release
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Direct Clickable Status Buttons */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-heading flex items-center justify-between">
          <span>Status:</span>
          <span
            className={`font-black uppercase text-[9px] ${
              isAvailable
                ? 'text-emerald-700'
                : isBooked
                ? 'text-amber-700'
                : 'text-rose-700'
            }`}
          >
            {unit.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() =>
              onUpdateStatus(
                selectedBlockId,
                selectedFloorNumber,
                unit.unitId,
                'available'
              )
            }
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
              isAvailable
                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-600/30'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50'
            }`}
            title="Click to set Available"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Avail
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateStatus(
                selectedBlockId,
                selectedFloorNumber,
                unit.unitId,
                'booked'
              )
            }
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
              isBooked
                ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-500/30'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/50'
            }`}
            title="Click to set Booked"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Booked
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateStatus(
                selectedBlockId,
                selectedFloorNumber,
                unit.unitId,
                'sold'
              )
            }
            className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
              isSold
                ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-600/30'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50/50'
            }`}
            title="Click to set Sold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Sold
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;

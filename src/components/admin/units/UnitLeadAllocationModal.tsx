'use client';

import React, { useEffect } from 'react';
import { UserCheck, X, Check, CheckCircle2 } from 'lucide-react';
import { AllocatingUnit } from './types';

interface UnitLeadAllocationModalProps {
  allocatingUnit: AllocatingUnit | null;
  onClose: () => void;
  onAllocateLead: (
    enquiryId: string | undefined,
    action: 'booked' | 'sold' | 'release'
  ) => Promise<void>;
  isAllocating: boolean;
}

export default function UnitLeadAllocationModal({
  allocatingUnit,
  onClose,
  onAllocateLead,
  isAllocating,
}: UnitLeadAllocationModalProps) {
  // Background scroll lock & Escape listener
  useEffect(() => {
    if (!allocatingUnit) return;
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
  }, [allocatingUnit, onClose]);

  if (!allocatingUnit) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200 overscroll-contain"
    >
      <div className="bg-white rounded-[32px] max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#29247c] text-white shadow-md shadow-indigo-950/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#29247c] font-heading">
                  {allocatingUnit.isPlot ? 'Plot' : 'Unit'} {allocatingUnit.unitNumber} Lead Allocation
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    allocatingUnit.currentStatus === 'available'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : allocatingUnit.currentStatus === 'booked'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {allocatingUnit.currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {allocatingUnit.enquiries.length === 0
                  ? 'No enquiries submitted for this unit yet.'
                  : `${allocatingUnit.enquiries.length} customer lead${
                      allocatingUnit.enquiries.length > 1 ? 's' : ''
                    } interested in this unit. Select a lead to book or sell.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 flex items-center justify-center transition shadow-xs cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 overscroll-contain">
          {/* Currently Booked / Sold Banner */}
          {allocatingUnit.bookedTo?.customerName && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 font-heading block">
                    Currently Assigned Buyer ({allocatingUnit.bookedTo.action === 'sold' ? 'Sold' : 'Booked'})
                  </span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">
                    {allocatingUnit.bookedTo.customerName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    📞 {allocatingUnit.bookedTo.customerPhone}{' '}
                    {allocatingUnit.bookedTo.customerEmail ? `• ✉️ ${allocatingUnit.bookedTo.customerEmail}` : ''}
                  </p>
                  {allocatingUnit.bookedTo.allocatedAt && (
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Allocated on: {new Date(allocatingUnit.bookedTo.allocatedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isAllocating}
                  onClick={() => onAllocateLead(allocatingUnit.bookedTo?.enquiryId, 'release')}
                  className="px-4 py-2 rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 text-xs font-black transition shadow-xs cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
                >
                  {isAllocating ? 'Releasing...' : 'Release (Make Available)'}
                </button>
              </div>
            </div>
          )}

          {/* Enquiry Leads List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-heading">
                Interested Customer Leads ({allocatingUnit.enquiries.length})
              </h4>
              {allocatingUnit.enquiries.length > 1 && (
                <span className="rounded-full bg-orange-100 text-orange-800 px-2.5 py-0.5 text-[10px] font-black border border-orange-200">
                  🔥 Contested ({allocatingUnit.enquiries.length} Leads)
                </span>
              )}
            </div>

            {allocatingUnit.enquiries.length === 0 ? (
              <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-500">
                  No customer leads have enquired for Unit {allocatingUnit.unitNumber} yet.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Leads who select this unit from the booking navigator will appear here automatically.
                </p>
              </div>
            ) : (
              allocatingUnit.enquiries.map((enq) => {
                const isCurrentAssigned =
                  allocatingUnit.bookedTo?.enquiryId === enq._id ||
                  allocatingUnit.bookedTo?.enquiryId === enq.id;

                return (
                  <div
                    key={enq._id || enq.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition shadow-xs ${
                      isCurrentAssigned
                        ? 'border-emerald-300 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm font-black text-[#29247c]">
                            {enq.name}
                          </h5>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              enq.status === 'Booked'
                                ? 'bg-emerald-100 text-emerald-800'
                                : enq.status === 'Sold'
                                ? 'bg-rose-100 text-rose-800'
                                : enq.status === 'Waitlisted'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {enq.status}
                          </span>
                          {isCurrentAssigned && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white flex items-center gap-1">
                              <Check className="h-3 w-3" /> Assigned
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-700 font-semibold flex-wrap">
                          <span>📞 {enq.phone}</span>
                          {enq.email && <span>✉️ {enq.email}</span>}
                        </div>

                        <div className="text-[11px] text-slate-400">
                          Enquiry Date: {new Date(enq.createdAt).toLocaleDateString()} • Source: {enq.source || 'Website'}
                        </div>

                        {enq.message && (
                          <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                            &quot;{enq.message}&quot;
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          disabled={isAllocating}
                          onClick={() => onAllocateLead(enq._id || enq.id, 'booked')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                          title="Book unit to this customer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Book to {enq.name.split(' ')[0]}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isAllocating}
                          onClick={() => onAllocateLead(enq._id || enq.id, 'sold')}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                          title="Mark sold to this customer"
                        >
                          <span>Sold to {enq.name.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <span className="text-xs text-slate-400 font-medium">
            Booking or selling will mark the unit status and automatically waitlist competing leads.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

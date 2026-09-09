'use client';

import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, Info, Loader2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'Delete Item?',
  message = 'Are you sure you want to proceed? This action cannot be undone and will be permanently removed.',
  itemName,
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-100 bg-white p-6 sm:p-8 shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        {/* Close Icon in top corner */}
        <button
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close dialog"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-4 ${
              isDanger
                ? 'bg-red-50 text-[#f12131] ring-8 ring-red-50/60'
                : isWarning
                ? 'bg-amber-50 text-amber-600 ring-8 ring-amber-50/60'
                : 'bg-blue-50 text-blue-600 ring-8 ring-blue-50/60'
            }`}
          >
            {isDanger ? (
              <Trash2 className="h-8 w-8 stroke-[2.2]" />
            ) : isWarning ? (
              <AlertTriangle className="h-8 w-8 stroke-[2.2]" />
            ) : (
              <Info className="h-8 w-8 stroke-[2.2]" />
            )}
          </div>

          <h3 className="text-xl font-black tracking-tight text-[#29247c]">
            {title}
          </h3>

          {itemName && (
            <div className="mt-2 max-w-full">
              <span className="inline-block max-w-[280px] truncate rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 border border-slate-200/60">
                &ldquo;{itemName}&rdquo;
              </span>
            </div>
          )}

          <p className="mt-3 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 h-11 rounded-full px-5 text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
              isDanger
                ? 'bg-[#f12131] hover:bg-[#d81928] shadow-red-500/25'
                : isWarning
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25'
                : 'bg-[#29247c] hover:bg-[#1f1b5c] shadow-blue-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {isDanger && <Trash2 className="h-4 w-4" />}
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

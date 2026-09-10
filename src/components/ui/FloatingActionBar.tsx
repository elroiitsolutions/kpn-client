'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlistCompare } from '@/context/WishlistCompareContext';
import { Scale, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingActionBar() {
  const { compareIds, clearCompare } = useWishlistCompare();

  if (compareIds.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full border border-slate-700 bg-slate-900/95 px-6 py-3.5 text-white shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f12131] text-xs font-bold">
            <Scale className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">
            {compareIds.length} {compareIds.length === 1 ? 'project' : 'projects'} selected to compare
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className="flex items-center gap-2 rounded-full bg-[#f12131] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-red-600 hover:scale-105"
          >
            Compare Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={clearCompare}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            title="Clear all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

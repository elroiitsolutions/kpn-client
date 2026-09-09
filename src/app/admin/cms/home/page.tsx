'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Ban } from 'lucide-react';

// Homepage CMS is currently disabled / commented out as requested.
export default function AdminHomepageCMSPage() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-[28px] border border-slate-200 bg-white shadow-xs max-w-lg mx-auto mt-10">
      <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
        <Ban className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-black text-[#29247c]">Homepage CMS Disabled</h2>
      <p className="text-xs text-slate-500 mt-2">
        This section is currently commented out and not in use.
      </p>
      <Link
        href="/admin"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#29247c] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1f1b5c] transition-all"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, Plus, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    href: string;
  };
}

export default function AdminHeader({
  onMenuToggle,
  title = 'Overview',
  subtitle,
  actionButton,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Title and subtitle */}
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#29247c]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Optional Action Button */}
        {actionButton && (
          <Link
            href={actionButton.href}
            className="flex h-10 items-center gap-2 rounded-full bg-[#f12131] px-4 sm:px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{actionButton.label}</span>
          </Link>
        )}

        {/* View live public site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs"
        >
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          <span>View Website</span>
        </Link>

        {/* User profile pill */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#29247c] text-xs font-extrabold text-white">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.name || 'Admin'}
            </p>
            <span className="text-[10px] font-semibold text-[#f12131] uppercase">
              {user?.role || 'Superadmin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

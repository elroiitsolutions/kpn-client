'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { AppSidebar } from './AppSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ExternalLink } from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated, user } = useAuth();

  // Login page has its own standalone layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f12131] text-2xl font-black text-white shadow-xl animate-pulse">
            K
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <div className="h-2 w-2 rounded-full bg-[#f12131] animate-ping" />
            <span>Loading KPN Admin Portal...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Breadcrumb segment formatting
  const segments = (pathname || '')
    .split('/')
    .filter(Boolean)
    .filter((s) => s !== 'admin');

  const currentPageTitle =
    segments.length === 0
      ? 'Dashboard'
      : segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace(/-/g, ' ');

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur shadow-2xs font-sans">
          <div className="flex items-center gap-3.5">
            <SidebarTrigger className="text-slate-600 hover:text-[#29247c] hover:bg-rose-50/60 transition-colors" />
            <Separator orientation="vertical" className="h-4 bg-slate-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden sm:block">
                  <BreadcrumbLink href="/admin" className="text-xs font-bold text-slate-400 hover:text-[#29247c] transition-colors">
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block text-slate-300" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-black text-[#29247c] font-heading tracking-tight">
                    {currentPageTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 hover:border-[#f12131] hover:text-[#f12131] hover:bg-rose-50/50 transition-all shadow-2xs group"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#f12131] transition-colors" />
              <span className="hidden sm:inline">Live Website</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#29247c] text-xs font-black text-white shadow-xs font-heading">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-extrabold text-slate-800 hidden md:inline">
                {user?.name || 'Administrator'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 bg-[#f8fafc]">
          <div className="mx-auto max-w-[1500px] w-full font-sans">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

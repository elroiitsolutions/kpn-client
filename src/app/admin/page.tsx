'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Inbox,
  FileText,
  Users,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalEnquiries: number;
  newEnquiries: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalReferrals: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalReferrals: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.success) {
          setStats(res.stats);
          setRecentEnquiries(res.recentEnquiries || []);
          setRecentProjects(res.recentProjects || []);
          setRecentBlogs(res.recentBlogs || []);
        }
      } catch (err) {
        console.warn('Could not load dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subValue: `${stats.publishedProjects} Published • ${stats.draftProjects} Draft`,
      icon: Building2,
      color: 'bg-[#29247c]',
      href: '/admin/projects',
    },
    {
      title: 'Customer Enquiries',
      value: stats.totalEnquiries,
      subValue: `${stats.newEnquiries} New Inquiries Pending`,
      icon: Inbox,
      color: 'bg-[#f12131]',
      href: '/admin/enquiries',
      alert: stats.newEnquiries > 0,
    },
    {
      title: 'Articles & Blogs',
      value: stats.totalBlogs,
      subValue: `${stats.publishedBlogs} Live on Website`,
      icon: FileText,
      color: 'bg-[#342987]',
      href: '/admin/blogs',
    },
    /*
    {
      title: 'Customer Referrals',
      value: stats.totalReferrals,
      subValue: 'Referral Program Leads',
      icon: Users,
      color: 'bg-rose-600',
      href: '/admin/referrals',
    },
    */
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Contacted':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Site Visit':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Booked':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f12131]">
            OVERVIEW
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#29247c]">
            Real Estate Command Center
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Monitor incoming leads, manage property units, and update website content in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Link>

          <Link
            href="/admin/blogs/new"
            className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            <span>New Blog</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color} text-white shadow-md`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tight text-[#29247c]">
                    {isLoading ? '-' : card.value}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {card.subValue}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main 2-Column Content Row: Recent Enquiries & Recent Projects */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Recent Enquiries */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-[#29247c]">
              Recent Enquiries & Leads
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#f12131] hover:underline"
            >
              View All Enquiries →
            </Link>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
            {recentEnquiries.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-600">No enquiries recorded yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Enquiries submitted from project detail pages and forms will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#29247c]">
                          {enquiry.name}
                        </span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadgeColor(enquiry.status)}`}>
                          {enquiry.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        📞 {enquiry.phone} {enquiry.email ? `• ✉️ ${enquiry.email}` : ''}
                      </p>
                      <p className="text-xs font-semibold text-slate-700">
                        Interested in: <span className="text-[#f12131]">{enquiry.projectName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Projects & Quick Links */}
        <div className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-[#29247c]">
              Recent Projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs font-bold text-[#f12131] hover:underline"
            >
              All Projects →
            </Link>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 hover:border-slate-200 hover:bg-slate-50/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#29247c]">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {project.propertyType} • {project.budget}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/projects/${project._id}/edit`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-[#f12131] hover:text-[#f12131] transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            ))}

            <Link
              href="/admin/projects/new"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 text-xs font-bold text-[#29247c] hover:border-[#f12131] hover:text-[#f12131] transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Real Estate Project</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

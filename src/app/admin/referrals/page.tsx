'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Users, Search, Gift, Clock, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/referrals');
      if (res.success) setReferrals(res.data || []);
    } catch (err) {
      console.warn('Failed to load referrals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string, rewardStatus?: string) => {
    try {
      const res = await api.patch(`/referrals/${id}`, { status, rewardStatus });
      if (res.success) {
        setReferrals((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status, rewardStatus: rewardStatus || r.rewardStatus } : r))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update referral');
    }
  };

  const filteredReferrals = useMemo(() => {
    return referrals.filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.referrerName.toLowerCase().includes(q) ||
          r.referrerPhone.includes(q) ||
          r.referredName.toLowerCase().includes(q) ||
          r.referredPhone.includes(q)
        );
      }
      return true;
    });
  }, [referrals, statusFilter, search]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Referral Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Site Visit':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Booked':
      case 'Completed / Closed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
          Customer Referral Program
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Track customer referrals, lead qualification stages, and reward distribution status.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by referrer or friend name / phone..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700"
        >
          <option value="All">All Workflow Stages</option>
          <option value="Referral Submitted">Referral Submitted</option>
          <option value="Contacted">Contacted</option>
          <option value="Site Visit">Site Visit</option>
          <option value="Interested">Interested</option>
          <option value="Booked">Booked</option>
          <option value="Completed / Closed">Completed / Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
            Loading referral records...
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-base font-extrabold text-slate-700">No referrals found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Referrer (Advocate)</th>
                  <th className="px-6 py-4">Referred Customer</th>
                  <th className="px-4 py-4">Project</th>
                  <th className="px-4 py-4">Pipeline Stage</th>
                  <th className="px-4 py-4">Reward Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredReferrals.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-[#29247c] block text-sm">
                        {item.referrerName}
                      </span>
                      <span className="text-[11px] text-slate-500">📞 {item.referrerPhone}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block text-sm">
                        {item.referredName}
                      </span>
                      <span className="text-[11px] text-slate-500">📞 {item.referredPhone}</span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-bold text-[#f12131]">
                        {item.projectName || 'General Inquiry'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                        className={`h-7 rounded-full border px-2.5 text-[10px] font-extrabold outline-none ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        <option value="Referral Submitted">Referral Submitted</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Site Visit">Site Visit</option>
                        <option value="Interested">Interested</option>
                        <option value="Booked">Booked</option>
                        <option value="Completed / Closed">Completed / Closed</option>
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={item.rewardStatus || 'Pending'}
                        onChange={(e) => handleUpdateStatus(item._id, item.status, e.target.value)}
                        className="h-7 rounded-full border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-700"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Disbursed">Disbursed</option>
                        <option value="Ineligible">Ineligible</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

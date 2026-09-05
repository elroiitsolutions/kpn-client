'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Clock,
  MessageSquare,
  Trash2,
  CheckCircle2,
  UserCheck,
  Plus,
  Send,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/enquiries');
      if (res.success) {
        setEnquiries(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load enquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await api.patch(`/enquiries/${id}/status`, { status: newStatus });
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !noteText.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await api.post(`/enquiries/${selectedEnquiry._id}/notes`, { text: noteText });
      if (res.success) {
        setSelectedEnquiry((prev: any) => ({ ...prev, notes: res.data }));
        setEnquiries((prev) =>
          prev.map((item) =>
            item._id === selectedEnquiry._id ? { ...item, notes: res.data } : item
          )
        );
        setNoteText('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/enquiries/${deleteTarget.id}`);
      if (res.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== deleteTarget.id));
        if (selectedEnquiry?._id === deleteTarget.id) setSelectedEnquiry(null);
        setDeleteTarget(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== 'All' && e.status !== statusFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        return (
          e.name.toLowerCase().includes(query) ||
          e.phone.includes(query) ||
          (e.email && e.email.toLowerCase().includes(query)) ||
          e.projectName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [enquiries, statusFilter, search]);

  const stats = useMemo(() => {
    return {
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === 'New').length,
      contacted: enquiries.filter((e) => e.status === 'Contacted').length,
      siteVisit: enquiries.filter((e) => e.status === 'Site Visit').length,
      booked: enquiries.filter((e) => e.status === 'Booked').length,
    };
  }, [enquiries]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Site Visit':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interested':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Booked':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
          Customer Enquiry & Lead Management
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Track property inquiries, follow up with home buyers, and schedule site visits.
        </p>
      </div>

      {/* KPI Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Enquiries</p>
          <p className="text-2xl font-black text-[#29247c] mt-1">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">New Leads</p>
          <p className="text-2xl font-black text-red-700 mt-1">{stats.new}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Contacted</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{stats.contacted}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Site Visits</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{stats.siteVisit}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Booked</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.booked}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by customer name, phone, or project..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 min-w-[170px] rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none shadow-none cursor-pointer">
            <SelectValue placeholder="All Lead Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
            <SelectItem value="All" className="text-xs font-bold">All Lead Statuses</SelectItem>
            <SelectItem value="New" className="text-xs font-bold">New</SelectItem>
            <SelectItem value="Contacted" className="text-xs font-bold">Contacted</SelectItem>
            <SelectItem value="Site Visit" className="text-xs font-bold">Site Visit</SelectItem>
            <SelectItem value="Interested" className="text-xs font-bold">Interested</SelectItem>
            <SelectItem value="Negotiation" className="text-xs font-bold">Negotiation</SelectItem>
            <SelectItem value="Booked" className="text-xs font-bold">Booked</SelectItem>
            <SelectItem value="Closed" className="text-xs font-bold">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 2-Column Layout: Table on left, Details on right if selected */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className={`${selectedEnquiry ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
            {isLoading ? (
              <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
                Loading inquiries from database...
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-16 text-center">
                <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-base font-extrabold text-slate-700">No enquiries found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Enquiries submitted from website forms will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Customer</th>
                      <th className="px-4 py-4">Contact</th>
                      <th className="px-4 py-4">Project</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredEnquiries.map((enquiry) => {
                      const isSelected = selectedEnquiry?._id === enquiry._id;
                      return (
                        <tr
                          key={enquiry._id}
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-red-50/40' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="px-5 py-4">
                            <span className="font-black text-[#29247c] block text-sm">
                              {enquiry.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(enquiry.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="font-bold text-slate-900 block">📞 {enquiry.phone}</span>
                            {enquiry.email && (
                              <span className="text-[11px] text-slate-500">✉️ {enquiry.email}</span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span className="font-extrabold text-[#f12131]">
                              {enquiry.projectName || 'General Inquiry'}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{enquiry.source}</span>
                          </td>

                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={enquiry.status}
                              onValueChange={(val) => handleStatusChange(enquiry._id, val)}
                            >
                              <SelectTrigger className={`h-7 rounded-full border px-2.5 text-[10px] font-extrabold outline-none shadow-none cursor-pointer ${getStatusBadge(
                                enquiry.status
                              )}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                                <SelectItem value="New" className="text-xs font-bold">New</SelectItem>
                                <SelectItem value="Contacted" className="text-xs font-bold">Contacted</SelectItem>
                                <SelectItem value="Site Visit" className="text-xs font-bold">Site Visit</SelectItem>
                                <SelectItem value="Interested" className="text-xs font-bold">Interested</SelectItem>
                                <SelectItem value="Negotiation" className="text-xs font-bold">Negotiation</SelectItem>
                                <SelectItem value="Booked" className="text-xs font-bold">Booked</SelectItem>
                                <SelectItem value="Closed" className="text-xs font-bold">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>

                          <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setDeleteTarget({ id: enquiry._id, title: `${enquiry.name} (${enquiry.projectName || 'General Inquiry'})` })}
                              title="Delete enquiry"
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 transition-colors inline-flex items-center justify-center"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Details & Notes Pane (Slide-in) */}
        {selectedEnquiry && (
          <div className="lg:col-span-5 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black tracking-tight text-[#29247c]">
                  {selectedEnquiry.name}
                </h2>
                <p className="text-xs text-slate-400">
                  Lead captured on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 rounded-2xl bg-slate-50/80 p-4 text-xs font-semibold text-slate-700">
              <p>📞 <strong>Phone:</strong> {selectedEnquiry.phone}</p>
              {selectedEnquiry.email && <p>✉️ <strong>Email:</strong> {selectedEnquiry.email}</p>}
              <p>🏢 <strong>Project:</strong> <span className="text-[#f12131] font-bold">{selectedEnquiry.projectName}</span></p>
              <p>📍 <strong>Source:</strong> {selectedEnquiry.source}</p>
              {selectedEnquiry.message && (
                <div className="pt-2 border-t border-slate-200/60 mt-2">
                  <p className="text-slate-500 font-bold mb-1">Message:</p>
                  <p className="font-normal italic text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                    &quot;{selectedEnquiry.message}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Staff Notes History */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Staff Follow-Up Notes
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(!selectedEnquiry.notes || selectedEnquiry.notes.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                ) : (
                  selectedEnquiry.notes.map((note: any, idx: number) => (
                    <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                      <p className="font-semibold text-slate-800">{note.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        By {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a follow-up note..."
                  className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold"
                />
                <button
                  type="submit"
                  disabled={isAddingNote || !noteText.trim()}
                  className="h-10 px-4 rounded-xl bg-[#f12131] text-xs font-bold text-white hover:bg-[#d81928] disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Customer Enquiry?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this enquiry lead record? This action cannot be undone."
        confirmText="Delete Enquiry"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

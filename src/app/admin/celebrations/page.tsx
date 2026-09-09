'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PartyPopper,
  Plus,
  Trash2,
  Edit,
  Upload,
  Calendar,
  Sparkles,
  X,
  ExternalLink,
  Search,
  CheckCircle,
  Eye,
  Camera,
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

interface Celebration {
  _id: string;
  title: string;
  subheading: string;
  description?: string;
  image: string;
  date?: string;
  year?: string;
  category?: string;
  order?: number;
  status: 'Published' | 'Draft';
}

const CATEGORIES = ['Trip', 'Office', 'Launch', 'Festival', 'Milestone', 'General'];

export default function AdminCelebrationsPage() {
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Custom Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subheading: '',
    description: '',
    image: '/images/celebrations/goa_trip_2025.jpeg',
    date: '',
    year: '2025',
    category: 'Trip',
    order: 0,
    status: 'Published' as 'Published' | 'Draft',
  });

  const loadCelebrations = async () => {
    setIsLoading(true);
    try {
      // Fetch admin endpoint (includes drafts) or fallback to public
      let res;
      try {
        res = await api.get('/celebrations/admin/all');
      } catch {
        res = await api.get('/celebrations');
      }
      if (res && res.success) {
        setCelebrations(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load celebrations from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCelebrations();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.upload(file, 'celebrations');
      if (res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed. Please verify image format and size.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCelebration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/celebrations/${editingId}`, formData);
        if (res.success) {
          setCelebrations((prev) => prev.map((c) => (c._id === editingId ? res.data : c)));
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/celebrations', formData);
        if (res.success) {
          setCelebrations((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save celebration');
    }
  };

  const handleEdit = (item: Celebration) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      subheading: item.subheading,
      description: item.description || '',
      image: item.image,
      date: item.date || '',
      year: item.year || '2025',
      category: item.category || 'General',
      order: item.order || 0,
      status: item.status || 'Published',
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/celebrations/${deleteTarget.id}`);
      if (res.success) {
        setCelebrations((prev) => prev.filter((c) => c._id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete celebration');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCelebrations = useMemo(() => {
    return celebrations.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.subheading.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [celebrations, categoryFilter, search]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Ceremonies & Celebrations CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage company trips, office openings, milestones, and celebration moments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/celebrations"
            target="_blank"
            className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Page</span>
          </Link>

          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: '',
                subheading: '',
                description: '',
                image: '/images/celebrations/goa_trip_2025.jpeg',
                date: '',
                year: '2025',
                category: 'Trip',
                order: 0,
                status: 'Published',
              });
              setIsModalOpen(true);
            }}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Celebration</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search celebrations..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              categoryFilter === 'All'
                ? 'bg-[#29247c] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({celebrations.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#29247c] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Celebrations */}
      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading celebration entries...
        </div>
      ) : filteredCelebrations.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 p-12 text-center bg-white">
          <PartyPopper className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-sm font-extrabold text-slate-700">No celebrations found</h3>
          <p className="text-xs text-slate-400 mt-1">Add your first celebration to showcase on the website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCelebrations.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-xs hover:shadow-md transition-all"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white">
                      {item.category || 'General'}
                    </span>
                    {item.year && (
                      <span className="rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-slate-800">
                        {item.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Text info */}
                <h3 className="text-base font-black text-[#29247c] line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-[#f12131] mt-0.5 line-clamp-1">
                  {item.subheading}
                </p>
                {item.description && (
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Bottom actions */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <span
                  className={`text-[10px] font-extrabold uppercase rounded-full px-2.5 py-0.5 ${
                    item.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-[#29247c] hover:text-[#29247c] transition-colors"
                    title="Edit Celebration"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: item._id, title: item.title })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Celebration"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#f12131]">
                  <PartyPopper className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black tracking-tight text-[#29247c]">
                  {editingId ? 'Edit Celebration' : 'Add New Celebration'}
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCelebration} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Celebration Heading / Title*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. GOA Trip 2025 or Bangalore Office Opening"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Subheading / Tagline*
                </label>
                <input
                  type="text"
                  required
                  value={formData.subheading}
                  onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                  placeholder="e.g. Goa 2025 – Where Every Sunset Tells a Story!"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Category*
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none shadow-none cursor-pointer">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-xs font-bold py-2">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Year*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2025"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Date Label (Optional)
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. January 2025"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Image Preview & Upload */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Photo / Image*
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/celebrations/... or https://..."
                    className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
                  />
                  <label className="flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {formData.image && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Detailed Story / Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Share highlights of the trip, celebration, or memorable moments..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Publication Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 shadow-none cursor-pointer">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                      <SelectItem value="Published" className="text-xs font-bold py-2">Published</SelectItem>
                      <SelectItem value="Draft" className="text-xs font-bold py-2">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-full bg-[#f12131] text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
                >
                  {editingId ? 'Update Celebration' : 'Save Celebration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable ConfirmModal for Deleting */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Celebration?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this celebration moment? It will be permanently removed from the website."
        confirmText="Delete Celebration"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

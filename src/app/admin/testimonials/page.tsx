'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Edit,
  Star,
  X,
  ExternalLink,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    role: 'Homeowner',
    quote: '',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    rating: 5,
    status: 'Published',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await api.upload(file, 'testimonials');
      if (res.url) {
        setFormData((prev) => ({ ...prev, avatar: res.url }));
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/testimonials');
      if (res.success) setTestimonials(res.data || []);
    } catch (err) {
      console.warn('Failed to load testimonials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/testimonials/${editingId}`, formData);
        if (res.success) {
          setTestimonials((prev) => prev.map((t) => (t._id === editingId ? res.data : t)));
        }
      } else {
        const res = await api.post('/testimonials', formData);
        if (res.success) {
          setTestimonials((prev) => [res.data, ...prev]);
        }
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        title: '',
        author: '',
        role: 'Homeowner',
        quote: '',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
        rating: 5,
        status: 'Published',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to save testimonial');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      author: item.author,
      role: item.role,
      quote: item.quote,
      avatar: item.avatar || '',
      rating: item.rating || 5,
      status: item.status || 'Published',
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/testimonials/${deleteTarget.id}`);
      if (res.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Testimonials & Reviews CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage buyer reviews, quotes, customer ratings, and testimonials shown across the website.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-xs">
          <MessageSquareQuote className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-extrabold text-slate-700">No testimonials found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      t.status === 'Draft'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}
                  >
                    {t.status || 'Published'}
                  </span>
                </div>

                <h3 className="text-sm font-black text-[#29247c]">
                  &quot;{t.title}&quot;
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'}
                    alt={t.author}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-black text-slate-900 leading-tight">{t.author}</p>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-[#29247c] hover:text-[#29247c]"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: t._id, title: t.title || t.author })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-black tracking-tight text-[#29247c]">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Review Headline*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Excellent experience!"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Customer Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Floyd Miles"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Homebuyer / IT Executive"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Customer Quote / Review*
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Share the customer review..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Rating (Stars)
                  </label>
                  <Select
                    value={String(formData.rating)}
                    onValueChange={(val) => setFormData({ ...formData, rating: parseInt(val, 10) || 5 })}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 outline-none shadow-none cursor-pointer">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                      <SelectItem value="5" className="text-xs font-bold py-2">5 Stars ⭐⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="4" className="text-xs font-bold py-2">4 Stars ⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="3" className="text-xs font-bold py-2">3 Stars ⭐⭐⭐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Display Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 outline-none shadow-none cursor-pointer">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                      <SelectItem value="Published" className="text-xs font-bold py-2">Published (Live on Website)</SelectItem>
                      <SelectItem value="Draft" className="text-xs font-bold py-2">Draft (Hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Customer Avatar / Photo
                </label>
                <div className="flex items-center gap-3">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar preview"
                      className="h-11 w-11 shrink-0 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-11 w-11 shrink-0 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                      IMG
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://... or upload photo"
                    className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                  <label className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Upload className="h-3.5 w-3.5 text-slate-500" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                {editingId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setDeleteTarget({
                        id: editingId,
                        title: formData.title || formData.author,
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-full bg-[#f12131] text-xs font-bold text-white shadow-md hover:bg-[#d81928] transition-all"
                  >
                    {editingId ? 'Update Testimonial' : 'Save Testimonial'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Testimonial?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this testimonial review? This action cannot be undone."
        confirmText="Delete Testimonial"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Plus,
  Trash2,
  Edit,
  Upload,
  Calendar,
  Building,
  X,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    year: '2025',
    description: '',
    image: '/images/awards/Trusted-Developer-2025.png',
    status: 'Published',
  });

  const loadAwards = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/awards');
      if (res.success) setAwards(res.data || []);
    } catch (err) {
      console.warn('Failed to load awards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAwards();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await api.upload(file, 'awards');
      if (res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    }
  };

  const handleSaveAward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/awards/${editingId}`, formData);
        if (res.success) {
          setAwards((prev) => prev.map((a) => (a._id === editingId ? res.data : a)));
        }
      } else {
        const res = await api.post('/awards', formData);
        if (res.success) {
          setAwards((prev) => [res.data, ...prev]);
        }
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        title: '',
        organization: '',
        year: '2025',
        description: '',
        image: '/images/awards/Trusted-Developer-2025.png',
        status: 'Published',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to save award');
    }
  };

  const handleEdit = (award: any) => {
    setEditingId(award._id);
    setFormData({
      title: award.title,
      organization: award.organization,
      year: award.year,
      description: award.description || '',
      image: award.image,
      status: award.status || 'Published',
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/awards/${deleteTarget.id}`);
      if (res.success) {
        setAwards((prev) => prev.filter((a) => a._id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete award');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Awards & Accreditations CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage industry honors, business meet awards, and developer recognitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/our-awards"
            target="_blank"
            className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Page</span>
          </Link>

          <button
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Award</span>
          </button>
        </div>
      </div>

      {/* Awards Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading awards...
        </div>
      ) : awards.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-xs">
          <Trophy className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-extrabold text-slate-700">No awards in repository</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award) => (
            <div
              key={award._id}
              className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="max-h-24 max-w-[140px] object-contain transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-[11px] font-extrabold text-[#f12131]">
                    {award.year}
                  </span>
                  <h3 className="text-base font-black tracking-tight text-[#29247c]">
                    {award.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {award.organization}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-[10px] font-extrabold uppercase rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-700">
                  {award.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(award)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-[#29247c] hover:text-[#29247c]"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: award._id, title: award.title })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Award"
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
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-black tracking-tight text-[#29247c]">
                {editingId ? 'Edit Award' : 'Add New Award'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAward} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Award Title*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Trusted Developer of the Year"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Organization*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Economic Times"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
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
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Award Certificate Image URL or Upload*
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                  <label className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-slate-800 px-4 text-xs font-bold text-white hover:bg-slate-700">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-full bg-[#f12131] text-xs font-bold text-white shadow-md hover:bg-[#d81928]"
                >
                  {editingId ? 'Update Award' : 'Save Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Award?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this award? This action cannot be undone and will permanently remove it from the website."
        confirmText="Delete Award"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

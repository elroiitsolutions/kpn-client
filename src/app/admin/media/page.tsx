'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Filter,
  ExternalLink,
  Copy,
  Check,
  Video,
  FileText,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // New media modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'General',
    mediaType: 'image',
    fileUrl: '',
    thumbnailUrl: '',
    status: 'Published',
  });

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/media');
      if (res.success) setMediaItems(res.data || []);
    } catch (err) {
      console.warn('Failed to load media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.upload(file, 'media_centre');
      if (res.url) {
        setNewItem((prev) => ({ ...prev, fileUrl: res.url, title: prev.title || file.name }));
      }
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/media', newItem);
      if (res.success) {
        setMediaItems((prev) => [res.data, ...prev]);
        setIsModalOpen(false);
        setNewItem({
          title: '',
          description: '',
          category: 'General',
          mediaType: 'image',
          fileUrl: '',
          thumbnailUrl: '',
          status: 'Published',
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save media');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      const res = await api.delete(`/media/${id}`);
      if (res.success) {
        setMediaItems((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredItems = useMemo(() => {
    if (typeFilter === 'All') return mediaItems;
    return mediaItems.filter((m) => m.mediaType === typeFilter);
  }, [mediaItems, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Media Centre CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Upload and organize photos, press documents, marketing videos, and events.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Media Item</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {['All', 'image', 'video', 'news', 'press', 'event'].map((tab) => (
          <button
            key={tab}
            onClick={() => setTypeFilter(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all ${
              typeFilter === tab
                ? 'bg-[#29247c] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading media library...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-xs">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-extrabold text-slate-700">No media items found</p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;Upload Media Item&quot; to add assets to your repository.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-xs transition-all hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {item.mediaType === 'video' ? (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                      <Video className="h-8 w-8 text-[#f12131]" />
                    </div>
                  ) : item.mediaType === 'press' || item.mediaType === 'news' ? (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
                      <FileText className="h-8 w-8" />
                    </div>
                  ) : (
                    <img
                      src={item.fileUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute top-2.5 left-2.5 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                    {item.mediaType}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-xs font-black text-[#29247c] line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <button
                  onClick={() => handleCopy(item.fileUrl)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-[#29247c]"
                >
                  {copiedUrl === item.fileUrl ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-black tracking-tight text-[#29247c]">
                Add Media Item
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Title / Caption*
                </label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Groundbreaking Ceremony 2026"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Media Type
                  </label>
                  <select
                    value={newItem.mediaType}
                    onChange={(e) => setNewItem({ ...newItem, mediaType: e.target.value })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="news">News</option>
                    <option value="press">Press Release</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    placeholder="e.g. Marketing / Construction"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  File Upload or URL*
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newItem.fileUrl}
                    onChange={(e) => setNewItem({ ...newItem, fileUrl: e.target.value })}
                    placeholder="https://... or click Upload"
                    className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  />
                  <label className="flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-slate-800 px-4 text-xs font-bold text-white hover:bg-slate-700">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Optional notes or details..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold"
                />
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
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

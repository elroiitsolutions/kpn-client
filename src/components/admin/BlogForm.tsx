'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { api } from '@/lib/api';

interface BlogFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    author: initialData?.author || 'KPN Editorial Team',
    category: initialData?.category || 'Tips & Tricks',
    status: initialData?.status || 'Published',
    featuredImage: initialData?.featuredImage || '/images/blog/blog_1.jpg',
    bannerImage: initialData?.bannerImage || '/images/blog/blog_1.jpg',
    shortDescription: initialData?.shortDescription || '',
    content: initialData?.content || '',
    tags: initialData?.tags?.join(', ') || 'Real Estate, Chennai',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await api.upload(file, 'blogs');
      if (res.url) {
        setFormData((prev) => ({ ...prev, [field]: res.url }));
      }
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.put(`/blogs/${initialData._id}`, payload);
      } else {
        await api.post('/blogs', payload);
      }
      router.push('/admin/blogs');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#29247c]">
              {isEdit ? `Edit: ${initialData?.title}` : 'Create Blog Post'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage articles, market updates, and real estate news.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="flex h-11 items-center px-5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-6 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : isEdit ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Article Title*
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. How to Get Started in Buying Your First Home"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated from title if blank"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Category*
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Tips & Tricks / Company / Social Media"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Status*
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Cover Featured Image URL / Upload*
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              required
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              className="h-12 flex-1 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold"
            />
            <label className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-slate-800 px-5 text-xs font-bold text-white hover:bg-slate-700 transition-colors">
              <Upload className="h-4 w-4" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'featuredImage')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Short Excerpt / Summary*
          </label>
          <input
            type="text"
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="1-2 sentences for card preview"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Article Content*
          </label>
          <textarea
            rows={10}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write the full article content here. Paragraphs separated by double linebreaks will format cleanly..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="First Home, Real Estate, Investment"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
          />
        </div>
      </div>
    </form>
  );
}

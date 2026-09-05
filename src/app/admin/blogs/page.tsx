'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Calendar,
  Eye,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Posts');

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const [blogsRes, catsRes] = await Promise.all([
        api.get('/blogs?includeDrafts=true'),
        api.get('/blogs/categories'),
      ]);

      if (blogsRes.success) setBlogs(blogsRes.data || []);
      if (catsRes.success) setCategories(catsRes.data || []);
    } catch (err) {
      console.warn('Failed to load blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (categoryFilter !== 'All Posts' && b.category !== categoryFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        return (
          b.title.toLowerCase().includes(query) ||
          b.shortDescription.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [blogs, categoryFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Blog & Article CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Publish real estate market trends, homebuyer guides, and company press releases.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Blog Post</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by headline or summary..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none"
        >
          <option value="All Posts">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
            Loading articles...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-base font-extrabold text-slate-700">No blog posts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBlogs.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                          <img
                            src={post.featuredImage || '/images/blog/blog_1.jpg'}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-extrabold text-[#29247c] text-sm block line-clamp-1">
                            {post.title}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">
                            {post.shortDescription}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase text-slate-700">
                        {post.category}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-500 font-semibold">
                      {new Date(post.publishedDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                          post.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blogs/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview public article"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/admin/blogs/${post._id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-[#29247c] hover:bg-[#29247c] hover:text-white transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(post._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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

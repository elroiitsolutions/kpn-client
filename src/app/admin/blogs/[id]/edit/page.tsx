'use client';

import React, { use, useEffect, useState } from 'react';
import BlogForm from '@/components/admin/BlogForm';
import { api } from '@/lib/api';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlog() {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.success && res.data) {
          setBlog(res.data);
        } else {
          setError('Blog post not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load blog');
      } finally {
        setIsLoading(false);
      }
    }

    loadBlog();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
        Loading article details for editor...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-xs font-bold text-red-700">
        ⚠️ {error || 'Blog post not found'}
      </div>
    );
  }

  return <BlogForm initialData={blog} isEdit={true} />;
}

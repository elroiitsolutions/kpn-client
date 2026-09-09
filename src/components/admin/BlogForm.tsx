'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Quote } from 'lucide-react';
import { api } from '@/lib/api';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

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
    galleryImage1: initialData?.galleryImages?.[0] || '/images/projects/project_1.jpg',
    galleryImage2: initialData?.galleryImages?.[1] || '/images/projects/project_2.jpg',
    quoteText:
      initialData?.quoteText ||
      'Investing in real estate is more than just acquiring property; it is about establishing a lasting legacy of security and peace of mind for your family.',
    quoteAuthor: initialData?.quoteAuthor || 'John Doe',
    shortDescription: initialData?.shortDescription || '',
    content:
      typeof initialData?.content === 'string'
        ? initialData.content
        : Array.isArray(initialData?.content)
        ? initialData.content.join('\n\n')
        : '',
    tags: initialData?.tags?.join(', ') || 'Real Estate, Chennai, Home Buying',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
  });

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !isEdit && !prev.slug ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }));
  };

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

    const galleryImages = [formData.galleryImage1, formData.galleryImage2].filter(Boolean);
    const payload = {
      ...formData,
      galleryImages,
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
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#29247c]">
              {isEdit ? `Edit: ${initialData?.title}` : 'Write New Article'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Publish blog articles, market insights, and guides matching the website theme.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="flex h-10 items-center px-4 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#f12131] px-6 text-xs font-bold text-white shadow-xs hover:bg-[#d81928] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : isEdit ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* 1. Core Meta */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. General Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Article Title*
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. How to Get Started in Buying Your First Home"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              URL Slug*
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="how-to-get-started-in-buying-your-first-home"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Category*
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Tips & Tricks, Company, Architecture"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Author Name
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Status*
            </label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131] shadow-none cursor-pointer">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                <SelectItem value="Published" className="text-xs font-bold py-2">Published</SelectItem>
                <SelectItem value="Draft" className="text-xs font-bold py-2">Draft</SelectItem>
                <SelectItem value="Archived" className="text-xs font-bold py-2">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2. Cover Image */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-[#f12131]" />
          <span>2. Cover Featured Image</span>
        </h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Main Featured Image (URL or Upload)*
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              required
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              placeholder="/images/blog/blog_1.jpg or CDN image URL"
              className="h-10 flex-1 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
            <label className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-slate-800 px-4 text-xs font-bold text-white hover:bg-slate-700 transition-colors">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'featuredImage')}
                className="hidden"
              />
            </label>
          </div>
          {formData.featuredImage && (
            <div className="mt-3 h-28 w-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <img src={formData.featuredImage} alt="Cover preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* 3. In-Article 2-Column Gallery */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[#29247c]" />
            <span>3. In-Article 2-Column Image Gallery</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Displayed side-by-side between the first and second paragraphs as seen on the reference design.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Gallery Image 1 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Gallery Image 1 (Left)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.galleryImage1}
                onChange={(e) => setFormData({ ...formData, galleryImage1: e.target.value })}
                placeholder="/images/projects/project_1.jpg"
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold"
              />
              <label className="flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-3 text-slate-700 hover:bg-slate-200">
                <Upload className="h-3.5 w-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'galleryImage1')}
                  className="hidden"
                />
              </label>
            </div>
            {formData.galleryImage1 && (
              <div className="h-24 w-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img src={formData.galleryImage1} alt="Gallery 1" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {/* Gallery Image 2 */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Gallery Image 2 (Right)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.galleryImage2}
                onChange={(e) => setFormData({ ...formData, galleryImage2: e.target.value })}
                placeholder="/images/projects/project_2.jpg"
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold"
              />
              <label className="flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-3 text-slate-700 hover:bg-slate-200">
                <Upload className="h-3.5 w-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'galleryImage2')}
                  className="hidden"
                />
              </label>
            </div>
            {formData.galleryImage2 && (
              <div className="h-24 w-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img src={formData.galleryImage2} alt="Gallery 2" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Pullquote Block */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Quote className="h-4 w-4 text-[#f12131]" />
            <span>4. Featured Pullquote (Blockquote)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Highlighted quotation displayed with a red left border and author citation inside the article.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Quote Text
          </label>
          <textarea
            rows={2}
            value={formData.quoteText}
            onChange={(e) => setFormData({ ...formData, quoteText: e.target.value })}
            placeholder="e.g. This quote emphasizes the significance of charity as an essential virtue..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Quote Author / Citation
          </label>
          <input
            type="text"
            value={formData.quoteAuthor}
            onChange={(e) => setFormData({ ...formData, quoteAuthor: e.target.value })}
            placeholder="e.g. John Doe"
            className="h-10 w-full sm:w-80 rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
          />
        </div>
      </div>

      {/* 5. Content & Excerpt */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          5. Article Content & Paragraphs
        </h2>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Short Excerpt (Card Summary)*
          </label>
          <input
            type="text"
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="1-2 sentences summarizing the article for the blog listing page."
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Full Article Body*
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            💡 Tip: Separate paragraphs with a blank line (press Enter twice). Paragraph 1 will appear before the 2-column gallery, and Paragraph 2 before the pullquote!
          </p>
          <textarea
            rows={12}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="It's no secret that access to quality education is unevenly distributed...

Education is more than just acquiring facts; it's about empowerment...

In a world brimming with opportunities, it's disheartening to know that not everyone has equal access..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-4 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131] leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Real Estate, Chennai, Investment, Advice"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
          />
        </div>
      </div>
    </form>
  );
}

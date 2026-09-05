'use client';

import React, { useEffect, useState } from 'react';
import { Video, Plus, Trash2, Edit, Play, X, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    project: '',
    projectName: '',
    videoUrl: '',
    videoType: 'YouTube',
    thumbnailUrl: '',
    description: '',
    status: 'Published',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vRes, pRes] = await Promise.all([
        api.get('/videos'),
        api.get('/projects'),
      ]);
      if (vRes.success) setVideos(vRes.data || []);
      if (pRes.success) setProjects(pRes.data || []);
    } catch (err) {
      console.warn('Failed to load videos:', err);
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
      const selectedProj = projects.find((p) => p._id === formData.project);
      const payload = {
        ...formData,
        projectName: selectedProj ? selectedProj.name : formData.projectName,
      };

      const res = await api.post('/videos', payload);
      if (res.success) {
        setVideos((prev) => [res.data, ...prev]);
        setIsModalOpen(false);
        setFormData({
          title: '',
          project: '',
          projectName: '',
          videoUrl: '',
          videoType: 'YouTube',
          thumbnailUrl: '',
          description: '',
          status: 'Published',
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save video');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await api.delete(`/videos/${id}`);
      if (res.success) {
        setVideos((prev) => prev.filter((v) => v._id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Video Center CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage YouTube walkthroughs, aerial drone footage, and project video tours.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Video Tour</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading video walkthroughs...
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-xs">
          <Video className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-extrabold text-slate-700">No videos published yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;Add Video Tour&quot; above to link YouTube or MP4 walkthroughs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-xs transition-all hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f12131] text-white shadow-xl">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2.5 left-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                    {item.videoType}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-extrabold text-[#f12131]">
                    {item.projectName || 'General'}
                  </span>
                  <h3 className="text-sm font-black text-[#29247c] line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-[#29247c] hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Video</span>
                </a>

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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-black tracking-tight text-[#29247c]">
                Add Video Tour
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
                  Video Title*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. KPN LeNid Drone Walkthrough"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Associated Project
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                >
                  <option value="">General Video Tour</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Video URL (YouTube or Direct)*
                </label>
                <input
                  type="text"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or /images/videos/hero-bg.mp4"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Platform Type
                  </label>
                  <select
                    value={formData.videoType}
                    onChange={(e) => setFormData({ ...formData, videoType: e.target.value as any })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="External">External / MP4</option>
                    <option value="Cloudinary">Cloudinary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
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
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

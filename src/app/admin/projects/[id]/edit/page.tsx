'use client';

import React, { use, useEffect, useState } from 'react';
import ProjectForm from '@/components/admin/ProjectForm';
import { api } from '@/lib/api';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await api.get(`/projects/${id}`);
        if (res.success && res.data) {
          setProject(res.data);
        } else {
          setError('Project not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
        Loading project details for editor...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-xs font-bold text-red-700">
        ⚠️ {error || 'Project not found'}
      </div>
    );
  }

  return <ProjectForm initialData={project} isEdit={true} />;
}

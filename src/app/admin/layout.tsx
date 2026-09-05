import React from 'react';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/authContext';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'KPN Promoters - Admin Portal & CMS',
  description: 'Manage real estate projects, enquiries, blogs, and site content for KPN Promoters.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="font-sans antialiased text-slate-800 bg-[#f8fafc] min-h-screen">
        <AdminShell>{children}</AdminShell>
      </div>
    </AuthProvider>
  );
}

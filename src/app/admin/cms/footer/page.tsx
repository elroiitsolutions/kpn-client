'use client';

import React, { useEffect, useState } from 'react';
import { PanelBottom, Save, CheckCircle, Plus, Trash2, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';

const DEFAULT_FOOTER_DATA = {
  name: 'main_footer',
  companyDescription:
    'KPN Promoters has earned the trust of over 10,000 satisfied families across Chennai and Tamil Nadu.',
  address: 'No: 17, 1st Cross Street, Sri Devi Nagar, Alapakkam, Chennai - 600116',
  phone: '+91 98844 55555',
  email: 'info@kpnpromoters.in',
  copyright: '© 2026 KPN Promoters. All Rights Reserved.',
  socialLinks: {
    facebook: 'https://facebook.com/kpnpromoters',
    instagram: 'https://instagram.com/kpnpromoters',
    youtube: 'https://youtube.com/@kpnpromoters',
    linkedin: 'https://linkedin.com/company/kpnpromoters',
  },
  quickLinks: [
    { label: 'About Us', href: '/about-us', order: 1 },
    { label: 'Our Awards', href: '/our-awards', order: 2 },
    { label: 'Investors', href: '/investors', order: 3 },
    { label: 'Projects', href: '/projects', order: 4 },
  ],
  importantLinks: [
    { label: 'Residential Apartments', href: '/projects', order: 1 },
    { label: 'Approved Plots', href: '/projects', order: 2 },
    { label: 'Joint Development', href: '/joint-development', order: 3 },
    { label: 'NRI Services', href: '/nri', order: 4 },
  ],
};

export default function AdminFooterCMSPage() {
  const [footer, setFooter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadFooter() {
      try {
        const res = await api.get('/cms/footer');
        if (res.success && res.data) {
          setFooter({
            ...DEFAULT_FOOTER_DATA,
            ...res.data,
            quickLinks: res.data.quickLinks?.length ? res.data.quickLinks : DEFAULT_FOOTER_DATA.quickLinks,
            importantLinks: res.data.importantLinks?.length ? res.data.importantLinks : DEFAULT_FOOTER_DATA.importantLinks,
          });
        } else {
          setFooter(DEFAULT_FOOTER_DATA);
        }
      } catch (err) {
        console.warn('Failed to load footer CMS:', err);
        setFooter(DEFAULT_FOOTER_DATA);
      } finally {
        setIsLoading(false);
      }
    }

    loadFooter();
  }, []);

  const handleResetToDefault = () => {
    if (window.confirm('Reset footer to default website content?')) {
      setFooter(DEFAULT_FOOTER_DATA);
    }
  };

  const handleAddLink = (key: 'quickLinks' | 'importantLinks') => {
    const list = footer[key] || [];
    setFooter({
      ...footer,
      [key]: [
        ...list,
        { label: 'New Link', href: '/', order: list.length + 1 },
      ],
    });
  };

  const handleRemoveLink = (key: 'quickLinks' | 'importantLinks', idx: number) => {
    const list = [...(footer[key] || [])];
    list.splice(idx, 1);
    setFooter({
      ...footer,
      [key]: list,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await api.put('/cms/footer', footer);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save footer');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
        Loading footer configuration...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Website Footer CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage company contact phone numbers, sales email, head office address, quick links, and social URLs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#f12131] px-5 text-xs font-bold text-white shadow-xs hover:bg-[#d81928] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Footer Settings'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Footer settings successfully updated!</span>
        </div>
      )}

      {/* Main Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900">
          Company & Contact Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Sales Phone Number
            </label>
            <input
              type="text"
              value={footer?.phone || ''}
              onChange={(e) => setFooter({ ...footer, phone: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Sales Enquiry Email
            </label>
            <input
              type="email"
              value={footer?.email || ''}
              onChange={(e) => setFooter({ ...footer, email: e.target.value })}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Corporate Head Office Address
          </label>
          <input
            type="text"
            value={footer?.address || ''}
            onChange={(e) => setFooter({ ...footer, address: e.target.value })}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Company Bio / Description
          </label>
          <textarea
            rows={3}
            value={footer?.companyDescription || ''}
            onChange={(e) =>
              setFooter({ ...footer, companyDescription: e.target.value })
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Copyright Notice
          </label>
          <input
            type="text"
            value={footer?.copyright || ''}
            onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900">
          Social Media Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Facebook URL
            </label>
            <input
              type="text"
              value={footer?.socialLinks?.facebook || ''}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...footer.socialLinks, facebook: e.target.value },
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Instagram URL
            </label>
            <input
              type="text"
              value={footer?.socialLinks?.instagram || ''}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...footer.socialLinks, instagram: e.target.value },
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              YouTube Channel URL
            </label>
            <input
              type="text"
              value={footer?.socialLinks?.youtube || ''}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...footer.socialLinks, youtube: e.target.value },
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              LinkedIn / Twitter URL
            </label>
            <input
              type="text"
              value={footer?.socialLinks?.linkedin || ''}
              onChange={(e) =>
                setFooter({
                  ...footer,
                  socialLinks: { ...footer.socialLinks, linkedin: e.target.value },
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
            />
          </div>
        </div>
      </div>

      {/* Quick Links & Important Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Company Quick Links ({footer?.quickLinks?.length || 0})
            </h2>
            <button
              type="button"
              onClick={() => handleAddLink('quickLinks')}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-[#29247c] hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(footer?.quickLinks || []).map((link: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    const copy = [...footer.quickLinks];
                    copy[idx].label = e.target.value;
                    setFooter({ ...footer, quickLinks: copy });
                  }}
                  placeholder="Label"
                  className="h-8 w-36 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 text-xs font-bold"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => {
                    const copy = [...footer.quickLinks];
                    copy[idx].href = e.target.value;
                    setFooter({ ...footer, quickLinks: copy });
                  }}
                  placeholder="URL (/about-us)"
                  className="h-8 flex-1 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink('quickLinks', idx)}
                  className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Important Links / Services */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Services & Highlights ({footer?.importantLinks?.length || 0})
            </h2>
            <button
              type="button"
              onClick={() => handleAddLink('importantLinks')}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-[#29247c] hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(footer?.importantLinks || []).map((link: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    const copy = [...footer.importantLinks];
                    copy[idx].label = e.target.value;
                    setFooter({ ...footer, importantLinks: copy });
                  }}
                  placeholder="Label"
                  className="h-8 w-36 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 text-xs font-bold"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => {
                    const copy = [...footer.importantLinks];
                    copy[idx].href = e.target.value;
                    setFooter({ ...footer, importantLinks: copy });
                  }}
                  placeholder="URL (/projects)"
                  className="h-8 flex-1 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink('importantLinks', idx)}
                  className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}

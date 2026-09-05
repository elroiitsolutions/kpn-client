'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  FileText,
  Image as ImageIcon,
  Trophy,
  MessageSquareQuote,
  Video,
  Home,
  Menu as MenuIcon,
  PanelBottom,
  Users,
  Settings,
  LogOut,
  PlusCircle,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/authContext';

const navigationItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
      { title: 'Enquiries', url: '/admin/enquiries', icon: Inbox },
    ],
  },
  {
    title: 'Real Estate CMS',
    items: [
      { title: 'Projects', url: '/admin/projects', icon: Building2 },
      { title: 'New Project', url: '/admin/projects/new', icon: PlusCircle },
    ],
  },
  {
    title: 'Content & Media',
    items: [
      { title: 'Blogs', url: '/admin/blogs', icon: FileText },
      { title: 'Media Library', url: '/admin/media', icon: ImageIcon },
      { title: 'Awards', url: '/admin/awards', icon: Trophy },
      { title: 'Testimonials', url: '/admin/testimonials', icon: MessageSquareQuote },
      { title: 'Videos', url: '/admin/videos', icon: Video },
    ],
  },
  {
    title: 'Website CMS',
    items: [
      { title: 'Homepage', url: '/admin/cms/home', icon: Home },
      { title: 'Menu Navigation', url: '/admin/cms/menu', icon: MenuIcon },
      { title: 'Footer', url: '/admin/cms/footer', icon: PanelBottom },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Referrals', url: '/admin/referrals', icon: Users },
      { title: 'Settings', url: '/admin/settings', icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const isActive = (url: string) => {
    if (url === '/admin') return pathname === '/admin';
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <Sidebar>
      {/* Header Logo */}
      <SidebarHeader>
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-1 py-1 rounded-lg hover:bg-slate-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f12131] text-white shadow-xs">
            <span className="text-base font-black">K</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden leading-none">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                KPN Promoters
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Admin Panel
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                      >
                        <Link href={item.url} className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#f12131]' : 'text-slate-500'}`} />
                          {!isCollapsed && (
                            <span className="truncate">{item.title}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter>
        <div
          className={`flex items-center rounded-lg border border-slate-200 bg-slate-50/70 p-2 ${
            isCollapsed ? 'justify-center p-1.5' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#29247c] text-xs font-bold text-white shadow-xs">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'KPN Admin'}
                </p>
                <p className="truncate text-[10px] font-medium text-slate-500">
                  {user?.role || 'Superadmin'}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

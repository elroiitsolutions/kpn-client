'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

interface BreadcrumbContextValue {
  customCrumbs: BreadcrumbCrumb[] | null;
  setCustomCrumbs: (crumbs: BreadcrumbCrumb[] | null) => void;
  entityTitles: Record<string, string>;
  setEntityTitle: (id: string, title: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  customCrumbs: null,
  setCustomCrumbs: () => {},
  entityTitles: {},
  setEntityTitle: () => {},
});

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [customCrumbs, setCustomCrumbs] = useState<BreadcrumbCrumb[] | null>(null);
  const [entityTitles, setEntityTitles] = useState<Record<string, string>>({});

  // Reset custom crumbs on route change so stale page-specific crumbs don't linger
  useEffect(() => {
    setCustomCrumbs(null);
  }, [pathname]);

  const setEntityTitle = (id: string, title: string) => {
    if (!id || !title) return;
    setEntityTitles((prev) => {
      if (prev[id] === title) return prev;
      return { ...prev, [id]: title };
    });
  };

  return (
    <BreadcrumbContext.Provider
      value={{ customCrumbs, setCustomCrumbs, entityTitles, setEntityTitle }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  return useContext(BreadcrumbContext);
}

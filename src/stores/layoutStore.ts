import { create } from 'zustand';
import { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/components/layouts/PageBreadcrumb';

interface HeaderState {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: ReactNode;
}

interface LayoutState {
  header: HeaderState | null;
  setHeader: (header: HeaderState | null) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  header: null,
  setHeader: (header) => set({ header }),
}));

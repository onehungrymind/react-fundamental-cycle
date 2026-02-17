import { create } from 'zustand'
import type { ProjectStatus } from '../types'

// ============================================================
// AppState — all global client state slices
// ============================================================

interface AppState {
  // ---- Sidebar ------------------------------------------------
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // ---- Filters ------------------------------------------------
  statusFilter: ProjectStatus | 'all';
  sortOrder: 'asc' | 'desc';
  setStatusFilter: (filter: ProjectStatus | 'all') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;

  // ---- Recently viewed ----------------------------------------
  // Stores up to 5 project IDs, most recent first.
  recentlyViewed: string[];
  addRecentlyViewed: (projectId: string) => void;

  // ---- Notification preferences --------------------------------
  showSuccessToasts: boolean;
  showErrorToasts: boolean;
  toggleNotificationPref: (key: 'showSuccessToasts' | 'showErrorToasts') => void;
}

// ============================================================
// Store
//
// Module-level singleton — no Provider needed.
// Any component can import and call useAppStore() directly.
// ============================================================

export const useAppStore = create<AppState>((set) => ({
  // ---- Sidebar ------------------------------------------------
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // ---- Filters ------------------------------------------------
  statusFilter: 'all',
  sortOrder: 'asc',
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setSortOrder: (order) => set({ sortOrder: order }),

  // ---- Recently viewed ----------------------------------------
  recentlyViewed: [],
  addRecentlyViewed: (projectId) =>
    set((state) => ({
      recentlyViewed: [
        projectId,
        ...state.recentlyViewed.filter((id) => id !== projectId),
      ].slice(0, 5),
    })),

  // ---- Notification preferences --------------------------------
  showSuccessToasts: true,
  showErrorToasts: true,
  toggleNotificationPref: (key) =>
    set((state) => ({ [key]: !state[key] })),
}))

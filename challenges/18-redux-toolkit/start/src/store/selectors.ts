import { shallow } from 'zustand/shallow'
import { useAppStore } from './useAppStore'

// ============================================================
// Selector hooks
//
// Each hook subscribes only to the slice of state the consuming
// component needs.  Using shallow comparison for object returns
// prevents re-renders when unrelated state changes.
//
// shallow: compares object properties one level deep.
//   Without it, a new object is created on every state change
//   which always fails referential equality → unnecessary re-render.
// ============================================================

// Sidebar — isCollapsed + toggle action
export const useSidebarState = () =>
  useAppStore(
    (s) => ({ isCollapsed: s.sidebarCollapsed, toggle: s.toggleSidebar }),
    shallow,
  )

// Filter preferences — statusFilter, sortOrder, and setters
export const useFilterPreferences = () =>
  useAppStore(
    (s) => ({
      statusFilter: s.statusFilter,
      sortOrder: s.sortOrder,
      setStatusFilter: s.setStatusFilter,
      setSortOrder: s.setSortOrder,
    }),
    shallow,
  )

// Recently viewed — array of project IDs (last 5, most recent first)
// Returns a primitive array so no shallow needed (referential equality
// handles array changes correctly since Zustand replaces the array).
export const useRecentlyViewed = () =>
  useAppStore((s) => s.recentlyViewed)

// Notification preferences — booleans + toggle action
export const useNotificationPrefs = () =>
  useAppStore(
    (s) => ({
      showSuccess: s.showSuccessToasts,
      showError: s.showErrorToasts,
      toggle: s.toggleNotificationPref,
    }),
    shallow,
  )

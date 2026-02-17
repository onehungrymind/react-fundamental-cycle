# Challenge 17 — Global Client State with Zustand

## Overview

In the previous challenge you used TanStack Query for all server state and React context for auth/theme. One gap remained: **UI state that needs to survive navigation** — sidebar collapse, filter preferences, and recently-viewed history.

In this challenge you will add [Zustand](https://zustand.docs.pmnd.rs/) as a lightweight global client-state store, giving that UI state a proper home without the boilerplate of Context + useReducer.

---

## Learning Objectives

- Create a typed Zustand store with multiple state slices
- Write **selector hooks** to subscribe only to the data a component needs
- Use `shallow` comparison to prevent unnecessary re-renders when selecting objects
- Understand the **module-level singleton** pattern Zustand uses
- Distinguish when to use Zustand vs. TanStack Query vs. React Context

---

## Tasks

### 1 — Create the store (`src/store/useAppStore.ts`)

Create a Zustand store with four slices:

| Slice | State | Actions |
|---|---|---|
| Sidebar | `sidebarCollapsed: boolean` | `toggleSidebar()` |
| Filters | `statusFilter`, `sortOrder` | `setStatusFilter()`, `setSortOrder()` |
| Recently Viewed | `recentlyViewed: string[]` (last 5 project IDs) | `addRecentlyViewed(id)` |
| Notifications | `showSuccessToasts`, `showErrorToasts` | `toggleNotificationPref(key)` |

The `recentlyViewed` list must:
- Deduplicate (moving an existing ID to the front)
- Cap at 5 entries

### 2 — Write selector hooks (`src/store/selectors.ts`)

Export four named hooks. Each must use `shallow` comparison when returning an object:

```ts
export const useSidebarState   = () => useAppStore((s) => ..., shallow)
export const useFilterPreferences = () => useAppStore((s) => ..., shallow)
export const useRecentlyViewed = () => useAppStore((s) => s.recentlyViewed)
export const useNotificationPrefs = () => useAppStore((s) => ..., shallow)
```

### 3 — Wire up `Layout.tsx`

Replace the local `useState` for sidebar collapse with `useSidebarState()`.

Add a sidebar toggle button somewhere in the header or layout that calls `toggle`.

When `isCollapsed` is `true`, apply a CSS class (`app-sidebar--collapsed`) to the aside element so it narrows.

### 4 — Wire up `Sidebar.tsx`

- Accept an `isCollapsed` prop
- When collapsed, hide link labels (show only icons or a narrow strip)

### 5 — Persist filters in `ProjectsLayout.tsx`

Replace the local `useState` (or `useProjectFilters` hook) with `useFilterPreferences()` from the store.

The filter and sort selection must **survive navigation away and back**.

### 6 — Track recently viewed in `ProjectDetailPanel.tsx`

Call `addRecentlyViewed(projectId)` inside a `useEffect` whenever `projectId` changes and the project data is loaded.

### 7 — Notification prefs in `Header.tsx`

Add a small "Settings" popover or inline controls that let the user toggle `showSuccessToasts` and `showErrorToasts`.

> You do not need to gate toasts behind these flags in `TaskItem` — just expose the controls so the state is usable.

---

## Hints

- Import `shallow` from `'zustand/shallow'`
- `create<AppState>((set) => ({ ... }))` — the type parameter makes everything strict
- You do not need `persist` middleware for this challenge (that is the debrief topic)
- The store is a singleton at module scope — no Provider needed

---

## File Map

```
src/
  store/
    useAppStore.ts    ← NEW: Zustand store
    selectors.ts      ← NEW: selector hooks
  components/
    Layout.tsx        ← updated: useSidebarState
    Sidebar.tsx       ← updated: isCollapsed prop
    Header.tsx        ← updated: notification prefs
  pages/
    ProjectsLayout.tsx     ← updated: useFilterPreferences
    ProjectDetailPanel.tsx ← updated: addRecentlyViewed
```

---

## Running the app

```bash
npm install
npx msw init public/ --save
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

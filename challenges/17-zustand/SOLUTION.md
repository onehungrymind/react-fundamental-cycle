# Challenge 17 — Solution Debrief

## What changed

| File | Change |
|---|---|
| `src/store/useAppStore.ts` | New: Zustand store with 4 slices |
| `src/store/selectors.ts` | New: typed selector hooks with shallow comparison |
| `src/components/Layout.tsx` | Reads `useSidebarState()` instead of local useState |
| `src/components/Sidebar.tsx` | Accepts `isCollapsed`, renders collapsed variant |
| `src/components/Header.tsx` | Adds notification pref toggles via `useNotificationPrefs()` |
| `src/pages/ProjectsLayout.tsx` | Reads `useFilterPreferences()` — filters persist across navigation |
| `src/pages/ProjectDetailPanel.tsx` | Calls `addRecentlyViewed(projectId)` on load |

---

## Zustand vs. React Context

| | Zustand | React Context |
|---|---|---|
| Boilerplate | Minimal — one `create()` call | Provider + hook + sometimes useReducer |
| Re-render granularity | Per-selector (subscribe to a slice) | All consumers re-render when any value changes |
| Provider | None (module singleton) | Must wrap the tree |
| DevTools | Yes (`zustand/middleware`) | Manual |
| Async actions | First-class (just call `set` after await) | Needs useEffect + dispatch pattern |
| Best for | UI state shared across unrelated components | Dependency injection (theme, auth) |

**Rule of thumb used here:**
- TanStack Query → server state (projects, tasks)
- Zustand → global client state (sidebar, filters, recent history, prefs)
- React Context → "environment" values injected into the tree (theme, auth)

---

## Selectors and shallow comparison

```ts
// Bad — creates a new object on every state change → always re-renders
const { statusFilter, sortOrder } = useAppStore((s) => ({
  statusFilter: s.statusFilter,
  sortOrder: s.sortOrder,
}));

// Good — shallow compares the returned object → only re-renders when values change
const { statusFilter, sortOrder } = useAppStore(
  (s) => ({ statusFilter: s.statusFilter, sortOrder: s.sortOrder }),
  shallow,
);

// Primitive — no shallow needed, referential equality is sufficient
const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
```

The `shallow` import lives in `'zustand/shallow'`, not the main `'zustand'` package.

---

## Module-level singleton

Zustand creates the store once at module load time, outside React's render cycle. This means:

1. **No Provider needed** — any component can import and call the hook directly
2. **Persists between route changes** — because it is not tied to component lifecycle
3. **Test reset pattern** — in tests, call `useAppStore.setState(initialState)` in `beforeEach` to reset

```ts
// In tests:
import { useAppStore } from '../store/useAppStore'

beforeEach(() => {
  useAppStore.setState({
    sidebarCollapsed: false,
    statusFilter: 'all',
    sortOrder: 'asc',
    recentlyViewed: [],
    showSuccessToasts: true,
    showErrorToasts: true,
  })
})
```

---

## Recently viewed — deduplication logic

```ts
addRecentlyViewed: (projectId) =>
  set((state) => ({
    recentlyViewed: [
      projectId,
      ...state.recentlyViewed.filter((id) => id !== projectId),
    ].slice(0, 5),
  })),
```

- Prepend the new ID
- Filter out any previous occurrence (deduplication)
- Slice to cap at 5

---

## persist middleware (bonus — not required)

To survive a page refresh, wrap the store with `persist`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({ /* same as before */ }),
    { name: 'taskflow-app-store' },
  ),
)
```

This writes the state to `localStorage` under the key `taskflow-app-store` and rehydrates on startup. You can limit what gets persisted with the `partialize` option:

```ts
persist(
  (set) => ({ ... }),
  {
    name: 'taskflow-app-store',
    partialize: (state) => ({
      statusFilter: state.statusFilter,
      sortOrder: state.sortOrder,
      recentlyViewed: state.recentlyViewed,
      showSuccessToasts: state.showSuccessToasts,
      showErrorToasts: state.showErrorToasts,
      // Note: sidebarCollapsed intentionally excluded
    }),
  },
)
```

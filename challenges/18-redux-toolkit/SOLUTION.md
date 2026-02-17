# Challenge 18 — Solution Debrief

## What was implemented

Three Redux Toolkit slices replace the Zustand store for global client-state:

| Slice | Key idea |
|---|---|
| `sidebarSlice` | Immer mutation inside `createSlice` reducer |
| `filtersSlice` | `PayloadAction<T>` generic for typed payloads |
| `recentlyViewedSlice` | Array manipulation with Immer — looks imperative, is immutable |

---

## Key concepts

### `createSlice` + Immer

`createSlice` wraps your reducers with Immer's `produce`.
Inside a reducer you can **write** to `state` directly:

```ts
toggle: (state) => {
  state.isCollapsed = !state.isCollapsed; // mutates a draft, not real state
},
```

Immer intercepts the mutation and returns a new state object.
This makes reducers concise without sacrificing immutability guarantees.

### Typed `PayloadAction`

Import `PayloadAction` from `@reduxjs/toolkit` to add type information to
the action's `payload`:

```ts
setStatusFilter: (state, action: PayloadAction<ProjectStatus | 'all'>) => {
  state.statusFilter = action.payload;
},
```

Without the generic the payload is typed as `unknown`, causing downstream errors.

### Typed hooks pattern

Instead of importing `useSelector` / `useDispatch` directly (which gives you
`unknown` / untyped dispatch), create bound versions once in `hooks.ts`:

```ts
// hooks.ts
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
```

Every component imports from `hooks.ts` — TypeScript knows the full state shape
automatically.

### `useSelector` re-render behaviour

`useSelector` re-renders when the selected value changes by **reference equality**.
For primitive values (`boolean`, `string`) this is fine.
For objects you need `shallowEqual` or `createSelector` (from reselect):

```ts
// Primitive — no extra comparator needed
const isCollapsed = useAppSelector((s) => s.sidebar.isCollapsed);

// Object — use shallowEqual or derive separate primitives
import { shallowEqual } from 'react-redux';
const { statusFilter, sortOrder } = useAppSelector(
  (s) => s.filters,
  shallowEqual,
);
```

### `createSelector` (bonus)

For derived / computed values, memoize with `createSelector` (re-exported by RTK):

```ts
import { createSelector } from '@reduxjs/toolkit';

const selectFilteredProjects = createSelector(
  [(s: RootState) => s.filters.statusFilter],
  (filter) => (projects: Project[]) =>
    filter === 'all' ? projects : projects.filter(p => p.status === filter),
);
```

The selector only recomputes when its inputs change.

---

## Redux Toolkit vs Zustand — comparison

| | Redux Toolkit | Zustand |
|---|---|---|
| **Boilerplate** | More (slice file per concern) | Minimal (one `create()` call) |
| **DevTools** | Excellent — time-travel, action log | Good — limited time-travel |
| **Provider** | Required (`<Provider store={store}>`) | Not required |
| **Async** | `createAsyncThunk` or middleware | Direct in action / external hook |
| **TypeScript** | Verbose but fully typed | Concise and fully typed |
| **Scale** | Scales well in large teams | Better for small/medium apps |
| **Learning curve** | Steeper | Gentler |

Both are valid choices. Zustand wins on simplicity; Redux wins on tooling and
standardisation in large codebases.

---

## Redux DevTools — time travel

1. Open Chrome DevTools → Redux tab
2. Every dispatched action appears in the left panel with its type and payload
3. Click any action to "jump" the UI back to that point in time
4. Use the slider at the bottom to scrub through history
5. The **Diff** tab shows exactly which parts of state changed

This makes debugging complex state flows dramatically easier compared to console logs.

---

## Files changed from `start/` to `solution/`

```
src/store/redux/sidebarSlice.ts        — reducers completed
src/store/redux/filtersSlice.ts        — reducers completed
src/store/redux/recentlyViewedSlice.ts — created from scratch
src/store/redux/store.ts               — reducers registered
src/store/redux/hooks.ts               — withTypes<> pattern
src/App.tsx                            — <Provider store={store}>
src/components/Layout.tsx              — useAppSelector/Dispatch
src/pages/ProjectsLayout.tsx           — useAppSelector/Dispatch
src/pages/ProjectDetailPanel.tsx       — useAppDispatch + addRecentlyViewed
```

Zustand files (`useAppStore.ts`, `selectors.ts`) are removed in `solution/` because
they are no longer used; they remain in `start/` for comparison.

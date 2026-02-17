# Challenge 18 — State Management: Redux Toolkit (Alternate)

## Learning objectives

- Understand the Redux Toolkit (RTK) mental model: slices, reducers, actions, store
- Use `createSlice` and appreciate how Immer enables mutation-style reducer code
- Wire the Redux store to React with `<Provider>` and `configureStore`
- Write typed hooks (`useAppSelector`, `useAppDispatch`) for type-safe store access
- Compare Redux Toolkit with Zustand (the previous challenge)
- Inspect state changes with Redux DevTools

---

## What you are building

The TaskFlow app already has all its UI working (with Zustand in `start/`).
Your job is to **replace Zustand with Redux Toolkit** without changing any visible behaviour.

Three slices of global client state to migrate:

| Slice | State | Actions |
|---|---|---|
| `sidebar` | `isCollapsed: boolean` | `toggle`, `collapse`, `expand` |
| `filters` | `statusFilter`, `sortOrder` | `setStatusFilter`, `setSortOrder` |
| `recentlyViewed` | `projectIds: string[]` | `addRecentlyViewed` |

---

## Tasks

### 1 — Complete `sidebarSlice.ts`

File: `src/store/redux/sidebarSlice.ts`

The state interface and stub reducers are already there.
Fill in the three reducers:

- `toggle` — flip `state.isCollapsed`
- `collapse` — set `state.isCollapsed = true`
- `expand` — set `state.isCollapsed = false`

Export `sidebarReducer` and the individual action creators (`toggle`, `collapse`, `expand`).

> Immer is built into `createSlice` — you can write `state.isCollapsed = !state.isCollapsed`
> directly inside a reducer. No spread needed.

### 2 — Complete `filtersSlice.ts`

File: `src/store/redux/filtersSlice.ts`

Fill in the two reducers:

- `setStatusFilter(state, action)` — replace `state.statusFilter` with `action.payload`
- `setSortOrder(state, action)` — replace `state.sortOrder` with `action.payload`

Export `filtersReducer` and the action creators.

### 3 — Create `recentlyViewedSlice.ts` from scratch

File: `src/store/redux/recentlyViewedSlice.ts`

Requirements:

- State: `{ projectIds: string[] }` (initially empty)
- One reducer: `addRecentlyViewed(state, action: PayloadAction<string>)`
  - Prepend the new ID
  - Remove any existing occurrence of that ID (no duplicates)
  - Keep only the last 5 entries

```ts
// Hint — one-liner that satisfies all three requirements:
state.projectIds = [action.payload, ...state.projectIds.filter(id => id !== action.payload)].slice(0, 5);
```

Export `recentlyViewedReducer` and `addRecentlyViewed`.

### 4 — Wire the store

File: `src/store/redux/store.ts`

Register the three reducers with `configureStore`:

```ts
reducer: {
  sidebar: sidebarReducer,
  filters: filtersReducer,
  recentlyViewed: recentlyViewedReducer,
}
```

Export `RootState` and `AppDispatch` type aliases.

### 5 — Replace Zustand hooks with Redux equivalents

The app currently uses Zustand selectors imported from `src/store/selectors.ts`.
Update the following components to use `useAppSelector` / `useAppDispatch` instead:

| Component | Was using | Now uses |
|---|---|---|
| `Layout.tsx` | `useSidebarState()` | `useAppSelector` + `useAppDispatch` |
| `Header.tsx` | `useNotificationPrefs()` | keep as local state (notification prefs are not in Redux) |
| `ProjectsLayout.tsx` | `useFilterPreferences()` | `useAppSelector` + `useAppDispatch` |
| `ProjectDetailPanel.tsx` | `useAppStore(s => s.addRecentlyViewed)` | `useAppDispatch` + `addRecentlyViewed` |

Wrap the app with `<Provider store={store}>` in `src/App.tsx`.

---

## Redux DevTools

1. Install the [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) in Chrome
2. Open DevTools → Redux tab
3. Click filter buttons and toggle the sidebar
4. Use the **time-travel** controls to jump between past states

---

## Files to edit

```
src/store/redux/sidebarSlice.ts        ← fill in TODOs
src/store/redux/filtersSlice.ts        ← fill in TODOs
src/store/redux/recentlyViewedSlice.ts ← create from scratch
src/store/redux/store.ts               ← register reducers
src/store/redux/hooks.ts               ← already done for you
src/App.tsx                            ← wrap with <Provider>
src/components/Layout.tsx              ← use Redux hooks
src/pages/ProjectsLayout.tsx           ← use Redux hooks
src/pages/ProjectDetailPanel.tsx       ← use Redux hooks
```

The Zustand store (`src/store/useAppStore.ts`, `src/store/selectors.ts`) is left in
place in `start/` so you can compare the two approaches side by side.

---

## Running the app

```bash
cd start          # or solution
npm install
npx msw init public/ --save
npm run dev
```

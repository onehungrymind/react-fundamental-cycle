# Challenge 23 — Solution Debrief: Suspense & Lazy Loading

---

## What Changed

### `src/App.tsx`

Two eager imports replaced with `React.lazy` calls:

```ts
// Before (eager — both pages land in the main bundle)
import { ProjectDetailPanel } from './pages/ProjectDetailPanel'
import { NewProjectPage }     from './pages/NewProjectPage'

// After (lazy — each page becomes its own chunk)
import { lazy, Suspense } from 'react'
const ProjectDetailPanel = lazy(() => import('./pages/ProjectDetailPanel'))
const NewProjectPage     = lazy(() => import('./pages/NewProjectPage'))
```

Each lazy component is wrapped with a `<Suspense>` boundary directly in the
route definition:

```tsx
<Route
  path=":projectId"
  element={
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailPanel />
    </Suspense>
  }
>
```

### `src/pages/ProjectDetailPanel.tsx` and `src/pages/NewProjectPage.tsx`

Both already had a default export alongside the named export.
`React.lazy` resolves the module's **default export**, so `export default` is
required on every lazily-loaded module.

### New skeleton components

| File | Purpose |
|---|---|
| `src/components/skeletons/ProjectDetailSkeleton.tsx` | Shape-matched placeholder for the project detail panel (title, meta row, task cards) |
| `src/components/skeletons/FormSkeleton.tsx` | Placeholder for the new-project form (label + input pairs) |
| `src/components/skeletons/PageSkeleton.tsx` | Generic full-page skeleton used as a catch-all fallback |

All three use the `.skeleton` CSS class with the shimmer keyframe animation
defined in `App.css`.

---

## Why Skeleton Loaders Instead of Spinners?

A spinner communicates "loading" but gives no information about what will
appear. A skeleton loader sets the correct visual expectation — the user sees
the layout before the content arrives, which reduces perceived latency and
prevents layout shift.

Rule of thumb: spinners work when load time is < 1 second or unpredictable;
skeletons work best for predictable content layouts (lists, cards, forms).

---

## Route-Level vs Component-Level Splitting

| Strategy | Boundary | Best for |
|---|---|---|
| Route-level | `<Route element={<Suspense>…}>` | Pages — users navigate to them, they're never rendered unless needed |
| Component-level | `<Suspense>` inside a component | Heavy widgets (charts, editors) that live on an already-loaded page |

For TaskFlow, route-level splitting is the right choice: `ProjectDetailPanel`
and `NewProjectPage` are full pages, so there is no reason to load their code
until the user navigates there.

`ProjectsLayout` is kept **eagerly loaded** because it is the first thing the
user sees after the initial redirect — lazy-loading it would add a Suspense
flash on every page load.

---

## `startTransition` and Avoiding Flash

React 18+ `startTransition` lets you mark a state update as non-urgent so
React can keep the old UI visible while it prepares the new one:

```ts
import { startTransition } from 'react'

function navigateTo(path: string) {
  startTransition(() => {
    navigate(path)
  })
}
```

When paired with `useDeferredValue` or React Router's built-in transition
support (via the `unstable_startViewTransition` option in React Router 7),
this prevents the blank-skeleton flash that can occur when navigating quickly
between routes.

In this challenge the skeletons are short-lived enough that the flash is
acceptable, but `startTransition` is the production-grade answer.

---

## Prefetching on Hover

You can eagerly start loading a lazy chunk before the user clicks by triggering
the import on `mouseenter`:

```tsx
const prefetchProjectDetail = () => {
  void import('./pages/ProjectDetailPanel')
}

<Link
  to={`/projects/${id}`}
  onMouseEnter={prefetchProjectDetail}
>
  {name}
</Link>
```

The browser requests the chunk on hover. By the time the user finishes clicking
and React resolves the route, the chunk is already in the module cache — the
`<Suspense>` fallback either never appears or appears for < 50 ms.

---

## Measuring Bundle Impact

```bash
npm run build
```

Vite outputs a size table. Before lazy loading, `ProjectDetailPanel` and
`NewProjectPage` are part of the main entry chunk. After lazy loading, each
appears as a separate `.js` file (e.g. `ProjectDetailPanel-BxYz1234.js`).

The entry chunk shrinks and the total gzipped size stays the same — but the
**critical path** (the code required before first paint) is smaller.

---

## Key Takeaways

1. `React.lazy` requires a dynamic `import()` that resolves to a module with a
   **default export**.
2. Every `React.lazy` component must be wrapped in a `<Suspense>` boundary
   somewhere in the tree.
3. Skeletons should mirror the shape of the real UI to reduce layout shift and
   set user expectations.
4. Route-level splitting is the most impactful form of code splitting for
   typical React apps.
5. Prefetching on hover eliminates perceived loading time for fast connections.

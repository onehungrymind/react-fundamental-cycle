# Challenge 23 — Suspense & Lazy Loading

**TaskFlow Workshop — Challenge 23 of 26**

---

## What You Will Build

Add code splitting and skeleton loading states to TaskFlow so that heavy pages
are loaded on-demand instead of bundled together with the initial JavaScript.

---

## Learning Goals

- Use `React.lazy` to split page components into separate chunks
- Wrap lazy components with `<Suspense>` and meaningful fallback UIs
- Build skeleton loaders that reflect the actual shape of the UI (not spinners)
- Understand route-level vs component-level code splitting
- Measure real bundle-size impact with Vite's build output

---

## Tasks

### 1 — Lazy-load `ProjectDetailPanel`

Open `src/App.tsx`. The panel is currently imported eagerly:

```ts
import { ProjectDetailPanel } from './pages/ProjectDetailPanel'
```

Change it to a lazy import:

```ts
const ProjectDetailPanel = React.lazy(() => import('./pages/ProjectDetailPanel'))
```

`React.lazy` requires the module's **default export**.
Open `src/pages/ProjectDetailPanel.tsx` and confirm it exports:

```ts
export function ProjectDetailPanel() { ... }   // named — kept for tests
export default ProjectDetailPanel              // default — required by lazy
```

### 2 — Lazy-load `NewProjectPage`

Repeat the same process for `NewProjectPage`.

### 3 — Add skeleton fallbacks

Create the following skeleton components inside `src/components/skeletons/`:

| File | Used as fallback for |
|---|---|
| `ProjectDetailSkeleton.tsx` | `ProjectDetailPanel` |
| `FormSkeleton.tsx` | `NewProjectPage` |
| `PageSkeleton.tsx` | Generic full-page fallback |

Skeleton elements should use the `.skeleton` CSS class defined in `App.css`
(shimmer animation). Show UI shapes that match the real content layout — not a
spinner or a blank screen.

### 4 — Wrap routes with `<Suspense>`

In `src/App.tsx`, wrap each lazy component with its skeleton fallback:

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

Do the same for the `/projects/new` route using `<FormSkeleton />`.

### 5 — Verify bundle splitting

Run `npm run build` and inspect the output:

```
npm run build
```

You should see separate chunk files for `ProjectDetailPanel` and `NewProjectPage`.
Compare total bundle size before and after your changes.

---

## What Is Already Done

The `start/` directory is identical to Challenge 22's solution with one
exception: all page imports are **eager** (no `React.lazy`, no `<Suspense>`,
no skeleton components exist yet).

---

## Acceptance Criteria

- [ ] `ProjectDetailPanel` is loaded via `React.lazy`
- [ ] `NewProjectPage` is loaded via `React.lazy`
- [ ] Each lazy component has a matching `<Suspense>` boundary with a skeleton fallback
- [ ] Skeleton components render shape-based placeholders (not spinners)
- [ ] `npm run build` produces separate chunk files for lazy-loaded pages
- [ ] All existing tests still pass: `npm test`
- [ ] TypeScript strict-mode — `npm run build` must succeed with zero errors

---

## Running the App

```bash
cd start          # or cd solution
npm install
npx msw init public/   # generates public/mockServiceWorker.js
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Running Tests

```bash
npm test
```

# Challenge 10 — Solution Debrief

## What You Built

A fully routed single-page application with four routes:

| URL | Component | Notes |
|-----|-----------|-------|
| `/` | — | Redirects to `/projects` via `<Navigate>` |
| `/projects` | `ProjectListPage` | Filter bar + project grid |
| `/projects/new` | `NewProjectPage` | Full-page form, navigates back on submit |
| `/projects/:projectId` | `ProjectDetailPage` | Reads ID from URL, shows project detail |
| `*` | `NotFoundPage` | Catch-all 404 |

The outer shell (Header, Sidebar, Footer) renders once in a layout route and
never unmounts between navigations.

---

## Route Configuration

```tsx
// src/App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/projects" replace />} />
    <Route element={<Layout />}>
      <Route path="/projects"            element={<ProjectListPage />} />
      <Route path="/projects/new"        element={<NewProjectPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

### Why `replace` on `<Navigate>`?

Without `replace`, navigating from `/` pushes `/projects` onto the history
stack. Pressing Back would return to `/`, which would immediately redirect again
— an infinite redirect loop in the history. `replace` avoids this by swapping
the current entry rather than adding one.

### Layout route

The `<Route element={<Layout />}>` has no `path`. React Router treats any route
without a `path` as a layout wrapper: its element renders, and `<Outlet />`
inside it receives the matched child's element. The shell (Header + Sidebar +
Footer) lives here and never remounts between page navigations.

---

## `<Outlet />` — The Key to Layout Routes

```tsx
// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-grid">
      <Header title="TaskFlow" subtitle="Manage your work" />
      <Sidebar navItems={navItems} />
      <main className="app-main">
        <Outlet />   {/* ← page content renders here */}
      </main>
      <Footer />
    </div>
  );
}
```

When the URL is `/projects`, React Router renders `ProjectListPage` into the
`<Outlet />` slot. When the URL changes to `/projects/new`, `Layout` stays
mounted and React Router swaps `ProjectListPage` for `NewProjectPage` inside the
outlet. Header, Sidebar, and Footer never unmount.

---

## `<Link>` vs `<a>`

```tsx
// Wrong — hard refresh, round-trip to server, React state lost
<a href="/projects">Projects</a>

// Correct — History API push, no reload, instant render
<Link to="/projects">Projects</Link>
```

`<Link>` renders an `<a>` element in the DOM but intercepts the `click` event
and calls `history.pushState` instead of triggering a full navigation. The
browser URL updates, React Router re-renders the matching components, and the
server is never contacted again after the initial load.

### Active link styling

`NavLink` from `react-router-dom` applies a CSS class automatically when its
`to` prop matches the current URL:

```tsx
<NavLink
  to={item.path}
  className={({ isActive }) =>
    `sidebar-nav-link${isActive ? ' sidebar-nav-link--active' : ''}`
  }
>
  {item.label}
</NavLink>
```

Using plain `<Link>` requires `useLocation()` to compare paths manually.

---

## `useParams` — Reading Dynamic Segments

```tsx
// Route definition
<Route path="/projects/:projectId" element={<ProjectDetailPage />} />

// Component
const { projectId } = useParams<{ projectId: string }>();
```

`useParams` always returns `string | undefined` for each param — TypeScript
enforces this even with the generic argument. There are two cases to handle:

1. `projectId` is `undefined` — the component was rendered outside a route that
   provides that param (should not happen with correct route config, but
   TypeScript requires you handle it).
2. `projectId` is a string that does not match any project — the ID is stale,
   invalid, or manually typed in the address bar.

```tsx
if (projectId === undefined) {
  return <p>Invalid URL.</p>;
}

const project = PROJECTS.find((p) => p.id === projectId);

if (project === undefined) {
  return (
    <div>
      <p>Project not found.</p>
      <Link to="/projects">Back to projects</Link>
    </div>
  );
}
```

---

## `useNavigate` — Programmatic Navigation

After the new-project form submits successfully, the user should land back on
the list page:

```tsx
const navigate = useNavigate();

function handleAddProject(data: ProjectFormData) {
  // ... create project
  navigate('/projects');
}
```

`useNavigate` returns a function, not a component. Use it for navigation that
happens in response to events (form submit, button click) rather than rendering.

---

## Shared Project Data

Both `ProjectListPage` (which renders the grid) and `ProjectDetailPage` (which
finds one project by ID) need access to the same project data. Moving the
initial array to `src/data/projects.ts` avoids duplication:

```ts
// src/data/projects.ts
export const INITIAL_PROJECTS: ProjectCardProps[] = [ ... ];
```

`ProjectListPage` copies this into `useState` so adding a new project works.
`ProjectDetailPage` searches the constant directly (new projects added in
`ProjectListPage` would not appear here — that is expected for now; a shared
state mechanism is introduced in a later challenge).

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Using `<a href>` instead of `<Link to>` | Full page reload, React state lost | Replace with `<Link>` |
| Not handling `undefined` from `useParams` | TypeScript error or runtime crash | Check for undefined before using |
| Forgetting `<Outlet />` in the layout | Page content never renders | Add `<Outlet />` where content should appear |
| No `replace` on the redirect `<Navigate>` | History loop when pressing Back | Add `replace` prop |
| Catch-all `path="*"` placed before specific routes | Every URL hits the 404 page | Put `path="*"` last |
| `BrowserRouter` wrapping only part of the tree | `useNavigate`/`useParams` throw outside Router context | Wrap the entire app |

---

## React Router v7 Notes

React Router v7 shipped as a major version but is backwards-compatible with v6
for the patterns used here. The API you used — `BrowserRouter`, `Routes`,
`Route`, `Link`, `Outlet`, `useParams`, `useNavigate`, `Navigate` — is stable
and identical between v6 and v7.

v7 adds first-class framework features (file-based routing, server rendering)
via the `react-router` package that are not used in this workshop. You imported
everything from `react-router-dom`, which is the correct entry point for
browser-based SPAs.

---

## Next Steps

In Challenge 11 you will replace the module-level `INITIAL_PROJECTS` constant
with a shared `useContext` store so that projects added on `/projects/new` also
appear on `/projects/:projectId`.

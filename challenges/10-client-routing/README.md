# Challenge 10 — Client-Side Routing

## Overview

Client-side routing lets the browser navigate between different views **without
a full page reload**. React Router intercepts URL changes and renders the
matching component — the server never sees those subsequent navigations.

In this challenge you will install React Router v7, configure a route tree, turn
the sidebar links into real `<Link>` components, and add three page components:
a project list, a project detail view, and a new-project form page.

---

## Learning Objectives

1. Install and configure `BrowserRouter` + `Routes` + `Route`.
2. Understand the difference between `<Link>` and `<a>`.
3. Use `useParams` to read dynamic URL segments (`:projectId`).
4. Use `useNavigate` to programmatically navigate after a form submission.
5. Create a **layout route** with `<Outlet />` so the shell (header, sidebar,
   footer) renders once and page content swaps inside it.
6. Use `<Navigate>` for index redirects and `path="*"` for 404 pages.

---

## Starting Point

The `start/` directory is the solution from Challenge 09 with `react-router` and
`react-router-dom` already added to `package.json`. The app still works as a
single page — no routing is configured yet.

```bash
cd start
npm install
npm run dev
```

The sidebar links use plain `<a>` tags, the "New Project" button opens a modal,
and there is no `<BrowserRouter>` anywhere.

---

## Your Tasks

Work inside `start/src/`.

### 1 — Wrap the app in `BrowserRouter`

In `src/main.tsx` (or `src/App.tsx`), import `BrowserRouter` from
`react-router-dom` and wrap the entire app.

### 2 — Create the page components

Create a `src/pages/` directory and add four files:

| File | What it renders |
|------|-----------------|
| `ProjectListPage.tsx` | The project grid with filter bar (move logic from `MainContent`) |
| `NewProjectPage.tsx` | The `AddProjectForm` as a full page (not a modal) |
| `ProjectDetailPage.tsx` | Reads `:projectId` from the URL, shows project name + description |
| `NotFoundPage.tsx` | A simple "Page not found" message with a link back to `/projects` |

### 3 — Create a Layout component

Create `src/components/Layout.tsx`. It should render the full shell (Header,
Sidebar, Footer) and use `<Outlet />` from `react-router-dom` where the page
content goes. This component is used as the `element` for a layout route.

### 4 — Configure routes in `App.tsx`

Replace `App.tsx` with a route configuration:

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/projects" replace />} />
    <Route element={<Layout />}>
      <Route path="/projects" element={<ProjectListPage />} />
      <Route path="/projects/new" element={<NewProjectPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

### 5 — Update `Sidebar` to use `<Link>`

Replace the `<a href={item.path}>` elements with `<Link to={item.path}>` from
`react-router-dom`. Use `useLocation` (or `NavLink`) to apply the active class.

Update the `navItems` paths:
- Dashboard → `/projects`
- Projects → `/projects`
- Team → `/team` (will hit the 404 page — that is expected)

### 6 — Wire up navigation from `ProjectCard`

Clicking a `ProjectCard` should navigate to `/projects/:projectId`. You can:
- Wrap the card in a `<Link>` component, **or**
- Use `useNavigate()` inside `ProjectCard`.

### 7 — Create a shared data file

Move the `INITIAL_PROJECTS` array to `src/data/projects.ts` so both
`ProjectListPage` and `ProjectDetailPage` can import it.

### 8 — Handle `useParams` safely

`useParams<{ projectId: string }>()` returns `string | undefined`. In
`ProjectDetailPage`, handle the case where `projectId` is `undefined` and the
case where no project matches the ID.

---

## Acceptance Criteria

- [ ] Navigating to `/` redirects to `/projects`
- [ ] `/projects` shows the project grid with filter controls
- [ ] `/projects/new` shows the AddProjectForm as a full page
- [ ] Submitting the new project form navigates back to `/projects`
- [ ] `/projects/:projectId` shows the project name and description
- [ ] Clicking a `ProjectCard` navigates to `/projects/{id}`
- [ ] `/anything-else` shows the NotFoundPage
- [ ] Sidebar links use `<Link>`, not `<a>` tags
- [ ] Active sidebar link has `.sidebar-nav-link--active` styling
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] Browser back/forward buttons work correctly

---

## Key Concepts

### `<Link>` vs `<a>`

```tsx
// Wrong — full page reload, loses React state
<a href="/projects">Projects</a>

// Correct — client-side navigation, no reload
<Link to="/projects">Projects</Link>
```

`<Link>` renders an `<a>` tag in the DOM but intercepts the click and uses the
History API instead of following the `href`. The result: no page reload, no
round-trip to the server, instant navigation.

### Layout Routes

A route without a `path` acts as a layout wrapper. Its `element` renders the
shell, and `<Outlet />` is the slot where matched child routes render:

```tsx
<Route element={<Layout />}>        {/* no path — wraps children */}
  <Route path="/projects" element={<ProjectListPage />} />
</Route>
```

`Layout.tsx` must import and render `<Outlet />` from `react-router-dom`.

### `useParams`

```tsx
const { projectId } = useParams<{ projectId: string }>();
// projectId is string | undefined — always handle the undefined case
```

### `useNavigate`

```tsx
const navigate = useNavigate();
// After form submit:
navigate('/projects');
```

### `Navigate` component

```tsx
// Redirect / to /projects without rendering anything
<Route path="/" element={<Navigate to="/projects" replace />} />
```

The `replace` prop replaces the current history entry instead of pushing a new
one — pressing Back after the redirect skips the redirect.

### Catch-all route

```tsx
<Route path="*" element={<NotFoundPage />} />
```

`path="*"` matches any URL that nothing else matched. Place it last.

---

## Bonus Challenges

1. Replace `<Link>` in the sidebar with `<NavLink>` — it automatically applies
   an `active` class when the current URL matches the link.
2. Add a breadcrumb trail to `ProjectDetailPage` that links back to `/projects`.
3. Preserve the filter state across navigation using the URL search params
   (`?status=active`) and `useSearchParams`.

---

## Running the App

```bash
cd start
npm install
npm run dev
```

Navigate to `http://localhost:5173`.

# Challenge 11 — Solution Debrief

## What changed

This challenge restructured the routing from flat full-page views into a nested master-detail pattern. Here is a summary of every change and why it was made.

---

## Routing restructure

**Before (Challenge 10):**
```
/projects           → ProjectListPage   (full page: grid of cards)
/projects/new       → NewProjectPage    (full page: form)
/projects/:projectId → ProjectDetailPage (full page: detail)
```

**After (Challenge 11):**
```
/projects                              → ProjectsLayout (master-detail shell)
  /projects                (index)     → ProjectEmptyState
  /projects/:projectId                 → ProjectDetailPanel
    /projects/:projectId   (index)     → TaskList
    /projects/:projectId/tasks/:taskId → TaskDetail
/projects/new                          → NewProjectPage
```

Key insight: `/projects/new` must remain **outside** the `ProjectsLayout` route so it renders as a full page, not inside the master-detail shell. React Router matches routes in order; listing `/projects/new` before or alongside `/projects/:projectId` ensures the literal segment "new" is not parsed as a project ID.

---

## URL as source of truth

A common beginner mistake is to store the selected project in `useState`:

```tsx
// Anti-pattern: local state for selection
const [selectedId, setSelectedId] = useState<string | null>(null);
```

This breaks browser navigation (Back/Forward buttons do not change the selection), prevents bookmarking, and makes deep-linking impossible.

The URL-driven approach:

```tsx
// Correct: URL drives the selection
const { projectId } = useParams<{ projectId: string }>();
const selectedProject = INITIAL_PROJECTS.find(p => p.id === projectId);
```

Every piece of selection state is encoded in the URL. The component re-renders when the URL changes, which React Router handles automatically.

---

## Nested `<Outlet />` — three levels

React Router's `<Outlet />` acts as a content slot. In this challenge there are three levels:

1. **`Layout`** renders the outer shell (Header + Sidebar + Footer). Its `<Outlet />` is where `ProjectsLayout` or `NewProjectPage` renders.

2. **`ProjectsLayout`** renders the master-detail grid. Its `<Outlet />` (in the right panel) is where `ProjectEmptyState` or `ProjectDetailPanel` renders.

3. **`ProjectDetailPanel`** renders the project's header info. Its `<Outlet />` is where `TaskList` or `TaskDetail` renders.

Each level only re-renders its own `<Outlet />` slot when navigation happens — the surrounding structure stays mounted and preserves scroll position.

---

## Scroll preservation

The master list (`<aside className="master-list">`) is an independent scroll container (`overflow-y: auto`). When the user selects project B after project A, only the right panel's `<Outlet />` swaps content. The left panel stays mounted and its scroll position is unchanged.

This is why putting the two-column layout in a layout route (rather than rendering both list and detail inside one component with conditional rendering) matters for UX.

---

## `useParams` at different depths

`useParams` reads from the closest matching route ancestor:

```tsx
// Inside ProjectDetailPanel — reads :projectId
const { projectId } = useParams<{ projectId: string }>();

// Inside TaskDetail — reads both :projectId and :taskId
const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
```

Parameters defined in ancestor route paths are available in all descendant components via `useParams`.

---

## Highlighting the selected item

`ProjectListItem` highlights itself when its project ID matches the current URL:

```tsx
const { projectId } = useParams<{ projectId?: string }>();
const isSelected = projectId === id;
```

This is equivalent to using `NavLink`'s `isActive` prop but gives finer control over the rendered markup and avoids wrapping non-anchor elements in `NavLink`.

Alternatively:
```tsx
<NavLink to={`/projects/${id}`} className={({ isActive }) => isActive ? 'selected' : ''}>
```

Both approaches derive selection state from the URL, not from local state.

---

## `index` routes as defaults

React Router's `index` attribute marks the default child when a parent route matches exactly:

```tsx
<Route path="/projects" element={<ProjectsLayout />}>
  <Route index element={<ProjectEmptyState />} />      {/* /projects */}
  <Route path=":projectId" element={<ProjectDetailPanel />}>
    <Route index element={<TaskList />} />             {/* /projects/proj-1 */}
    <Route path="tasks/:taskId" element={<TaskDetail />} />  {/* /projects/proj-1/tasks/task-1 */}
  </Route>
</Route>
```

- `/projects` → `ProjectsLayout` renders, its Outlet renders `ProjectEmptyState`
- `/projects/proj-1` → `ProjectDetailPanel` renders, its Outlet renders `TaskList`
- `/projects/proj-1/tasks/task-1` → `ProjectDetailPanel` renders, its Outlet renders `TaskDetail`

---

## Responsive considerations

The current CSS uses a fixed `320px` left panel with `grid-template-columns: 320px 1fr`. On narrow viewports this breaks. Production-quality approaches include:

- Use a media query to stack the panels vertically on mobile
- Hide the master list when a project is selected on mobile (navigate-only model)
- Use `minmax(240px, 320px)` for the left column

These refinements are left as an exercise; the challenge focuses on the routing pattern, not responsive CSS.

---

## What is NOT shown (intentionally deferred)

- **Adding tasks** — no form for creating tasks; task data is hardcoded
- **Shared project state** — newly added projects still do not persist (introduced in Challenge 12 with Context)
- **Loading/error states** — data is synchronous; async data fetching comes in Challenge 14
- **Optimistic UI** — covered in a later challenge

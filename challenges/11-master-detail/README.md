# Challenge 11 — The Master-Detail Pattern

## What you will build

Transform the current full-page project views into a **master-detail layout**:

- **Left panel** (master): a scrollable, narrow list of all projects — always visible
- **Right panel** (detail): the selected project's details including its task list
- Clicking a project in the master list highlights it and updates the right panel
- The URL updates to `/projects/:projectId` so the selection is bookmarkable
- When no project is selected: "Select a project to view details" placeholder
- Task detail view at `/projects/:projectId/tasks/:taskId` with a "Back to tasks" link

## Learning objectives

- Nested routes with `<Outlet />` as a content slot at multiple levels
- URL as the source of truth for UI state (selected project, selected task)
- `useParams` at different route depths to read `projectId` and `taskId`
- `NavLink` (or manual `useParams` comparison) for highlighting the selected item
- Scroll preservation: the master list does not scroll to the top on selection change

## Starting point

The `start/` directory is derived from Challenge 10's solution. It has:

- React Router v7 configured with `BrowserRouter`
- A grid layout shell (Header, Sidebar, Outlet, Footer) in `Layout.tsx`
- `ProjectListPage` — full-page project grid with filtering
- `ProjectDetailPage` — full-page project detail (reads `useParams`)
- `NewProjectPage` — add project form as a full page
- Routes: `/projects`, `/projects/new`, `/projects/:projectId`

**The list and detail are separate full-page views — no side-by-side layout yet.**

## Your tasks

### 1. Create `ProjectsLayout` (master-detail container)

Create `src/pages/ProjectsLayout.tsx`:

- Two-column layout: narrow left panel (master list) + wide right panel (detail)
- Left panel: renders a list of all projects, always visible, scrollable
- Right panel: renders `<Outlet />` — child routes fill this slot
- Use CSS Grid or flexbox

### 2. Create `ProjectListItem` (compact project row)

Create `src/components/ProjectListItem.tsx`:

- Compact single-row item: project name, status badge, task count
- Highlighted (visually distinct) when its project is currently selected
- Check the current `projectId` from `useParams()` to determine if selected
- Clicking navigates to `/projects/:projectId`

### 3. Update `App.tsx` routing

Restructure routes to nest under `ProjectsLayout`:

```tsx
<Route element={<Layout />}>
  <Route path="/projects" element={<ProjectsLayout />}>
    <Route index element={<ProjectEmptyState />} />
    <Route path=":projectId" element={<ProjectDetailPanel />}>
      <Route index element={<TaskList />} />
      <Route path="tasks/:taskId" element={<TaskDetail />} />
    </Route>
  </Route>
  <Route path="/projects/new" element={<NewProjectPage />} />
</Route>
```

### 4. Create `ProjectDetailPanel`

Create `src/pages/ProjectDetailPanel.tsx`:

- Reads `projectId` from `useParams`
- Shows project name, description, status, due date
- Renders `<Outlet />` below the project info for the task list or task detail

### 5. Create `TaskList`

Create `src/components/TaskList.tsx`:

- Reads `projectId` from `useParams`
- Filters tasks from `src/data/tasks.ts` for the current project
- Renders a `TaskItem` for each task
- Each task navigates to `/projects/:projectId/tasks/:taskId` on click

### 6. Create `TaskItem`

Create `src/components/TaskItem.tsx`:

- Compact task row: title, status badge, assignee name (if any)
- Wrapped in a `Link` to the task detail route

### 7. Create `TaskDetail`

Create `src/pages/TaskDetail.tsx`:

- Reads `taskId` (and `projectId`) from `useParams`
- Shows full task details: title, description, status, assignee, due date
- "Back to tasks" link: navigates to `/projects/:projectId`

### 8. Create `ProjectEmptyState`

Create `src/pages/ProjectEmptyState.tsx`:

- Simple placeholder: "Select a project to view details"
- Rendered when no project is selected (index route under `/projects`)

### 9. Add `src/data/tasks.ts`

Add hardcoded tasks data (subset of `shared/mock-api/data.ts`) associated with `proj-1` and `proj-2`.

### 10. Update `src/types/index.ts`

Add `TaskStatus` and `Task` types.

## CSS hints

```css
.projects-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  height: calc(100vh - var(--header-height) - 3rem);
}

.master-list {
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
  padding-right: 1rem;
}

.detail-panel {
  overflow-y: auto;
}
```

## Acceptance criteria

- [ ] Navigating to `/projects` shows the two-column layout
- [ ] Clicking a project item highlights it in the master list
- [ ] The right panel shows the selected project's details and tasks
- [ ] Navigating to `/projects` (no selection) shows the empty state placeholder
- [ ] The master list does NOT unmount or scroll-reset when a project is selected
- [ ] `/projects/:projectId/tasks/:taskId` shows task detail with a working "Back to tasks" link
- [ ] The URL reflects the selected project and task at all times
- [ ] TypeScript strict mode — no `any`

## Key concepts

**Why nested routes instead of state?**
Storing the selected project in URL params (`/projects/proj-1`) rather than in `useState` means:

- The URL is shareable and bookmarkable
- The browser Back button works naturally
- Deep-linking directly to a task works out of the box

**`<Outlet />` at multiple levels**
- `Layout` has an `<Outlet />` → renders `ProjectsLayout` or `NewProjectPage`
- `ProjectsLayout` has an `<Outlet />` → renders `ProjectEmptyState` or `ProjectDetailPanel`
- `ProjectDetailPanel` has an `<Outlet />` → renders `TaskList` or `TaskDetail`

**Scroll preservation**
The master list is a separate scrollable container from the detail panel. Selecting a different project only re-renders the detail `<Outlet />`, not the entire master list, so the list's scroll position is preserved.

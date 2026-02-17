# Challenge 04 — Rendering Lists & Conditional Rendering

## Overview

In Challenge 03 you built typed React components and learned how to pass props. Now
you will practise two of the most common patterns in every real React codebase:

- Rendering a **list of items** from an array using `.map()`
- **Conditional rendering** — showing or hiding UI elements depending on data

By the end of this challenge your project board will handle any number of projects,
display colour-coded status badges, warn when a project is overdue, and gracefully
handle an empty list.

---

## Learning Objectives

1. Render a dynamic list with `.map()` and supply a stable `key` prop.
2. Understand _why_ React requires keys and what happens when you use array index.
3. Use the `&&` short-circuit operator and ternary expressions for conditional JSX.
4. Avoid the classic `0` bug when using `&&` with falsy numbers.
5. Derive boolean flags from data (e.g. `isOverdue`) inside a component.
6. Implement an **empty state** that renders when the data array is empty.

---

## Starting Point

The `start/` directory contains the app from Challenge 03's solution. It already:

- Renders three `ProjectCard` components hardcoded in `MainContent.tsx`
- Has typed props (`ProjectCardProps`, `NavItem`)
- Shows a conditional `dueDate` inside each card

The app works — run it with `npm install && npm run dev` to verify — but the
rendering is not yet driven by the array.

---

## Your Tasks

Work inside `start/src/`. You may edit any file.

### 1 — Expand the projects array

Open `src/components/MainContent.tsx`. The `projects` array currently has 3 items.
Add at least 2 more so there are **5 projects total** with a mix of statuses:

- At least one `"active"`, one `"completed"`, one `"archived"`
- At least **two projects that have a `dueDate` in the past** (before today)

Use the `id` strings `"proj-1"` through `"proj-5"` so they are meaningful.

### 2 — Switch to `.map()` rendering with a proper key

Replace the three individual `<ProjectCard … />` instances with a single `.map()`
call. Use `project.id` as the `key` — **never use array index as key** for lists
that can change.

```tsx
{projects.map((project) => (
  <ProjectCard key={project.id} {...project} />
))}
```

### 3 — Add the overdue indicator inside `ProjectCard`

Open `src/components/ProjectCard.tsx`. Add logic to determine whether the project
is overdue:

```tsx
const isOverdue =
  dueDate !== undefined && new Date(dueDate) < new Date();
```

Then render a small warning **only when `isOverdue` is `true`**:

```tsx
{isOverdue && <span className="project-card__overdue">⚠ Overdue</span>}
```

### 4 — Add an empty state

Back in `MainContent.tsx`, add a conditional block that shows a friendly message
when `projects.length === 0`:

```tsx
{projects.length === 0 ? (
  <p className="empty-state">No projects yet. Create your first project!</p>
) : (
  <div className="project-grid">
    {projects.map((project) => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </div>
)}
```

You can temporarily set `projects` to `[]` to verify the empty state renders.

### 5 — Status badge colours (verify)

The CSS classes `status-badge--active`, `status-badge--completed`, and
`status-badge--archived` are already defined in `App.css`. Confirm all three
statuses display with the correct colour by looking at your 5-project list.

---

## Acceptance Criteria

- [ ] There are 5 or more projects in the array, with all three statuses present
- [ ] The list renders using `.map()` with `key={project.id}`
- [ ] Projects with a `dueDate` before today show "⚠ Overdue"
- [ ] Projects without a `dueDate`, or with a future `dueDate`, do **not** show the indicator
- [ ] Setting `projects` to `[]` shows the empty state message
- [ ] Status badges are green (active), blue (completed), and grey (archived)
- [ ] No TypeScript errors (`npm run build` passes)

---

## Key Concepts

### Why keys matter

React uses the `key` prop to identify which items changed, were added, or were
removed during re-renders. A stable, unique key (like an `id`) keeps component
state correctly associated with the right item. Using array index is only safe for
static, non-reorderable lists.

### The `&&` gotcha

```tsx
// BUG — renders "0" when taskCount is 0
{taskCount && <span>{taskCount} tasks</span>}

// SAFE — explicit boolean check
{taskCount > 0 && <span>{taskCount} tasks</span>}
```

When the left-hand side of `&&` is a falsy non-boolean (`0`, `""`, `NaN`), React
renders it as text. Always convert to a proper boolean first.

### Deriving data inside a component

You do not need extra state or props to compute `isOverdue`. Derive it directly
from the `dueDate` prop:

```tsx
const isOverdue = dueDate !== undefined && new Date(dueDate) < new Date();
```

---

## Running the App

```bash
cd start
npm install
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

To check the TypeScript build:

```bash
npm run build
```

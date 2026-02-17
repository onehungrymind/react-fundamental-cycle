# Challenge 05 — State with useState

## Overview

In Challenge 04 you rendered a list of projects from an array. The list is
working — but it is completely static. Nothing changes when the user interacts
with the page.

In this challenge you will add **project filtering** by introducing your first
piece of React state with the `useState` hook. You will build a `StatusFilter`
component with toggle buttons ("All", "Active", "Completed", "Archived"), wire
it up to a state variable, and derive the filtered list from state during render.

---

## Learning Objectives

1. Call `useState` to declare a state variable and its updater function.
2. Understand that calling the updater function triggers a re-render.
3. Pass state down as props (`activeFilter`) and pass the updater down as a
   callback prop (`onFilterChange`).
4. Derive filtered data with `.filter()` during render — **not** in a second
   `useState` call.
5. Apply conditional CSS classes to reflect active UI state.
6. Type state correctly: `ProjectStatus | "all"`.

---

## Starting Point

The `start/` directory is the app from Challenge 04's solution. It already:

- Renders 5 projects from a `projects` array using `.map()`
- Shows status badges (green/blue/grey) and overdue indicators
- Has an empty-state message when the array is empty
- Is fully typed with `ProjectCardProps` and `NavItem`

The `StatusFilter` component **does not exist yet**. The filtering logic is
**not wired up yet**. Your job is to add these.

Run the start app to verify it works before you begin:

```bash
cd start
npm install
npm run dev
```

---

## Your Tasks

Work inside `start/src/`. You may edit any file.

### 1 — Add the `ProjectStatus` type

Open `src/types/index.ts`. Extract the status union into a named exported type:

```ts
export type ProjectStatus = "active" | "completed" | "archived";
```

Then update `ProjectCardProps` to use it:

```ts
export interface ProjectCardProps {
  // ...
  status: ProjectStatus;
  // ...
}
```

### 2 — Create `StatusFilter.tsx`

Create a new file `src/components/StatusFilter.tsx`. This component receives
the current active filter and a callback, and renders four toggle buttons:

```tsx
interface StatusFilterProps {
  activeFilter: ProjectStatus | "all";
  onFilterChange: (filter: ProjectStatus | "all") => void;
}
```

Render a button for each option: `"all"`, `"active"`, `"completed"`,
`"archived"`. Apply the class `"active"` to whichever button matches
`activeFilter`:

```tsx
<button
  className={activeFilter === "all" ? "filter-btn active" : "filter-btn"}
  onClick={() => onFilterChange("all")}
>
  All
</button>
```

Display each label with a capital first letter even though the value is
lowercase.

### 3 — Add state and filtering to `MainContent`

Open `src/components/MainContent.tsx`. The TODO comments will guide you.

Declare state at the top of the component:

```tsx
const [activeFilter, setActiveFilter] = useState<ProjectStatus | "all">("all");
```

Derive `filteredProjects` from the `projects` array during render — do **not**
store it in a second `useState`:

```tsx
const filteredProjects =
  activeFilter === "all"
    ? projects
    : projects.filter((p) => p.status === activeFilter);
```

Render `<StatusFilter>` above the project list, passing `activeFilter` and
`setActiveFilter` as props. Update the count line and the `.map()` to use
`filteredProjects` instead of `projects`.

### 4 — Display the project count

Below the `<StatusFilter>`, add a count line:

```
Showing X of Y projects
```

Where `X` is `filteredProjects.length` and `Y` is `projects.length`.

### 5 — Handle the filtered empty state

When all projects are filtered out (e.g. no archived projects), show a
different message:

```
No projects match the selected filter.
```

---

## Acceptance Criteria

- [ ] Clicking "Active", "Completed", or "Archived" filters the list
- [ ] Clicking "All" shows all 5 projects
- [ ] The active filter button has a visually distinct style (`.active` class)
- [ ] The "All" filter is selected by default on page load
- [ ] The count line updates to reflect the filtered count
- [ ] Filtering to a status with no projects shows the empty-filter message
- [ ] `filteredProjects` is derived with `.filter()`, never stored in `useState`
- [ ] `ProjectStatus` is exported from `src/types/index.ts`
- [ ] No TypeScript errors (`npm run build` passes)

---

## Key Concepts

### useState — declare state in a component

```tsx
const [value, setValue] = useState(initialValue);
```

- `value` is the current state value — read-only during this render
- `setValue` is the updater — calling it schedules a re-render with the new value
- The initial value is only used on the first render

### State triggers re-renders

When `setValue` is called, React re-runs the component function from the top.
The new render reads the updated `value` and produces updated JSX. React then
reconciles the DOM.

### Derive, don't duplicate

If a value can be computed from existing state or props, compute it during
render. Storing it in a second `useState` forces you to keep two values in sync,
which inevitably causes bugs.

```tsx
// Good — derived during render
const filteredProjects =
  activeFilter === "all"
    ? projects
    : projects.filter((p) => p.status === activeFilter);

// Bad — unnecessary state duplication
const [filteredProjects, setFilteredProjects] = useState(projects);
// Now you must call setFilteredProjects every time activeFilter changes...
```

### Lifting state

`StatusFilter` needs to read and change `activeFilter`, but the filter logic
lives in `MainContent`. The state is declared in `MainContent` (the common
ancestor) and passed down as props. This is called **lifting state up**.

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

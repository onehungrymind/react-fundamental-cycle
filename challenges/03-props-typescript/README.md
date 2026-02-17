# Challenge 03 — Props & TypeScript Interfaces

## Overview

The TaskFlow components you built in Challenge 02 render the same hardcoded content
every time they are used. In this challenge you will make them **configurable** by
adding TypeScript interfaces and passing data down through props.

You will also build a brand-new `ProjectCard` component that accepts several typed
props — including an optional one — and renders a small project summary card.

---

## What You Will Build

```
App
├── Header          title="TaskFlow"  subtitle="Manage your work"
├── Sidebar         navItems={[...]}
│   └── <nav> built from array — no more hardcoded links
├── MainContent
│   ├── ProjectCard  name  description  status  taskCount  dueDate?
│   ├── ProjectCard  ...
│   └── ProjectCard  ...
└── Footer
```

---

## Tasks

### 1. Create `src/types/index.ts`

Define and export two interfaces:

```ts
export interface NavItem {
  label: string;
  path: string;
  icon?: string;        // optional
}

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  taskCount: number;
  dueDate?: string;     // optional — ISO date string e.g. "2025-03-15"
}
```

### 2. Refactor `src/components/Header.tsx`

Add a `HeaderProps` interface and accept `title` and `subtitle` as props:

```ts
interface HeaderProps {
  title: string;
  subtitle: string;
}
```

The component should render `title` inside `<h1>` and `subtitle` in a secondary
element below (or beside) it.

### 3. Refactor `src/components/Sidebar.tsx`

Add a `SidebarProps` interface and accept `navItems: NavItem[]`:

```ts
interface SidebarProps {
  navItems: NavItem[];
}
```

Replace the three hardcoded `<li>` elements with a `.map()` over `navItems`.
Each item must have a unique `key` prop on the `<li>`.

### 4. Create `src/components/ProjectCard.tsx`

A new component that accepts `ProjectCardProps` and renders:

- Project **name** as a heading
- **description** paragraph
- A **status badge** (a `<span>` with a CSS class that reflects the status value,
  e.g. `status-badge--active`)
- **taskCount** with a label (e.g. "5 tasks")
- **dueDate** — rendered only when the prop is provided (conditional rendering)

### 5. Update `src/components/MainContent.tsx`

Import `ProjectCard` and render three instances from a hardcoded `projects` array:

```ts
const projects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website',
    status: 'active' as const,
    taskCount: 5,
    dueDate: '2025-03-15',
  },
  {
    id: '2',
    name: 'Mobile App MVP',
    description: 'Build the first version of the mobile app',
    status: 'active' as const,
    taskCount: 4,
    dueDate: '2025-06-01',
  },
  {
    id: '3',
    name: 'API Migration',
    description: 'Migrate legacy REST endpoints to GraphQL',
    status: 'completed' as const,
    taskCount: 3,
  },
]
```

### 6. Update `src/App.tsx`

Define the `navItems` array and pass it — along with `title` and `subtitle` — to
`Header` and `Sidebar`:

```tsx
const navItems: NavItem[] = [
  { label: 'Dashboard', path: '#dashboard' },
  { label: 'Projects',  path: '#projects'  },
  { label: 'Team',      path: '#team'      },
]

<Header title="TaskFlow" subtitle="Manage your work" />
<Sidebar navItems={navItems} />
```

### 7. Update `src/App.css`

Add styles for `.project-card`, `.status-badge`, and the three status modifier
classes (`.status-badge--active`, `.status-badge--completed`, `.status-badge--archived`).

---

## Acceptance Criteria

- `src/types/index.ts` exports both `NavItem` and `ProjectCardProps`
- `Header` renders the `title` and `subtitle` props passed from `App`
- `Sidebar` renders nav items from the `navItems` array (no hardcoded `<li>` content)
- `ProjectCard` accepts all five `ProjectCardProps` fields
- `ProjectCard` renders `dueDate` **only when it is provided** (conditional rendering)
- All prop interfaces are **explicitly named** — no inline `{ foo: string }` types on
  the function signature
- `npm run build` passes with **zero TypeScript errors** (strict mode is on)

---

## Key Concepts

### Props flow one direction

Data flows **down** from parent to child through props. A child component never
reaches up to modify the parent's data.

```
App  ──props──▶  Header
App  ──props──▶  Sidebar
MainContent  ──props──▶  ProjectCard
```

### TypeScript interfaces for props

Defining a named interface rather than an inline type keeps the code readable and
makes the shape reusable:

```ts
// Preferred
interface HeaderProps {
  title: string;
  subtitle: string;
}
export function Header({ title, subtitle }: HeaderProps) { ... }

// Avoid
export function Header({ title, subtitle }: { title: string; subtitle: string }) { ... }
```

### Optional props and conditional rendering

Mark a prop optional with `?` in the interface. Check before rendering:

```tsx
interface CardProps {
  dueDate?: string;
}

// Option A — short-circuit
{dueDate && <p>Due: {dueDate}</p>}

// Option B — ternary
{dueDate !== undefined ? <p>Due: {dueDate}</p> : null}
```

### String literal union types

```ts
status: 'active' | 'completed' | 'archived'
```

TypeScript will reject any value outside that set — no more typos.

---

## Common Gotchas

| Mistake | Correct |
|---|---|
| `key` on the component instead of the outermost element | Put `key` on the `<li>` wrapping the link |
| Spreading `...props` without a typed interface | Always define the interface first |
| Forgetting `as const` on string literals in arrays | Use `status: 'active' as const` or define typed array |
| Using `React.FC` | Prefer plain function with explicit return type or inferred |

---

## Hints

- You can destructure props directly in the function signature:
  `function Header({ title, subtitle }: HeaderProps)`
- When mapping, `item.path` makes a good `key` if paths are unique
- The `icon` field on `NavItem` is optional — you do not have to render it in this
  challenge, but you should not cause a TypeScript error by accessing it unsafely

---

## Running the App

```bash
cd start/
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the starting point.

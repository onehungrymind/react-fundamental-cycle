# Challenge 03 — Solution & Debrief

## Complete Solution

### `src/types/index.ts`

```ts
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  taskCount: number;
  dueDate?: string;
}
```

### `src/components/Header.tsx`

```tsx
interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>
      <nav className="header-nav" aria-label="Primary navigation">
        <span className="header-nav-placeholder">Nav goes here</span>
      </nav>
    </header>
  )
}

export default Header
```

### `src/components/Sidebar.tsx`

```tsx
import type { NavItem } from '../types'

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  return (
    <aside className="app-sidebar">
      <nav aria-label="Sidebar navigation">
        <ul className="sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <a href={item.path} className="sidebar-nav-link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
```

### `src/components/ProjectCard.tsx`

```tsx
import type { ProjectCardProps } from '../types'

export function ProjectCard({
  name,
  description,
  status,
  taskCount,
  dueDate,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card__header">
        <h3 className="project-card__name">{name}</h3>
        <span className={`status-badge status-badge--${status}`}>{status}</span>
      </div>
      <p className="project-card__description">{description}</p>
      <div className="project-card__meta">
        <span className="project-card__tasks">{taskCount} tasks</span>
        {dueDate && (
          <span className="project-card__due">Due: {dueDate}</span>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
```

### `src/components/MainContent.tsx`

```tsx
import { ProjectCard } from './ProjectCard'
import type { ProjectCardProps } from '../types'

const projects: ProjectCardProps[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website',
    status: 'active',
    taskCount: 5,
    dueDate: '2025-03-15',
  },
  {
    id: '2',
    name: 'Mobile App MVP',
    description: 'Build the first version of the mobile app',
    status: 'active',
    taskCount: 4,
    dueDate: '2025-06-01',
  },
  {
    id: '3',
    name: 'API Migration',
    description: 'Migrate legacy REST endpoints to GraphQL',
    status: 'completed',
    taskCount: 3,
  },
]

export function MainContent() {
  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Projects</h2>
        <p className="main-description">
          Here is a summary of your current projects.
        </p>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default MainContent
```

### `src/App.tsx`

```tsx
import './App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { Footer } from './components/Footer'
import type { NavItem } from './types'

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '#dashboard' },
  { label: 'Projects',  path: '#projects'  },
  { label: 'Team',      path: '#team'      },
]

export function App() {
  return (
    <div className="app-grid">
      <Header title="TaskFlow" subtitle="Manage your work" />
      <Sidebar navItems={navItems} />
      <MainContent />
      <Footer />
    </div>
  )
}

export default App
```

---

## Debrief

### Props are the public API of a component

Every React component is, at its core, a function that accepts an object of props and
returns JSX. Defining a TypeScript interface for that object is the same discipline as
documenting a function signature — it tells consumers exactly what the component needs
and what is optional.

### `React.FC` is no longer recommended

You may see older code written as:

```tsx
const Header: React.FC<HeaderProps> = ({ title }) => { ... }
```

Since React 18 the recommended style is a plain function with explicit props:

```tsx
function Header({ title, subtitle }: HeaderProps) { ... }
```

`React.FC` used to implicitly add `children` to every component's props — which is
rarely desired. The plain function form is more precise.

### `import type` for type-only imports

```ts
import type { NavItem } from '../types'
```

The `type` keyword tells the compiler (and bundlers) that this import is erased at
runtime. It is a best practice with `isolatedModules: true` (which Vite uses).

### Spreading props onto a component

In `MainContent` the solution spreads the entire project object directly onto
`ProjectCard`:

```tsx
<ProjectCard key={project.id} {...project} />
```

This works because `projects` is typed as `ProjectCardProps[]` — every field aligns
exactly. Spreading is convenient, but only use it when the source type matches the
component's props precisely; spreading an unrelated object silences TypeScript errors
that you actually want.

### `interface` vs `type`

Both work for prop definitions:

```ts
interface NavItem { label: string; path: string }   // extendable with `extends`
type NavItem = { label: string; path: string }       // more flexible (unions, mapped)
```

For simple component props, either is fine. The workshop uses `interface` for object
shapes and `type` for unions and aliases:

```ts
type Status = 'active' | 'completed' | 'archived'
```

### String literal union types eliminate typos

```ts
status: 'active' | 'completed' | 'archived'
```

If you write `status="archivd"` (typo) TypeScript will flag it immediately. Compare
that to `status: string`, which would accept any garbage value at compile time and fail
silently at runtime.

### Conditional rendering patterns

```tsx
// Short-circuit (falsy guard) — idiomatic for simple cases
{dueDate && <span>Due: {dueDate}</span>}

// Ternary — good when you need an else branch
{dueDate !== undefined ? <span>Due: {dueDate}</span> : null}

// Extract to variable — best for multi-line JSX
const dueDateEl = dueDate ? <span>Due: {dueDate}</span> : null
```

Avoid `&&` with numeric values — `{count && <span>{count}</span>}` renders `0` when
`count` is zero. Use a ternary or explicit boolean cast: `{count > 0 && ...}`.

---

## Alternate Approaches

### Typed children with `PropsWithChildren`

If a component needs to wrap arbitrary JSX content:

```tsx
import { type PropsWithChildren } from 'react'

interface CardProps {
  title: string;
}

export function Card({ title, children }: PropsWithChildren<CardProps>) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### Co-located interfaces

For small components used in only one place, some teams keep the interface in the same
file rather than in `src/types/index.ts`. Both are valid — consistency matters more
than the rule itself.

---

## Stretch Challenges

1. **Icon rendering** — Add an `icon` to each `NavItem` and render it in `Sidebar`
   (use a Unicode emoji or import an SVG).
2. **Active link** — Add an `activePath: string` prop to `Sidebar` and apply
   `sidebar-nav-link--active` to the matching item.
3. **Status color tokens** — Replace the CSS modifier classes with CSS custom
   properties driven by a `data-status` attribute:
   `<article data-status={status}>` and style with
   `[data-status="active"] { --badge-color: green; }`.
4. **Extracted Status type** — Move `'active' | 'completed' | 'archived'` into a
   named `type ProjectStatus` in `src/types/index.ts` and reference it from
   `ProjectCardProps`.
5. **Formatted date** — Use `Intl.DateTimeFormat` to render `dueDate` as
   "Mar 15, 2025" instead of the raw ISO string.

# Challenge 09 — Solution Debrief

## What You Built

Three custom hooks extracted from the inline logic in `MainContent.tsx`:

1. **`useDocumentTitle`** — a one-effect hook that syncs `document.title` with a
   string argument.
2. **`useKeyboardShortcut`** — a parameterised hook that registers a `keydown`
   listener with cleanup.
3. **`useProjectFilters`** — a stateful hook that owns filter state and derives
   filtered output and counts from the project list.

The app's visible behaviour is unchanged. The only difference is that
`MainContent.tsx` is shorter and each piece of logic now has a clear home.

---

## Hook 1 — `useDocumentTitle`

```typescript
import { useEffect } from 'react';

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

### Why no cleanup?

`document.title` is an assignment. There is nothing to undo — the old title is
simply replaced. When the component unmounts, the browser keeps whatever title
was last set. A cleanup function returning the previous title would be surprising
and is not expected by convention.

### Why `[title]` and not `[]`?

The caller passes a computed string:

```typescript
useDocumentTitle(
  projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow'
);
```

This string changes whenever `projects.length` crosses zero. The hook must
re-run its effect whenever `title` changes, so `title` belongs in the dependency
array.

---

## Hook 2 — `useKeyboardShortcut`

```typescript
import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  modifier: 'meta' | 'ctrl',
  callback: () => void
): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modifierPressed = modifier === 'meta' ? e.metaKey : e.ctrlKey;
      if (modifierPressed && e.key === key) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, modifier, callback]);
}
```

### The `modifier` parameter

The original inline effect hard-coded `e.metaKey || e.ctrlKey` — it checked
both modifiers simultaneously. The hook generalises this to a single named
modifier (`'meta'` for macOS Cmd, `'ctrl'` for Windows/Linux Ctrl). The caller
decides which modifier applies.

### `[key, modifier, callback]` dependency array

All three parameters are external values the effect depends on. If the caller
passes a new callback reference on re-render (which happens with inline arrow
functions), the effect re-runs: it removes the old listener and attaches a new
one. This is correct but may be frequent.

**Production tip:** In a real app you would wrap the callback at the call site
with `useCallback` to stabilise its reference and prevent unnecessary
re-registration. For this workshop, the simpler form is fine.

### Handler inside the effect

`handleKeyDown` is declared inside the `useEffect` callback. This is
intentional: both the `addEventListener` and `removeEventListener` calls
reference the **same function instance** via closure. If the handler were
declared outside, you would need to store it in a ref to ensure both calls
reference the same function.

---

## Hook 3 — `useProjectFilters`

```typescript
import { useState } from 'react';
import type { ProjectCardProps, ProjectStatus } from '../types';

interface UseProjectFiltersReturn {
  filteredProjects: ProjectCardProps[];
  activeFilter: ProjectStatus | 'all';
  setFilter: (filter: ProjectStatus | 'all') => void;
  statusCounts: Record<ProjectStatus | 'all', number>;
}

export function useProjectFilters(
  projects: ProjectCardProps[]
): UseProjectFiltersReturn {
  const [activeFilter, setFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  const statusCounts: Record<ProjectStatus | 'all', number> = {
    all: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    archived: projects.filter((p) => p.status === 'archived').length,
  };

  return { filteredProjects, activeFilter, setFilter, statusCounts };
}
```

### Derived values, not state

`filteredProjects` and `statusCounts` are re-computed on every render from
`projects` and `activeFilter`. Storing them in `useState` would require keeping
three values in sync (the projects list, the filter, and the derived output) and
would introduce a class of stale-state bugs that are hard to reproduce.

### `setFilter` not `setActiveFilter`

The internal state setter is called `setActiveFilter` inside the hook. The hook
re-exports it under the name `setFilter` as part of the public interface. The
consumer (`MainContent`) sees a clean API.

### `statusCounts` type annotation

`Record<ProjectStatus | 'all', number>` is an explicit type — not inferred.
TypeScript would accept an inferred object literal here, but the explicit
annotation documents intent and catches typos in the property names.

---

## `MainContent.tsx` After Refactoring

```typescript
import { useState, useEffect } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useProjectFilters } from '../hooks/useProjectFilters';
// ... other imports

export function MainContent() {
  const [projects, setProjects] = useState<ProjectCardProps[]>(INITIAL_PROJECTS);
  const [showForm, setShowForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { filteredProjects, activeFilter, setFilter } = useProjectFilters(projects);

  useDocumentTitle(
    projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow'
  );

  useKeyboardShortcut('k', 'meta', () => setShowForm(true));

  // Toast auto-dismiss stays inline (or can be extracted as a bonus task)
  useEffect(() => {
    if (toastMessage === null) return;
    const timerId = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timerId);
  }, [toastMessage]);

  // ... rest of component
}
```

The component lost 30+ lines and three `useEffect` blocks. The intent of each
line is now immediately clear: `useDocumentTitle` syncs the title, and
`useKeyboardShortcut` wires the shortcut. No inline boilerplate obscures the
component's purpose.

---

## Hooks Extract Behaviour, Not UI

The key mental shift in this challenge:

| Extract a **component** | Extract a **hook** |
|---|---|
| Reuse **UI structure** | Reuse **stateful logic** |
| Returns JSX | Returns values (or `void`) |
| Can be rendered | Cannot be rendered |
| Props as input | Function arguments as input |

Custom hooks are not magic. They are regular functions that happen to call
React's built-in hooks. The `use` prefix is a convention that enables the
eslint-plugin-react-hooks linter to check that the rules of hooks are respected
inside them.

---

## The Rules of Hooks — Why They Exist

React tracks hook state by **call order**. On every render, the first `useState`
call gets slot 0, the second gets slot 1, and so on. If a hook call is inside a
condition:

```typescript
// Broken — hook call order may change between renders
if (someCondition) {
  const [x, setX] = useState(0); // sometimes slot 0, sometimes missing
}
const [y, setY] = useState(0);   // sometimes slot 0, sometimes slot 1
```

When `someCondition` becomes false on re-render, React still reads slot 0 and
assigns it to `y`, producing a mismatch. React enforces the rules at the linter
level to make this category of bug impossible.

---

## Predecessors to Custom Hooks

Before hooks (React 16.8, February 2019), the community solved logic reuse with:

- **Higher-Order Components (HOCs)** — a function that wraps a component and
  injects props. Powerful but verbose, and it produced "wrapper hell" in the
  React DevTools tree.
- **Render Props** — a component that calls a prop function with its internal
  state as an argument. Flexible but required nesting components in JSX.

Custom hooks replaced both patterns for most use cases while producing flatter
component trees and cleaner TypeScript types.

---

## Testing Custom Hooks

React Testing Library's `renderHook` utility lets you test hooks in isolation
without building a full component:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useProjectFilters } from '../hooks/useProjectFilters';

test('filters projects by status', () => {
  const projects = [
    { id: '1', status: 'active', ... },
    { id: '2', status: 'archived', ... },
  ];

  const { result } = renderHook(() => useProjectFilters(projects));

  expect(result.current.filteredProjects).toHaveLength(2);

  act(() => {
    result.current.setFilter('active');
  });

  expect(result.current.filteredProjects).toHaveLength(1);
  expect(result.current.filteredProjects[0].id).toBe('1');
});
```

This is a major advantage of custom hooks over inline logic: the behaviour can
be tested without rendering any UI.

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| Hook name does not start with `use` | Linter cannot check rules of hooks | Always prefix with `use` |
| Return type not annotated | Inferred type may be overly broad or wrong | Add explicit return type interface |
| Storing derived values in state | Stale-state bugs, double renders | Derive during render instead |
| Callback in dep array without `useCallback` | Effect re-runs every render | Stabilise with `useCallback` at call site |
| Calling a custom hook conditionally | Breaks rules of hooks | Move the condition inside the hook |

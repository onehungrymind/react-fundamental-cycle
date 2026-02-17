# Challenge 09 — Custom Hooks

## Overview

Custom hooks are the primary mechanism for **extracting and reusing stateful
logic** in React. A custom hook is simply a function whose name starts with
`use` and that may call other hooks inside it. The hook extracts behaviour — not
UI.

In this challenge you will take three inline `useEffect` calls from
`MainContent.tsx` and move them into dedicated custom hooks. The visual output
of the app will be identical before and after; the only change is how the logic
is organised.

---

## Learning Objectives

1. Understand the difference between extracting a component (reusing UI) and
   extracting a hook (reusing logic).
2. Name custom hooks with the `use` prefix so React can enforce the Rules of
   Hooks.
3. Declare explicit TypeScript return types for custom hooks.
4. Understand that hooks derive state and values rather than storing redundant
   copies in state.
5. Recognise the rules of hooks: only call hooks at the top level, only call
   hooks inside React functions.

---

## Starting Point

The `start/` directory is the solution from Challenge 08. It already has a fully
working app with three inline `useEffect` calls inside `MainContent.tsx`:

1. A document-title effect that depends on `projects.length`.
2. A keyboard-shortcut effect with cleanup (`Cmd/Ctrl+K` opens the modal).
3. A toast-auto-dismiss effect that depends on `toastMessage`.

The `src/hooks/` directory exists but is empty. Your job is to extract the first
two effects (and filter state) into custom hooks in that directory.

Run the start app to verify it works before you begin:

```bash
cd start
npm install
npm run dev
```

---

## Your Tasks

Work inside `start/src/`. Create new files in `src/hooks/` and update
`src/components/MainContent.tsx`.

### 1 — `useDocumentTitle`

Create `src/hooks/useDocumentTitle.ts`.

```typescript
export function useDocumentTitle(title: string): void
```

- Accepts a `title` string.
- Runs `document.title = title` inside a `useEffect`.
- The dependency array should contain `title` so the title updates whenever the
  argument changes.
- Return type is `void` (explicit annotation required).

Call it from `MainContent` like this:

```typescript
useDocumentTitle(
  projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow'
);
```

### 2 — `useKeyboardShortcut`

Create `src/hooks/useKeyboardShortcut.ts`.

```typescript
export function useKeyboardShortcut(
  key: string,
  modifier: 'meta' | 'ctrl',
  callback: () => void
): void
```

- Accepts the key string (e.g. `"k"`), a modifier (`"meta"` or `"ctrl"`), and a
  callback.
- Registers a `keydown` listener on `window` inside a `useEffect`.
- The listener checks the correct modifier key and calls `callback()` when the
  shortcut fires.
- Returns a cleanup function that removes the listener.
- Dependency array: `[key, modifier, callback]`.
- Return type is `void` (explicit annotation required).

Call it from `MainContent` like this:

```typescript
useKeyboardShortcut('k', 'meta', () => setShowForm(true));
```

### 3 — `useProjectFilters`

Create `src/hooks/useProjectFilters.ts`.

```typescript
interface UseProjectFiltersReturn {
  filteredProjects: ProjectCardProps[];
  activeFilter: ProjectStatus | 'all';
  setFilter: (filter: ProjectStatus | 'all') => void;
  statusCounts: Record<ProjectStatus | 'all', number>;
}

export function useProjectFilters(
  projects: ProjectCardProps[]
): UseProjectFiltersReturn
```

- Owns the `activeFilter` state (initially `'all'`).
- Derives `filteredProjects` from `projects` and `activeFilter` — no second
  `useState`.
- Derives `statusCounts` by counting each status in `projects` — not stored in
  state.
- Returns all four values in a single object.

Call it from `MainContent` like this:

```typescript
const { filteredProjects, activeFilter, setFilter, statusCounts } =
  useProjectFilters(projects);
```

Then pass `activeFilter` and `setFilter` to `StatusFilter` where previously
`activeFilter` state and `setActiveFilter` were used.

---

## Acceptance Criteria

- [ ] `src/hooks/useDocumentTitle.ts` exists and exports `useDocumentTitle`
- [ ] `src/hooks/useKeyboardShortcut.ts` exists and exports `useKeyboardShortcut`
- [ ] `src/hooks/useProjectFilters.ts` exists and exports `useProjectFilters`
- [ ] `MainContent.tsx` has **no** inline `useEffect` calls for title or keyboard
      shortcut
- [ ] Filter state is no longer in `MainContent` — it lives in `useProjectFilters`
- [ ] The app still works identically: filtering, modal, keyboard shortcut, toast
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] All hooks have explicit TypeScript return type annotations

---

## Key Concepts

### A custom hook is just a function

```typescript
// Before — inline in a component:
useEffect(() => {
  document.title = title;
}, [title]);

// After — extracted into a hook:
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

The only requirement is that the function name starts with `use`. React uses
this convention to apply the Rules of Hooks linter checks.

### Return types matter

Always annotate the return type explicitly. For a hook that returns multiple
values, define an interface:

```typescript
interface UseProjectFiltersReturn {
  filteredProjects: ProjectCardProps[];
  activeFilter: ProjectStatus | 'all';
  setFilter: (filter: ProjectStatus | 'all') => void;
  statusCounts: Record<ProjectStatus | 'all', number>;
}
```

### Derive, don't duplicate

`filteredProjects` and `statusCounts` are derived from `projects` and
`activeFilter` on every render. Storing them in state would introduce a
synchronisation problem: two sources of truth that could get out of sync.

```typescript
// Correct — derived during render
const filteredProjects = activeFilter === 'all'
  ? projects
  : projects.filter(p => p.status === activeFilter);

// Wrong — creates a stale-state bug
const [filteredProjects, setFilteredProjects] = useState(projects);
```

### Rules of Hooks

1. **Only call hooks at the top level.** Do not call hooks inside conditions,
   loops, or nested functions.
2. **Only call hooks from React functions.** That means function components and
   other custom hooks — not plain utility functions.

These rules exist because React identifies hooks by their call order. If the
order changes between renders, React cannot correctly match state to the hook
that owns it.

---

## Bonus Challenges

1. Add a `useToast` hook that encapsulates `toastMessage` state and the
   auto-dismiss effect. It should return `{ toastMessage, showToast }`.
2. Modify `useKeyboardShortcut` to accept an array of shortcuts instead of a
   single key, so multiple shortcuts can be registered with one call.
3. Extract a `useLocalStorage` hook that persists the active filter to
   `localStorage` and restores it on page load.

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

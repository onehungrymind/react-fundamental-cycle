# Challenge 08 — Side Effects with useEffect

## Overview

React components are pure functions of props and state — they describe what the
UI should look like, not what should happen over time. **Side effects** are
everything else: DOM mutations, timers, subscriptions, and network requests. The
`useEffect` hook is React's escape hatch for all of these.

In this challenge you will add three real side effects to the TaskFlow app:

1. **Dynamic document title** — sync `document.title` with the project list.
2. **Keyboard shortcut** — `Cmd/Ctrl+K` opens the "New Project" modal from
   anywhere on the page.
3. **Auto-dismiss toast** — a success notification that disappears after 3
   seconds, with proper cleanup so no timers leak.

---

## Learning Objectives

1. Call `useEffect` with the correct dependency array to run on the right
   renders.
2. Return a cleanup function from `useEffect` to avoid memory leaks and stale
   listeners.
3. Understand the three dependency array variants:
   - `[]` — run once on mount, clean up on unmount.
   - `[dep]` — run when `dep` changes (and on mount).
   - no array — run after every render (rarely what you want).
4. Use `window.addEventListener` / `removeEventListener` inside an effect.
5. Use `setTimeout` / `clearTimeout` inside an effect.
6. Understand why React Strict Mode runs effects twice in development.

---

## Starting Point

The `start/` directory is the solution from Challenge 07. It already has:

- A working project list with filtering
- A modal-based "New Project" form
- `Card`, `Modal`, `PageLayout`, `ProjectCard`, `StatusFilter` components

What is **missing**:

- The document title never updates — it stays as whatever is in `index.html`.
- There are no keyboard shortcuts.
- Creating a project gives no feedback — the modal just closes silently.

Three `// TODO` comments in `start/src/components/MainContent.tsx` mark
exactly where to add each feature.

Run the start app to verify it works before you begin:

```bash
cd start
npm install
npm run dev
```

---

## Your Tasks

Work inside `start/src/`. The only file you need to edit is `MainContent.tsx`
(and optionally create `Toast.tsx` for the notification component).

### 1 — Dynamic Document Title

Add a `useEffect` that sets `document.title` whenever the number of projects
changes:

- When `projects.length > 0`: `"Projects | TaskFlow"`
- When `projects.length === 0`: `"Get Started | TaskFlow"`

Think carefully about the dependency array. This effect depends on
`projects.length` — nothing else.

### 2 — Keyboard Shortcut

Add a `useEffect` that registers a global `keydown` listener on `window`. When
the user presses `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux):

- Call `e.preventDefault()` to suppress browser default behaviour.
- Call `setShowForm(true)` to open the modal.

The effect must return a **cleanup function** that calls
`window.removeEventListener` with the same handler reference.

What should the dependency array be? The handler only calls `setShowForm` —
a stable setter from `useState`. Consider whether it truly needs any
dependencies.

### 3 — Auto-Dismiss Toast

Add a success notification when a project is created:

1. Add a new state variable `toastMessage` of type `string | null`, initialised
   to `null`.
2. In `handleAddProject`, after closing the modal, call
   `setToastMessage('Project created successfully!')`.
3. Add a `useEffect` that watches `toastMessage`. When it is not `null`, start a
   `setTimeout` that resets `toastMessage` to `null` after 3 000 ms. Return a
   cleanup function that calls `clearTimeout`.
4. Conditionally render a toast when `toastMessage !== null`. You can create a
   small `Toast.tsx` component or render the markup inline.

---

## Acceptance Criteria

- [ ] `document.title` is `"Projects | TaskFlow"` when projects exist
- [ ] `document.title` is `"Get Started | TaskFlow"` when no projects exist
- [ ] Pressing `Cmd/Ctrl+K` opens the "New Project" modal
- [ ] The keyboard listener is removed when the component unmounts (no leak)
- [ ] Adding a project shows a success toast
- [ ] The toast disappears automatically after 3 seconds
- [ ] The toast timer is cancelled if the component unmounts before 3 s
- [ ] No TypeScript errors (`npm run build` passes)

---

## Key Concepts

### `useEffect` signature

```tsx
useEffect(
  () => {
    // side effect here
    return () => {
      // optional cleanup — runs before next effect and on unmount
    };
  },
  [dep1, dep2] // dependency array
);
```

### Dependency array quick reference

| Array | When does the effect run? |
|---|---|
| `[]` | Once on mount; cleanup on unmount |
| `[a, b]` | On mount and whenever `a` or `b` changes |
| *(omitted)* | After every render |

### Why cleanup matters

Without cleanup, every `useEffect` that adds a listener or starts a timer will
leak resources if the component unmounts or re-renders unexpectedly. React
Strict Mode deliberately unmounts and remounts every component in development to
surface these leaks early.

### Strict Mode double-invoke

In development with `<StrictMode>`, every component mounts, immediately
unmounts (running cleanup), and mounts again. This verifies that your cleanup
function correctly reverses the effect. If you see your effects running twice,
this is expected and is not a bug in your code.

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

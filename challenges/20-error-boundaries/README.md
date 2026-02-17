# Challenge 20 — Error Handling & Error Boundaries

## Learning Goals

- Understand why error boundaries must be **class components**
- Use `getDerivedStateFromError` to render a fallback UI during a render error
- Use `componentDidCatch` to log error details
- Place boundaries at meaningful **isolation zones** so one failing section does not crash the entire app
- Build a reusable `useErrorHandler` hook that bridges async errors into the nearest boundary
- Understand what error boundaries **cannot** catch (event handlers, async callbacks, server-side errors)

---

## The Problem

Open `start/` and run the app.  Everything looks fine — until something throws during a render.  Because there are no error boundaries, **any render error anywhere in the tree produces a white screen** and the user has no path to recovery.

Run `npm run dev` inside `start/` and try triggering the test crash buttons added to the UI.

---

## Your Tasks

### 1. Create `ErrorBoundary` class component

File: `src/components/ErrorBoundary.tsx`

```ts
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: { error: Error; resetError: () => void }) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

Requirements:
- Implement `static getDerivedStateFromError(error)` — returns `{ hasError: true, error }`
- Implement `componentDidCatch(error, errorInfo)` — call `props.onError` and `console.error`
- Implement `resetError` instance method — resets state to `{ hasError: false, error: null }`
- If `props.fallback` is provided, call it with `{ error, resetError }`; otherwise render `<DefaultErrorFallback>`

### 2. Create fallback UI components

File: `src/components/ErrorFallback.tsx`

Export two components:
- `DefaultErrorFallback` — shows error message, "Try Again" button, "Report Issue" link
- `GlobalErrorFallback` — shows a full-page error, "Reload Application" button that calls `window.location.reload()`

### 3. Create `useErrorHandler` hook

File: `src/hooks/useErrorHandler.ts`

```ts
export function useErrorHandler(): (error: Error) => void
```

The hook stores an error in state.  If the error is non-null, it **throws during render**, which is caught by the nearest `ErrorBoundary`.

### 4. Place boundaries in the component tree

| Location | File | What it protects |
|---|---|---|
| Global | `src/App.tsx` | Entire application — last resort |
| Project list | `src/pages/ProjectsLayout.tsx` | The `<aside>` project list |
| Project detail | `src/pages/ProjectDetailPanel.tsx` | The detail panel content |
| Task form | `src/components/TaskList.tsx` | The `<AddTaskForm>` section |

Each section boundary uses the `resetError` callback so "Try Again" re-renders the section.
The global boundary uses `window.location.reload()`.

---

## Concepts

### Why class components?

Error boundaries rely on two **lifecycle methods** that have no hook equivalents:

- `getDerivedStateFromError` — called synchronously during the render phase; React uses its return value to re-render with a fallback
- `componentDidCatch` — called during the commit phase for side effects (logging)

The React team has stated a hook-based API is planned but has not shipped as of React 19.

### What error boundaries do NOT catch

- Errors in **event handlers** (use try/catch there instead)
- Errors in **async code** (setTimeout, fetch callbacks) — use `useErrorHandler` to forward them
- Errors thrown in **the error boundary itself**
- Server-side rendering errors

### Isolation strategy

Place boundaries at meaningful "blast radius" boundaries:
- Too few → whole app crashes on any error
- Too many → excessive nesting with no benefit
- Good targets: route segments, independent data-fetching sections, third-party widgets

---

## Stretch Goals

- Accept a `fallbackComponent` prop (React element) in addition to the render-prop `fallback`
- Add a `resetKeys` prop array — when any value in the array changes, automatically reset the boundary (as react-error-boundary does)
- Integrate an error reporting service in `componentDidCatch` (e.g., `Sentry.captureException`)
- Explore the `react-error-boundary` library and compare its API with your implementation

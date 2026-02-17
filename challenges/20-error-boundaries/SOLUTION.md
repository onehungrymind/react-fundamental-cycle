# Challenge 20 — Solution Debrief

## What Changed

### New files

| File | Purpose |
|---|---|
| `src/components/ErrorBoundary.tsx` | Reusable class component error boundary |
| `src/components/ErrorFallback.tsx` | Default and global fallback UIs |
| `src/hooks/useErrorHandler.ts` | Bridge async errors into the nearest boundary |

### Modified files

| File | Change |
|---|---|
| `src/App.tsx` | Wrapped entire app in `GlobalErrorBoundary` |
| `src/pages/ProjectsLayout.tsx` | `ErrorBoundary` around the project list `<aside>` |
| `src/pages/ProjectDetailPanel.tsx` | `ErrorBoundary` around `<ProjectDetailContent>` |
| `src/components/TaskList.tsx` | `ErrorBoundary` around the `<AddTaskForm>` section |

---

## Key Concepts

### Why class components are required

Error boundaries must be class components because they depend on two lifecycle methods:

```ts
static getDerivedStateFromError(error: Error): ErrorBoundaryState {
  // Called during the render phase.
  // Must be pure — no side effects.
  // Return value is merged into state.
  return { hasError: true, error };
}

componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
  // Called during the commit phase.
  // Safe for side effects: logging, analytics, reporting.
  console.error('ErrorBoundary caught:', error, errorInfo);
}
```

React hooks run inside function components.  The render-phase hook equivalent of `getDerivedStateFromError` does not exist because hooks cannot change state synchronously during another component's render.

### The render-throw pattern for async errors

`useErrorHandler` is a small but powerful pattern:

```ts
export function useErrorHandler(): (error: Error) => void {
  const [error, setError] = useState<Error | null>(null);
  if (error) throw error;   // <-- thrown during render, caught by boundary
  return setError;
}
```

Usage in a component with an async operation:

```ts
const handleError = useErrorHandler();

async function loadData() {
  try {
    const result = await fetchSomething();
    setData(result);
  } catch (err) {
    handleError(err instanceof Error ? err : new Error(String(err)));
  }
}
```

When `handleError(err)` is called, it calls `setError(err)`.  On the next render of the component, `if (error) throw error` fires, and React propagates the throw to the nearest `ErrorBoundary`.

### Isolation zones

```
<GlobalErrorBoundary>          ← entire app, last resort
  <Layout>
    <ProjectsLayout>
      <ErrorBoundary>          ← project list aside
        <aside>...</aside>
      </ErrorBoundary>
      <section>
        <ProjectDetailPanel>
          <ErrorBoundary>      ← detail panel content
            <ProjectDetailContent />
          </ErrorBoundary>
        </ProjectDetailPanel>
      </section>
    </ProjectsLayout>
  </Layout>
</GlobalErrorBoundary>
```

With this structure:
- A crash in the project list shows a fallback only in the sidebar; the detail panel still works
- A crash in the detail content only affects the right pane; the sidebar still works
- A crash anywhere else (header, routing) is caught by the global boundary

### componentDidCatch for logging

`componentDidCatch` is the correct place to call external error reporting:

```ts
componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
  // errorInfo.componentStack is the React component stack trace
  // Sentry.captureException(error, { extra: errorInfo });
  // logErrorToMyService(error, errorInfo.componentStack);
  console.error('ErrorBoundary caught:', error, errorInfo);
}
```

### What error boundaries cannot catch

| Error source | Caught by boundary? | Solution |
|---|---|---|
| Render method | Yes | Error boundary handles it |
| Constructor | Yes | Error boundary handles it |
| Lifecycle methods | Yes | Error boundary handles it |
| Event handlers | No | Use try/catch in the handler |
| Async (setTimeout, fetch) | No | Use `useErrorHandler` to re-throw during render |
| The boundary component itself | No | Wrap in a parent boundary |
| SSR errors | No | Framework-specific handling |

---

## Alternative Approaches

### react-error-boundary library

The [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package provides a polished class component with additional features:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
  FallbackComponent={MyFallback}
  onError={(error, info) => logError(error, info)}
  onReset={() => queryClient.clear()}
  resetKeys={[projectId]}
>
  <ProjectDetailPanel />
</ErrorBoundary>
```

Key additions over a basic implementation:
- `resetKeys` — automatically resets when a prop value changes (e.g., navigation to a different project)
- `onReset` — called when the boundary resets (useful for clearing stale query cache)
- `useErrorBoundary` hook — same idea as `useErrorHandler` but better integrated

### Result types (TypeScript)

For deeply async flows, a Result type can make error paths explicit without exceptions:

```ts
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchProject(id: string): Promise<Result<Project>> {
  try {
    const data = await api.getProject(id);
    return { ok: true, value: data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
```

This shifts error handling to the call site and avoids the need for error boundaries for network errors (those are already handled by TanStack Query's `error` state).  Error boundaries are best reserved for **unexpected render errors** rather than expected API failures.

# Challenge 14 — Solution Notes

## What changed from Challenge 13

| File | Change |
|------|--------|
| `src/main.tsx` | Async MSW bootstrap before `createRoot` |
| `src/hooks/useFetch.ts` | **New** generic data-fetching hook |
| `src/components/LoadingSpinner.tsx` | **New** loading indicator |
| `src/components/ErrorMessage.tsx` | **New** error display with retry |
| `src/pages/ProjectsLayout.tsx` | Uses `useFetch<Project[]>` instead of hardcoded data |
| `src/pages/ProjectDetailPanel.tsx` | Uses `useFetch<Project & { tasks: Task[] }>` |
| `src/components/TaskList.tsx` | Accepts `initialTasks` prop |
| `src/mocks/` | **New** directory: `data.ts`, `handlers.ts`, `browser.ts` |
| `src/data/projects.ts` | **Removed** |
| `src/data/tasks.ts` | **Removed** |

## Key concepts

### The fetch lifecycle

Every fetch operation goes through four states.  Map them directly to React state:

```
idle     → isLoading: false, data: null, error: null
loading  → isLoading: true,  data: null, error: null
success  → isLoading: false, data: T,    error: null
error    → isLoading: false, data: null, error: Error
```

### AbortController + StrictMode

React 18 StrictMode mounts components **twice** in development.  Without cleanup:

1. Effect fires → `fetch` starts (request A)
2. Cleanup fires (StrictMode unmount) — nothing cancels request A
3. Effect fires again → `fetch` starts (request B)
4. Request A resolves → sets state (stale data)
5. Request B resolves → sets state again (fresh data)

With `AbortController`:

```typescript
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(/* ... */);
  return () => controller.abort();  // cancels request A on cleanup
}, [url]);
```

When the signal is aborted, `fetch` rejects with an `AbortError`.  The hook checks
`err.name !== 'AbortError'` to avoid setting error state for intentional cancellations.

### Why `response.ok`?

`fetch` only rejects on network-level failures (no internet, DNS, CORS).  HTTP 4xx/5xx
**resolve** to a Response object with `ok === false`.  Without the check:

```typescript
// BUG: silently treats 404 JSON error body as valid data
const data = await res.json();
```

The correct pattern:

```typescript
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

### The `refetch` pattern

Incrementing a counter forces the `useEffect` to re-run without changing `url`:

```typescript
const [fetchCount, setFetchCount] = useState(0);

useEffect(() => { /* fetch */ }, [url, fetchCount]);

const refetch = useCallback(() => setFetchCount(c => c + 1), []);
```

This is a simple, dependency-array-friendly way to trigger imperative re-fetches.

### MSW in the browser

MSW registers a Service Worker that intercepts outgoing `fetch` calls.  The worker must
be started **before** React renders to avoid missed requests on initial mount.

Dynamic import (`await import('./mocks/browser')`) ensures the MSW code is only bundled
in development — you can conditionally skip this in production:

```typescript
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') return;
  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}
```

### Race conditions

If the user navigates quickly (project A → project B), two fetches may be in-flight.
The `AbortController` cleanup handles this: navigating away unmounts the component,
triggering cleanup and aborting the stale request.

If you keep a single `useFetch` instance and change the `url` dependency instead, the
previous effect's cleanup aborts the old request before the new one starts.

## What's next

Challenge 15 will introduce **mutations** — POST/PATCH/DELETE — and optimistic updates.

### SWR / TanStack Query preview

`useFetch` implements the minimal fetch lifecycle manually.  Production apps typically
reach for a dedicated library:

| Feature | useFetch (ours) | TanStack Query |
|---------|-----------------|----------------|
| Loading / error states | Yes | Yes |
| Deduplication | No | Yes |
| Background refetch | No | Yes |
| Cache with stale-while-revalidate | No | Yes |
| Mutations + rollback | No | Yes |
| DevTools | No | Yes |

The mental model you built here (effect → abort → setData/setError) maps directly to
what these libraries do internally.

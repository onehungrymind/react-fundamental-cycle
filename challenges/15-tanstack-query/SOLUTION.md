# Challenge 15 Solution Debrief — Server State with TanStack Query

## What Changed

| File | Change |
|------|--------|
| `src/App.tsx` | Added `QueryClient`, `QueryClientProvider`, `ReactQueryDevtools` |
| `src/api/projects.ts` | NEW — typed fetch functions extracted from components |
| `src/hooks/queries/useProjects.ts` | NEW — `useProjects()` query hook |
| `src/hooks/queries/useProject.ts` | NEW — `useProject(id)` query hook |
| `src/pages/ProjectsLayout.tsx` | Uses `useProjects()` + `invalidateQueries` Refresh button |
| `src/pages/ProjectDetailPanel.tsx` | Uses `useProject(projectId)` |
| `src/hooks/useFetch.ts` | Deleted (no longer needed) |

## Key Concepts Explained

### Query Keys — Arrays, not strings

TanStack Query uses **arrays** as query keys, not strings. This enables:

```typescript
// Invalidate just one project
queryClient.invalidateQueries({ queryKey: ["projects", "proj-1"] })

// Invalidate ALL project queries (list + detail)
queryClient.invalidateQueries({ queryKey: ["projects"] })
```

The second call works because TanStack Query matches **prefixes** — `["projects"]` is a prefix of `["projects", "proj-1"]`, so it invalidates both.

**Structural equality** — Query keys are compared by value, not reference:
```typescript
// These produce the SAME cache entry (deep equality)
useQuery({ queryKey: ["projects", projectId] })
useQuery({ queryKey: ["projects", projectId] })
```

### Staleness vs Cache Expiry

Two independent timers control TanStack Query's cache behavior:

```
staleTime (default: 0ms)
  ↓ After this, data is "stale" — still shown, but refetched in background on next mount

gcTime (default: 5min)
  ↓ After this, cache entry is garbage collected (removed from memory)
```

With `staleTime: 30_000`:
- 0–30s: data is "fresh" → no refetch on remount
- 30s+: data is "stale" → background refetch on remount (old data shown instantly)
- 5min after last subscriber: cache entry purged

### isPending vs isLoading vs isFetching

TanStack Query has three loading flags:

| Flag | True when |
|------|-----------|
| `isPending` | No data in cache yet (first load) |
| `isLoading` | Alias for `isPending && isFetching` |
| `isFetching` | Any fetch in progress (including background refetches) |

For the spinner you want `isPending` — it only shows on the first load, not on background refetches (which would cause jarring re-renders).

### The `enabled` Option

The `enabled` option prevents a query from firing until a condition is true:

```typescript
export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: projectId !== undefined,
    staleTime: 30_000,
  })
}
```

Without `enabled`, TanStack Query would immediately fire the query with `undefined` as the ID, resulting in a `fetch("/api/projects/undefined")` call.

### Retry Behavior

By default, TanStack Query retries failed queries **3 times** with exponential backoff. This is sensible for production (transient network errors), but can be frustrating during development. You can disable it:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,          // disable retry
      retry: 1,              // retry once
      retryDelay: 1000,      // 1s between retries
    },
  },
})
```

### invalidateQueries vs refetch

Two ways to force a fresh fetch:

```typescript
// Option 1: refetch — re-runs the current query regardless of staleness
const { refetch } = useQuery(...)
await refetch()

// Option 2: invalidateQueries — marks cache as stale, triggers refetch
// on next component that has the query mounted
queryClient.invalidateQueries({ queryKey: ["projects"] })
```

Use `invalidateQueries` after mutations (POST/PATCH/DELETE) to invalidate all related queries. Use `refetch` for a simple "Refresh" button on the current page.

### Separating Fetch Functions from Hooks

Notice that `src/api/projects.ts` contains plain async functions, not hooks. This separation is intentional:

1. **Testability** — Pure async functions are easy to test in isolation
2. **Reusability** — The same `fetchProject` can be used in `prefetchQuery`, `getQueryData`, etc.
3. **Readability** — The hook only declares *how* to cache the result, not *how* to fetch it

```typescript
// Bad — fetch logic inside hook (harder to test/reuse)
function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    },
  })
}

// Good — fetch logic extracted
// api/projects.ts
export async function fetchProject(id: string): Promise<ProjectWithTasks> {
  const res = await fetch(`/api/projects/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`)
  return res.json()
}

// hooks/queries/useProject.ts
export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => fetchProject(id),
    staleTime: 30_000,
  })
}
```

### QueryClientProvider Placement

The `QueryClientProvider` must wrap any component that calls `useQuery` or `useQueryClient`. Place it near the root:

```typescript
// Correct — QueryClientProvider wraps everything
<QueryClientProvider client={queryClient}>
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        ...
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
  <ReactQueryDevtools />
</QueryClientProvider>
```

`ReactQueryDevtools` should be a direct child of `QueryClientProvider`, not nested inside the router.

## TanStack Query vs Alternatives

| Library | Mental Model | Best For |
|---------|-------------|----------|
| TanStack Query | Server state cache | REST APIs, any async data |
| SWR | Stale-while-revalidate | Simple REST, lightweight |
| RTK Query | Redux-integrated | Teams already using Redux Toolkit |
| Apollo Client | GraphQL-first | GraphQL APIs |
| Zustand/Jotai | General state | Client-only state |

TanStack Query is framework-agnostic, has excellent TypeScript support, and the DevTools are exceptional for debugging cache behavior.

## DevTools Exploration

With the app running, open the TanStack Query DevTools (bottom-right corner) and try:

1. **Navigate to a project** — watch the query go from `fetching` to `fresh`
2. **Navigate away and back within 30s** — the query is `fresh`, no network request
3. **Wait 30+ seconds and navigate back** — query is `stale`, background refetch fires
4. **Click "Refresh"** — `invalidateQueries` marks all project queries stale, refetch fires
5. **Open two browser tabs** — TanStack Query deduplicates in-flight requests

## What's Next

Challenge 16 will use TanStack Query's **mutations** (`useMutation`) to POST new projects and PATCH task statuses, then invalidate queries to keep the cache fresh.

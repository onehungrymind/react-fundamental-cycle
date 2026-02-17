# Challenge 15 — Server State with TanStack Query

## What You'll Build

Migrate all data fetching from the custom `useFetch` hook to **TanStack Query** (`@tanstack/react-query`). You'll configure a `QueryClient`, wrap the app in a `QueryClientProvider`, create typed query-hook wrappers, and observe TanStack Query's built-in caching in action.

## Learning Goals

- Install and configure `QueryClient` + `QueryClientProvider`
- Replace `useFetch` with `useQuery` using proper array-based query keys
- Create typed query hook wrappers: `useProjects()` and `useProject(id)`
- Observe caching: navigate away and back — no loading spinner on the second visit (within `staleTime`)
- Add a manual "Refresh" button that calls `queryClient.invalidateQueries()`
- Configure `staleTime: 30_000` (30 seconds)

## Background

### Why TanStack Query?

The custom `useFetch` hook from Challenge 14 works, but it has no caching. Every navigation triggers a fresh network request, even if you just visited that page 5 seconds ago. TanStack Query solves this with a client-side **query cache**:

```
First visit  → loading → fetched → cached
Second visit → instant (from cache, no spinner)
After 30s    → background refetch (staleTime expired)
```

### Core Concepts

**Query Keys** — Arrays that uniquely identify each query:
```typescript
["projects"]              // the projects list
["projects", "proj-1"]    // a specific project
```

**staleTime** — How long cached data is considered "fresh". Within this window, TanStack Query serves the cache immediately without refetching. After it expires, the data is "stale" — TanStack Query will still show cached data but refetch in the background.

**gcTime (Garbage Collection Time)** — How long unused cache entries stay in memory after the component unmounts. Default is 5 minutes.

**enabled** — A flag that prevents a query from running until a condition is true (e.g., `enabled: projectId !== undefined`).

## Your Tasks

### 1. Configure QueryClient in `src/App.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
    },
  },
})

// Wrap your JSX:
// <QueryClientProvider client={queryClient}>
//   ...existing providers...
//   <ReactQueryDevtools />
// </QueryClientProvider>
```

### 2. Create API fetch functions in `src/api/projects.ts`

Extract the fetch logic from components into standalone async functions:

```typescript
export async function fetchProjects(): Promise<Project[]> { ... }
export async function fetchProject(id: string): Promise<Project & { tasks: Task[] }> { ... }
```

### 3. Create typed query hooks

**`src/hooks/queries/useProjects.ts`**
```typescript
import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '../../api/projects'

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 30_000,
  })
}
```

**`src/hooks/queries/useProject.ts`**
```typescript
import { useQuery } from '@tanstack/react-query'
import { fetchProject } from '../../api/projects'

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => fetchProject(projectId),
    staleTime: 30_000,
  })
}
```

### 4. Update `src/pages/ProjectsLayout.tsx`

Replace `useFetch<Project[]>` with `useProjects()`. Note that TanStack Query returns `isPending` instead of `isLoading`, and `refetch` becomes `invalidateQueries`.

Add a "Refresh" button that invalidates the projects query:
```typescript
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

function handleRefresh() {
  void queryClient.invalidateQueries({ queryKey: ["projects"] })
}
```

### 5. Update `src/pages/ProjectDetailPanel.tsx`

Replace `useFetch<ProjectWithTasks>` with `useProject(projectId)`.

### 6. (Optional) Delete `src/hooks/useFetch.ts`

Once all consumers are migrated, the custom hook is no longer needed.

## Key Differences: useFetch vs useQuery

| Feature | `useFetch` | `useQuery` |
|---------|-----------|------------|
| Caching | None | Built-in |
| Background refetch | No | Yes |
| Stale-while-revalidate | No | Yes |
| Deduplication | No | Yes |
| Loading state name | `isLoading` | `isPending` |
| Error type | `Error \| null` | `Error \| null` |
| Refetch | `refetch()` | `refetch()` or `invalidateQueries()` |

## File Structure After Migration

```
src/
  api/
    projects.ts          NEW — typed fetch functions
  hooks/
    queries/
      useProjects.ts     NEW — typed query hook
      useProject.ts      NEW — typed query hook
    useFetch.ts          (can be deleted)
  pages/
    ProjectsLayout.tsx   UPDATED — uses useProjects()
    ProjectDetailPanel.tsx UPDATED — uses useProject()
  App.tsx                UPDATED — QueryClientProvider
```

## Running the App

```bash
cd start/
npm install
npx msw init public/ --save
npm run dev
```

Visit `http://localhost:5173`, open the TanStack Query DevTools (bottom-right corner), and observe:
1. First visit to a project → fetch fires, DevTools shows "fetching"
2. Navigate away and back within 30s → instant render from cache, no fetch
3. Click "Refresh" → DevTools shows "stale" → refetch fires

## See TODO comments in the `start/` directory

Look for `// TODO` comments in:
- `src/App.tsx`
- `src/pages/ProjectsLayout.tsx`
- `src/pages/ProjectDetailPanel.tsx`

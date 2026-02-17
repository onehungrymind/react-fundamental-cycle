# Challenge 14 — Data Fetching Fundamentals

## Goal

Replace every hardcoded data import with real HTTP calls to a mock API powered by
**Mock Service Worker (MSW)**.  By the end, `ProjectsLayout` and `ProjectDetailPanel`
both fetch their data over the network (intercepted by MSW in the browser), and every
loading / error / success state is handled gracefully in the UI.

## Background

Fetching data in React boils down to one pattern:

```
mount  → kick off fetch + show spinner
success → store data in state + hide spinner
error  → store error in state + show retry button
unmount → cancel the in-flight request (AbortController)
```

### Why AbortController?

React 18+ StrictMode intentionally mounts each component **twice** in development to
surface side-effects.  Without cleanup, two fetch calls fire and the first response may
overwrite the second.  Returning `() => controller.abort()` from `useEffect` cancels the
stale request.

### Why check `response.ok`?

`fetch` only rejects on network errors (no connection, DNS failure, etc.).  A 404 or 500
**resolves** to a `Response` with `ok === false`.  Always check `res.ok` before calling
`res.json()`.

## What you need to do

### 1. Start MSW in `src/main.tsx`

The `src/mocks/browser.ts` worker is already set up.  Wrap the `ReactDOM.createRoot`
call so MSW starts before React renders:

```typescript
async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
```

### 2. Create `src/hooks/useFetch.ts`

A generic hook that wraps the fetch lifecycle:

```typescript
export function useFetch<T>(url: string): UseFetchResult<T>
```

Requirements:

- Returns `{ data, isLoading, error, refetch }`
- `isLoading` starts `true` and becomes `false` once the request settles
- `error` is `null` on success or an `Error` instance on failure
- Throws (as an error state, not a thrown exception) when `response.ok` is `false`
- Cancels the request with `AbortController` on unmount / url change
- `refetch` increments an internal counter to re-trigger the effect

### 3. Update `src/pages/ProjectsLayout.tsx`

Replace the hardcoded `INITIAL_PROJECTS` import with:

```typescript
const { data: projects, isLoading, error, refetch } = useFetch<Project[]>('/api/projects');
```

Render three states:
- **Loading** — a `<LoadingSpinner />` inside the master-list panel
- **Error** — an `<ErrorMessage />` with a Retry button that calls `refetch()`
- **Success** — the existing `<ProjectListItem>` list

### 4. Update `src/pages/ProjectDetailPanel.tsx`

Replace the hardcoded `INITIAL_PROJECTS.find(...)` with:

```typescript
const { data: project, isLoading, error, refetch } =
  useFetch<Project & { tasks: Task[] }>(`/api/projects/${projectId}`);
```

Render the same three states.  On success, pass the fetched tasks to `<TaskList>` as a
prop (instead of reading `TASKS` from the data file).

### 5. Create `src/components/LoadingSpinner.tsx`

A simple accessible spinner.  Minimal markup, no dependencies.

### 6. Create `src/components/ErrorMessage.tsx`

Displays the error message and a **Retry** button.

```typescript
interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}
```

### 7. Update `src/components/TaskList.tsx`

Accept an optional `initialTasks` prop so `ProjectDetailPanel` can pass the fetched
tasks directly.  Fall back to the old behaviour (empty) when the prop is absent.

## What NOT to change

- `src/mocks/` — the handlers are already complete
- `src/reducers/taskReducer.ts` — unchanged from challenge 13
- `src/context/` — unchanged
- `src/data/team.ts` — still hardcoded (team data will be fetched in a later challenge)

## Rules

- TypeScript strict mode — no `any`
- Named exports everywhere
- `useFetch` must use `AbortController` for cleanup
- `useFetch` must check `response.ok` before calling `.json()`
- Loading, error, and success states must all be visible in the UI
- Error state must include a Retry button

## Stretch goals

1. Add a `staleTime` option to `useFetch` so re-fetching is debounced
2. Cache responses in a `Map` keyed by URL using `useRef` or a module-level singleton
3. Explore [TanStack Query](https://tanstack.com/query) — swap `useFetch` for `useQuery`
   and notice how much boilerplate disappears
4. Add a network-error simulation: expose a button that triggers a bad fetch and verify
   the error state + retry flow works

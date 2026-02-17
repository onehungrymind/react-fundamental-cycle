# Challenge 22 — Solution Notes

## What changed from the start/ directory

### src/mocks/server.ts (NEW)

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

`setupServer` is the Node equivalent of `setupWorker`.  It patches Node's `fetch`
(via `@mswjs/interceptors`) instead of registering a Service Worker.
The same `handlers` array is shared with the browser mock.

### src/test/setup.ts (UPDATED)

Added three Vitest global lifecycle hooks:

```ts
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

- `onUnhandledRequest: 'error'` catches typos in URLs (any request with no matching
  handler throws immediately rather than silently hanging).
- `resetHandlers()` removes per-test overrides so they cannot leak into subsequent tests.

### src/test/utils.tsx (UPDATED)

- `renderWithProviders` now creates a **fresh `QueryClient`** every call via
  `createTestQueryClient()` — ensuring no cache bleed between tests.
- Returns `{ ...renderResult, queryClient }` so tests can seed or inspect the cache.
- Accepts a `path` option to mount the component under a specific `<Route path>`,
  which is required when the component reads `useParams`.

```ts
export function renderWithProviders(
  ui: ReactElement,
  options?: { route?: string; path?: string }
)
```

When `path` is provided the component is rendered inside:

```tsx
<Routes>
  <Route path={path} element={ui} />
</Routes>
```

When no `path` is given the component is rendered directly (for components that
don't need route params).

## Key concepts debrief

### MSW setupServer vs setupWorker

| | setupWorker | setupServer |
|--|--|--|
| Runs in | Browser (Service Worker) | Node (http interceptor) |
| Import path | `msw/browser` | `msw/node` |
| Used by | `src/mocks/browser.ts` | `src/mocks/server.ts` |
| Started in | `main.tsx` | `src/test/setup.ts` |

### Handler overrides per test

```ts
server.use(
  http.get('/api/projects', () => new HttpResponse(null, { status: 500 }))
)
```

This *prepends* the override; MSW tries handlers in order and stops at the first
match, so the override wins. `server.resetHandlers()` removes overrides after each
test, restoring the default handler.

### waitFor vs findBy

`findByText('foo')` is shorthand for `waitFor(() => getByText('foo'))`.
Use `findBy` when you expect a single element to eventually appear.
Use `waitFor` for more complex assertions or when checking multiple conditions.

### Fresh QueryClient per test

```ts
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })
}
```

- `retry: false` — a failed query fails immediately (no 3-retry delay).
- `gcTime: 0` — cache entries are removed as soon as they are no longer observed,
  preventing phantom data between tests.

### Seeding the cache for mutation tests

Rather than waiting for a full async fetch cycle in every test, you can pre-populate
the QueryClient cache:

```ts
queryClient.setQueryData(['projects', 'proj-1'], existingProject)
```

This makes the detail panel render synchronously on the first paint, letting the
test focus purely on the mutation behaviour.

### Testing optimistic updates

The optimistic task gets an id that starts with `temp-`.  The sequence is:

1. User submits form → `useMutation.onMutate` fires → cache updated with temp task
2. Component re-renders with the optimistic task visible
3. MSW responds with real task → `onSettled` invalidates query → refetch
4. Component re-renders with server task (real id) replacing optimistic one

In the test you `findByText` the task title — it appears after step 2 without
needing to wait for step 4.

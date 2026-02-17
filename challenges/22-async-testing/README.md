# Challenge 22 — Testing Async Operations & Mocking

## Overview

In Challenge 21 you wrote unit tests for synchronous components.
Real apps also need tests that cover the full async lifecycle: loading states, success renders, error states, and mutations that refetch data.

In this challenge you will wire up **MSW (Mock Service Worker) for Node** so that the
Vitest test environment intercepts `fetch` calls, then write async integration tests
for the pages and hooks that depend on those API calls.

## What you will practise

1. Configure MSW for the **Node/jsdom** environment (`setupServer`, not `setupWorker`)
2. Test the **loading state** – the spinner is visible while the fetch is in flight
3. Test the **success state** – projects render after MSW responds
4. Test the **error state** – override a handler to return 500 and verify the error UI plus retry button
5. Test **mutation + cache invalidation** – create a task, verify it appears optimistically, verify the server data is eventually loaded

## Getting started

```bash
cd start/
npm install
npm test
```

The tests in `src/components/__tests__/` from Challenge 21 still pass.
Your job is to make the *new* async tests in `src/pages/__tests__/` and
`src/components/__tests__/TaskMutations.test.tsx` pass by completing the TODOs.

## Files to edit

| File | What to do |
|------|-----------|
| `src/mocks/server.ts` | Create the MSW Node server with `setupServer` |
| `src/test/setup.ts` | Add `beforeAll`, `afterEach`, `afterAll` lifecycle hooks |
| `src/test/utils.tsx` | Update `renderWithProviders` to return `queryClient` and support route params |
| `src/pages/__tests__/ProjectsLayout.test.tsx` | Write async tests (loading / success / error / retry) |
| `src/pages/__tests__/ProjectDetailPanel.test.tsx` | Write async tests for project detail |
| `src/components/__tests__/TaskMutations.test.tsx` | Write mutation + optimistic-update test |

## Key concepts

### setupServer vs setupWorker

| | `setupWorker` | `setupServer` |
|--|--|--|
| Where | Browser (Service Worker) | Node (http-interceptor) |
| Used in | `main.tsx` (dev mode) | Test files via `setup.ts` |
| Import | `msw/browser` | `msw/node` |

### Lifecycle hooks (in setup.ts)

```ts
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())   // clear per-test overrides
afterAll(() => server.close())
```

### Per-test handler overrides

```ts
server.use(
  http.get('/api/projects', () => new HttpResponse(null, { status: 500 }))
)
```

`server.resetHandlers()` in `afterEach` removes these overrides automatically.

### Async query helpers

| Helper | When to use |
|--------|------------|
| `findBy*` | Single element, waits up to timeout |
| `waitFor` | Arbitrary assertion, polls until truthy |
| `queryBy*` | Checking absence (returns `null`, never throws) |

### Fresh QueryClient per test

Each call to `renderWithProviders` creates a new `QueryClient` with
`retry: false` and `gcTime: 0` so:
- Failed queries fail immediately (no retries)
- Cache entries are never shared between tests
- `queryClient` is returned so tests can inspect/seed the cache

## Hints

- `ProjectsLayout` renders `<Outlet />` — in tests you may render the component
  directly inside a `<Routes>` with a path, or use the `path` option in
  `renderWithProviders`.
- The loading spinner has `role="status"` — use `getByRole('status')`.
- `ErrorMessage` renders "Something went wrong" and a Retry button — use
  `findByText(/something went wrong/i)` and `getByRole('button', { name: /retry/i })`.
- For the mutation test, seed the QueryClient cache with the project data
  **before** rendering so the detail panel loads instantly without a network round-trip.

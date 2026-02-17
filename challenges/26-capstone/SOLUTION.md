# Challenge 26 — Solution Debrief

Congratulations — you have completed the full 26-challenge TaskFlow workshop.

## What the Solution Does

### Feature 1: Team Member Assignment

`TeamMemberSelect` is a ARIA combobox built entirely with React primitives:

```
role="combobox"  →  the text input
role="listbox"   →  the dropdown ul
role="option"    →  each li
```

Key implementation decisions:

**Client-side filtering with `useMemo`**: Because team data is small and rarely changes (`staleTime: 5 * 60 * 1000`), filtering happens synchronously in the browser. No debounce needed.

**Keyboard navigation with `activeIndex` state**: Rather than imperatively focusing DOM nodes, we track which option is "active" as a number in state and derive `aria-activedescendant` from it. The browser announces the active option to screen readers automatically.

**Closing on outside click**: `useEffect` attaches a `mousedown` listener to `document`. Because React events bubble through portals, a simpler pattern is to compare `event.target` against the wrapper ref.

**Optimistic update on selection**: `onAssign` comes from `TaskList` → `useUpdateTask`, which already has optimistic update logic built in from Challenge 16.

### Feature 2: Project Dashboard

The dashboard is built around **derived state** — it reads from TanStack Query's in-memory cache rather than making additional API requests.

```typescript
// useProjects() returns cached data immediately if fresh
const { data: projects } = useProjects()

const stats = useMemo(() => {
  if (!projects) return null
  return {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    // ...
  }
}, [projects])
```

This is a critical architectural insight: your query cache is a client-side database. `useQuery` with the same `queryKey` will deduplicate requests and share data across components — the Dashboard and the Projects sidebar both call `useProjects()` but only one network request fires.

**Recently viewed** comes from Redux because it is purely client-side UI state: it does not need to be persisted to the server, and `useAppSelector` gives us a subscription to updates as the user navigates.

### Feature 3: Real-Time Updates via Polling

TanStack Query's `refetchInterval` option implements polling with a single configuration line:

```typescript
refetchInterval: 30_000,
refetchIntervalInBackground: false,
```

`refetchIntervalInBackground: false` is the subtle but important part. When the user switches to another browser tab, the Page Visibility API fires `visibilitychange`. TanStack Query listens to this internally and pauses background refetches, resuming them when the tab becomes visible again. This avoids wasting bandwidth for background tabs.

The `SyncIndicator` converts `dataUpdatedAt` (a timestamp in ms) into a human-readable "X seconds ago" string using `setInterval`:

```typescript
useEffect(() => {
  const id = setInterval(() => {
    setRelativeTime(formatRelativeTime(dataUpdatedAt))
  }, 1000)
  return () => clearInterval(id)
}, [dataUpdatedAt])
```

The cleanup function (`clearInterval`) prevents the interval from accumulating across re-renders — a foundational `useEffect` pattern from Challenge 8.

## Architectural Decisions

### Why polling instead of WebSockets?

WebSockets are excellent for true real-time (chat, collaborative editing, live trading dashboards). But they add complexity: you need a WebSocket server, reconnection logic, and client-side event handling.

For TaskFlow — a project management tool where data changes a few times per hour — polling every 30 seconds is simpler, more reliable, and uses standard HTTP. TanStack Query's `refetchInterval` gives you the same UX benefit (stale data refreshes automatically) with zero extra infrastructure.

**When to use WebSockets instead:**
- Sub-second latency required (games, live auctions)
- Server needs to push events the client did not request
- Many users editing the same resource simultaneously (Google Docs-style)

**When to use SSE (Server-Sent Events):**
- Server-to-client streaming only (no client messages needed)
- Simpler than WebSockets, works over standard HTTP/2
- Example: live log tailing, stock tickers, AI token streaming

### React Server Components

RSC (available in Next.js 13+ App Router) would change some of these patterns:
- Server Components fetch data on the server — no loading states, no `useQuery`
- Client Components handle interactivity — `useState`, `useEffect`, event handlers
- `TeamMemberSelect` would still be a Client Component (keyboard events)
- `DashboardPage` stats could be computed on the server (no TanStack Query needed)

For a purely client-side Vite app like TaskFlow, the patterns in this workshop (TanStack Query, optimistic updates, polling) remain the right approach.

### End-to-End Testing with Playwright

Unit tests with Vitest cover individual components in isolation. A production app also needs E2E tests that verify full user workflows in a real browser.

The key TaskFlow E2E test scenarios would be:

```typescript
// playwright/e2e/taskflow.spec.ts

test('user can create a project and add tasks', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="new-project-link"]')
  await page.fill('[name="name"]', 'My E2E Project')
  await page.click('[type="submit"]')
  await expect(page.getByText('My E2E Project')).toBeVisible()
})

test('dashboard shows correct project stats', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByText('Active')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})

test('team member combobox is keyboard accessible', async ({ page }) => {
  await page.goto('/projects/proj-1')
  await page.click('[aria-label="Search team member"]')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  // verify assignment was made
})
```

E2E tests run against the real browser, catching bugs that unit tests miss (CSS layout, focus management, navigation flows).

## What You Have Built

Over 26 challenges you assembled every layer of a modern React application:

| Layer | Challenges |
|---|---|
| Components & JSX | 01-04 |
| State & events | 05-06 |
| Composition & effects | 07-08 |
| Custom hooks | 09 |
| Routing | 10-11 |
| Context API | 12 |
| useReducer | 13 |
| Data fetching | 14-16 |
| Global state (Redux) | 17-18 |
| Performance | 19 |
| Error boundaries | 20 |
| Testing | 21-22 |
| Suspense & lazy loading | 23 |
| Accessibility | 24 |
| Deployment | 25 |
| Capstone | 26 |

The full TaskFlow application you have built demonstrates professional-grade React patterns used in production applications at scale.

# Challenge 26 — Capstone: Putting It All Together

You've built every layer of a modern React application across 25 challenges. Now it's time to synthesize everything into the complete, production-ready **TaskFlow** app.

## What You Will Build

Three features that draw on skills from across the entire workshop:

### Feature 1: Team Member Assignment (Searchable Combobox)

Replace the basic `<select>` in `TaskAssignment` with a fully accessible searchable combobox that fetches real data from `/api/team`.

**Requirements:**
- Create `src/components/TeamMemberSelect.tsx`
  - Fetch team members via `useTeam()` hook (create `src/hooks/queries/useTeam.ts`)
  - Text input filters members client-side with `useMemo`
  - Dropdown list of filtered results, shown when input is focused or has a value
  - Keyboard navigation: Arrow Up / Arrow Down move through options, Enter selects, Escape closes
  - ARIA: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-controls`
  - Show selected member's avatar + name when assigned
  - Clearing the input or pressing Escape unassigns
- Update `src/components/TaskItem.tsx` to use `TeamMemberSelect` instead of `TaskAssignment`

### Feature 2: Project Dashboard

Add a `/dashboard` route showing a high-level summary of all projects.

**Requirements:**
- Create `src/pages/DashboardPage.tsx` (lazy-loaded)
  - Derive stats from the already-cached TanStack Query data — no extra API calls
  - Display: Total Projects, Active, Completed, Archived counts
  - Show "Recently Viewed" projects list from Redux (`recentlyViewed.projectIds`)
  - Each recently viewed item links to `/projects/:id`
- Create `src/components/StatCard.tsx` — reusable stat display card
- Update `src/App.tsx`:
  - Add `<Route path="/dashboard">` (lazy, Suspense-wrapped)
  - Redirect `/` → `/dashboard` instead of `/projects`
- Update `src/components/Layout.tsx` (or `Sidebar`) to add a Dashboard nav link

### Feature 3: Real-Time Updates via Polling

Make the projects list feel "live" by polling the server every 30 seconds.

**Requirements:**
- Update `src/hooks/queries/useProjects.ts`:
  - Add `refetchInterval: 30_000`
  - Add `refetchIntervalInBackground: false` (pauses when tab is hidden)
- Create `src/components/SyncIndicator.tsx`:
  - Shows "Last synced: X seconds ago" (updates every second with `setInterval`)
  - Shows a brief "Data updated" flash when `dataUpdatedAt` changes
- Update `src/components/Header.tsx` to render `<SyncIndicator />`

## TODO Comments

The `start/` directory has `// TODO:` comments at every location that needs to change. Search for `TODO` to find them all.

## Files to Create

```
src/components/TeamMemberSelect.tsx   (new)
src/components/StatCard.tsx           (new)
src/components/SyncIndicator.tsx      (new)
src/hooks/queries/useTeam.ts          (new)
src/pages/DashboardPage.tsx           (new)
```

## Files to Update

```
src/App.tsx                           add /dashboard route, change / redirect
src/components/Layout.tsx             add Dashboard nav item
src/components/TaskItem.tsx           use TeamMemberSelect
src/components/Header.tsx             add SyncIndicator
src/hooks/queries/useProjects.ts      add refetchInterval
```

## Concepts Exercised

| Concept | Used In |
|---|---|
| Custom hooks + TanStack Query | `useTeam`, `useProjects` polling |
| `useMemo` / `useCallback` | Team member filtering, callbacks |
| ARIA combobox pattern | `TeamMemberSelect` |
| Keyboard accessibility | Arrow key navigation in dropdown |
| Redux `useAppSelector` | Recently viewed on dashboard |
| Derived state from cache | Dashboard stats |
| Lazy loading + Suspense | `DashboardPage` |
| `refetchInterval` | Polling projects |
| `setInterval` in `useEffect` | Sync time display |

## Running the App

```bash
npm install
npm run dev
```

## Running Tests

```bash
npm test
```

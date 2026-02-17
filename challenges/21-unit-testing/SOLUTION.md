# Challenge 21 — Solution Notes

## What Was Built

Four test files exercising real user behaviour across the TaskFlow component tree:

| File | Tests |
|---|---|
| `ProjectListItem.test.tsx` | Renders name/status/task count; marks active item |
| `TaskStatusButton.test.tsx` | Correct transitions rendered; callback invoked |
| `AddTaskForm.test.tsx` | Toggle open/close; validation error; valid submission |
| `TaskItem.test.tsx` | Title/status display; delete; status transition callback |

Supporting infrastructure:

- `vite.config.ts` — Vitest test config embedded via `/// <reference types="vitest" />`
- `src/test/setup.ts` — Imports jest-dom matchers for `toBeInTheDocument` etc.
- `src/test/utils.tsx` — `renderWithProviders` wraps components with all providers

## Key Concepts

### getBy vs queryBy vs findBy

```
getBy…     throws immediately if element not found     → "must exist now"
queryBy…   returns null if not found                   → "may not exist"
findBy…    returns Promise, waits up to 1 000 ms       → "will appear async"
```

**Pattern: use `queryBy` for negative assertions**

```typescript
// WRONG — getBy throws before toBeNull runs
expect(screen.getByText('Error')).not.toBeInTheDocument();

// RIGHT — queryBy returns null safely
expect(screen.queryByText('Error')).not.toBeInTheDocument();
```

**Pattern: use `findBy` for async content**

```typescript
// Waits for element to appear after async operation completes
const item = await screen.findByRole('listitem', { name: /my task/i });
expect(item).toBeInTheDocument();
```

### userEvent vs fireEvent

`userEvent` simulates a full browser interaction sequence. For a click:

```
pointerover → pointerenter → mouseover → mouseenter →
pointermove → mousemove →
pointerdown → mousedown → focus →
pointerup → mouseup → click
```

`fireEvent.click` dispatches only the `click` event. This means code that
responds to `mousedown` or `focus` (e.g. tooltip triggers, focus traps) will
not behave as it does in a browser.

**Rule of thumb**: use `userEvent` for everything. Fall back to `fireEvent`
only when you specifically need to test a low-level event in isolation.

```typescript
// Setup once per test (manages internal state for pointer coords etc.)
const user = userEvent.setup();

await user.click(button);
await user.type(input, 'Hello world');
await user.keyboard('{Tab}');
await user.selectOptions(select, 'active');
```

### Testing Behaviour, Not Implementation

**Bad** — tests the class name, which is a styling detail:

```typescript
expect(wrapper.find('.add-task-form__error')).toHaveLength(1);
```

**Good** — tests the accessible error message:

```typescript
expect(screen.getByRole('alert')).toHaveTextContent('at least 2 characters');
```

**Bad** — tests internal state:

```typescript
expect(component.state.isOpen).toBe(true);
```

**Good** — tests what the user sees:

```typescript
expect(screen.getByLabelText('Task title')).toBeInTheDocument();
```

### renderWithProviders

Almost all TaskFlow components depend on at least one of:

- `QueryClientProvider` — TanStack Query cache
- `Provider` (Redux) — filters, sidebar, recently viewed state
- `ThemeProvider` — theme context
- `AuthProvider` — current user context
- `MemoryRouter` — `useParams`, `useNavigate`, `Link`

Without these, `useContext` calls throw or return null. `renderWithProviders`
provides them all in one call:

```typescript
renderWithProviders(<ProjectListItem id="proj-1" name="Website Redesign" ... />);
```

Pass `{ route: '/projects/proj-1' }` to pre-populate URL params:

```typescript
renderWithProviders(<ProjectListItem id="proj-1" ... />, {
  route: '/projects/proj-1',
});
```

### Test QueryClient Configuration

The test `QueryClient` disables retries and sets `gcTime: 0`:

```typescript
new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
})
```

- `retry: false` — failed queries fail immediately instead of retrying 3 times
- `gcTime: 0` — cache entries are garbage collected between tests (no bleed)

### act() Warnings

If you see `Warning: An update to X inside a test was not wrapped in act(...)`,
it usually means an async operation (state update, query result) completed
after the test assertion. Fixes:

1. Use `await user.click(...)` instead of `user.click(...)` without await
2. Use `findBy` instead of `getBy` for async content
3. Wrap explicit state setters in `act(() => { ... })`

Most `userEvent` calls handle this automatically because they return Promises.

### Querying Roles

Prefer role queries — they match accessibility semantics, not DOM structure:

```typescript
screen.getByRole('button', { name: /add task/i })
screen.getByRole('link', { name: /website redesign/i })
screen.getByRole('textbox', { name: /task title/i })
screen.getByRole('alert')
screen.getByRole('listitem')
```

The `name` option matches the element's accessible name:
- For a `<button>`: the visible text content
- For an `<input>`: the associated `<label>` text or `aria-label`
- For an `<a>`: the link text

## File Structure

```
src/
  test/
    setup.ts           ← imports jest-dom matchers
    utils.tsx          ← renderWithProviders helper
  components/
    __tests__/
      ProjectListItem.test.tsx
      TaskStatusButton.test.tsx
      AddTaskForm.test.tsx
      TaskItem.test.tsx
```

## Common Pitfalls

**1. Missing provider throws**

```
Error: useTheme must be used within ThemeProvider
```

Solution: use `renderWithProviders` instead of bare `render`.

**2. Router hooks throw without router**

```
Error: useParams() may be used only in the context of a <Router> component
```

Solution: `renderWithProviders` wraps with `MemoryRouter`. For specific params
pass `{ route: '/projects/proj-1' }`.

**3. Mutation mock not called**

If `vi.fn()` for a mutation callback is not being called, check that the
button click `await` is present and the form submission is completing.

**4. Queries stale between tests**

Each call to `renderWithProviders` creates a fresh `QueryClient`, so query
cache does not bleed between tests.

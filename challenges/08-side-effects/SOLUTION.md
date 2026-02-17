# Challenge 08 — Solution Debrief

## What You Built

Three `useEffect`-driven features layered on top of the existing TaskFlow app:

1. A document title that reflects the current project count.
2. A global keyboard shortcut that opens the "New Project" modal.
3. A success toast that auto-dismisses after 3 seconds.

Each effect demonstrates a different facet of the hook: a simple synchronisation
with the DOM, a mount-only event listener with cleanup, and a timer managed via
state change.

---

## Effect 1 — Document Title

```typescript
useEffect(() => {
  document.title =
    projects.length > 0 ? 'Projects | TaskFlow' : 'Get Started | TaskFlow';
}, [projects.length]);
```

**Dependency array:** `[projects.length]`

Setting `document.title` is a direct DOM mutation — a side effect by React's
definition. The effect re-runs only when `projects.length` changes, so filter
changes and modal open/close do not trigger unnecessary title updates.

No cleanup is needed: `document.title` is a simple assignment. There is nothing
to undo when the component unmounts.

---

## Effect 2 — Keyboard Shortcut

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setShowForm(true);
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []);
```

**Dependency array:** `[]` (empty)

The effect registers a listener once when the component mounts and removes it
when the component unmounts. `setShowForm` is a React state setter — its
identity is stable across renders (React guarantees this), so it does not need
to appear in the dependency array.

The cleanup function must reference the **same** `handleKeyDown` function that
was passed to `addEventListener`. This is why `handleKeyDown` is declared
inside the effect body — both calls share the same reference via closure.

### Strict Mode and double-invoke

In development, `<StrictMode>` causes the sequence:

1. Mount — listener attached.
2. Unmount — cleanup runs, listener removed.
3. Remount — listener attached again.

After step 3 there is exactly one listener, which is correct. If you had
forgotten the cleanup, step 3 would create a second listener and pressing
`Cmd/Ctrl+K` would call `setShowForm(true)` twice.

---

## Effect 3 — Auto-Dismiss Toast

```typescript
const [toastMessage, setToastMessage] = useState<string | null>(null);

useEffect(() => {
  if (toastMessage === null) return;

  const timerId = setTimeout(() => {
    setToastMessage(null);
  }, 3000);

  return () => {
    clearTimeout(timerId);
  };
}, [toastMessage]);
```

**Dependency array:** `[toastMessage]`

The effect fires whenever `toastMessage` changes. When it becomes `null` (the
initial value, or after dismissal) we return early — nothing to schedule.

When it becomes a non-null string, a 3-second timer is started. The cleanup
function calls `clearTimeout` to cancel the timer in two scenarios:

- **The component unmounts** before 3 seconds elapse (e.g. the user navigates
  away). Without cleanup, the `setToastMessage(null)` call inside the timeout
  would fire against an unmounted component — technically harmless in React 18+
  but still a code smell.
- **A second toast fires** before the first expires (e.g. the user adds two
  projects in rapid succession). When `toastMessage` changes again, React calls
  the previous effect's cleanup (cancelling the old timer) before running the
  new effect (starting a fresh 3-second timer from zero).

---

## The Toast Component

`Toast.tsx` is intentionally a **pure display component** — no state, no
effects. It receives a `message` prop and renders it:

```tsx
export function Toast({ message }: { message: string }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">&#10003;</span>
      {message}
    </div>
  )
}
```

Keeping the timer logic in `MainContent` and the rendering in `Toast` is a
deliberate separation of concerns:

- `MainContent` knows *when* to show a toast and *what* message to show.
- `Toast` only knows *how* to display the message.

This makes `Toast` reusable for other message types and trivial to test.

---

## Dependency Array Pitfalls

### Including too many dependencies

If `setShowForm` were listed in Effect 2's dependency array, the effect would
re-run every render (because function identity changes each render, even though
React guarantees state setters are stable). The linter (`eslint-plugin-react-hooks`)
knows about this exception and will not warn you to add stable setters.

### Including too few dependencies

If `projects.length` were omitted from Effect 1's array, the title would only
update once (on mount) and would never reflect subsequent changes. The
exhaustive-deps lint rule exists to catch exactly this mistake.

### No dependency array vs. empty array

```tsx
// Runs after EVERY render — rarely correct
useEffect(() => { document.title = '...'; });

// Runs once on mount — correct for this effect
useEffect(() => { window.addEventListener(...); return () => ...; }, []);
```

Omitting the array entirely is almost always a mistake.

---

## You Might Not Need an Effect

The React team recommends asking "Can this be computed during render?" before
reaching for `useEffect`. In this challenge:

- `filteredProjects` is derived from `projects` and `activeFilter` — computed
  during render, no effect needed.
- `isOverdue` inside `ProjectCard` is derived from `dueDate` — computed during
  render, no effect needed.
- `document.title` depends on `projects.length` but cannot be set during render
  (it is a DOM mutation). An effect is correct here.

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| No cleanup on event listener | Duplicate listeners accumulate on remount | Return `() => window.removeEventListener(...)` |
| No cleanup on `setTimeout` | Stale state update after unmount | Return `() => clearTimeout(timerId)` |
| Handler declared outside effect | `removeEventListener` gets wrong reference | Declare the handler **inside** the effect |
| Empty dep array for title effect | Title set once, never updated | Use `[projects.length]` |
| No dep array at all | Effect runs every render | Add the correct dep array |
| `useEffect` for derived state | Unnecessary double render | Compute during render instead |

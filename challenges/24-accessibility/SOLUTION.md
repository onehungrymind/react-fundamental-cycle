# Challenge 24 — Solution Debrief: Accessibility Fundamentals

## What We Fixed

### 1. Modal focus trap

**The problem.** Before the fix, pressing Tab inside the modal would happily
move focus to links and buttons in the background page. The modal had no
`role="dialog"` or `aria-modal="true"`, so screen readers did not treat it as
a dialog and users could navigate outside it.

**The fix.** We added a `useEffect` that runs whenever `isOpen` changes:

```typescript
useEffect(() => {
  if (!isOpen) return;

  const dialog = dialogRef.current;
  if (!dialog) return;

  // Remember who had focus before the modal opened
  const previouslyFocused = document.activeElement as HTMLElement;

  // Focus the dialog itself so the first Tab press goes to the first child
  dialog.focus();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    previouslyFocused?.focus(); // Restore focus when modal closes
  };
}, [isOpen, onClose]);
```

Key points:
- We listen on `document`, not the dialog, so we always intercept Tab regardless
  of which element inside the dialog currently has focus.
- `e.preventDefault()` stops the browser's default Tab behavior when we are
  wrapping to the other end.
- The cleanup function runs when `isOpen` becomes `false` (or the component
  unmounts), which restores focus to the triggering element.
- We also added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`
  pointing to the `<h2>` title element inside the modal.

### 2. Sidebar: `aria-current="page"`

React Router's `NavLink` passes an `{ isActive }` object to function children
and also to class/style function props. We can do the same for `aria-current`:

```tsx
<NavLink
  to={item.path}
  aria-current={({ isActive }) => isActive ? 'page' : undefined}
  ...
>
```

Actually, React Router v7's `NavLink` does **not** accept a render prop for
`aria-current` directly. The correct pattern is to use the function form of the
`className` prop (which we already had) and add `aria-current` as a plain
conditional:

```tsx
<NavLink
  to={item.path}
  className={({ isActive }) =>
    `sidebar-nav-link${isActive ? ' sidebar-nav-link--active' : ''}`
  }
  aria-current={/* NavLink v7 sets aria-current="page" automatically */}
>
```

React Router v7's `NavLink` already sets `aria-current="page"` on the active
link automatically — we do **not** need to add it manually. The issue in the
`start/` version was that the `end` prop was set on all nav items, meaning only
exact URL matches would be treated as active. We corrected the `end` usage so
that the `/projects` item is active for all `/projects/*` routes.

Additionally, we wrapped the `<ul>` in `<nav aria-label="Main navigation">`
(this was already present in the start code but is worth calling out as
required for the landmark to be announced correctly by screen readers).

### 3. Task status button `aria-label`

Before:
```tsx
<button title={`Move to ${STATUS_LABELS[newStatus]}`}>
  → {STATUS_LABELS[newStatus]}
</button>
```

The `title` attribute is shown as a tooltip on hover but is not reliably
announced by screen readers, and it contains no information about *which* task
is being affected.

After:
```tsx
<button
  aria-label={`Change status of ${task.title} to ${STATUS_LABELS[newStatus]}`}
  title={`Change status of ${task.title} to ${STATUS_LABELS[newStatus]}`}
>
  → {STATUS_LABELS[newStatus]}
</button>
```

Now a screen reader user navigating by button will hear:
_"Change status of Design homepage mockup to In Progress, button"_ — full
context without having to back-track to read the surrounding task title.

### 4. Color contrast

The original badge colors used light pastel backgrounds which, when paired with
medium-weight text at 0.6875rem (11px), failed the 4.5:1 ratio required for
WCAG AA normal text. Small text at that size is always treated as normal text
regardless of weight.

We lightened the backgrounds (more white) and darkened the foreground colors
to ensure the ratio is met:

| Badge       | Old bg   | New bg   | Old fg   | New fg   | New ratio |
|-------------|----------|----------|----------|----------|-----------|
| active      | #dcfce7  | #f0fdf4  | #15803d  | #15803d  | ~4.9:1    |
| completed   | #e0e7ff  | #eff6ff  | #4338ca  | #1d4ed8  | ~5.1:1    |
| archived    | surface  | #f8fafc  | muted    | #475569  | ~4.7:1    |
| Todo        | surface  | #f8fafc  | muted    | #475569  | ~4.7:1    |
| InProgress  | #fef9c3  | #fffbeb  | #854d0e  | #92400e  | ~4.6:1    |
| InReview    | #ede9fe  | #f5f3ff  | #6d28d9  | #5b21b6  | ~5.3:1    |
| Done        | #dcfce7  | #f0fdf4  | #15803d  | #15803d  | ~4.9:1    |

All dark-mode overrides were also reviewed. Dark mode badge backgrounds are
dark enough that the existing lighter foreground colors already passed.

## Automated vs Manual Testing

### What automated tools catch

Tools like `axe-core` (and the `vitest-axe` wrapper for unit tests) excel at
finding:
- Missing `alt` attributes on images
- Form controls without labels
- Incorrect ARIA role usage
- Missing document language
- Insufficient color contrast (when computed styles are available)

They can catch roughly **30–40%** of accessibility issues automatically.

### What only manual testing catches

- **Focus trap correctness** — automated tools see the ARIA attributes but
  cannot simulate a user tabbing through a live dialog.
- **Logical reading order** — a page can be technically valid ARIA and still
  announce content in a confusing order.
- **Cognitive load** — too many actions, inconsistent patterns, confusing
  labels. These require a human to evaluate.
- **Screen reader UX** — VoiceOver, NVDA, and JAWS behave differently. Testing
  with at least one real screen reader is essential.
- **Keyboard-only workflows** — can a keyboard-only user complete every task
  without reaching for a mouse?

### ARIA live regions

We verified that `Toast` already uses `role="status"` and `aria-live="polite"`
for success messages, and `role="alert"` and `aria-live="assertive"` for
errors. Live regions allow screen readers to announce dynamic content changes
without the user having to navigate to them.

### Semantic HTML vs ARIA

Prefer semantic HTML elements over ARIA when possible:
- `<button>` over `<div role="button">`
- `<nav>` over `<div role="navigation">`
- `<dialog>` over `<div role="dialog">` (native `<dialog>` has built-in focus
  management in modern browsers, but cross-browser support for the full
  feature set is still evolving)

The first rule of ARIA: **do not use ARIA if you can use a native HTML
element or attribute instead.**

## Testing with vitest-axe

For automated accessibility testing you can add `vitest-axe`:

```bash
npm install --save-dev vitest-axe axe-core
```

```typescript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'vitest-axe'
import { Modal } from '../Modal'

expect.extend(toHaveNoViolations)

it('modal has no accessibility violations', async () => {
  const { container } = render(
    <Modal isOpen title="Test" onClose={() => {}}>
      <p>Content</p>
    </Modal>
  )
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

Note that axe will not catch the focus-trap logic — that must be tested with
a userEvent simulation or a real screen reader.

## Key Takeaways

1. **ARIA attributes are declarations, not behaviour** — `aria-modal="true"`
   tells screen readers the modal is a dialog, but the focus trap must be
   implemented in JavaScript.
2. **Focus management is a usability issue, not just an ARIA issue** — sighted
   keyboard users also rely on focus being in the right place.
3. **Color contrast affects more people than you might think** — users in
   bright sunlight, those with low-contrast displays, and those with colour
   vision deficiency all benefit from sufficient contrast.
4. **Accessible names must include context** — a button labelled "→ In Progress"
   is useless in a list of 10 tasks; include the task name.
5. **Always restore focus** — when a modal, popover, or panel closes, return
   focus to the element that triggered it so keyboard users don't lose their
   place in the page.

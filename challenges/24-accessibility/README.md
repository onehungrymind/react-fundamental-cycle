# Challenge 24 — Accessibility Fundamentals

## Overview

TaskFlow works well visually, but keyboard and screen-reader users hit several
walls. In this challenge you will audit the application against WCAG 2.1 AA,
document the issues you find, and then fix them one by one.

## Learning Objectives

- Conduct a keyboard-only and screen-reader audit of a React application
- Implement a focus trap in a modal dialog
- Use ARIA roles, properties, and live regions correctly
- Fix color contrast failures to meet WCAG AA (4.5:1 for normal text)
- Appreciate the difference between automated and manual accessibility testing

## Known Issues in `start/`

The following accessibility problems are present — your job is to fix them:

### 1. Modal: no focus trap, no Escape key, missing ARIA attributes

Open any project, click a task to open the task detail, then press **Tab**.
Focus escapes to the background page. Pressing **Escape** does nothing.
The modal element is missing `role="dialog"`, `aria-modal="true"`, and
`aria-labelledby`.

### 2. Sidebar: no `aria-current` on the active link

Screen readers cannot tell which nav item is the current page because no
`aria-current="page"` attribute is set on the active `<NavLink>`.

### 3. Task status buttons: no descriptive `aria-label`

The status transition buttons say "→ In Progress" etc., but do not include the
task title in their accessible name. A screen reader user navigating by button
cannot tell which task each button belongs to.

### 4. Color contrast failures in status badges

Several badge color combinations fail the WCAG AA contrast ratio of 4.5:1:

| Badge class              | Background | Foreground | Approx ratio |
|--------------------------|-----------|-----------|--------------|
| `.status-badge--active`  | `#dcfce7` | `#15803d` | ~4.1:1       |
| `.status-badge--InProgress` | `#fef9c3` | `#854d0e` | ~4.2:1    |
| others may also fail     |           |           |              |

## Tasks

### Task 1 — Audit and document issues

Open `start/` (`npm install && npm run dev`) and perform a manual audit:

1. Navigate the entire app using only the **Tab** / **Shift+Tab** keys.
2. Note every place where focus is lost, trapped incorrectly, or not visible.
3. Open the modal and verify focus management.
4. Use the browser DevTools accessibility tree to check ARIA attributes.
5. Use a contrast checker tool on each badge color.

Document your findings — you will fix them in the following tasks.

### Task 2 — Fix the Modal component

File: `src/components/Modal.tsx`

Requirements:
- Add `role="dialog"` and `aria-modal="true"` to the dialog container.
- Add `aria-labelledby` pointing to the modal title element's `id`.
- When the modal opens, **trap focus** inside it (Tab and Shift+Tab should
  cycle through focusable elements within the dialog only).
- Pressing **Escape** must call `onClose`.
- When the modal closes, return focus to the element that was focused before
  the modal opened.

Focus trap implementation notes:
- Query all focusable elements inside the dialog:
  `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
- On Tab: if focus is on the last focusable element, wrap to the first.
- On Shift+Tab: if focus is on the first focusable element, wrap to the last.
- Store `document.activeElement` before opening; restore it on close.

### Task 3 — Fix the Sidebar

File: `src/components/Sidebar.tsx`

Requirements:
- Wrap the nav list in `<nav aria-label="Main navigation">`.
- The active `<NavLink>` must have `aria-current="page"`.
  React Router's `NavLink` accepts a function for the `aria-current` prop.

### Task 4 — Fix task status buttons

File: `src/components/TaskStatusButton.tsx`

Requirements:
- Each button must have an `aria-label` that names both the action and the
  task it affects, e.g. `"Change status of Design homepage mockup to In Progress"`.
- This requires passing the task title to `TaskStatusButton` (it already has
  access to the full `task` object, so `task.title` is available).

File: `src/components/TaskItem.tsx`

The delete button already has a correct `aria-label` (`"Delete task: {title}"`).
No changes needed there, but verify it is present.

### Task 5 — Fix color contrast

File: `src/App.css` (or `src/index.css`)

Update badge colors so every combination meets the WCAG AA 4.5:1 ratio for
normal text (font-size < 18px or < 14px bold):

| Badge              | Suggested background | Suggested foreground |
|--------------------|---------------------|---------------------|
| `--active`         | `#f0fdf4`           | `#15803d`           |
| `--completed`      | `#eff6ff`           | `#1d4ed8`           |
| `--archived`       | `#f8fafc`           | `#475569`           |
| `--InProgress`     | `#fffbeb`           | `#92400e`           |
| `--InReview`       | `#f5f3ff`           | `#5b21b6`           |
| `--Done`           | `#f0fdf4`           | `#15803d`           |
| `--Todo`           | `#f8fafc`           | `#475569`           |

Verify each combination with a contrast checker before committing.

## Acceptance Criteria

- [ ] Tabbing into an open modal never moves focus outside the dialog
- [ ] Pressing Escape closes the modal and returns focus to the trigger
- [ ] Screen reader announces `aria-current="page"` on the active nav link
- [ ] Each status button's accessible name includes the associated task title
- [ ] All badge color combinations pass WCAG AA contrast (4.5:1)
- [ ] All existing tests still pass (`npm test`)

## Running the App

```bash
cd start   # or solution
npm install
npm run dev
```

## Running Tests

```bash
npm test
```

## Further Reading

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide — Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN: Using ARIA: Roles, States, and Properties](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

# Challenge 07 — Component Composition & Children

## Overview

React components become truly reusable when they accept **children** instead of
encoding every detail in props. In this challenge you will build three generic
container components — `Card`, `Modal`, and `PageLayout` — and refactor the
existing components to use them.

You will practice:

- Accepting `children: React.ReactNode` in prop interfaces
- Composing UI from generic containers rather than hardcoding markup
- Using `ReactDOM.createPortal` to render a modal outside the component tree
- Stopping event bubbling with `e.stopPropagation()`

---

## Learning Objectives

1. Define prop interfaces that include `children: React.ReactNode`.
2. Build a `Card` component with optional `title` and `footer` slots.
3. Refactor `ProjectCard` to use `Card` internally.
4. Build a `Modal` component that uses `ReactDOM.createPortal`.
5. Move the "Add Project" form from inline to inside a `Modal`.
6. Build a `PageLayout` component that provides a consistent page structure.
7. Use `PageLayout` inside `MainContent`.

---

## Starting Point

The `start/` directory is the solution from Challenge 06. It already:

- Renders 5 projects with filtering (All / Active / Completed / Archived)
- Has a working `AddProjectForm` that renders **inline** inside `MainContent`
- Has `ProjectCard` with its own card styling

There is **no `Card` component**, **no `Modal` component**, and **no
`PageLayout` component** yet. Your job is to build them.

Run the start app to verify it works before you begin:

```bash
cd start
npm install
npm run dev
```

---

## Your Tasks

Work inside `start/src/`. You may edit any file.

### 1 — Create `src/components/Card.tsx`

Build a generic card container:

```ts
interface CardProps {
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

Render structure:

```tsx
<div className={`card${className ? ' ' + className : ''}`}>
  {title && <div className="card-header"><h3>{title}</h3></div>}
  <div className="card-body">{children}</div>
  {footer && <div className="card-footer">{footer}</div>}
</div>
```

### 2 — Refactor `ProjectCard` to use `Card`

`ProjectCard` currently renders its own `<article className="project-card">`.
Refactor it so it uses `<Card>` internally. The `footer` prop is a good slot
for the meta row (task count, due date, overdue indicator). The `title` prop
can hold the project name, and the `children` can be the description.

The status badge can be placed in the header by composing a custom title node
or by passing it as part of `children`.

### 3 — Create `src/components/Modal.tsx`

```ts
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

Requirements:

- Only render anything when `isOpen` is `true`.
- Use `ReactDOM.createPortal(content, document.body)` to render outside the
  normal React tree.
- The backdrop (`div.modal-backdrop`) covers the full viewport. Clicking it
  calls `onClose`.
- The dialog (`div.modal-dialog`) is centred. Clicking it calls
  `e.stopPropagation()` so backdrop clicks do not bubble.
- Include a close button (`button.modal-close`) in the header that calls
  `onClose`.

### 4 — Update `MainContent.tsx`

- Replace the inline `<AddProjectForm>` with a `<Modal>` that wraps it.
- The "New Project" button always stays visible (it was hidden while the form
  was open — remove that logic).
- `showForm` now controls `isOpen` on the `<Modal>`.
- Passing `onCancel={() => setShowForm(false)}` to `AddProjectForm` also closes
  the modal.

### 5 — Create `src/components/PageLayout.tsx`

```ts
interface PageLayoutProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}
```

Render a `div.page-layout` with:

- A `div.page-header` containing an `h2` for the title and a
  `div.page-actions` for any `actions`.
- The `children` below.

### 6 — Use `PageLayout` in `MainContent`

Wrap the contents of `MainContent` with `<PageLayout>`, passing the "Projects"
title and the "New Project" button as `actions`.

---

## Acceptance Criteria

- [ ] `Card` renders children with an optional title and optional footer
- [ ] `ProjectCard` uses `Card` internally — no duplicate card markup
- [ ] Clicking "New Project" opens a `Modal` containing `AddProjectForm`
- [ ] Clicking the modal backdrop closes the modal
- [ ] Clicking inside the modal dialog does **not** close it
- [ ] Clicking the X button closes the modal
- [ ] After a successful form submission the modal closes and the project appears
- [ ] `PageLayout` wraps `MainContent`'s content with a consistent header
- [ ] All components are typed with `children: React.ReactNode`
- [ ] No TypeScript errors (`npm run build` passes)

---

## Key Concepts

### `children` prop

Any JSX placed between a component's opening and closing tags is passed as the
`children` prop:

```tsx
<Card title="Hello">
  <p>This paragraph is children.</p>
</Card>
```

Type it as `React.ReactNode` — the widest type that covers strings, elements,
arrays, null, and undefined.

### Named slots via props

When you need more than one "slot" (e.g. a footer in addition to a body), use
additional props typed as `React.ReactNode`:

```tsx
<Card title="Summary" footer={<button>Save</button>}>
  <p>Body content here.</p>
</Card>
```

### `ReactDOM.createPortal`

Portals let you render a subtree into a different DOM node than the component's
parent. This is the standard approach for modals because it lets the overlay
sit on top of everything regardless of CSS stacking context:

```tsx
import ReactDOM from 'react-dom'

return ReactDOM.createPortal(
  <div className="modal-backdrop">...</div>,
  document.body
)
```

### Event bubbling through React tree

Even though the portal's DOM node is outside the component tree, React events
still bubble through the **React** tree (not the DOM tree). Use
`e.stopPropagation()` on the dialog element so clicks inside it do not reach
the backdrop's `onClick` handler.

---

## Running the App

```bash
cd start
npm install
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

To check the TypeScript build:

```bash
npm run build
```

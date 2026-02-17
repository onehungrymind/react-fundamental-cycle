# Challenge 02 — JSX & Component Fundamentals

## Overview

**TaskFlow** is still a single-file app. Your job is to break it into four focused
components and compose them with a CSS Grid layout.

---

## What You Will Build

A multi-component layout with a persistent header, sidebar navigation, main content
area, and footer — each living in its own file.

```
┌────────────────────────────────────────┐
│              Header                    │
├──────────────┬─────────────────────────┤
│              │                         │
│   Sidebar    │      MainContent        │
│              │                         │
├──────────────┴─────────────────────────┤
│              Footer                    │
└────────────────────────────────────────┘
```

---

## Tasks

1. Create `src/components/Header.tsx`
   - Renders a `<header>` element
   - Contains the TaskFlow logo text (`<h1>TaskFlow</h1>`) and a placeholder `<nav>`

2. Create `src/components/Sidebar.tsx`
   - Renders an `<aside>` element
   - Contains a `<nav>` with three hardcoded links: Dashboard, Projects, Team

3. Create `src/components/MainContent.tsx`
   - Renders a `<main>` element
   - Contains a welcome heading and a short descriptive paragraph

4. Create `src/components/Footer.tsx`
   - Renders a `<footer>` element
   - Contains the "Built with React + TypeScript" credit line

5. Update `src/App.tsx`
   - Import all four components
   - Remove the inline JSX and compose the components instead
   - Use a CSS Grid layout (see `App.css`)

6. Update `src/App.css`
   - Add a CSS Grid layout using `grid-template-areas`:
     ```
     "header  header"
     "sidebar main"
     "footer  footer"
     ```

---

## Acceptance Criteria

- Each component lives in its own file inside `src/components/`
- `App.tsx` imports and renders all four components
- The layout is visually correct: header spans full width, sidebar left, main right, footer spans full width
- All components use the correct semantic HTML element (`<header>`, `<aside>`, `<main>`, `<footer>`)
- Every component uses a **named export** (e.g. `export function Header()`)
- No single component exceeds **30 lines** of JSX
- `npm run build` passes with zero TypeScript errors

---

## Common Gotchas

| Mistake | Correct |
|---|---|
| `class="..."` | `className="..."` |
| Multiple root elements | Wrap in `<div>` or `<>...</>` |
| `<input>` without closing | `<input />` |
| Default-only export | Add named export too |
| Forgetting to import the component | Add `import { Header } from './components/Header'` |

---

## Hints

- JSX is **not** HTML. Attributes follow camelCase (`onClick`, `tabIndex`) and
  every tag must be explicitly closed.
- A component file **must** return a **single root element**. Use a React Fragment
  (`<>...</>`) when you need multiple siblings without an extra DOM node.
- File names for components conventionally match the component name exactly:
  `Header.tsx` exports `Header`.
- Named exports keep the name consistent across the codebase and work better with
  IDE auto-import.

---

## Running the App

```bash
cd start/
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the starting point.

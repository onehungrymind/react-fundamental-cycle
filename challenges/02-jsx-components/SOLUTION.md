# Challenge 02 — Solution & Debrief

## Complete Solution

### `src/components/Header.tsx`

```tsx
export function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="header-title">TaskFlow</h1>
      </div>
      <nav className="header-nav" aria-label="Primary navigation">
        <span className="header-nav-placeholder">Nav goes here</span>
      </nav>
    </header>
  )
}

export default Header
```

### `src/components/Sidebar.tsx`

```tsx
export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav aria-label="Sidebar navigation">
        <ul className="sidebar-nav-list">
          <li>
            <a href="#dashboard" className="sidebar-nav-link sidebar-nav-link--active">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#projects" className="sidebar-nav-link">
              Projects
            </a>
          </li>
          <li>
            <a href="#team" className="sidebar-nav-link">
              Team
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
```

### `src/components/MainContent.tsx`

```tsx
export function MainContent() {
  return (
    <main className="app-main">
      <div className="main-inner">
        <h2 className="main-heading">Welcome to TaskFlow</h2>
        <p className="main-description">
          Select a project from the sidebar to get started, or create a new one.
        </p>
      </div>
    </main>
  )
}

export default MainContent
```

### `src/components/Footer.tsx`

```tsx
export function Footer() {
  return (
    <footer className="app-footer">
      <p>Built with React + TypeScript</p>
    </footer>
  )
}

export default Footer
```

### `src/App.tsx`

```tsx
import './App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { Footer } from './components/Footer'

export function App() {
  return (
    <div className="app-grid">
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  )
}

export default App
```

### `src/App.css` (key grid rules)

```css
.app-grid {
  display: grid;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr var(--footer-height);
  min-height: 100vh;
}

.app-header  { grid-area: header;  }
.app-sidebar { grid-area: sidebar; }
.app-main    { grid-area: main;    }
.app-footer  { grid-area: footer;  }
```

---

## Debrief

### JSX is not HTML

JSX is syntactic sugar for `React.createElement()` calls. The browser never sees JSX —
Vite compiles it to regular JavaScript before shipping. Because JSX is JavaScript, it
follows JS naming rules:

- `class` is a reserved word → use `className`
- `for` (on `<label>`) is a reserved word → use `htmlFor`
- Event handlers are camelCase: `onClick`, `onChange`, `onSubmit`
- All tags must close: `<br />`, `<img />`, `<input />`

### File and Component Naming

| Convention | Reason |
|---|---|
| `PascalCase.tsx` for component files | Matches the component name; makes IDE auto-import reliable |
| Named export (`export function Foo`) | Name is locked at definition; IDE finds it even before importing |
| Default export too | Lets consumers choose either import style |

React itself doesn't care about file names — Vite does when resolving modules, and your
team will when reading code.

### Why Named Exports?

```tsx
// Named — always called Header, easy to auto-import
import { Header } from './components/Header'

// Default — caller chooses the name (can lead to drift)
import Hdr from './components/Header'  // valid but inconsistent
```

For a component library, named exports are safer. This workshop uses them everywhere.

### Single Root Element

Every component's `return` must yield **one root element**. Two common solutions:

```tsx
// Option 1: wrap in a div (adds a real DOM node)
return (
  <div>
    <h1>Title</h1>
    <p>Text</p>
  </div>
)

// Option 2: React Fragment (no DOM node)
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
)
```

Use Fragment when the extra `<div>` would break your CSS layout (e.g. inside a grid or
flexbox container).

### CSS Grid `grid-template-areas`

This challenge uses the named-area syntax because it makes the intended layout obvious
at a glance:

```css
grid-template-areas:
  "header  header"
  "sidebar main"
  "footer  footer";
```

Each child claims its area with a single declaration (`grid-area: header`). No
fiddling with column/row numbers.

---

## Alternate Approaches

### CSS Modules

Instead of global class names, each component imports its own `.module.css`:

```tsx
// Header.tsx
import styles from './Header.module.css'

export function Header() {
  return <header className={styles.header}>...</header>
}
```

The build tool scopes the class names automatically, preventing collisions.

### Tailwind CSS

Utility-first — no separate CSS files, classes live directly in JSX:

```tsx
export function Header() {
  return (
    <header className="flex items-center h-16 px-6 border-b border-gray-200">
      <h1 className="text-xl font-bold">TaskFlow</h1>
    </header>
  )
}
```

---

## Stretch Challenges

1. **Add a logo icon** — place an SVG in `src/assets/` and import it into `Header.tsx`.
2. **Active link state** — add a prop `activePage: string` to `Sidebar` and highlight
   the matching link with a different class.
3. **Responsive sidebar** — collapse the sidebar to a narrow icon bar on small screens
   using a CSS `@media` query inside `App.css`.
4. **CSS Modules** — migrate each component's styles to a `.module.css` file and
   remove all global class names from `App.css`.

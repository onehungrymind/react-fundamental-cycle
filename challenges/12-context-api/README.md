# Challenge 12 — Context API & Prop Drilling Solutions

## What you will build

Add two React contexts to the TaskFlow app:

1. **ThemeContext** — provides `"light" | "dark"` theme state and a `toggleTheme` function. A toggle button in the Header switches the theme and updates CSS custom properties on `<html>` via a `data-theme` attribute.

2. **AuthContext** — provides the current user `{ id, name, avatarUrl }` and `login` / `logout` functions. The Header shows the signed-in user's avatar and name. Authentication is simulated with local state (no server).

Both contexts expose **custom hooks** (`useTheme`, `useAuth`) that throw descriptive errors when used outside their providers, making misuse obvious at development time.

## Learning objectives

- Creating a context with `createContext`, a typed value interface, and `null` as the default
- Wrapping the app with `<Provider>` components at the root
- Memoizing provider value objects with `useMemo` and `useCallback` to prevent unnecessary re-renders
- Writing `useTheme()` / `useAuth()` helper hooks that throw if called outside a provider
- Applying CSS custom properties (design tokens) from a `data-theme` attribute for light/dark mode
- Understanding when Context is the right tool vs. when to reach for an external state library

## Starting point

The `start/` directory is derived from Challenge 11's solution. It has:

- Full master-detail routing (nested `<Outlet />` at three levels)
- A hardcoded `Header` that shows "Sarah Chen" and no theme support
- No context, no providers
- All CSS already uses `var(--color-*)` design tokens — adding dark mode is purely a CSS layer

**No context exists in the starting point. The Header hardcodes user info and has no theme toggle.**

## Your tasks

### 1. Create `src/context/ThemeContext.tsx`

- Define `ThemeContextValue` interface: `{ theme: "light" | "dark"; toggleTheme: () => void }`
- Create `ThemeContext` with `createContext<ThemeContextValue | null>(null)`
- `ThemeProvider`:
  - Stores `theme` in `useState<"light" | "dark">("light")`
  - `toggleTheme` is memoized with `useCallback`
  - Provider value is memoized with `useMemo`
  - A `useEffect` sets `document.documentElement.setAttribute("data-theme", theme)` whenever `theme` changes
- `useTheme()` custom hook:
  - Reads context with `useContext(ThemeContext)`
  - Throws `new Error("useTheme must be used within ThemeProvider")` if context is `null`
  - Returns the context value

### 2. Create `src/context/AuthContext.tsx`

- Define `User` interface: `{ id: string; name: string; avatarUrl: string }`
- Define `AuthContextValue` interface: `{ user: User | null; login: (user: User) => void; logout: () => void }`
- Create `AuthContext` with `createContext<AuthContextValue | null>(null)`
- `AuthProvider`:
  - Stores `user: User | null` in `useState`
  - Initialises with the `DEFAULT_USER` so the app starts "logged in":
    ```ts
    const DEFAULT_USER: User = {
      id: "tm-1",
      name: "Sarah Chen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    };
    ```
  - `login` and `logout` are memoized with `useCallback`
  - Provider value is memoized with `useMemo`
- `useAuth()` custom hook:
  - Throws `new Error("useAuth must be used within AuthProvider")` if context is `null`
  - Returns the context value

### 3. Update `src/App.tsx`

Wrap the `<BrowserRouter>` tree with both providers:

```tsx
<ThemeProvider>
  <AuthProvider>
    <BrowserRouter>…</BrowserRouter>
  </AuthProvider>
</ThemeProvider>
```

### 4. Update `src/components/Header.tsx`

- Call `useTheme()` to get `theme` and `toggleTheme`
- Call `useAuth()` to get `user`
- Render a theme toggle button (☀️ / 🌙 or "Light" / "Dark") that calls `toggleTheme`
- If `user !== null`, render the user's avatar (`<img>`) and name
- If `user === null`, render a "Sign In" button that calls `login(DEFAULT_USER)` (for demo purposes you can import the constant or pass it inline)

### 5. Update `src/index.css`

Add `[data-theme="dark"]` CSS variable overrides on `:root` so dark mode activates when `ThemeProvider` sets the attribute:

```css
[data-theme="dark"] {
  --color-bg: #111827;
  --color-heading: #f9fafb;
  --color-text: #d1d5db;
  --color-text-muted: #9ca3af;
  --color-border: #1f2937;
  --color-accent: #818cf8;
  --color-accent-hover: #a5b4fc;
  --color-surface: #1f2937;
  --color-surface-hover: #374151;
}
```

Also add corresponding dark-mode variants for the status badges and other elements that use hardcoded colours.

## CSS hints for the Header

```css
/* Theme toggle button */
.header-theme-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.375rem 0.625rem;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-text);
  transition: background-color 0.15s ease;
}

.header-theme-btn:hover {
  background-color: var(--color-surface-hover);
}

/* User area */
.header-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
}

.header-user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}
```

## Acceptance criteria

- [ ] Clicking the theme toggle in the Header switches between light and dark mode
- [ ] The `data-theme` attribute on `<html>` changes between `"light"` and `"dark"`
- [ ] All `var(--color-*)` tokens update — no hardcoded colours remain in light/dark text
- [ ] The Header shows the logged-in user's avatar and name
- [ ] Calling `useTheme()` outside `ThemeProvider` throws a descriptive error
- [ ] Calling `useAuth()` outside `AuthProvider` throws a descriptive error
- [ ] Provider values are memoized (`useMemo`) — no new object on every render
- [ ] TypeScript strict mode — no `any`

## Key concepts

### Why `createContext(null)` not `createContext(defaultValue)`?

Providing a real default value would silently allow components to use the context outside a provider. Using `null` as the default and throwing in the custom hook makes the bug visible immediately.

### Context is not a replacement for all state

Context is ideal for:
- Cross-cutting concerns: theme, locale, auth
- Values read by many components at different tree depths
- Avoiding prop drilling through 3+ layers

Reach for Zustand/Redux when:
- State is frequently updated by many components (context re-renders all consumers)
- You need time-travel debugging
- The state is large and only subsets are needed

### Memoizing provider value

```tsx
// Without memoization: new object on EVERY render → all consumers re-render
return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>

// With memoization: stable reference unless theme or toggleTheme change
const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
```

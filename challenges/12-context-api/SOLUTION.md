# Challenge 12 — Solution Debrief

## What changed

This challenge added two React contexts — `ThemeContext` and `AuthContext` — to eliminate prop drilling for cross-cutting concerns and to introduce the canonical pattern for global UI state in a React app without an external state library.

---

## New files

| File | Purpose |
|---|---|
| `src/context/ThemeContext.tsx` | Theme state + toggle, `useTheme()` hook |
| `src/context/AuthContext.tsx` | Auth state + login/logout, `useAuth()` hook |

## Modified files

| File | Change |
|---|---|
| `src/App.tsx` | Wrapped tree with `<ThemeProvider>` and `<AuthProvider>` |
| `src/components/Header.tsx` | Uses `useTheme()` and `useAuth()` |
| `src/index.css` | Added `[data-theme="dark"]` CSS variable overrides |

---

## Why `createContext(null)` — the null pattern

A React context always has a default value. You might think providing a real default avoids the need for error throwing:

```tsx
// Anti-pattern: silent failure — looks like it works, returns stale data
const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});
```

The problem: if a component calls `useTheme()` outside `<ThemeProvider>`, it silently gets the default value. The toggle button appears to work but nothing actually changes. The bug is invisible.

The null pattern:

```tsx
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

Now misuse throws immediately with a clear message. This is the standard pattern in production codebases (React Query, Chakra UI, etc.).

---

## Memoizing provider value

Without memoization, every render of `ThemeProvider` creates a new object reference for `value`, causing every context consumer to re-render even if `theme` did not change:

```tsx
// Re-creates {theme, toggleTheme} on every render → all consumers re-render
return (
  <ThemeContext.Provider value={{ theme, toggleTheme }}>
    {children}
  </ThemeContext.Provider>
);
```

With `useMemo`:

```tsx
const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
```

`value` only changes when `theme` or `toggleTheme` changes. Since `toggleTheme` is wrapped in `useCallback`, it is stable across renders. So the provider value only changes when the theme actually switches — which is exactly when consumers should re-render.

---

## `useCallback` for stable function references

```tsx
const toggleTheme = useCallback(
  () => setTheme(prev => (prev === "light" ? "dark" : "light")),
  []  // no dependencies — setTheme is stable
);
```

`useCallback` with an empty dependency array gives a stable function reference across renders. This matters because `toggleTheme` is in the `useMemo` dependency array for the provider value. Without `useCallback`, `toggleTheme` would be a new function on every render, defeating the `useMemo`.

---

## CSS variable switching via `data-theme`

Rather than applying class names or inline styles, the theme is driven by a `data-theme` attribute on `<html>`:

```tsx
useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);
```

CSS then overrides the design tokens using an attribute selector:

```css
:root {
  --color-bg: #ffffff;
  /* ... light mode tokens */
}

[data-theme="dark"] {
  --color-bg: #111827;
  /* ... dark mode tokens */
}
```

This approach:
- Requires zero changes to any component — they all use `var(--color-*)` already
- Eliminates the need to pass a class name to every node
- Is compatible with server-side rendering (the attribute can be set on the server)
- Works with `prefers-color-scheme` as a fallback

---

## Multiple contexts — composition pattern

Two separate providers compose cleanly:

```tsx
<ThemeProvider>
  <AuthProvider>
    <BrowserRouter>…</BrowserRouter>
  </AuthProvider>
</ThemeProvider>
```

There is no single "god context" that holds all global state. Each context is narrowly scoped to one concern. This means:

- A theme change does not re-render auth consumers (and vice versa)
- Each context can be tested in isolation
- Each provider can be moved or replaced independently

---

## Context is not state management

Context is a **delivery mechanism** — it makes a value available anywhere in the tree without prop drilling. It is not a replacement for Zustand, Redux, or Jotai.

**Context is a good fit when:**
- The value changes infrequently (theme, locale, auth)
- Many components at different depths need the same value
- You want to avoid passing props through 3+ intermediate layers

**Reach for Zustand/Redux when:**
- The value is a large list updated by many components (shopping cart, notifications)
- You need fine-grained subscriptions (only re-render the parts that changed)
- You need time-travel debugging or serializable state
- Multiple unrelated slices of state need coordinated updates

---

## What is NOT shown (intentionally deferred)

- **Persisting theme preference** — storing the user's choice in `localStorage` so it survives a page refresh (Challenge 14 covers `useEffect` side effects in more depth)
- **Real authentication** — JWT tokens, refresh logic, protected routes (covered if the workshop includes an auth-specific challenge)
- **Context performance at scale** — splitting a large context into smaller atoms (Jotai) or using `useContextSelector` (a community library)
- **Server-side rendering** — passing the initial theme from the server to avoid a flash of unstyled content

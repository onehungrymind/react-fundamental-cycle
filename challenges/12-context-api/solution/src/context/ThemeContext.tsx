import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// ============================================================
// Types
// ============================================================

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// ============================================================
// Context
// ============================================================

// Use null as the default so useTheme() can detect when the provider is absent.
// Providing a real default would silently allow components to skip the provider,
// making bugs invisible until runtime.
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ============================================================
// Provider
// ============================================================

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // toggleTheme is memoized with useCallback so its reference stays stable
  // across renders.  This matters because it is included in the useMemo
  // dependency array below — an unstable reference would defeat memoization.
  const toggleTheme = useCallback(
    () => setTheme(prev => (prev === 'light' ? 'dark' : 'light')),
    [], // setTheme is stable (guaranteed by React)
  );

  // Sync the data-theme attribute on <html> whenever theme changes.
  // CSS uses [data-theme="dark"] attribute selectors to override design tokens.
  // This approach keeps styling concerns in CSS, not in component logic.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Memoize the context value so consumers only re-render when theme
  // or toggleTheme actually changes — not on every ThemeProvider render.
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================
// Custom hook
// ============================================================

// useTheme() throws a descriptive error when called outside a ThemeProvider.
// This makes misuse obvious at development time rather than silently returning
// a stale default value.
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

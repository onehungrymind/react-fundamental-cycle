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
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ============================================================
// Provider
// ============================================================

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(
    () => setTheme(prev => (prev === 'light' ? 'dark' : 'light')),
    [],
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

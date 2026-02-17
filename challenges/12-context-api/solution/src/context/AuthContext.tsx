import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// ============================================================
// Types
// ============================================================

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// ============================================================
// Default user
// ============================================================

// The app starts "logged in" as Sarah Chen so the Header immediately shows
// a user without requiring the learner to interact with a login flow.
// In a real app this would come from a stored token or server session.
export const DEFAULT_USER: User = {
  id: 'tm-1',
  name: 'Sarah Chen',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
};

// ============================================================
// Context
// ============================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================
// Provider
// ============================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Start logged in as the default user so the app is immediately usable.
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  // login and logout are memoized so they are excluded from re-render triggers
  // when included in the provider value's useMemo dependency array.
  const login = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Memoize the context value.  Without this, every render of AuthProvider
  // would produce a new object reference, causing all consumers to re-render
  // even when user, login, and logout have not changed.
  const value = useMemo<AuthContextValue>(
    () => ({ user, login, logout }),
    [user, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// Custom hook
// ============================================================

// useAuth() throws a descriptive error when called outside an AuthProvider.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

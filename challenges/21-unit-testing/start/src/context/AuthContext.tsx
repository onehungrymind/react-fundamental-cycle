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
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  const login = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

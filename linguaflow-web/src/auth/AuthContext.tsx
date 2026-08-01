import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setAuthToken, setUnauthorizedHandler } from '../api/client';
import { authApi } from '../api/endpoints';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../api/types';

// The JWT lives in localStorage so the login persists across browser restarts (not just
// page reloads). It's cleared on explicit logout or on a 401 from the API.
const STORAGE_KEY = 'linguaflow.auth';

interface AuthState {
  user: AuthResponse | null;
  token: string | null;
  login: (dto: LoginRequest) => Promise<void>;
  register: (dto: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function load(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(load);

  // Keep the client's token in sync SYNCHRONOUSLY during render, before any child
  // renders or effects run — so the first authenticated request already has the token.
  setAuthToken(user?.token ?? null);

  // Register the 401 → logout handler once.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
      setUser(null);
    });
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      token: user?.token ?? null,
      async login(dto) {
        const res = await authApi.login(dto);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
        setAuthToken(res.token);
        setUser(res);
      },
      async register(dto) {
        const res = await authApi.register(dto);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
        setAuthToken(res.token);
        setUser(res);
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY);
        setAuthToken(null);
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

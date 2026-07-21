import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CurrentUser } from "../types/user";
import * as authApi from "../lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: CurrentUser | null;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      isLoading,
      user,
      loginWithGoogle: async (credential: string) => {
        const loggedInUser = await authApi.loginWithGoogle(credential);
        setUser(loggedInUser);
      },
      logout: async () => {
        await authApi.logout();
        setUser(null);
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

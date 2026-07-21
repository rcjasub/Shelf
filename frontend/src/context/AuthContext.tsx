import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CurrentUser } from "../types/user";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: CurrentUser;
  login: () => void;
  logout: () => void;
}

const DEFAULT_USER: CurrentUser = {
  name: "Maren Cole",
  handle: "@marencole",
  initials: "MC",
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user: DEFAULT_USER,
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false),
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

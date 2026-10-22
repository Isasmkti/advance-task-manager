"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/token";
import type { HeroProgress, User } from "@/types";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setProgress: (progress: HeroProgress) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Pulihkan sesi dari token yang tersimpan.
  useEffect(() => {
    if (!tokenStorage.get()) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    tokenStorage.set(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    // Zona waktu browser dipakai server untuk menentukan pergantian hari streak.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await authApi.register({ name, email, password, timezone });
    tokenStorage.set(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Token mungkin sudah tidak valid; tetap bersihkan sesi lokal.
    }
    tokenStorage.clear();
    setUser(null);
  }, []);

  const setProgress = useCallback((progress: HeroProgress) => {
    setUser((current) => (current ? { ...current, ...progress } : current));
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setProgress }),
    [user, loading, login, register, logout, setProgress],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

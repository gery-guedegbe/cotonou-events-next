"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AdminAuthValue {
  authed: boolean;
  ready: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const KEY = "cotonou_admin_authed";
const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used within <AdminAuthProvider>");
  return ctx;
}

/**
 * Auth de démonstration côté client. En production, remplacer par Supabase Auth
 * (createBrowserClient + supabase.auth.signInWithPassword) et un middleware de
 * protection de route.
 */
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      // Lecture ponctuelle au montage : sessionStorage est indisponible côté serveur,
      // donc impossible à lire via un état initial paresseux sans provoquer un mismatch d'hydratation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthed(sessionStorage.getItem(KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = (email: string, password: string) => {
    if (email.trim() && password.trim()) {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
  };

  return (
    <AdminAuthContext.Provider value={{ authed, ready, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

"use client";

import { createContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/config";

/* ================= TYPES ================= */

export type User = {
  name?: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "AGENT";
  id: string;
};

export type Company = {
  companyName?: string;
  companyEmail?: string;
  logoUrl?: string;
}

type LoginPayload = {
  username: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "AGENT";
};

type AuthContextType = {
  user: User | null;
  company: Company | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshCompany: () => Promise<void>;
};

/* ================= CONTEXT ================= */

export const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);

  /* ===== Fetch current user ===== */
  // On a hard refresh this is the only source of truth for restoring the
  // session (React state doesn't survive a reload). A genuine 401/403 means
  // the user really isn't authenticated. Anything else — a network blip, the
  // backend mid-restart, a transient 5xx — is retried a couple of times
  // before giving up, so a refresh during a brief server hiccup doesn't look
  // like the user got logged out.
  const fetchMe = async (attempt = 0): Promise<void> => {
    try {
      const res = await fetch(API_ENDPOINTS.ME, {
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        setUser(null);
        return;
      }

      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}`);
      }

      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
        return fetchMe(attempt + 1);
      }
      setUser(null);
    }
  };


  /* ===== Fetch Company Details ===== */
  const fetchCompany = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_COMPANY_SETTINGS);
      if (!res.ok) throw new Error("Failed to fetch company");

      const data = await res.json();
      setCompany(data ?? null);
    } catch {
      setCompany(null);
    }
  };

  /* ===== On first load ===== */
  // useEffect(() => {
  //   (async () => {
  //     await fetchMe();
  //     setLoading(false);
  //   })();
  // }, []);
  useEffect(() => {
    (async () => {
      await fetchMe();
      await fetchCompany(); // ✅ add this
      setLoading(false);
    })();
  }, []);

  /* ===== Login ===== */
  const login = async ({ username, password, role }: LoginPayload) => {
    const res = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    if (!res.ok) {
      let body: any = null;
      try { body = await res.json(); } catch { /* ignore */ }
      const msg =
        (body && typeof body.message === "string" && body.message) ||
        (res.status === 401 ? "Invalid credentials" : `Login failed (${res.status})`);
      throw new Error(msg);
    }

    // 🔑 IMPORTANT: re-fetch /me after cookie is set
    await fetchMe();
  };

  /* ===== Logout ===== */
  const logout = async () => {
    await fetch(API_ENDPOINTS.LOGOUT, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, company, logout, refreshCompany: fetchCompany }}>
      {children}
    </AuthContext.Provider>
  );
};

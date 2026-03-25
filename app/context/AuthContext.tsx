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
}

type LoginPayload = {
  username: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "AGENT";
};

type AuthContextType = {
  user: User | null;
  company: Company | null; // ✅ add this
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
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
  const fetchMe = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.ME, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  };


  /* ===== Fetch Company Details ===== */
  const fetchCompany = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_COMPANY_SETTINGS);
      if (!res.ok) throw new Error("Failed to fetch company");

      const data = await res.json();
      console.log(data)
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
      throw new Error("Invalid credentials");
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
    <AuthContext.Provider value={{ user, loading, login, company, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

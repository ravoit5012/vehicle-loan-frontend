"use client";

import { createContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/config";

export type User = {
  username: string;
  role: "ADMIN" | "MANAGER" | "AGENT";
  sub: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: {
    username: string;
    password: string;
    role: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.ME, { credentials: "include" });
        const data = await res.json();
        console.log("fetchMe:", data.user);
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);


  const login = async ({ username, password, role }: any) => {
    const res = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json();
    setUser(data.user);
    console.log(data.user);
  };

  const logout = async () => {
    await fetch(API_ENDPOINTS.LOGOUT, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

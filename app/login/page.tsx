"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const roles = ["ADMIN", "MANAGER", "AGENT"] as const;
type Role = (typeof roles)[number];


export default function LoginPage() {
  const router = useRouter();
  const { user, login, company } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ username, password, role });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* LEFT PANEL */}
      <div className="lg:flex md:w-1/2 bg-white p-12 flex-col justify-center">
        <div className="max-w-md">
          {/* Company Logo */}
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt="Company Logo"
              className="w-16 h-16 object-cover rounded-xl shadow-md mb-4"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-blue-700 flex items-center justify-center shadow-md mb-4 text-white text-2xl font-bold">
              {company?.companyName?.charAt(0) || "C"}
            </div>
          )}

          <h1 className="text-3xl font-bold text-blue-700 mb-6">
            {company?.companyName}
          </h1>

          <h2 className="text-2xl font-semibold mb-4">
            Office Administration Login
          </h2>

          <p className="text-gray-600 mb-6 hidden md:block">
            Use a valid username and password to gain access to the
            administrator backend.
          </p>

<a
  href="https://www.champanandmotors.com/"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300"
>
  Go to Site Home Page
</a>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold mb-6">Login</h3>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium">User Name</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full mt-1 p-3 border rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full mt-1 p-3 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Role Name</label>
              <Select onValueChange={(value) => setRole(value as Role)}
                defaultValue="ADMIN">
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

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
    <div className="relative font-sans overflow-hidden flex items-center justify-center p-6 h-full min-h-[90vh]">
      {/* Main Glass Modal */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8">
        
        {/* Left Branding Panel */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          <div className="relative group w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-70 blur-sm"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-white rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-md z-10 hover:scale-105 transition-transform duration-300">
                {company?.logoUrl ? (
                <img
                    src={company.logoUrl}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                />
                ) : (
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-blue-500">
                    {company?.companyName?.charAt(0) || "C"}
                </span>
                )}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{company?.companyName || "Champanand"}</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-md hidden md:block leading-relaxed">
            Administrative terminal. Ensure you have the appropriate clearance tier before attempting to authenticate.
          </p>
          <button onClick={() => router.push("/")} className="mt-4 px-6 py-2.5 rounded-full bg-white/60 backdrop-blur border border-slate-200 text-slate-700 font-semibold shadow-sm hover:shadow-md hover:bg-white transition-all text-sm flex items-center gap-2 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Return to Homepage
          </button>
        </div>

        {/* Right Authentication Box */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-8">
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">Sign In</h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                <input
                  type="text"
                  placeholder="admin.user"
                  className="w-full p-3.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 font-medium text-slate-700"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 font-medium text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Clearance Tier</label>
                <div className="relative">
                    <Select onValueChange={(value) => setRole(value as Role)} defaultValue="ADMIN">
                    <SelectTrigger className="w-full p-3.5 h-auto bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-slate-700">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 overflow-hidden shadow-xl">
                      {roles.map((r) => (
                        <SelectItem key={r} value={r} className="font-medium focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer py-3">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                      <><Loader2 className="animate-spin w-5 h-5" /> Authenticating...</>
                  ) : (
                      "Authenticate"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

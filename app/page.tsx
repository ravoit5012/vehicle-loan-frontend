"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { company, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen font-sans">
      {/* Main Glass Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-12 mt-12 flex flex-col items-center">
        
        {/* Hero Area */}
        <div className="text-center space-y-8 animate-fade-in-up">
          {/* Dynamic Logo Avatar */}
          <div className="relative group mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-70 blur-sm"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-white rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-sm z-10 hover:scale-105 transition-transform duration-300">
                {company?.logoUrl ? (
                <img
                    src={company.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                />
                ) : (
                <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-blue-500">
                    {company?.companyName?.charAt(0) || "C"}
                </span>
                )}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm">
            Welcome to <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              {company?.companyName || "Champanand"}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            Manage your vehicle lending lifecycle with pristine security and next-generation speed. Access your administrative workspace instantly.
          </p>

          <div className="pt-4 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="relative overflow-hidden group px-10 py-4 font-bold text-white bg-indigo-600 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2 text-lg">
                Access Workspace 
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </span>
            </button>

            <a
              href="https://www.champanandmotors.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 flex items-center gap-2 rounded-full font-bold text-slate-700 bg-white/40 backdrop-blur-md border border-slate-300/50 hover:bg-white/70 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              Champanand Motors Site
            </a>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-4">
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-shadow duration-300 group">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Enterprise Security</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Protected infrastructure ensuring your financial data is fully encrypted and gated by strict role-based hierarchies.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-shadow duration-300 group">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Telemetry</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Zero-latency dashboard updates. Generate contracts, view repayments, and manage agents with lightning-fast reactive UI.</p>
          </div>
        </div>

        <footer className="mt-20 text-sm font-semibold tracking-wide text-slate-400">
          &copy; {new Date().getFullYear()} {company?.companyName || "Champanand Motors"} &mdash; System Admin V2
        </footer>
      </div>
    </div>
  );
}

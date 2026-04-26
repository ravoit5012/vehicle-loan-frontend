"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/app/config/config";
import { useAuth } from "@/hooks/useAuth";
import {
  FaHandHoldingUsd,
  FaEye,
  FaPen,
  FaBox,
  FaPlus,
  FaCheckCircle,
  FaClipboardList,
  FaRupeeSign,
  FaFileAlt,
  FaCheck,
} from "react-icons/fa";

interface LoanType {
  id: string;
  loanName: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  status: string;
  totalLoans: number;
  activeProducts: number;
  totalDisbursed: number;
}

import Stats from "./Stats";
export default function LoanTypesPage() {
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    fetch(API_ENDPOINTS.GET_ALL_LOAN_TYPES, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setLoanTypes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden font-sans p-4 md:p-8 space-y-8">
      {/* Premium Ambient Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 pointer-events-none animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center transform -rotate-3 transition duration-300">
                <FaHandHoldingUsd className="w-8 h-8 text-white drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-900 tracking-tight">Loan Types Configurations</h1>
                <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">Manage, configure and toggle loan policies systematically.</p>
              </div>
            </div>

            {/* Add New Product */}
            <Link href="/loans/types/add">
              <button className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all duration-300 hover:-translate-y-0.5">
                <FaPlus className="text-white group-hover:rotate-90 transition-transform" /> Add Configuration
              </button>
            </Link>
          </div>
        </header>

        {/* Stats cards */}
        <section className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6">
          <Stats />
        </section>

        {/* Loan products table */}
        <section className="bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden block">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-100/50 border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 tracking-widest text-[11px] uppercase">PRODUCT DEFINITION</th>
                <th className="px-6 py-4 font-bold text-slate-500 tracking-widest text-[11px] uppercase text-center">INTEREST SYSTEM</th>
                <th className="px-6 py-4 font-bold text-slate-500 tracking-widest text-[11px] uppercase text-center">PRINCIPAL BOUNDS</th>
                <th className="px-6 py-4 font-bold text-slate-500 tracking-widest text-[11px] uppercase text-center">LIVE STATUS</th>
                <th className="px-6 py-4 font-bold text-slate-500 tracking-widest text-[11px] uppercase text-center">OPERATIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {Array.isArray(loanTypes) &&
                loanTypes.map((lt) => (
                  <tr
                    key={lt.id}
                    className="hover:bg-white/90 transition duration-150 group"
                  >
                    <td className="px-6 py-5">
                      <div className="font-extrabold text-slate-800 text-base capitalize mb-1">{lt.loanName}</div>
                      <div className="text-sm text-slate-500 max-w-xs truncate">{lt.description}</div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                        {lt.interestRate.toFixed(2)}%
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center font-semibold text-slate-600">
                      <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-xs">₹{lt.minAmount.toLocaleString()}</span>
                      <span className="mx-2 text-slate-300">→</span>
                      <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-xs">₹{lt.maxAmount.toLocaleString()}</span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide border shadow-sm ${lt.status === "active"
                          ? "bg-green-50 border-green-200 text-green-700 shadow-green-100"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                      >
                        {lt.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link href={`/loans/types/${lt.id}?mode=view`}>
                          <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-semibold transition-all shadow-sm">
                            <FaEye /> View
                          </button>
                        </Link>
                        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                          <Link href={`/loans/types/${lt.id}?mode=edit`}>
                            <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg font-semibold transition-all shadow-sm">
                              <FaPen /> Edit
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

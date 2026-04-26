"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/config";
import { useAuth } from "@/hooks/useAuth";
import ProtectedPageMessage from "@/app/components/ProtectedPageMessage";
import {
  TrendingUp,
  Download,
  Loader2,
  PieChart,
  IndianRupee,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Briefcase
} from "lucide-react";

/* ================= FORMATTERS ================= */

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (d: string | Date | undefined) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ================= COMPONENT ================= */

export default function ProfitReportsPage() {
  const { user, loading: authLoading } = useAuth();
  
  const [loans, setLoans] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !["ADMIN", "MANAGER"].includes(user.role)) return;

    const fetchData = async () => {
      try {
        const [loansRes, feesRes] = await Promise.all([
          axios.get(API_ENDPOINTS.GET_ALL_LOAN_APPLICATIONS, {
            withCredentials: true,
          }),
          axios.get(API_ENDPOINTS.GET_ALL_FEES, {
            withCredentials: true,
          }),
        ]);

        setLoans(loansRes.data || []);
        setFees(feesRes.data || []);
      } catch (err) {
        console.error("Failed to load profit data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ===== Derived Analytics ===== */
  
  // 1. Active Portfolio (Disbursed + Closed)
  const portfolioLoans = useMemo(() => {
    return loans.filter((l) => ["DISBURSED", "CLOSED"].includes(l.status));
  }, [loans]);

  // Projected vs Realized Fees
  const totalFeesExpected = portfolioLoans.reduce((sum, loan) => {
    return sum + (loan.processingFees || 0) + (loan.insuranceFees || 0) + 
      ((loan.otherFees || []).reduce((s: number, f: any) => s + (f.amount || 0), 0));
  }, 0);

  const totalFeesCollected = fees
    .filter(f => f.paid)
    .reduce((sum, f) => sum + (f.totalFees || 0), 0);

  // Projected vs Realized Interest
  const expectedInterest = portfolioLoans.reduce((s, l) => s + (l.totalInterest || 0), 0);
  
  // Repayments (Inflows)
  const totalRepaidAmount = portfolioLoans.reduce((sum, l) => {
    return sum + (l.repayments || []).reduce((rSum: number, r: any) => rSum + (r.paidAmount || 0), 0);
  }, 0);

  // Disbursements (Outflows)
  const totalDisbursed = portfolioLoans.reduce((s, l) => s + (l.disbursedAmount || 0), 0);

  // Overall Financial Health
  // The system's actual net cash position = (Total Repaid + Total Fees) - Total Disbursed
  const actualCashflow = (totalRepaidAmount + totalFeesCollected) - totalDisbursed;
  
  // Projected Total Revenue (The pure profit if all loans complete successfully)
  const projectedRevenue = expectedInterest + totalFeesExpected;

  /* ===== Exporter ===== */
  const downloadCSV = () => {
    const headers = [
      "Loan ID",
      "Status",
      "Disbursed Amount (Outflow)",
      "Total Fees Collected",
      "Expected Interest",
      "Total EMIs Collected",
      "Current Cashflow Contribution"
    ];

    const rows = portfolioLoans.map((l) => {
      // Find fee record for this loan
      const feeRec = fees.find(f => f.loanId === l.id && f.paid);
      const feeColl = feeRec ? feeRec.totalFees : 0;
      
      const repaid = (l.repayments || []).reduce((s: number, r: any) => s + (r.paidAmount || 0), 0);
      const cashflow = (repaid + feeColl) - (l.disbursedAmount || 0);

      return [
        l.id,
        l.status,
        l.disbursedAmount || 0,
        feeColl,
        l.totalInterest || 0,
        repaid,
        cashflow
      ].join(",");
    });

    const csvData = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `profit_analysis_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ===== Auth Guard ===== */
  if (authLoading) return null;
  if (!user) return <ProtectedPageMessage />;
  if (!["ADMIN", "MANAGER"].includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center relative z-10 w-full text-red-900 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Access Denied</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-500" size={36} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-r from-gray-800 to-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <PieChart size={28} className="text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Profits & Revenue
            </h1>
          </div>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            High-level overview of portfolio cashflow, projected interest, and realized fees.
          </p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={portfolioLoans.length === 0}
          className="flex items-center justify-center gap-2 bg-gray-700 text-white border border-gray-600 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Export Breakdown
        </button>
      </div>

      {/* Top Banner - Net Cashflow */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${actualCashflow >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
        <p className={`text-sm font-semibold uppercase tracking-wider ${actualCashflow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
          Net Cashflow Position (Realized Profit/Deficit)
        </p>
        <div className="flex items-end gap-4 mt-2">
          <h2 className={`text-4xl sm:text-5xl font-black ${actualCashflow >= 0 ? 'text-emerald-600' : 'text-rose-600'} truncate`}>
            {actualCashflow >= 0 ? '+' : ''}{fmtCurrency(actualCashflow)}
          </h2>
          <div className={`flex items-center gap-1 mb-2 font-medium ${actualCashflow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {actualCashflow >= 0 ? <TrendingUp size={24} /> : <ArrowDownRight size={24} />}
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-3 max-w-2xl">
          This represents the actual money in the bank. It is calculated as 
          <strong> (Total Repayments Collected + Total Fees Collected) - Total Principal Disbursed</strong>. 
          A negative number is normal during heavy growth phases before EMIs mature.
        </p>
      </div>

      {/* Split Grid for Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Col: Realized Cashflow Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 px-2">
            <Activity size={20} className="text-blue-500" /> Realized Cash In/Out
          </h3>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
              <ArrowUpRight size={120} />
            </div>
            <p className="text-sm text-gray-500 font-medium">Principal Disbursed (Cash Out)</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{fmtCurrency(totalDisbursed)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex flex-col justify-center">
              <p className="text-sm text-indigo-500 font-semibold mb-1">EMIs Collected</p>
              <p className="text-2xl font-bold text-indigo-900">{fmtCurrency(totalRepaidAmount)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-center">
              <p className="text-sm text-emerald-600 font-semibold mb-1">Fees Collected</p>
              <p className="text-2xl font-bold text-emerald-900">{fmtCurrency(totalFeesCollected)}</p>
            </div>
          </div>
        </div>

        {/* Right Col: Projected Earnings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 px-2">
            <DollarSign size={20} className="text-amber-500" /> Projected Revenue Yield
          </h3>
          
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 relative overflow-hidden">
            <p className="text-sm text-amber-700 font-bold uppercase tracking-wide">Total Projected Revenue</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{fmtCurrency(projectedRevenue)}</p>
            <p className="text-xs text-amber-600/80 mt-2">
              The total expected profit across the lifetime of the active portfolio once fully repaid.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100 p-6 space-y-5">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-semibold text-gray-600">Expected Interest</span>
                <span className="font-bold text-gray-800">{fmtCurrency(expectedInterest)}</span>
              </div>
              <div className="w-full bg-white/40 backdrop-blur-md border border-white/50 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-semibold text-gray-600">Expected Fees</span>
                <span className="font-bold text-gray-800">{fmtCurrency(totalFeesExpected)}</span>
              </div>
              <div className="w-full bg-white/40 backdrop-blur-md border border-white/50 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full" 
                  style={{ width: totalFeesExpected > 0 ? `${(totalFeesCollected / totalFeesExpected) * 100}%` : '0%' }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                {fmtCurrency(totalFeesCollected)} realized
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

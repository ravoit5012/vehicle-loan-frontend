"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_ENDPOINTS } from "@/app/config/config";
import ProtectedPageMessage from "@/app/components/ProtectedPageMessage";
import {
  BarChart3,
  Users,
  UserCog,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
  IndianRupee,
  Loader2,
  Award,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  BriefcaseBusiness
} from "lucide-react";

/* ================= TYPES ================= */

type AgentAnalytics = {
  agentId: string;
  agentName: string;
  agentCode: string;
  status: string;
  totalLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  pendingLoans: number;
  disbursedLoans: number;
  totalDisbursedAmount: number;
  totalRepaidAmount: number;
  totalPendingAmount: number;
  customerCount: number;
};

/* ================= FORMAT HELPERS ================= */

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const pct = (n: number, d: number) =>
  d === 0 ? 0 : Math.round((n / d) * 100);

/* ================= COLORS ================= */

const COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-orange-500",
];

/* ================= COMPONENT ================= */

export default function AgentAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<AgentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Both ADMIN and MANAGER might need to see this, but restricting to ADMIN for now as modeled
    if (!user || !["ADMIN", "MANAGER"].includes(user.role)) return;

    const fetchData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.AGENT_ANALYTICS, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* Auth guard */
  if (authLoading) return null;
  if (!user) return <ProtectedPageMessage />;
  if (!["ADMIN", "MANAGER"].includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg md:text-2xl">
          Only <strong>Admins and Managers</strong> can access this page.
        </p>
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

  /* Derived totals */
  const totalLoans = data.reduce((s, a) => s + a.totalLoans, 0);
  const totalDisbursed = data.reduce((s, a) => s + a.totalDisbursedAmount, 0);
  const totalRepaid = data.reduce((s, a) => s + a.totalRepaidAmount, 0);
  const totalPending = data.reduce((s, a) => s + a.totalPendingAmount, 0);
  const totalCustomers = data.reduce((s, a) => s + a.customerCount, 0);

  /* Max values for bar scaling */
  const maxLoans = Math.max(...data.map((a) => a.totalLoans), 1);
  const maxDisbursed = Math.max(
    ...data.map((a) => a.totalDisbursedAmount),
    1
  );

  /* Top performer */
  const topPerformer = data.length > 0 ? data[0] : null;

  /* ===== Summary cards config ===== */
  const summaryCards = [
    {
      label: "Total Agents",
      value: data.length,
      icon: <BriefcaseBusiness size={22} />,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Loans",
      value: totalLoans,
      icon: <CreditCard size={22} />,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Disbursed Amount",
      value: fmt(totalDisbursed),
      icon: <IndianRupee size={22} />,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Repaid Amount",
      value: fmt(totalRepaid),
      icon: <TrendingUp size={22} />,
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Outstanding Amount",
      value: fmt(totalPending),
      icon: <Wallet size={22} />,
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Total Customers",
      value: totalCustomers,
      icon: <Users size={22} />,
      color: "from-violet-500 to-violet-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* ===== Header ===== */}
      <div className="rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="flex items-center gap-3">
          <BriefcaseBusiness size={28} />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Agent Analytics
          </h1>
        </div>
        <p className="mt-2 text-white/80 text-sm sm:text-base">
          Track field agent performance, loan processing volumes, and collection rates.
        </p>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl p-4 text-white bg-gradient-to-br ${card.color} shadow-md`}
          >
            <div className="flex items-center gap-2 opacity-90 mb-2">
              {card.icon}
            </div>
            <p className="text-2xl font-bold truncate" title={card.value.toString()}>{card.value}</p>
            <p className="text-xs opacity-80 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* ===== Top Performer Banner ===== */}
      {topPerformer && topPerformer.totalLoans > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Award size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800">
              🌟 Agent of the Month
            </p>
            <p className="text-lg font-bold text-emerald-900">
              {topPerformer.agentName}{" "}
              <span className="text-sm font-normal text-emerald-600">
                ({topPerformer.agentCode})
              </span>
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              {topPerformer.totalLoans} loans • {fmt(topPerformer.totalDisbursedAmount)} disbursed •{" "}
              {pct(topPerformer.approvedLoans, topPerformer.totalLoans)}% approval rate
            </p>
          </div>
        </div>
      )}

      {/* ===== Chart Sections ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== Loan Volume Chart ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Target size={20} className="text-blue-500" />
              Sourcing Volume
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Breakdown of sourced loans by status
            </p>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
            {data.slice(0, 15).map((agt) => {
              const approvedPct = pct(agt.approvedLoans, agt.totalLoans);
              const rejectedPct = pct(agt.rejectedLoans, agt.totalLoans);
              const pendingPct = 100 - approvedPct - rejectedPct;
              const barWidth = pct(agt.totalLoans, maxLoans);
              return (
                <div key={agt.agentId} className="flex items-center gap-4">
                  <div className="w-24 sm:w-32 shrink-0">
                    <p className="text-sm font-semibold text-gray-800 truncate" title={agt.agentName}>
                      {agt.agentName}
                    </p>
                    <p className="text-xs text-gray-400">{agt.agentCode}</p>
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-7 rounded-lg overflow-hidden flex"
                      style={{ width: `${Math.max(barWidth, 8)}%` }}
                    >
                      {agt.approvedLoans > 0 && (
                        <div
                          className="bg-emerald-500 h-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${approvedPct}%` }}
                          title={`Approved: ${agt.approvedLoans}`}
                        />
                      )}
                      {agt.pendingLoans > 0 && (
                        <div
                          className="bg-amber-400 h-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${pendingPct}%` }}
                          title={`Pending: ${agt.pendingLoans}`}
                        />
                      )}
                      {agt.rejectedLoans > 0 && (
                        <div
                          className="bg-rose-500 h-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${rejectedPct}%` }}
                          title={`Rejected: ${agt.rejectedLoans}`}
                        />
                      )}
                      {agt.totalLoans === 0 && (
                        <div className="bg-gray-200 h-full w-full rounded-lg" />
                      )}
                    </div>
                  </div>
                  <div className="w-8 text-right text-sm font-bold text-gray-700">
                    {agt.totalLoans}
                  </div>
                </div>
              );
            })}
            
            {/* Legend */}
            <div className="flex gap-4 pt-2 text-xs text-gray-500 border-t border-gray-100 mt-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Approved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Pending
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" /> Rejected
              </span>
            </div>
          </div>
        </div>

        {/* ===== Disbursement Size Chart ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <IndianRupee size={20} className="text-indigo-500" />
              Portfolio Size
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Total value of disbursed loans per agent (Top 15)
            </p>
          </div>
          <div className="p-6 space-y-3 flex-1 overflow-y-auto max-h-[400px]">
            {[...data].sort((a,b) => b.totalDisbursedAmount - a.totalDisbursedAmount).slice(0, 15).map((agt, i) => {
              const barWidth = pct(agt.totalDisbursedAmount, maxDisbursed);
              return (
                <div key={agt.agentId} className="flex items-center gap-4">
                  <div className="w-24 sm:w-32 shrink-0">
                    <p className="text-sm font-semibold text-gray-800 truncate" title={agt.agentName}>
                      {agt.agentName}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-7 rounded-lg ${COLORS[i % COLORS.length]} flex items-center px-3 transition-all duration-500`}
                      style={{ width: `${Math.max(barWidth, 5)}%` }}
                    >
                      <span className="text-white text-xs font-medium truncate">
                        {fmt(agt.totalDisbursedAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Detailed Comparison Table ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-500" />
            Comprehensive Agent Report
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-600">
                <th className="text-left px-4 py-3 font-semibold">#</th>
                <th className="text-left px-4 py-3 font-semibold">Agent</th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
                <th className="text-center px-4 py-3 font-semibold">Customers</th>
                <th className="text-center px-4 py-3 font-semibold">
                  <span className="flex items-center gap-1 justify-center">
                    <CreditCard size={14} /> Loans
                  </span>
                </th>
                <th className="text-center px-4 py-3 font-semibold text-emerald-600">Approved</th>
                <th className="text-center px-4 py-3 font-semibold text-rose-600">Rejected</th>
                <th className="text-center px-4 py-3 font-semibold text-amber-600">Pending</th>
                <th className="text-right px-4 py-3 font-semibold">Disbursed</th>
                <th className="text-right px-4 py-3 font-semibold">Repaid</th>
                <th className="text-right px-4 py-3 font-semibold">Outstanding</th>
                <th className="text-center px-4 py-3 font-semibold">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((agt, i) => {
                const approvalRate = pct(agt.approvedLoans, agt.totalLoans);
                return (
                  <tr
                    key={agt.agentId}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                  >
                    <td className="px-4 py-3 text-gray-400 font-medium">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {agt.agentName}
                        </p>
                        <p className="text-xs text-gray-400">{agt.agentCode}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                          agt.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {agt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                      {agt.customerCount}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-800">
                      {agt.totalLoans}
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-medium bg-emerald-50/30">
                      {agt.approvedLoans}
                    </td>
                    <td className="px-4 py-3 text-center text-rose-600 font-medium bg-rose-50/30">
                      {agt.rejectedLoans}
                    </td>
                    <td className="px-4 py-3 text-center text-amber-600 font-medium bg-amber-50/30">
                      {agt.pendingLoans}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {fmt(agt.totalDisbursedAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                      {fmt(agt.totalRepaidAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 font-medium">
                      {fmt(agt.totalPendingAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              approvalRate >= 70
                                ? "bg-emerald-500"
                                : approvalRate >= 40
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${approvalRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-8">
                          {approvalRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No agent data available</p>
            <p className="text-sm">
              Create agents and assign loans to see analytics here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

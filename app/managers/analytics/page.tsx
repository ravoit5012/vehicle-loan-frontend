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
} from "lucide-react";

/* ================= TYPES ================= */

type ManagerAnalytics = {
  managerId: string;
  managerName: string;
  managerCode: string;
  status: string;
  totalLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  pendingLoans: number;
  disbursedLoans: number;
  totalDisbursedAmount: number;
  totalRepaidAmount: number;
  totalPendingAmount: number;
  agentCount: number;
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

const COLORS_LIGHT = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-indigo-100 text-indigo-700",
  "bg-orange-100 text-orange-700",
];

/* ================= COMPONENT ================= */

export default function ManagerAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<ManagerAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    const fetchData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.MANAGER_ANALYTICS, {
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
  if (user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center relative z-10 w-full text-red-900 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg md:text-2xl">
          Only <strong>Admins</strong> can access this page.
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
  const totalLoans = data.reduce((s, m) => s + m.totalLoans, 0);
  const totalDisbursed = data.reduce((s, m) => s + m.totalDisbursedAmount, 0);
  const totalRepaid = data.reduce((s, m) => s + m.totalRepaidAmount, 0);
  const totalPending = data.reduce((s, m) => s + m.totalPendingAmount, 0);
  const totalAgents = data.reduce((s, m) => s + m.agentCount, 0);
  const totalCustomers = data.reduce((s, m) => s + m.customerCount, 0);

  /* Max values for bar scaling */
  const maxLoans = Math.max(...data.map((m) => m.totalLoans), 1);
  const maxDisbursed = Math.max(
    ...data.map((m) => m.totalDisbursedAmount),
    1
  );

  /* Top performer */
  const topPerformer = data.length > 0 ? data[0] : null;

  /* ===== Summary cards config ===== */
  const summaryCards = [
    {
      label: "Total Managers",
      value: data.length,
      icon: <UserCog size={22} />,
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
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Repaid Amount",
      value: fmt(totalRepaid),
      icon: <TrendingUp size={22} />,
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Pending Amount",
      value: fmt(totalPending),
      icon: <Wallet size={22} />,
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Total Agents",
      value: totalAgents,
      icon: <Users size={22} />,
      color: "from-rose-500 to-rose-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* ===== Header ===== */}
      <div className="rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Manager Analytics
          </h1>
        </div>
        <p className="mt-2 text-white/80 text-sm sm:text-base">
          Compare manager performance, loan volumes, and collection efficiency.
        </p>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl p-4 text-white bg-gradient-to-br ${card.color} shadow-[0_8px_30px_rgb(0,0,0,0.04)]`}
          >
            <div className="flex items-center gap-2 opacity-90 mb-2">
              {card.icon}
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs opacity-80 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* ===== Top Performer Banner ===== */}
      {topPerformer && topPerformer.totalLoans > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Award size={24} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">
              🏆 Top Performer
            </p>
            <p className="text-lg font-bold text-amber-900">
              {topPerformer.managerName}{" "}
              <span className="text-sm font-normal text-amber-600">
                ({topPerformer.managerCode})
              </span>
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {topPerformer.totalLoans} loans • {fmt(topPerformer.totalDisbursedAmount)} disbursed •{" "}
              {pct(topPerformer.approvedLoans, topPerformer.totalLoans)}% approval rate
            </p>
          </div>
        </div>
      )}

      {/* ===== Loan Volume Comparison Bar Chart ===== */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-transparent border-t border-white/40/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Target size={20} className="text-indigo-500" />
            Loan Volume Comparison
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Total loans per manager with approval/rejection breakdown
          </p>
        </div>
        <div className="p-6 space-y-4">
          {data.map((mgr, i) => {
            const approvedPct = pct(mgr.approvedLoans, mgr.totalLoans);
            const rejectedPct = pct(mgr.rejectedLoans, mgr.totalLoans);
            const pendingPct = 100 - approvedPct - rejectedPct;
            const barWidth = pct(mgr.totalLoans, maxLoans);
            return (
              <div key={mgr.managerId} className="flex items-center gap-4">
                <div className="w-28 sm:w-36 shrink-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {mgr.managerName}
                  </p>
                  <p className="text-xs text-gray-400">{mgr.managerCode}</p>
                </div>
                <div className="flex-1">
                  <div
                    className="h-8 rounded-lg overflow-hidden flex"
                    style={{ width: `${Math.max(barWidth, 8)}%` }}
                  >
                    {mgr.approvedLoans > 0 && (
                      <div
                        className="bg-emerald-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${approvedPct}%` }}
                        title={`Approved: ${mgr.approvedLoans}`}
                      >
                        {approvedPct > 15 && `${mgr.approvedLoans}`}
                      </div>
                    )}
                    {mgr.pendingLoans > 0 && (
                      <div
                        className="bg-amber-400 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${pendingPct}%` }}
                        title={`Pending: ${mgr.pendingLoans}`}
                      >
                        {pendingPct > 15 && `${mgr.pendingLoans}`}
                      </div>
                    )}
                    {mgr.rejectedLoans > 0 && (
                      <div
                        className="bg-rose-500 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${rejectedPct}%` }}
                        title={`Rejected: ${mgr.rejectedLoans}`}
                      >
                        {rejectedPct > 15 && `${mgr.rejectedLoans}`}
                      </div>
                    )}
                    {mgr.totalLoans === 0 && (
                      <div className="bg-gray-200 h-full w-full rounded-lg" />
                    )}
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-bold text-gray-700">
                  {mgr.totalLoans}
                </div>
              </div>
            );
          })}
          {/* Legend */}
          <div className="flex gap-6 pt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />{" "}
              Approved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />{" "}
              Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />{" "}
              Rejected
            </span>
          </div>
        </div>
      </div>

      {/* ===== Disbursement Comparison ===== */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-transparent border-t border-white/40/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <IndianRupee size={20} className="text-emerald-500" />
            Disbursement Comparison
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Total disbursed amount per manager
          </p>
        </div>
        <div className="p-6 space-y-3">
          {data.map((mgr, i) => {
            const barWidth = pct(mgr.totalDisbursedAmount, maxDisbursed);
            return (
              <div key={mgr.managerId} className="flex items-center gap-4">
                <div className="w-28 sm:w-36 shrink-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {mgr.managerName}
                  </p>
                </div>
                <div className="flex-1">
                  <div
                    className={`h-7 rounded-lg ${COLORS[i % COLORS.length]} flex items-center px-3 transition-all duration-500`}
                    style={{ width: `${Math.max(barWidth, 5)}%` }}
                  >
                    <span className="text-white text-xs font-medium truncate">
                      {fmt(mgr.totalDisbursedAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Detailed Comparison Table ===== */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-transparent border-t border-white/40/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-500" />
            Detailed Manager Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-transparent border-t border-white/40/50 text-gray-600">
                <th className="text-left px-4 py-3 font-semibold">#</th>
                <th className="text-left px-4 py-3 font-semibold">Manager</th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
                <th className="text-center px-4 py-3 font-semibold">Agents</th>
                <th className="text-center px-4 py-3 font-semibold">Customers</th>
                <th className="text-center px-4 py-3 font-semibold">
                  <span className="flex items-center gap-1 justify-center">
                    <CreditCard size={14} /> Loans
                  </span>
                </th>
                <th className="text-center px-4 py-3 font-semibold">
                  <span className="flex items-center gap-1 justify-center">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Approved
                  </span>
                </th>
                <th className="text-center px-4 py-3 font-semibold">
                  <span className="flex items-center gap-1 justify-center">
                    <XCircle size={14} className="text-rose-500" /> Rejected
                  </span>
                </th>
                <th className="text-center px-4 py-3 font-semibold">
                  <span className="flex items-center gap-1 justify-center">
                    <Clock size={14} className="text-amber-500" /> Pending
                  </span>
                </th>
                <th className="text-right px-4 py-3 font-semibold">Disbursed</th>
                <th className="text-right px-4 py-3 font-semibold">Repaid</th>
                <th className="text-right px-4 py-3 font-semibold">Outstanding</th>
                <th className="text-center px-4 py-3 font-semibold">Approval %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((mgr, i) => {
                const approvalRate = pct(mgr.approvedLoans, mgr.totalLoans);
                const collectionRate = mgr.totalDisbursedAmount > 0
                  ? pct(mgr.totalRepaidAmount, mgr.totalDisbursedAmount)
                  : 0;
                return (
                  <tr
                    key={mgr.managerId}
                    className="border-b border-gray-50 hover:bg-transparent border-t border-white/40/50 transition"
                  >
                    <td className="px-4 py-3 text-gray-400 font-medium">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {mgr.managerName}
                      </p>
                      <p className="text-xs text-gray-400">{mgr.managerCode}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          mgr.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {mgr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${COLORS_LIGHT[i % COLORS_LIGHT.length]}`}
                      >
                        <Users size={12} />
                        {mgr.agentCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                      {mgr.customerCount}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-800">
                      {mgr.totalLoans}
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-medium">
                      {mgr.approvedLoans}
                    </td>
                    <td className="px-4 py-3 text-center text-rose-600 font-medium">
                      {mgr.rejectedLoans}
                    </td>
                    <td className="px-4 py-3 text-center text-amber-600 font-medium">
                      {mgr.pendingLoans}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {fmt(mgr.totalDisbursedAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                      {fmt(mgr.totalRepaidAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-600 font-medium">
                      {fmt(mgr.totalPendingAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                        <span className="text-xs font-medium text-gray-600 w-8">
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
            <UserCog size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No manager data available</p>
            <p className="text-sm">
              Create managers and assign loans to see analytics here.
            </p>
          </div>
        )}
      </div>

      {/* ===== Per-Manager Performance Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data.map((mgr, i) => {
          const approvalRate = pct(mgr.approvedLoans, mgr.totalLoans);
          const collectionRate =
            mgr.totalDisbursedAmount > 0
              ? pct(mgr.totalRepaidAmount, mgr.totalDisbursedAmount)
              : 0;
          return (
            <div
              key={mgr.managerId}
              className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow"
            >
              {/* Card header */}
              <div
                className={`px-5 py-4 bg-gradient-to-r ${
                  i === 0
                    ? "from-indigo-500 to-blue-500"
                    : i === 1
                    ? "from-emerald-500 to-teal-500"
                    : "from-gray-500 to-gray-600"
                } text-white`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-bold">{mgr.managerName}</p>
                    <p className="text-xs opacity-80">{mgr.managerCode}</p>
                  </div>
                  {i === 0 && mgr.totalLoans > 0 && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      🏆 #1
                    </span>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 space-y-4">
                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {mgr.totalLoans}
                    </p>
                    <p className="text-xs text-gray-500">Total Loans</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {mgr.approvedLoans}
                    </p>
                    <p className="text-xs text-gray-500">Approved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-rose-600">
                      {mgr.rejectedLoans}
                    </p>
                    <p className="text-xs text-gray-500">Rejected</p>
                  </div>
                </div>

                {/* Financial stats */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <IndianRupee size={13} /> Disbursed
                    </span>
                    <span className="font-semibold text-gray-800">
                      {fmt(mgr.totalDisbursedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <TrendingUp size={13} className="text-emerald-500" /> Repaid
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {fmt(mgr.totalRepaidAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <TrendingDown size={13} className="text-amber-500" />{" "}
                      Outstanding
                    </span>
                    <span className="font-semibold text-amber-600">
                      {fmt(mgr.totalPendingAmount)}
                    </span>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Approval Rate</span>
                      <span className="font-semibold">{approvalRate}%</span>
                    </div>
                    <div className="h-2 bg-white/40 backdrop-blur-md border border-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          approvalRate >= 70
                            ? "bg-emerald-500"
                            : approvalRate >= 40
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${approvalRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Collection Rate</span>
                      <span className="font-semibold">{collectionRate}%</span>
                    </div>
                    <div className="h-2 bg-white/40 backdrop-blur-md border border-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          collectionRate >= 70
                            ? "bg-blue-500"
                            : collectionRate >= 40
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${collectionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {mgr.agentCount} agents
                  </span>
                  <span className="flex items-center gap-1">
                    <UserCog size={12} /> {mgr.customerCount} customers
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

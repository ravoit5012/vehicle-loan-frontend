"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/config";
import { useAuth } from "@/hooks/useAuth";
import ProtectedPageMessage from "@/app/components/ProtectedPageMessage";
import {
  FileText,
  Download,
  CreditCard,
  CheckCircle2,
  IndianRupee,
  XCircle,
  Clock,
  Loader2,
  Filter,
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

export default function LoanReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [customers, setCustomers] = useState<Record<string, any>>({});
  const [agents, setAgents] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user || !["ADMIN", "MANAGER"].includes(user.role)) return;

    const fetchData = async () => {
      try {
        const [loansRes, custRes, agentsRes] = await Promise.all([
          axios.get(API_ENDPOINTS.GET_ALL_LOAN_APPLICATIONS, {
            withCredentials: true,
          }),
          axios.get(API_ENDPOINTS.GET_ALL_CUSTOMERS, {
            withCredentials: true,
          }),
          axios.get(API_ENDPOINTS.GET_ALL_AGENTS, {
            withCredentials: true,
          }),
        ]);

        setLoans(loansRes.data || []);

        const cMap = Object.fromEntries(
          (custRes.data || []).map((c: any) => [c.id, c])
        );
        const aMap = Object.fromEntries(
          (agentsRes.data || []).map((a: any) => [a.id, a])
        );

        setCustomers(cMap);
        setAgents(aMap);
      } catch (err) {
        console.error("Failed to load report data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ===== Derived & Filtered Data ===== */
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      // Status filter
      if (statusFilter !== "ALL" && loan.status !== statusFilter) return false;

      // Date filter (using createdAt or submittedAt)
      if (startDate || endDate) {
        const d = new Date(loan.createdAt || loan.submittedAt);
        if (startDate && d < new Date(startDate)) return false;
        if (endDate) {
          const eDate = new Date(endDate);
          eDate.setHours(23, 59, 59, 999);
          if (d > eDate) return false;
        }
      }

      return true;
    });
  }, [loans, statusFilter, startDate, endDate]);

  const totalLoans = filteredLoans.length;
  const totalDisbursedAmount = filteredLoans
    .filter((l) => ["DISBURSED", "CLOSED", "ADMIN_APPROVED"].includes(l.status))
    .reduce((s, l) => s + (l.disbursedAmount || 0), 0);
  const totalApproved = filteredLoans.filter((l) =>
    ["ADMIN_APPROVED", "DISBURSED", "CLOSED"].includes(l.status)
  ).length;
  const totalRejected = filteredLoans.filter((l) =>
    l.status?.includes("REJECT")
  ).length;

  /* ===== Exporter ===== */
  const downloadCSV = () => {
    const headers = [
      "Loan ID",
      "Customer Name",
      "Phone",
      "Agent Name",
      "Amount",
      "Disbursed Amount",
      "Status",
      "Created At",
    ];

    const rows = filteredLoans.map((l) => {
      const c = customers[l.customerId] || {};
      const a = agents[l.agentId] || {};
      return [
        l.id,
        `"${c.applicantName || "-"}"`,
        `"${c.mobileNumber || "-"}"`,
        `"${a.name || "-"}"`,
        l.loanAmount,
        l.disbursedAmount || 0,
        l.status,
        fmtDate(l.createdAt || l.submittedAt),
      ].join(",");
    });

    const csvData = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `loan_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ===== Auth Guard ===== */
  if (authLoading) return null;
  if (!user) return <ProtectedPageMessage />;
  if (!["ADMIN", "MANAGER"].includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 px-4 text-center">
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
      <div className="rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-r from-blue-600 to-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <FileText size={28} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Loan Reports
            </h1>
          </div>
          <p className="mt-2 text-blue-100 text-sm sm:text-base">
            Generate and export comprehensive reports of all loan applications.
          </p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={filteredLoans.length === 0}
          className="flex items-center justify-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Loans in View</p>
            <p className="text-2xl font-bold text-gray-800">{totalLoans}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Disbursed (View)</p>
            <p className="text-xl font-bold text-gray-800 truncate" title={totalDisbursedAmount.toString()}>
              {fmtCurrency(totalDisbursedAmount)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Approved</p>
            <p className="text-2xl font-bold text-gray-800">{totalApproved}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Rejected</p>
            <p className="text-2xl font-bold text-gray-800">{totalRejected}</p>
          </div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="flex items-center gap-2 text-gray-700 font-semibold sm:w-1/4">
            <Filter size={18} className="text-blue-500" />
            Filters
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="CALL_VERIFIED">Call Verified</option>
                <option value="FIELD_VERIFIED">Field Verified</option>
                <option value="ADMIN_APPROVED">Admin Approved</option>
                <option value="DISBURSED">Disbursed</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white text-gray-500 text-left">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Loan ID</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Agent</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Amount</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Disbursed</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium">No loans found</p>
                    <p className="text-sm">Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const customer = customers[loan.customerId];
                  const agent = agents[loan.agentId];
                  return (
                    <tr
                      key={loan.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {loan.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {customer?.applicantName || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {customer?.mobileNumber || "No phone"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {agent?.name || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-800">
                        {fmtCurrency(loan.loanAmount)}
                      </td>
                      <td className="px-6 py-4 text-right text-indigo-600 font-semibold">
                        {fmtCurrency(loan.disbursedAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-wider ${loan.status === "DISBURSED" || loan.status === "CLOSED"
                              ? "bg-emerald-100 text-emerald-700"
                              : loan.status?.includes("REJECT")
                                ? "bg-rose-100 text-rose-700"
                                : loan.status === "ADMIN_APPROVED"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <Clock size={14} className="opacity-50" />
                        {fmtDate(loan.createdAt || loan.submittedAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/config";
import { useAuth } from "@/hooks/useAuth";
import ProtectedPageMessage from "@/app/components/ProtectedPageMessage";
import {
  Wallet,
  Download,
  Filter,
  Loader2,
  CalendarDays,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

/* ================= TYPES & FORMATTERS ================= */

type RepaymentRow = {
  loanId: string;
  emiNumber: number;
  dueDate: string;
  emiAmount: number;
  paidAmount: number;
  status: string;
  paidDate?: string;
  customerName: string;
  customerPhone: string;
};

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

export default function CollectionReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [repayments, setRepayments] = useState<RepaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user || !["ADMIN", "MANAGER"].includes(user.role)) return;

    const fetchData = async () => {
      try {
        const [loansRes, custRes] = await Promise.all([
          axios.get(API_ENDPOINTS.GET_ALL_LOAN_APPLICATIONS, {
            withCredentials: true,
          }),
          axios.get(API_ENDPOINTS.GET_ALL_CUSTOMERS, {
            withCredentials: true,
          }),
        ]);

        const cMap = Object.fromEntries(
          (custRes.data || []).map((c: any) => [c.id, c])
        );

        const flattened: RepaymentRow[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        (loansRes.data || []).forEach((loan: any) => {
          const customer = cMap[loan.customerId] || {};
          (loan.repayments || []).forEach((rep: any) => {
            let derivedStatus = rep.status;
            // Map strict OVERDUE if pending and past due date
            if (derivedStatus === "PENDING" && new Date(rep.dueDate) < today) {
              derivedStatus = "OVERDUE";
            }

            flattened.push({
              loanId: loan.id,
              emiNumber: rep.emiNumber,
              dueDate: rep.dueDate,
              emiAmount: rep.emiAmount || 0,
              paidAmount: rep.paidAmount || 0,
              status: derivedStatus,
              paidDate: rep.paidDate,
              customerName: customer.applicantName || "Unknown",
              customerPhone: customer.mobileNumber || "No phone",
            });
          });
        });

        // Sort by due date (newest first)
        flattened.sort(
          (a, b) =>
            new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        );

        setRepayments(flattened);
      } catch (err) {
        console.error("Failed to load collection data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ===== Derived & Filtered Data ===== */
  const filteredRepayments = useMemo(() => {
    return repayments.filter((rep) => {
      // Status filter
      if (statusFilter !== "ALL" && rep.status !== statusFilter) return false;

      // Date filter (applies to Paid Date if paid, Due Date if not paid)
      if (startDate || endDate) {
        const d = new Date(rep.paidDate || rep.dueDate);
        if (startDate && d < new Date(startDate)) return false;
        if (endDate) {
          const eDate = new Date(endDate);
          eDate.setHours(23, 59, 59, 999);
          if (d > eDate) return false;
        }
      }

      return true;
    });
  }, [repayments, statusFilter, startDate, endDate]);

  const totalCollected = filteredRepayments.reduce(
    (s, r) => s + r.paidAmount,
    0
  );
  const totalDue = filteredRepayments.reduce(
    (s, r) => s + (r.emiAmount - r.paidAmount),
    0
  );
  const countPaid = filteredRepayments.filter((r) => r.status === "PAID").length;
  const countOverdue = filteredRepayments.filter((r) => r.status === "OVERDUE").length;

  /* ===== Exporter ===== */
  const downloadCSV = () => {
    const headers = [
      "Loan ID",
      "Customer Name",
      "Phone",
      "EMI Number",
      "Due Date",
      "Paid Date",
      "EMI Amount",
      "Paid Amount",
      "Status",
    ];

    const rows = filteredRepayments.map((r) => [
      r.loanId,
      `"${r.customerName}"`,
      `"${r.customerPhone}"`,
      r.emiNumber,
      fmtDate(r.dueDate),
      fmtDate(r.paidDate),
      r.emiAmount,
      r.paidAmount,
      r.status,
    ]);

    const csvData = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `collection_report_${new Date().getTime()}.csv`
    );
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
      <div className="rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-r from-purple-600 to-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Wallet size={28} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Collection Reports
            </h1>
          </div>
          <p className="mt-2 text-purple-100 text-sm sm:text-base">
            Track EMI collections, overdue payments, and overall recovery rates.
          </p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={filteredRepayments.length === 0}
          className="flex items-center justify-center gap-2 bg-white text-purple-700 px-5 py-2.5 rounded-xl font-bold hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-gray-500 font-medium">Total Collected (View)</p>
            <p className="text-2xl font-bold text-gray-800 truncate" title={totalCollected.toString()}>
              {fmtCurrency(totalCollected)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <IndianRupee size={24} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-gray-500 font-medium">Pending Dues (View)</p>
            <p className="text-2xl font-bold text-gray-800 truncate" title={totalDue.toString()}>
              {fmtCurrency(totalDue)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-1">
          <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
            <CheckCircle2 size={16} className="text-emerald-500" /> EMIs Paid
          </p>
          <p className="text-2xl font-bold text-gray-800">{countPaid}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center gap-1">
          <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
            <AlertTriangle size={16} className="text-rose-500" /> EMIs Overdue
          </p>
          <p className="text-2xl font-bold text-gray-800">{countOverdue}</p>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="flex items-center gap-2 text-gray-700 font-semibold sm:w-1/4">
            <Filter size={18} className="text-purple-500" />
            Filters
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Payment Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="ALL">All EMIs</option>
                <option value="PAID">Paid</option>
                <option value="PARTIAL">Partial</option>
                <option value="PENDING">Pending (Future)</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Start Date (Due/Paid)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                End Date (Due/Paid)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white text-gray-500 text-left">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Customer Info</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">EMI #</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Amount Due</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Amount Paid</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Dates</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <Wallet size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium">No repayments found</p>
                    <p className="text-sm">Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredRepayments.map((rep, i) => (
                  <tr
                    key={`${rep.loanId}-${rep.emiNumber}-${i}`}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">
                        {rep.customerName}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        <span>{rep.customerPhone}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                          {rep.loanId.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-600">
                      {rep.emiNumber}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800">
                      {fmtCurrency(rep.emiAmount)}
                    </td>
                    <td className="px-6 py-4 text-right text-indigo-600 font-semibold">
                      {fmtCurrency(rep.paidAmount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                          rep.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : rep.status === "PARTIAL"
                            ? "bg-blue-100 text-blue-700"
                            : rep.status === "OVERDUE"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {rep.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs">
                      <div className="text-gray-500 flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <CalendarDays size={13} className="opacity-50" />
                        Due: {fmtDate(rep.dueDate)}
                      </div>
                      <div
                        className={`mt-1 flex items-center justify-end gap-1.5 whitespace-nowrap ${
                          rep.paidDate ? "text-emerald-600 font-medium" : "text-gray-400"
                        }`}
                      >
                        <Clock size={13} className="opacity-50" />
                        Paid: {fmtDate(rep.paidDate)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

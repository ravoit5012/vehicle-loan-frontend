"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/config";
import { useAuth } from "@/hooks/useAuth";
import ProtectedPageMessage from "@/app/components/ProtectedPageMessage";
import {
  Users,
  Download,
  Filter,
  Loader2,
  MapPin,
  CalendarDays,
  UserCog,
  BriefcaseBusiness,
} from "lucide-react";

/* ================= FORMATTERS ================= */

const fmtDate = (d: string | Date | undefined) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ================= COMPONENT ================= */

export default function CustomerReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [agents, setAgents] = useState<Record<string, any>>({});
  const [managers, setManagers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [agentFilter, setAgentFilter] = useState("ALL");
  const [managerFilter, setManagerFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user || !["ADMIN", "MANAGER"].includes(user.role)) return;

    const fetchData = async () => {
      try {
        const [custRes, agentsRes, mgrRes] = await Promise.all([
          axios.get(API_ENDPOINTS.GET_ALL_CUSTOMERS, { withCredentials: true }),
          axios.get(API_ENDPOINTS.GET_ALL_AGENTS, { withCredentials: true }),
          axios.get(API_ENDPOINTS.GET_ALL_MANAGERS, { withCredentials: true }),
        ]);

        setCustomers(custRes.data || []);

        const aMap = Object.fromEntries(
          (agentsRes.data || []).map((a: any) => [a.id, a])
        );
        const mMap = Object.fromEntries(
          (mgrRes.data || []).map((m: any) => [m.id, m])
        );

        setAgents(aMap);
        setManagers(mMap);
      } catch (err) {
        console.error("Failed to load report data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* ===== Derived & Filtered Data ===== */
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      // Agent filter
      if (agentFilter !== "ALL" && cust.agentId !== agentFilter) return false;

      // Manager filter
      if (managerFilter !== "ALL" && cust.managerId !== managerFilter)
        return false;

      // Date filter
      if (startDate || endDate) {
        const d = new Date(cust.createdAt);
        if (startDate && d < new Date(startDate)) return false;
        if (endDate) {
          const eDate = new Date(endDate);
          eDate.setHours(23, 59, 59, 999);
          if (d > eDate) return false;
        }
      }

      return true;
    });
  }, [customers, agentFilter, managerFilter, startDate, endDate]);

  const totalCustomers = filteredCustomers.length;
  const recentCustomers = filteredCustomers.filter((c) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(c.createdAt) >= thirtyDaysAgo;
  }).length;

  // Agent/Manager lists for filter dropdowns
  const agentOptions = Object.values(agents);
  const managerOptions = Object.values(managers);

  /* ===== Exporter ===== */
  const downloadCSV = () => {
    const headers = [
      "Customer ID",
      "Name",
      "Phone",
      "Gender",
      "Village",
      "District",
      "Agent",
      "Manager",
      "Date Added",
    ];

    const rows = filteredCustomers.map((c) => {
      const a = agents[c.agentId] || {};
      const m = managers[c.managerId] || {};
      return [
        c.id,
        `"${c.applicantName || "-"}"`,
        `"${c.mobileNumber || "-"}"`,
        c.gender || "-",
        `"${c.village || "-"}"`,
        `"${c.district || "-"}"`,
        `"${a.name || "-"}"`,
        `"${m.name || "-"}"`,
        fmtDate(c.createdAt),
      ].join(",");
    });

    const csvData = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `customer_report_${new Date().getTime()}.csv`);
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
      <div className="flex flex-center items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-500" size={36} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-r from-emerald-600 to-teal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Users size={28} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Customer Reports
            </h1>
          </div>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base">
            Detailed list of registered customers, locational data, and assignments.
          </p>
        </div>
        <button
          onClick={downloadCSV}
          disabled={filteredCustomers.length === 0}
          className="flex items-center justify-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Customers (Filtered)</p>
            <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">New (Last 30 Days)</p>
            <p className="text-2xl font-bold text-gray-800">{recentCustomers}</p>
          </div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col xl:flex-row gap-5">
          <div className="flex items-center gap-2 text-gray-700 font-semibold md:w-48 shrink-0">
            <Filter size={18} className="text-emerald-500" />
            Filters
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {user.role === "ADMIN" && (
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">
                  Manager
                </label>
                <select
                  value={managerFilter}
                  onChange={(e) => setManagerFilter(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="ALL">All Managers</option>
                  {managerOptions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.managerCode})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Agent
              </label>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="ALL">All Agents</option>
                {agentOptions
                  // If manager is filtered, show only agent for that manager
                  .filter((a) =>
                    managerFilter === "ALL" ? true : a.managerId === managerFilter
                  )
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.agentCode})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Added From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Added To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white text-gray-500 text-left">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Location</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Agent</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Manager</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Added On</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <Users size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium">No customers found</p>
                    <p className="text-sm">Try adjusting your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const agent = agents[c.agentId];
                  const manager = managers[c.managerId];
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          <img 
                            src={c.personalPhotoUrl || "/default-avatar.png"} 
                            alt="" 
                            className="w-8 h-8 rounded-full border border-gray-100 object-cover"
                            onError={(e) => { e.currentTarget.style.display="none" }}
                          />
                          {c.applicantName}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 pl-10">
                          {c.mobileNumber} • {c.gender}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1.5 text-gray-700">
                          <MapPin size={14} className="mt-0.5 text-rose-400 shrink-0" />
                          <div>
                            <span className="font-medium">{c.village}</span>
                            <div className="text-xs text-gray-400">
                              {c.district}, {c.pinCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <BriefcaseBusiness size={14} className="text-blue-400" />
                          {agent?.name || "Unassigned"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <UserCog size={14} className="text-indigo-400" />
                          {manager?.name || "Unassigned"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap">
                        {fmtDate(c.createdAt)}
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

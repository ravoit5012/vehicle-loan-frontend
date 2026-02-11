// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import Navbar from "../components/Navbar";

// export default function DashboardPage() {
//     const { user, loading, logout } = useAuth();
//     const router = useRouter();

//     useEffect(() => {
//         if (!loading && !user) {
//             router.replace("/login");
//         }
//     }, [user, loading, router]);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <p className="text-lg font-semibold">Loading dashboard...</p>
//             </div>
//         );
//     }

//     if (!user) return null;
//     return (<>
//         {/* <Navbar/> */}
//         <div className="min-h-screen bg-gray-100 p-6">
//             <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
//                 {/* Header */}
//                 <div className="flex justify-between items-center border-b pb-4 mb-6">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">
//                             Dashboard
//                         </h1>
//                         <p className="text-gray-500 text-sm">
//                             Logged in as <b>{user.username}</b> ({user.role})
//                         </p>
//                     </div>

//                     <button
//                         onClick={async () => {
//                             await logout();
//                             router.push("/login");
//                         }}
//                         className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
//                     >
//                         Logout
//                     </button>
//                 </div>

//                 {/* Role based sections */}
//                 {user.role === "ADMIN" && <AdminPanel />}
//                 {user.role === "MANAGER" && <ManagerPanel />}
//                 {user.role === "AGENT" && <AgentPanel />}
//             </div>
//         </div>
//         </>
//     );
// }

// /* ---------------- ROLE PANELS ---------------- */

// function AdminPanel() {
//     return (
//         <section className="mb-6">
//             <h2 className="text-xl font-semibold mb-3 text-indigo-600">
//                 Admin Controls
//             </h2>
//             <ul className="space-y-2 text-gray-700">
//                 <li>✔ Manage users</li>
//                 <li>✔ View all loan applications</li>
//                 <li>✔ System configuration</li>
//             </ul>
//         </section>
//     );
// }

// function ManagerPanel() {
//     return (
//         <section className="mb-6">
//             <h2 className="text-xl font-semibold mb-3 text-green-600">
//                 Manager Dashboard
//             </h2>
//             <ul className="space-y-2 text-gray-700">
//                 <li>✔ Approve / reject loans</li>
//                 <li>✔ Assign agents</li>
//                 <li>✔ Branch analytics</li>
//             </ul>
//         </section>
//     );
// }

// function AgentPanel() {
//     return (
//         <section>
//             <h2 className="text-xl font-semibold mb-3 text-blue-600">
//                 Agent Workspace
//             </h2>
//             <ul className="space-y-2 text-gray-700">
//                 <li>✔ Submit loan applications</li>
//                 <li>✔ Track assigned customers</li>
//                 <li>✔ Upload documents</li>
//             </ul>
//         </section>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  Plus,
  List,
  BarChart3,
  CalendarDays,
  Calculator,
  Printer,
  FileText,
  Wallet,
  AlertTriangle,
} from "lucide-react";

type Role = "ADMIN" | "MANAGER" | "AGENT";

type AnalyticsData = {
  emiBasedLoans: number;
  simpleLoans: number;
  totalLoanAmount: number;
  remainingAmount: number;
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ANALYTICS ================= */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics"); // <-- change to your backend endpoint
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (!user) return null;

  const role = user.role as Role;

  /* ================= BUTTON CONFIG ================= */

  const quickActions = [
    {
      label: "Simple Add Loan",
      href: "/loans/apply",
      icon: <Plus size={16} />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "Simple All Loan",
      href: "/loans/view",
      icon: <List size={16} />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "Simple Loan Analytics",
      href: "/reports/loans",
      icon: <BarChart3 size={16} />,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      label: "EMI Add Loan",
      href: "/loans/apply",
      icon: <Plus size={16} />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "EMI All Loans",
      href: "/loans/view",
      icon: <List size={16} />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "Due Today",
      href: "/repayments/schedule",
      icon: <CalendarDays size={16} />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "Calculator",
      href: "/calculator",
      icon: <Calculator size={16} />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "EMI Loan Analytics",
      href: "/reports/loans",
      icon: <BarChart3 size={16} />,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      label: "Collection Schedule",
      href: "/repayments/schedule",
      icon: <CalendarDays size={16} />,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      label: "Print Passbook",
      href: "/loans/view",
      icon: <Printer size={16} />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
  ];

  const visibleActions = quickActions.filter((btn) =>
    btn.roles.includes(role)
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="rounded-2xl p-8 text-white bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <LayoutDashboard size={32} />
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="mt-2 text-white/80">Welcome back, {user.role}!</p>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <CalendarDays size={18} />
            <span>{today}</span>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="mt-6 flex flex-wrap gap-3">
          {visibleActions.map((btn) => (
            <Link
              key={btn.label}
              href={btn.href}
              className="flex items-center gap-2 bg-white/90 text-indigo-700 px-4 py-2 rounded-lg shadow hover:bg-white transition text-sm font-medium"
            >
              {btn.icon}
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl p-6 text-white grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText />}
          label="EMI Based Loans"
          value={loading ? "..." : analytics?.emiBasedLoans ?? 0}
        />

        <StatCard
          icon={<FileText />}
          label="Simple Loans"
          value={loading ? "..." : analytics?.simpleLoans ?? 0}
        />

        <StatCard
          icon={<Wallet />}
          label="Total Loan Amount"
          value={
            loading
              ? "..."
              : `₹${analytics?.totalLoanAmount?.toLocaleString() ?? 0}`
          }
        />

        <StatCard
          icon={<AlertTriangle />}
          label="Remaining Amount"
          value={
            loading
              ? "..."
              : `₹${analytics?.remainingAmount?.toLocaleString() ?? 0}`
          }
        />
      </div>

    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-white/80 text-sm">{label}</div>
      </div>
    </div>
  );
}

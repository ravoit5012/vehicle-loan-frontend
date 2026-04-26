"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import Stats from "./Stats";
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

    if (!user) return null;

    const role = user.role as Role;

    /* ================= BUTTON CONFIG ================= */

    const quickActions = [
        {
            label: "Add Loan Application",
            href: "/loans/apply",
            icon: <Plus size={16} />,
            roles: ["ADMIN", "MANAGER", "AGENT"],
        },
        {
            label: "View All Loans",
            href: "/loans/view",
            icon: <List size={16} />,
            roles: ["ADMIN", "MANAGER", "AGENT"],
        },
        {
            label: "Loan Analytics",
            href: "/reports/loans",
            icon: <BarChart3 size={16} />,
            roles: ["ADMIN", "MANAGER"],
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
            label: "Loan Reports",
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
        <div className="relative font-sans p-4 md:p-8 space-y-8">

            {/* ================= HEADER ================= */}
            <div className="relative z-10 w-full max-w-7xl mx-auto">
                <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transform -rotate-3">
                                    <LayoutDashboard size={28} className="text-white" />
                                </div>
                                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-900 tracking-tight">
                                    {user.role === "ADMIN" ? "Administrator" : user.role === "MANAGER" ? "Manager" : "Agent"} Hub
                                </h1>
                            </div>
                            <p className="mt-3 text-slate-500 font-medium ml-[72px]">Welcome to your workspace, <span className="text-indigo-600 font-bold">{user.name || "User"}</span></p>
                        </div>

                        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-100/80 rounded-xl border border-slate-200/60 shadow-inner">
                            <CalendarDays size={18} className="text-indigo-500" />
                            <span className="text-sm font-semibold text-slate-700">{today}</span>
                        </div>
                    </div>

                    {/* ================= QUICK ACTIONS ================= */}
                    <div className="mt-8 pt-6 border-t border-slate-100/80 flex flex-wrap gap-3">
                        {visibleActions.map((btn) => (
                            <Link
                                key={btn.label}
                                href={btn.href}
                                className="group flex items-center gap-2.5 bg-white border border-slate-200/60 text-slate-600 hover:text-indigo-600 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-sm font-bold"
                            >
                                <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                                    {btn.icon}
                                </span>
                                {btn.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ================= STATS ================= */}
                <div className="mt-8 bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="text-purple-500 w-6 h-6" />
                        <h2 className="text-xl font-bold text-slate-800">Financial Telemetry</h2>
                    </div>
                    <Stats />
                </div>
            </div>
        </div>
    );
}

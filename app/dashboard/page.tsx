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
        <div className="p-6 space-y-6">
            {/* ================= HEADER ================= */}
            <div className="rounded-2xl p-8 text-white bg-gradient-to-r from-indigo-500 to-purple-600">
                <div className="flex flex-col md:flex-row md:justify-between items-end md:items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <LayoutDashboard size={32} />
                            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        </div>
                        <p className="mt-2 text-white/80">Welcome back, {user.role}!</p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-white/90">
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
            <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl p-6 text-white">
                <Stats />
            </div>


        </div>
    );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold">Loading dashboard...</p>
            </div>
        );
    }

    if (!user) return null;
    return (<>
        {/* <Navbar/> */}
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Dashboard
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Logged in as <b>{user.username}</b> ({user.role})
                        </p>
                    </div>

                    <button
                        onClick={async () => {
                            await logout();
                            router.push("/login");
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </div>

                {/* Role based sections */}
                {user.role === "ADMIN" && <AdminPanel />}
                {user.role === "MANAGER" && <ManagerPanel />}
                {user.role === "AGENT" && <AgentPanel />}
            </div>
        </div>
        </>
    );
}

/* ---------------- ROLE PANELS ---------------- */

function AdminPanel() {
    return (
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">
                Admin Controls
            </h2>
            <ul className="space-y-2 text-gray-700">
                <li>✔ Manage users</li>
                <li>✔ View all loan applications</li>
                <li>✔ System configuration</li>
            </ul>
        </section>
    );
}

function ManagerPanel() {
    return (
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-green-600">
                Manager Dashboard
            </h2>
            <ul className="space-y-2 text-gray-700">
                <li>✔ Approve / reject loans</li>
                <li>✔ Assign agents</li>
                <li>✔ Branch analytics</li>
            </ul>
        </section>
    );
}

function AgentPanel() {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
                Agent Workspace
            </h2>
            <ul className="space-y-2 text-gray-700">
                <li>✔ Submit loan applications</li>
                <li>✔ Track assigned customers</li>
                <li>✔ Upload documents</li>
            </ul>
        </section>
    );
}

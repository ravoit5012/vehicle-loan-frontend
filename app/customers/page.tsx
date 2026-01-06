"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface Manager {
    id: string;
    name: string;
    managerCode: string;
    phoneNumber: string;
}

interface Agent {
    id: string;
    name: string;
    email: string;
}

interface Customer {
    id: string;
    applicantName: string;
    memberId: string;
    mobileNumber: string;
    email: string;
    accountStatus: string;
    manager?: { name: string };
    agent?: { name: string };
}

const ViewCustomer: React.FC = () => {
    const { user } = useAuth();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedManager, setSelectedManager] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const res = await axios.get<Customer[]>(
                    API_ENDPOINTS.GET_ALL_CUSTOMERS,
                    {
                        withCredentials: true,
                    }
                );
                setCustomers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (user?.role !== "ADMIN") return;

        axios
            .get<Manager[]>(API_ENDPOINTS.GET_ALL_MANAGERS)
            .then((res) => setManagers(res.data));

        axios
            .get<Agent[]>(API_ENDPOINTS.GET_ALL_AGENTS)
            .then((res) => setAgents(res.data));
    }, [user]);

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            const search = searchTerm.toLowerCase();
            return (
                (c.applicantName.toLowerCase().includes(search) ||
                    c.memberId.toLowerCase().includes(search) ||
                    c.mobileNumber.includes(search) ||
                    c.email.toLowerCase().includes(search)) &&
                (selectedManager === "" || c.manager?.name === selectedManager) &&
                (selectedAgent === "" || c.agent?.name === selectedAgent)
            );
        });
    }, [customers, searchTerm, selectedManager, selectedAgent]);

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    All Customers
                </h2>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    {user?.role === "ADMIN" && (
                        <select
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            value={selectedManager}
                            onChange={(e) => setSelectedManager(e.target.value)}
                        >
                            <option value="">Filter by Manager</option>
                            {managers.map((m) => (
                                <option key={m.id} value={m.name}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                        <select
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                        >
                            <option value="">Filter by Agent</option>
                            {agents.map((a) => (
                                <option key={a.id} value={a.name}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <input
                        type="search"
                        placeholder="Search customers..."
                        className="border rounded-lg px-4 py-2 w-full md:flex-1 focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <p className="text-gray-500">Loading customers...</p>
                ) : filteredCustomers.length === 0 ? (
                    <p className="text-gray-500">No customers found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    {[
                                        "Member ID",
                                        "Applicant Name",
                                        "Mobile",
                                        "Email",
                                        "Status",
                                        "Manager",
                                        "Agent",
                                        "Actions",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3">{c.memberId || "-"}</td>
                                        <td className="px-4 py-3">{c.applicantName}</td>
                                        <td className="px-4 py-3">{c.mobileNumber}</td>
                                        <td className="px-4 py-3">{c.email}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${c.accountStatus === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {c.accountStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">{c.manager?.name || "-"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"><span className="px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">{c.agent?.name || "-"}</span></td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs mr-2">
                                                <a
                                                    href={`/customers/view/${c.id}`}
                                                    target="_blank"  // opens in new tab
                                                    rel="noopener noreferrer"  // security best practice

                                                >
                                                    View
                                                </a>
                                            </button>
                                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs">
                                                <a
                                                    href={`/customers/edit/${c.id}`}
                                                    target="_blank"  // opens in new tab
                                                    rel="noopener noreferrer"  // security best practice

                                                >
                                                    Edit
                                                </a>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewCustomer;

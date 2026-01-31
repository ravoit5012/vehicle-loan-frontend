'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FaFile } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/app/config/config';
import LoanTable from './LoanTable';
import LoanFilters from './LoanFilters';

export default function ViewLoansPage() {
    const router = useRouter();

    const [loans, setLoans] = useState<any[]>([]);
    const [customersMap, setCustomersMap] = useState<Record<string, any>>({});
    const [agentsMap, setAgentsMap] = useState<Record<string, any>>({});
    const [agentFilter, setAgentFilter] = useState<string>('');
    const [search, setSearch] = useState('');

    // =========================
    // Fetch all data
    // =========================
    useEffect(() => {
        (async () => {
            const [loansRes, customersRes, agentsRes] = await Promise.all([
                axios.get(API_ENDPOINTS.GET_ALL_LOAN_APPLICATIONS, { withCredentials: true }),
                axios.get(API_ENDPOINTS.GET_ALL_CUSTOMERS, { withCredentials: true }),
                axios.get(API_ENDPOINTS.GET_ALL_AGENTS, { withCredentials: true }),
            ]);

            setLoans(loansRes.data);

            // Build lookup maps
            setCustomersMap(
                Object.fromEntries(customersRes.data.map((c: any) => [c.id, c]))
            );
            setAgentsMap(
                Object.fromEntries(agentsRes.data.map((a: any) => [a.id, a]))
            );
        })();
    }, []);

    // =========================
    // Filtered loans
    // =========================
    const filteredLoans = useMemo(() => {
        return loans.filter(loan => {
            const customer = customersMap[loan.customerId];
            const agent = agentsMap[loan.agentId];

            if (agentFilter && loan.agentId !== agentFilter) return false;

            if (search) {
                const term = search.toLowerCase();
                return (
                    customer?.applicantName?.toLowerCase().includes(term) ||
                    customer?.mobileNumber?.includes(term)
                );
            }

            return true;
        });
    }, [loans, customersMap, agentsMap, agentFilter, search]);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
                    <FaFile className="text-orange-400 text-3xl" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">View All Loans</h2>
                        <p className="text-gray-600 mt-1">
                            Get a summary and view all your loan applications
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/loans/apply')}
                    className="btn-primary bg-green-500 p-4 rounded-xl text-white font-bold"
                >
                    + Add New Loan
                </button>
            </div>

            {/* Filters */}
            <LoanFilters
                agents={Object.values(agentsMap)}
                onAgentChange={setAgentFilter}
                onSearch={setSearch}
            />

            {/* Table */}
            <LoanTable
                loans={filteredLoans}
                customersMap={customersMap}
                agentsMap={agentsMap}
            />
        </div>
    );
}

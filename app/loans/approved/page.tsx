'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FaFile } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/app/config/config';
import LoanTable from './LoanTable';
import LoanFilters from './LoanFilters';
import { useAuth } from '@/hooks/useAuth';
export default function ViewLoansPage() {
    const router = useRouter();
    const { user } = useAuth();

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
            const [loansRes, customersRes, agentsRes, loanTypesRes] = await Promise.all([
                axios.get(API_ENDPOINTS.GET_ALL_LOAN_APPLICATIONS, { withCredentials: true }),
                axios.get(API_ENDPOINTS.GET_ALL_CUSTOMERS, { withCredentials: true }),
                axios.get(API_ENDPOINTS.GET_ALL_AGENTS, { withCredentials: true }),
                axios.get(API_ENDPOINTS.GET_ALL_LOAN_TYPES, { withCredentials: true }), // 👈 new
            ]);
            const loans = loansRes.data;
            const customers = customersRes.data;
            const agents = agentsRes.data;
            const loanTypes = loanTypesRes.data;
            // Build lookup maps
            const customersMap = Object.fromEntries(customers.map((c: any) => [c.id, c]));
            const agentsMap = Object.fromEntries(agents.map((a: any) => [a.id, a]));
            const loanTypesMap = Object.fromEntries(loanTypes.map((lt: any) => [lt.id, lt]));
            // Merge data into loans
            const enrichedLoans = loans.map((loan: any) => ({
                ...loan,
                customer: customersMap[loan.customerId] || null,
                agent: agentsMap[loan.agentId] || null,
                loanType: loanTypesMap[loan.loanTypeId] || null, // 👈 key part
            }));

            setLoans(enrichedLoans);
            setCustomersMap(customersMap);
            setAgentsMap(agentsMap);
        })();
    }, []);
    // =========================
    // Filtered loans
    // =========================
    const filteredLoans = useMemo(() => {
        if (!user) return [];

        return loans.filter((loan: any) => {
            const customer = customersMap[loan.customerId];
            const agent = agentsMap[loan.agentId];
            const loanType = loan.loanType; // already merged


            // 🎯 Agent filter (UI filter)
            if (agentFilter && loan.agentId !== agentFilter) {
                return false;
            }

            // 🔍 Search
            if (search) {
                const term = search.toLowerCase();

                return (
                    customer?.applicantName?.toLowerCase().includes(term) ||
                    customer?.mobileNumber?.includes(term) ||
                    loan?.registrationNumber?.toLowerCase().includes(term) ||
                    loan?.chassisNumber?.toLowerCase().includes(term) ||
                    loan?.engineNumber?.toLowerCase().includes(term) ||
                    loanType?.loanName?.toLowerCase().includes(term) ||              // 👈 added
                    loanType?.vehicleCondition?.toLowerCase().includes(term)         // 👈 added
                );
            }

            return true;
        });
    }, [loans, customersMap, agentsMap, agentFilter, search, user]);


    return (
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">

            <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] mb-4">
                <FaFile className="text-orange-400 text-3xl" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View All Approved Loans</h2>
                    <p className="text-gray-600 mt-1">
                        Get a summary of all Approved Loans ready for Disbursement or Closure
                    </p>
                </div>
            </div>

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

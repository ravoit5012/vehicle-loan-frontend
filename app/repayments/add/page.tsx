'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import LoanSearchList from './LoanSearchList';
import RepaymentTable from './RepaymentTable';
import Loading from '@/app/components/Loading';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from "@/hooks/useAuth";
export default function RepaymentPage() {
    const [loans, setLoans] = useState<any[]>([]);
    const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
    const [repayments, setRepayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchLoans();
    }, []);

   const fetchLoans = async () => {
    setLoading(true);

    try {
        const res = await fetch(API_ENDPOINTS.GET_ALL_LOAN_APPLICATIONS, {
            credentials: 'include',
        });
        const data = await res.json();

        const validLoans = data.filter((l: any) => {
            // ✅ Status filter
            const isValidStatus =
                l.status === 'DISBURSED' || l.status === 'ACTIVE';

            if (!isValidStatus) return false;

            // ✅ Role-based filter
            if (user.role === "AGENT") {
                return l.agentId === user.id;
            }

            if (user.role === "MANAGER") {
                return l.managerId === user.id;
            }

            // ADMIN → no restriction
            return true;
        });

        setLoans(validLoans);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};
    const selectLoan = async (loan: any) => {
        setSelectedLoan(loan);

        const res = await fetch(
            `${API_ENDPOINTS.GET_REPAYMENTS_FOR_LOAN}/${loan.id}`,
            { credentials: 'include' }
        );

        const data = await res.json();
        setRepayments(data.repayments);
    };

    return (<>
    <Loading visible={loading} />
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex items-center space-x-4 bg-[#0078F8] rounded-lg p-6 mb-4">
                <FaPlus className="text-orange-400 text-3xl" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Add EMI Repayment</h2>
                    <p className="text-white mt-1">
                        Search and Select a loan Application to register an EMI Repayment
                    </p>
                </div>
            </div>

            {!selectedLoan ? (
                <LoanSearchList loans={loans} onSelect={selectLoan} />
            ) : (
                <RepaymentTable
                    loan={selectedLoan}
                    repayments={repayments}
                    onBack={() => {
                        setSelectedLoan(null);
                        setRepayments([]);
                    }}
                />
            )}
        </div></>
    );
}

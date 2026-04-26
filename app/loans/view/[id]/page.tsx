'use client';
import { FaInfo } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { API_ENDPOINTS } from '@/app/config/config';

import CustomerInfoCard from './CustomerInfoCard';
import LoanInfoCard from './LoanInfoCard';
import DocumentsSection from './DocumentsSection';
import HousePhotosGrid from './HousePhotosGrid';
import RepaymentScheduleTable from './RepaymentScheduleTable';
import { useAuth } from '@/hooks/useAuth';
import UploadSignedContract from './UploadSignedContract';
import VehicleDetailsCard from './VehicleDetailsCard';

export default function ViewLoanPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [loan, setLoan] = useState<any>(null);
    const [customer, setCustomer] = useState<any>(null);
    const [agent, setAgent] = useState<any>(null);

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const loanRes = await axios.get(`${API_ENDPOINTS.GET_LOAN_APPLICATION_BY_ID}/${id}`);

                // Extract data from the response
                const customerId = loanRes.data.customerId;
                const agentId = loanRes.data.agentId;
                const loanData = loanRes.data;

                setLoan(loanData);

                // Fetch customer and agent data in parallel
                const [customerRes, agentRes] = await Promise.all([
                    axios.get(`${API_ENDPOINTS.GET_CUSTOMER_BY_ID}/${customerId}`),
                    axios.get(`${API_ENDPOINTS.GET_AGENT_BY_ID}/${agentId}`)
                ]);

                // Set customer and agent data
                setCustomer(customerRes.data);
                setAgent(agentRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle the error appropriately (e.g., display an error message to the user)
            }
        })();

    }, [id]);

    if (!loan || !customer || !agent) {
        return <div className="p-6">Loading loan details...</div>;
    }

    return (
        <div className="relative z-10 w-full/50 p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="fixed top-0 -left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
            <div className="fixed top-20 -right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
            <div className="fixed -bottom-20 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl p-8 flex items-center justify-between transition-all duration-300 hover:shadow-indigo-500/10">
                    <div className="flex items-center space-x-5">
                        <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center transform -rotate-3 hover:rotate-0 transition duration-300">
                            <FaInfo className="text-white text-3xl drop-shadow-[0_8px_30px_rgb(0,0,0,0.04)]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">Loan Profile Context</h1>
                            <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">Reference Registry: {loan.id}</p>
                        </div>
                    </div>
                </header>


            {/* Rejection Remark */}
            {(loan.status.includes('REJECTED') || loan.status.includes('ADMIN_APPROVED') || loan.status.includes('DISBURSED')) && (
                <div
                    className={`border-l-4 p-4 rounded ${loan.status === 'REJECTED'
                        ? 'border-red-500 bg-red-50'
                        : loan.status === 'ADMIN_APPROVED'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-green-500 bg-green-50'
                        }`}
                >
                    <p
                        className={`font-medium ${loan.status === 'REJECTED'
                            ? 'text-red-700'
                            : loan.status === 'ADMIN_APPROVED'
                                ? 'text-blue-700'
                                : 'text-green-700'
                            }`}
                    >
                        {loan.status === 'REJECTED'
                            ? 'Rejection Remark'
                            : loan.status === 'ADMIN_APPROVED'
                                ? 'Admin Approval Remark'
                                : 'Disbursement Remark'}
                    </p>
                    <p
                        className={`text-sm ${loan.status === 'REJECTED'
                            ? 'text-red-600'
                            : loan.status === 'ADMIN_APPROVED'
                                ? 'text-blue-600'
                                : 'text-green-600'
                            }`}
                    >
                        {loan.remark || 'No remark provided'}
                    </p>
                </div>

            )}

            {loan.status === 'CONTRACT_GENERATED' && (
                <UploadSignedContract loanId={loan.id} />
            )}

            {/* Customer + Loan Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustomerInfoCard customer={customer} agent={agent} />
                <LoanInfoCard loan={loan} />
            </div>

            {/* Vehicle Info */}
            <VehicleDetailsCard
                loan={loan}
                user={user}
                customer={customer}
                onUpdate={() => window.location.reload()}
            />

            {/* Documents */}
            <DocumentsSection loan={loan} customer={customer} />

            {/* House Photos */}
            {loan.housePhotos?.length > 0 && (
                <HousePhotosGrid photos={loan.housePhotos} />
            )}

            {/* Repayment Schedule */}
            <RepaymentScheduleTable repayments={loan.repayments} />
            </div>
        </div>
    );
}

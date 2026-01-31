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
        <div className="w-full mx-auto p-6 space-y-8">
            {/* Header */}
            {/* <div className="flex flex-col md:flex-row justify-start gap-4 items-center md:items-start"> */}

            <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4 w-full md:w-auto">
                <FaInfo className="text-orange-400 text-3xl" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Loan Application Details</h2>
                    <p className="text-gray-600 mt-1">
                        Loan ID: {loan.id}
                    </p>
                </div>
            </div>

            {/* Assuming StatusBadge is a custom component that takes a 'status' prop */}


            {/* </div> */}


            {/* Rejection Remark */}
            {loan.status.includes('REJECTED') && (
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                    <p className="font-medium text-red-700">
                        Rejection Remark
                    </p>
                    <p className="text-sm text-red-600">
                        {loan.rejectionRemark || 'No remark provided'}
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

            {/* Documents */}
            <DocumentsSection loan={loan} customer={customer} />

            {/* House Photos */}
            {loan.housePhotos?.length > 0 && (
                <HousePhotosGrid photos={loan.housePhotos} />
            )}

            {/* Repayment Schedule */}
            <RepaymentScheduleTable repayments={loan.repayments} />
        </div>
    );
}

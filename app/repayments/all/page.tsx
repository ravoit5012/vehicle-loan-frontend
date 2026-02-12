'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import RepaymentAccordion from './components/RepaymentAccordion';
import Loading from '@/app/components/Loading';
import { FaCalendarCheck, FaSearch } from 'react-icons/fa';
export default function AllRepaymentsPage() {
    const [data, setData] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);

        const res = await fetch(API_ENDPOINTS.GET_ALL_REPAYMENTS, {
            credentials: 'include',
        });
        const loans = await res.json();

        const enriched = [];

        for (const loan of loans) {
            const loanRes = await fetch(
                `${API_ENDPOINTS.GET_LOAN_APPLICATION_BY_ID}/${loan.loanId}`,
                { credentials: 'include' }
            );
            const loanDetails = await loanRes.json();

            const customerRes = await fetch(
                `${API_ENDPOINTS.GET_CUSTOMER_BY_ID}/${loanDetails.customerId}`,
                { credentials: 'include' }
            );
            const customer = await customerRes.json();

            enriched.push({
                loanId: loan.loanId,
                remainingAmount: loan.remainingAmount,
                repayments: loan.repayments,
                customerName: customer.applicantName,
                customerMobile: customer.mobileNumber,
            });
        }

        setData(enriched);
        setLoading(false);
    }

    const filtered = data.filter(d =>
        `${d.customerName}${d.customerMobile}${d.loanId}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );



    return (<>
    <Loading visible={loading} />
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
                <FaCalendarCheck className="text-orange-400 text-3xl" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View All Repayments Schedule</h2>
                    <p className="text-gray-600 mt-1">
                        Keep a track of all the repayment Schedules
                    </p>
                </div>
            </div>
            <div className="relative border-2 rounded-xl p-2 md:w-[50vw] max-w-[500px] mx-auto">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                    className="input pl-10 w-full"
                    placeholder="Search by name / mobile / loan ID"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                {filtered.map((item, i) => (
                    <RepaymentAccordion key={i} data={item} />
                ))}
            </div>
        </div></>
    );
}

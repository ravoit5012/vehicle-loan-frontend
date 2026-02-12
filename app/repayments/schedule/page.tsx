'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import RepaymentAccordion from './components/RepaymentAccordion';
import Loading from '@/app/components/Loading';
import { FaClock, FaSearch } from 'react-icons/fa';
import UpcomingEmiCards from './components/UpcomingEmiCards';
import OverdueEmiCards from './components/OverdueEmiCards';

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

    const today = new Date();

    const within45Days = (date: string) => {
        const due = new Date(date);
        const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 45;
    };

    const isOverdue = (emi: any) =>
        emi.status !== 'PAID' && new Date(emi.dueDate) < today;

    const upcomingEmis = data
        .flatMap(d =>
            d.repayments.map((emi: any) => ({
                ...emi,
                loanId: d.loanId,
                customerName: d.customerName,
                customerMobile: d.customerMobile,
            }))
        )
        .filter(
            emi =>
                within45Days(emi.dueDate) &&
                emi.status !== 'PAID'
        )
        .sort(
            (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
        .slice(0, 5);

    const overdueEmis = data
        .flatMap(d =>
            d.repayments.map((emi: any) => ({
                ...emi,
                loanId: d.loanId,
                customerName: d.customerName,
                customerMobile: d.customerMobile,
            }))
        )
        .filter(
            emi =>
                emi.status !== 'PAID' &&
                new Date(emi.dueDate) < today
        )
        .sort(
            (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );

    const filtered = data
        .map(d => ({
            ...d,
            repayments: d.repayments.filter(
                (emi: any) =>
                    within45Days(emi.dueDate) || isOverdue(emi)
            ),
        }))
        .filter(d => d.repayments.length > 0)
        .filter(d =>
            `${d.customerName}${d.customerMobile}${d.loanId}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );



    return (
        <>
            <Loading visible={loading} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero Section */}
                <div className="flex items-center bg-gray-50 rounded-lg p-6 shadow-md">
                    <FaClock className="text-orange-500 text-4xl" />
                    <div className="ml-4">
                        <h2 className="text-3xl font-semibold text-gray-900">
                            View Your Repayments
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Keep track of your upcoming and overdue repayments.
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative border rounded-xl p-3 bg-white shadow-sm">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        className="w-full pl-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search by name / mobile / loan ID"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Overdue and Upcoming EMIs Sections */}
                {overdueEmis.length > 0 && (
                    <OverdueEmiCards emis={overdueEmis} />
                )}

                <UpcomingEmiCards emis={upcomingEmis} />

                {/* Filtered Repayment Accordion */}
                <div className="space-y-6">
                    {filtered.map((item, i) => (
                        <RepaymentAccordion key={i} data={item} />
                    ))}
                </div>
            </div></>
    );
}

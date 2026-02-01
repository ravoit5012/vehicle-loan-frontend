'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import FeesTable from './FeesTable';
import { FaSearch } from 'react-icons/fa';
import Loading from '@/app/components/Loading';
import { FaHistory } from 'react-icons/fa';

export default function CollectFeesPage() {
    const [fees, setFees] = useState<any[]>([]);
    const [filteredFees, setFilteredFees] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(API_ENDPOINTS.GET_ALL_FEES, {
                    credentials: 'include',
                });
                const data = await res.json();

                const paid = data.filter((f: any) => f.paid);
                setFees(paid);
                setFilteredFees(paid);
            } catch (err) {
                alert('Failed to load fees');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // 🔍 Search filter
    useEffect(() => {
        const q = search.toLowerCase();

        setFilteredFees(
            fees.filter(f =>
                f.customerName.toLowerCase().includes(q) ||
                f.customermobileNumber.includes(q) ||
                f.loanId.toLowerCase().includes(q)
            )
        );
    }, [search, fees]);

    if (loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
                    <FaHistory className="text-orange-400 text-3xl" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Fee Payment History</h2>
                        <p className="text-gray-600 mt-1">
                            Check your Fee Payment History Here
                        </p>
                    </div>
                </div>


                {/* 🔍 Search Box */}
                <div className="relative hover:scale-105 ease-in-out transition-all duration-300 border-2 p-2 rounded-xl border-black">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2" />

                    <input
                        type="text"
                        placeholder="Search by name / mobile / loan ID"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input text-gray-800 md:w-80 pl-10"
                    />
                </div>

            </div>

            <FeesTable fees={filteredFees} />
        </div>
    );
}

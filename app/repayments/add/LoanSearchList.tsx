import { useState } from 'react';
import LoanCard from './LoanCard';
import { FaSearch } from 'react-icons/fa';

export default function LoanSearchList({ loans, onSelect }: any) {
    const [search, setSearch] = useState('');

    const filtered = loans.filter((l: any) =>
        l.id.toLowerCase().includes(search.toLowerCase()) ||
        l.customerId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative w-full max-w-md mx-auto">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                    placeholder="Search by Loan ID / Customer ID"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Loan Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.length > 0 ? (
                    filtered.map((loan: any) => (
                        <div
                            key={loan.id}
                            className="cursor-pointer transform transition hover:scale-105"
                            onClick={() => onSelect(loan)}
                        >
                            <LoanCard loan={loan} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No loans found.
                    </p>
                )}
            </div>
        </div>
    );
}

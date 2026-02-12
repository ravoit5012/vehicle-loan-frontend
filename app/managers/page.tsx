'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import ManagerTable from './components/ManagerTable';
import Loading from '@/app/components/Loading';
import { FaEye, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ManagersPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [managers, setManagers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchManagers();
    }, []);

    async function fetchManagers() {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.GET_ALL_MANAGERS, {
            credentials: 'include',
        });
        const data = await res.json();
        setManagers(data);
        setLoading(false);
    }

    const filtered = managers.filter(a =>
        `${a.name}${a.phoneNumber}${a.agentCode}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    return (<>
        <Loading visible={loading} />
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
                    <FaEye className="text-orange-400 text-3xl" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">View your Managers</h2>
                        {/* <p className="text-gray-600 mt-1">
                            Create a comprehensive customer profile with personal and account information
                        </p> */}
                    </div>
                </div>
                <button
                    onClick={() => router.push('/managers/create')}
                    className="bg-blue-600 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Manager
                </button>
            </div>
            <div className="relative border-2 p-2 rounded-xl">
                <FaSearch className="absolute top-3 left-3 text-gray-400" />
                <input
                    className="input pl-10 w-full"
                    placeholder="Search by name / phone / manager code"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <ManagerTable managers={filtered} />
        </div>
    </>);
}

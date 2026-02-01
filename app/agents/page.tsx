'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import AgentTable from './components/AgentTable';
import Loading from '@/app/components/Loading';
import { FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchAgents();
    }, []);

    async function fetchAgents() {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.GET_ALL_AGENTS, {
            credentials: 'include',
        });
        const data = await res.json();
        setAgents(data);
        setLoading(false);
    }

    const filtered = agents.filter(a =>
        `${a.name}${a.phoneNumber}${a.agentCode}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
                    <FaEye className="text-orange-400 text-3xl" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">View your Agents</h2>
                        {/* <p className="text-gray-600 mt-1">
                                    Create a comprehensive customer profile with personal and account information
                                </p> */}
                    </div>
                </div>
                <button
                    onClick={() => router.push('/agents/create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <FaPlus /> Add Agent
                </button>
            </div>

            <div className="relative border-2 p-2 rounded-xl">
                <FaSearch className="absolute top-3 left-3 text-gray-400" />
                <input
                    className="input pl-10 w-full"
                    placeholder="Search by name / phone / agent code"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <AgentTable agents={filtered} />
        </div>
    );
}

'use client';

import AgentForm from '../components/AgentForm';
import { API_ENDPOINTS } from '@/app/config/config';
import { useRouter } from 'next/navigation';
import { FaUserPlus } from 'react-icons/fa';

export default function CreateAgentPage() {
    const router = useRouter();

    async function handleSubmit(data: any) {
        const res = await fetch(API_ENDPOINTS.CREATE_AGENT, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            alert('Agent created successfully');
            router.push('/agents');
        } else {
            alert('Failed to create agent');
        }
    }

    return (<>
        <div className="flex items-center space-x-4 bg-gray-100 m-2 mt-4 rounded-lg p-6 mb-4">
            <FaUserPlus className="text-orange-400 text-3xl" />
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Agent</h2>
                {/* <p className="text-gray-600 mt-1">
                    Create a a
                </p> */}
            </div>
        </div>
        <AgentForm
            title="Create Agent"
            onSubmit={handleSubmit}
        /></>
    );
}

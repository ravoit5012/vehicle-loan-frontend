'use client';

import AgentForm from '../components/AgentForm';
import { API_ENDPOINTS } from '@/app/config/config';
import { useRouter } from 'next/navigation';
import { FaUserPlus } from 'react-icons/fa';
import { useState } from 'react';

export default function CreateAgentPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);


    // async function handleSubmit(data: any) {
    //     const res = await fetch(API_ENDPOINTS.CREATE_AGENT, {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(data),
    //     });

    //     if (res.ok) {
    //         alert('Agent created successfully');
    //         router.push('/agents');
    //     } else {
    //         const message =
    //             error?.response?.data?.message ||
    //             error?.message ||
    //             'Something went wrong';

    //         setError(message);
    //         alert(error);
    //     }
    // }
    async function handleSubmit(data: any) {
        try {
            const res = await fetch(API_ENDPOINTS.CREATE_AGENT, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json(); // 👈 always parse body

            if (!res.ok) {
                console.log("Full response:", result);

                let message = 'Something went wrong';

                if (typeof result?.message === 'string') {
                    message = result.message;
                }
                else if (Array.isArray(result?.message)) {
                    message = result.message.join(', ');
                }
                else if (typeof result?.message === 'object') {
                    message = result.message?.message || JSON.stringify(result.message);
                }

                setError(message);
                alert(`Error Creating Agent: ${message}`);
                return;
            }

            alert('Agent created successfully');
            router.push('/agents');

        } catch (err) {
            // Network error (server down, no internet, etc.)
            setError('Server error. Please try again.');
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

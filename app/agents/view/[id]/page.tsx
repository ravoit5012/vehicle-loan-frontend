'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import AgentForm from '../../components/AgentForm';
import DeleteAgentModal from '../../components/DeleteAgentModal';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/app/components/Loading';
import { FaPencil } from 'react-icons/fa6';

export default function ViewAgentPage() {
    const { id } = useParams();
    const router = useRouter();
    const [agent, setAgent] = useState<any>(null);
    const [showDelete, setShowDelete] = useState(false);
    useEffect(() => {
        if (!id) return;
        fetchAgent();
    }, [id]);

    async function fetchAgent() {
        const res = await fetch(`${API_ENDPOINTS.GET_AGENT_BY_ID}/${id}`, {
            credentials: 'include',
        });
        setAgent(await res.json());
    }

    async function handleUpdate(data: any) {
        const { id, agentCode, createdAt, tokenVersion, ...rest } = data;

        try {
            const res = await fetch(`${API_ENDPOINTS.UPDATE_AGENT}/${id}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rest),
            });

            const result = await res.json();

            if (res.ok) {
                alert('Agent updated successfully');
                router.push('/agents');
            } else {

                let message = 'Failed to update agent';

                if (typeof result?.message === 'string') {
                    message = result.message;
                }
                else if (Array.isArray(result?.message)) {
                    message = result.message.join(', ');
                }
                else if (typeof result?.message === 'object') {
                    message = result.message?.message || JSON.stringify(result.message);
                }

                alert(`Error: ${message}`);
            }
        } catch (err) {
            alert('Server error. Please try again.');
        }
    }

    if (!agent) {
        return <Loading visible={true} />;
    }


    return (
        <>
            <div className="flex items-center m-2 my-4 space-x-4 bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] mb-4">
                <FaPencil className="text-orange-400 text-3xl" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">View / Edit Agent</h2>
                    <p className="text-gray-600 mt-1">
                        View or Edit Details for the agent
                    </p>
                </div>
            </div>
            <AgentForm
                title="Edit Agent"
                initialData={agent}
                isEdit
                onSubmit={handleUpdate}
            />

            <div className="text-center hover:cursor-pointer mt-4">
                <button
                    onClick={() => setShowDelete(true)}
                    className="text-white bg-red-400 hover:bg-red-500 hover:cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 p-2 px-4 rounded-lg my-4"
                >
                    Delete Agent
                </button>
            </div>

            {showDelete && (
                <DeleteAgentModal
                    id={id as string}
                    onClose={() => setShowDelete(false)}
                />
            )}
        </>
    );
}

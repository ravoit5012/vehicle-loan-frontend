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
        const { id, agentCode, createdAt, ...rest } = data;

        const res = await fetch(`${API_ENDPOINTS.UPDATE_AGENT}/${id}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rest),
        });


        if (res.ok) {
            alert('Agent updated');
            router.push('/agents');
        } else {
            alert('Failed to update agent');
        }
    }

    if (!agent) {
        return <Loading visible={true} />;
    }


    return (
        <>
            <div className="flex items-center m-2 my-4 space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
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

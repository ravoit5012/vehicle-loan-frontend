'use client';

import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

export default function AgentTable({ agents }: { agents: any[] }) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-225 w-full text-sm">
        <thead>
          <tr className="bg-linear-to-r from-gray-50 border-b border-gray-200 bg-white to-gray-100 text-gray-600">
            <th className="px-4 py-4 text-left font-semibold">Agent</th>
            <th className="px-4 py-4 text-left font-semibold">Code</th>
            <th className="px-4 py-4 text-left font-semibold">Phone</th>
            <th className="px-4 py-4 text-left font-semibold">Email</th>
            <th className="px-4 py-4 text-left font-semibold">Status</th>
            <th className="px-4 py-4 text-right font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {agents.map((agent) => (
            <tr
              key={agent.id}
              className="group transition-colors border-gray-200 bg-white hover:bg-blue-50/40"
            >
              <td className="px-4 py-4 font-medium text-gray-900">
                {agent.name}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {agent.agentCode}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {agent.phoneNumber}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {agent.email}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold
                    ${
                      agent.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      agent.status === 'ACTIVE'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    }`}
                  />
                  {agent.status}
                </span>
              </td>

              <td className="px-4 py-4 text-right">
                <button
                  onClick={() => router.push(`/agents/view/${agent.id}`)}
                  className="inline-flex flex-row cursor-pointer hover:scale-105 transition-all items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm ease-in-out duration-300
                             hover:bg-blue-700 hover:shadow-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Eye className='inline-block mr-2' size={14} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {agents.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          No agents found
        </div>
      )}
    </div>
  );
}

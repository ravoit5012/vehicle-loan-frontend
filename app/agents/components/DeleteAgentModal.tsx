'use client';

import { API_ENDPOINTS } from '@/app/config/config';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteAgentModalProps {
  id: string;
  onClose: () => void;
}

export default function DeleteAgentModal({ id, onClose }: DeleteAgentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.DELETE_AGENT}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert('Agent deleted successfully');
        router.push('/agents');
      } else {
        const error = await res.text();
        alert(`Failed to delete: ${error}`);
      }
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-red-600 mb-2 text-center">Delete Agent?</h2>
        <p className="text-gray-700 text-center mb-6">
          This action cannot be undone. Are you sure you want to proceed?
        </p>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-medium w-full sm:w-auto transition-all duration-300
              ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
            `}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

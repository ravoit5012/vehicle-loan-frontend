'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/app/config/config';
import ManagerDetailsCard from './components/ManagerDetailsCard';
import EditManagerModal from '../../components/EditManagerModal';
import DeleteManagerModal from '../../components/DeleteManagerModal';
import Loading from '@/app/components/Loading';

export default function ViewManagerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [manager, setManager] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchManager();
  }, [id]);

  async function fetchManager() {
    const res = await fetch(`${API_ENDPOINTS.GET_MANAGER_BY_ID}/${id}`, {
      credentials: 'include',
    });
    const data = await res.json();
    setManager(data);
  }
  if (!manager) {
    return <Loading visible={true} />;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <ManagerDetailsCard manager={manager} />

        <div className="flex gap-4">
          <button
            onClick={() => setEditOpen(true)}
            className="bg-yellow-500 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="bg-red-500 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>

        {editOpen && (
          <EditManagerModal
            manager={manager}
            onClose={() => setEditOpen(false)}
            onUpdated={fetchManager}
          />
        )}

        {deleteOpen && (
          <DeleteManagerModal
            managerId={id as string}
            onClose={() => setDeleteOpen(false)}
            onDeleted={() => router.push('/managers')}
          />
        )}
      </div></>
  );
}

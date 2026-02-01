'use client';

import { API_ENDPOINTS } from '@/app/config/config';

export default function DeleteManagerModal({ managerId, onClose, onDeleted }: any) {
  async function confirm() {
    await fetch(`${API_ENDPOINTS.DELETE_MANAGER}/${managerId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    onDeleted();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-6 transform transition-transform duration-300 ease-in-out scale-100 hover:scale-[1.02]">
        <h3 className="text-xl sm:text-2xl font-bold text-red-600 text-center">Delete Manager?</h3>
        <p className="text-gray-700 text-center">
          Are you sure you want to delete this manager? <br></br> This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className="w-full sm:w-auto px-4 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

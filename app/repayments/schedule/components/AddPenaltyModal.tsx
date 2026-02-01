import { API_ENDPOINTS } from "@/app/config/config";
import { useState } from "react";

export default function AddPenaltyModal({ loanId, emi, onClose }: any) {
    const [penalty, setPenalty] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!penalty || isNaN(Number(penalty))) {
            alert("Please enter a valid penalty amount.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_ENDPOINTS.ADD_PENALTY}/${loanId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emiNumber: emi.emiNumber,
                    penaltyAmount: Number(penalty),
                }),
            });

            if (!res.ok) throw new Error('Failed to add penalty');

            alert('Penalty added successfully!');
            window.location.reload();
        } catch (err: any) {
            alert(err.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 transform transition-transform scale-100 sm:p-8">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Add Penalty
                </h3>

                <input
                    type="number"
                    className="w-full px-4 py-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 mb-6"
                    placeholder="Penalty Amount"
                    value={penalty}
                    onChange={e => setPenalty(e.target.value)}
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding...' : 'Add'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 border cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

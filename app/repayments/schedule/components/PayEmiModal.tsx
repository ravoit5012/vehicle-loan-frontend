import { useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';

export default function PayEmiModal({ loanId, emi, onClose }: any) {
  const [amount, setAmount] = useState('');
  const [txn, setTxn] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!amount || !txn) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.PAY_REPAYMENT}/${loanId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emiNumber: emi.emiNumber,
          paidAmount: Number(amount),
          paymentMethod: 'CASH',
          transactionId: txn,
        }),
      });

      if (res.ok) {
        alert('Payment recorded successfully!');
        window.location.reload();
      } else {
        alert('Failed to record payment.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 sm:p-8 transition-all">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Pay EMI #{emi.emiNumber}
        </h3>

        <div className="flex flex-col gap-4">
          <input
            type="number"
            className="input px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <input
            type="text"
            className="input px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Transaction ID"
            value={txn}
            onChange={e => setTxn(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={submit}
            disabled={loading}
            className="btn-primary w-full cursor-pointer sm:w-auto px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 outline outline-white/30 hover:shadow-lg hover:-translate-y-0.5 transition-all text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
          <button
            onClick={onClose}
            className="btn-secondary w-full sm:w-auto cursor-pointer px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white/40 backdrop-blur-md border border-white/50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

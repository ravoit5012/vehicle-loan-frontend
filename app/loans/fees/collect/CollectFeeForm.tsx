'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import Loading from '@/app/components/Loading';

export default function CollectFeeForm({ fee }: { fee: any }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!paymentMethod || !transactionId) {
      return alert('Please fill all fields');
    }

    try {
      setLoading(true);

      const res = await fetch(API_ENDPOINTS.FEES_PAYMENT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: fee.id,
          loanId: fee.loanId,
          paymentMethod,
          transactionId,
        }),
      });

      if (!res.ok) throw new Error('Payment failed');

      alert('Fee payment recorded successfully');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error collecting fee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading visible={loading} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm m-2 text-gray-800">
            Payment Method
          </label>
          <select
            className="input border-2 border-black cursor-pointer rounded-lg mt-2 p-2 w-full"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <option value="">Select</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="text-sm m-2 text-gray-800">
            Transaction ID
          </label>
          <input
            className="input border-2 border-black rounded-lg mt-2 p-2 w-full"
            placeholder="UTR / Reference No"
            value={transactionId}
            onChange={e => setTransactionId(e.target.value)}
          />
        </div>

        <button
          onClick={submit}
          className="bg-green-600 hover:scale-105 ease-in-out cursor-pointer transition-all duration-300 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Collect Fees
        </button>
      </div>
    </>
  );
}

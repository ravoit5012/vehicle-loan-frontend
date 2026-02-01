'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PayEmiModal from './PayEmiModal';
import AddPenaltyModal from './AddPenaltyModal';

export default function EmiCard({ emi, variant }: any) {
  const router = useRouter();
  const [payOpen, setPayOpen] = useState(false);
  const [penaltyOpen, setPenaltyOpen] = useState(false);

  const isOverdue = variant === 'overdue';

  return (
    <>
      <div
        className={`rounded-xl p-6 space-y-4 shadow-lg transition-all duration-300 ease-in-out transform ${
          isOverdue
            ? 'bg-red-50 border-red-500 hover:scale-105'
            : 'bg-white border-gray-200 hover:shadow-xl'
        } max-w-md mx-auto`}
      >
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-xl text-gray-800">{emi.customerName}</div>
          <div className="text-sm text-gray-500">{emi.customerMobile}</div>

          <div className="flex justify-between text-sm text-gray-700">
            <span>EMI #{emi.emiNumber}</span>
            <span>₹ {emi.emiAmount.toFixed(2)}</span>
          </div>

          <div className="text-sm text-gray-600">
            Due: {new Date(emi.dueDate).toLocaleDateString()}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-start pt-3">
          <button
            onClick={() => setPayOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out text-sm"
          >
            Pay
          </button>

          <button
            onClick={() => setPenaltyOpen(true)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out text-sm"
          >
            Add Penalty
          </button>

          <button
            onClick={() => router.push(`/loans/view/${emi.loanId}`)}
            className="text-blue-600 underline hover:text-blue-700 transition duration-200 ease-in-out text-sm"
          >
            View Loan
          </button>
        </div>
      </div>

      {payOpen && (
        <PayEmiModal
          loanId={emi.loanId}
          emi={emi}
          onClose={() => setPayOpen(false)}
        />
      )}

      {penaltyOpen && (
        <AddPenaltyModal
          loanId={emi.loanId}
          emi={emi}
          onClose={() => setPenaltyOpen(false)}
        />
      )}
    </>
  );
}

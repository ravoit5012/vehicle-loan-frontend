import { useState } from 'react';
import PayEmiModal from './PayEmiModal';
import AddPenaltyModal from './AddPenaltyModal';

export default function EmiRow({ emi, loanId }: any) {
  const [payOpen, setPayOpen] = useState(false);
  const [penaltyOpen, setPenaltyOpen] = useState(false);

  // Status colors
  const statusColors: Record<string, string> = {
    PAID: 'text-green-700 bg-green-100',
    PENDING: 'text-yellow-700 bg-yellow-100',
    OVERDUE: 'text-red-700 bg-red-100',
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition">
        <td className="p-3 font-medium text-gray-700 dark:text-gray-200">{emi.emiNumber}</td>
        <td className="p-3 text-gray-600 dark:text-gray-300">
          {new Date(emi.dueDate).toLocaleDateString()}
        </td>
        <td className="p-3 text-gray-700 dark:text-gray-100">₹ {emi.emiAmount.toLocaleString()}</td>
        <td className="p-3 text-gray-700 dark:text-gray-100">₹ {emi.paidAmount.toLocaleString()}</td>
        <td className="p-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[emi.status] || 'text-gray-600 bg-gray-100'}`}
          >
            {emi.status}
          </span>
        </td>
        <td className="p-3 flex flex-wrap gap-2">
          {emi.status !== 'PAID' && (
            <>
              <button
                onClick={() => setPayOpen(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Pay
              </button>
              <button
                onClick={() => setPenaltyOpen(true)}
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition"
              >
                Penalty
              </button>
            </>
          )}
        </td>
      </tr>

      {/* Pay EMI Modal */}
      {payOpen && (
        <PayEmiModal
          loanId={loanId}
          emi={emi}
          onClose={() => setPayOpen(false)}
        />
      )}

      {/* Add Penalty Modal */}
      {penaltyOpen && (
        <AddPenaltyModal
          loanId={loanId}
          emi={emi}
          onClose={() => setPenaltyOpen(false)}
        />
      )}
    </>
  );
}

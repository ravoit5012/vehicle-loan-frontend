'use client';

import { useState } from 'react';
import CollectFeeForm from './CollectFeeForm';

export default function FeeRow({ fee }: { fee: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-t hover:bg-transparent border-t border-white/40">
        <td className="px-4 py-3 font-medium">
          {fee.customerName}
        </td>
        <td className="px-4 py-3">
          {fee.customermobileNumber}
        </td>
        <td className="px-4 py-3 text-xs text-gray-600">
          {fee.loanId}
        </td>
        <td className="px-4 py-3">
          ₹ {fee.totalFees}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => setOpen(!open)}
            className="bg-blue-500 cursor-pointer hover:scale-105 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
          >
            {open ? 'Close' : 'Collect'}
          </button>
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={5} className="bg-transparent border-t border-white/40 px-6 py-4">
            <CollectFeeForm fee={fee} />
          </td>
        </tr>
      )}
    </>
  );
}

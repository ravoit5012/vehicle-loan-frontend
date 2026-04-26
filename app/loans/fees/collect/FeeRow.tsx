'use client';

import { useState } from 'react';
import CollectFeeForm from './CollectFeeForm';

export default function FeeRow({ fee }: { fee: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-t hover:bg-transparent border-t border-white/40">
        <td className="px-4 py-3">
          <div className="font-medium">{fee.customer.applicantName}</div>
          <div className="text-xs text-gray-500">
            {fee.customer.mobileNumber}
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="font-medium"> ₹ {fee.loan.loanAmount}</div>
          <div className="text-xs text-gray-500">
            {fee.loan.interestRate}% ({fee.loan.interestType})
          </div>
          <div className="text-xs text-gray-500">
            {fee.loan.loanDuration} months
          </div>
        </td>

        <td className="px-4 py-3">
          <div>{fee.loan.loanType?.loanName}</div> <div>{fee.loan.loanType?.vehicleCondition.charAt(0).toUpperCase() + fee.loan.loanType?.vehicleCondition.slice(1).toLowerCase()} Vehicle Loan</div>
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

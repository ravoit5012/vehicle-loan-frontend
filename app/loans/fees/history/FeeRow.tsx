'use client';

import { useState } from 'react';

export default function FeeRow({ fee }: { fee: any }) {

  const date = new Date(fee.updatedAt);

  const readable = date.toLocaleString();

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
        <td className="px-4 py-3">
          {fee.receiptUrl ? (
            <a
              href={fee.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View Receipt
            </a>
          ) : (
            <span className="text-gray-400 text-xs italic">No receipt</span>
          )}
        </td>
        <td className="px-4 py-3 text-right">
          {new Date(fee.updatedAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}

        </td>
      </tr>
    </>
  );
}

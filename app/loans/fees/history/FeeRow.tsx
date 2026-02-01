'use client';

import { useState } from 'react';

export default function FeeRow({ fee }: { fee: any }) {

  const date = new Date(fee.updatedAt);

  const readable = date.toLocaleString();

  return (
    <>
      <tr className="border-t hover:bg-gray-50">
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

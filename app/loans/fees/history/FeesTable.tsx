'use client';

import FeeRow from './FeeRow';
import { FaCheckCircle } from 'react-icons/fa';
export default function FeesTable({ fees }: { fees: any[] }) {
  if (fees.length === 0) {
    return (
      <div className="card mx-auto mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 p-6 text-center shadow-sm">
        <FaCheckCircle className="text-4xl text-green-600" />
        <p className="text-lg font-semibold text-green-700">
          No have no fees collection history
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Loan ID</th>
            <th className="px-4 py-3">Total Fees</th>
            <th className="px-4 py-3 text-right">Collected at </th>
          </tr>
        </thead>

        <tbody>
          {fees.map(fee => (
            <FeeRow key={fee.id} fee={fee} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

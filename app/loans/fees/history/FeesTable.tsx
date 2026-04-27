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
        <thead className="bg-transparent border-t border-white/40">
          <tr>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-left">Loan Details</th>
            <th className="px-4 py-3 text-left">Loan Type</th>
            <th className="px-4 py-3 text-left">Total Fees</th>
            <th className="px-4 py-3 text-left">Payment Method</th>
            <th className="px-4 py-3 text-left">Transaction / Collected By</th>
            <th className="px-4 py-3 text-left">Payment Receipt</th>
            <th className="px-4 py-3 text-left">Customer Receipt</th>
            <th className="px-4 py-3 text-right">Collected At</th>
            <th className="px-4 py-3 text-right"></th>
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

'use client';

import { useRouter } from 'next/navigation';
import StatusBadge from './StatusBadge';

export default function LoanRow({
  loan,
  customer,
  agent,
}: {
  loan: any;
  customer: any;
  agent: any;
}) {
  const router = useRouter();

  return (
    <tr className="border-t hover:bg-gray-50 transition">
      <td className="px-4 py-3">
        <div className="font-medium">{customer?.applicantName}</div>
        <div className="text-xs text-gray-500">
          {customer?.mobileNumber}
        </div>
      </td>

      <td className="px-4 py-3">₹ {loan.loanAmount}</td>

      <td className="px-4 py-3">
        {loan.interestRate}% ({loan.interestType})
      </td>

      <td className="px-4 py-3">
        {loan.loanDuration} months
      </td>

      <td className="px-4 py-3">
        <div>Interest: ₹ {loan.totalInterest}</div>
        <div className="text-xs text-gray-500">
          Total: ₹ {loan.totalPayableAmount}
        </div>
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={loan.status} />
      </td>

      <td className="px-4 py-3">{agent?.name}</td>

      <td className="px-4 py-3 text-right">
        <button
          onClick={() => router.push(`/loans/view/${loan.id}`)}
          className="cursor-pointer bg-blue-400 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
        >
          View
        </button>
      </td>
    </tr>
  );
}

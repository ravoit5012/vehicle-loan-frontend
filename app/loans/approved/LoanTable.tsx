'use client';

import LoanRow from './LoanRow';

interface Props {
  loans: any[];
  customersMap: Record<string, any>;
  agentsMap: Record<string, any>;
}

export default function LoanTable({
  loans,
  customersMap,
  agentsMap,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Loan</th>
            <th className="px-4 py-3">Interest</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Totals</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applied By</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {loans.map(loan => (
            <LoanRow
              key={loan.id}
              loan={loan}
              customer={customersMap[loan.customerId]}
              agent={agentsMap[loan.agentId]}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

import EmiRow from './EmiRow';

export default function EmiTable({ loanId, repayments }: any) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              EMI
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              EMI Amt
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              Paid
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {repayments.map((emi: any) => (
            <EmiRow key={emi.emiNumber} emi={emi} loanId={loanId} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

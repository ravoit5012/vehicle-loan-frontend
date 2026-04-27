export default function RepaymentScheduleTable({
  repayments,
}: {
  repayments: any[];
}) {
  return (
    <div className="card overflow-x-auto">
      <h2 className="section-title mb-4">Repayment Schedule</h2>

      <table className="min-w-full text-sm">
        <thead className="bg-transparent border-t border-white/40">
          <tr>
            <th className="px-3 py-2 text-left">EMI</th>
            <th className="px-3 py-2 text-left">Due Date</th>
            <th className="px-3 py-2 text-left">EMI Amount</th>
            <th className="px-3 py-2 text-left">Principal</th>
            <th className="px-3 py-2 text-left">Interest</th>
            <th className="px-3 py-2 text-left">Paid</th>
            <th className="px-3 py-2 text-left">Paid Date</th>
            <th className="px-3 py-2 text-left">Transaction / Collected By</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Proof</th>
            <th className="px-3 py-2 text-left">Customer Receipt</th>
          </tr>
        </thead>

        <tbody>
          {repayments.map((r: any) => {
            const statusColors: Record<string, string> = {
              PAID: 'bg-green-100 text-green-700',
              PENDING: 'bg-yellow-100 text-yellow-700',
              OVERDUE: 'bg-red-100 text-red-700',
              PARTIAL: 'bg-orange-100 text-orange-700',
            };

            return (
              <tr key={r.emiNumber} className="border-t hover:bg-gray-50/40 transition">
                <td className="px-3 py-2 font-medium">{r.emiNumber}</td>
                <td className="px-3 py-2 text-gray-600">
                  {new Date(r.dueDate).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </td>
                <td className="px-3 py-2 font-medium">₹ {r.emiAmount?.toLocaleString()}</td>
                <td className="px-3 py-2 text-gray-600">₹ {r.principalAmount?.toLocaleString()}</td>
                <td className="px-3 py-2 text-gray-600">₹ {r.interestAmount?.toLocaleString()}</td>
                <td className="px-3 py-2 font-semibold text-green-700">
                  ₹ {r.paidAmount?.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-gray-600 text-xs">
                  {r.paidDate
                    ? new Date(r.paidDate).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className="px-3 py-2">
                  {r.transactionId ? (
                    <span className="font-mono text-xs">{r.transactionId}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    statusColors[r.status] ?? 'bg-gray-100 text-gray-600'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {r.proofUrl ? (
                    <a
                      href={r.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium hover:bg-blue-100 transition"
                    >
                      📷 View
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {r.customerReceiptUrl ? (
                    <a
                      href={r.customerReceiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium hover:bg-indigo-100 transition"
                    >
                      📄 Receipt
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

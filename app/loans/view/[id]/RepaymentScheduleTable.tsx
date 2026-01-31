export default function RepaymentScheduleTable({
  repayments,
}: {
  repayments: any[];
}) {
  return (
    <div className="card overflow-x-auto">
      <h2 className="section-title mb-4">Repayment Schedule</h2>

      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2">EMI</th>
            <th className="px-3 py-2">Due Date</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Paid</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {repayments.map((r: any) => (
            <tr key={r.emiNumber} className="border-t">
              <td className="px-3 py-2">{r.emiNumber}</td>
              <td className="px-3 py-2">
                {new Date(r.dueDate).toDateString()}
              </td>
              <td className="px-3 py-2">₹ {r.emiAmount}</td>
              <td className="px-3 py-2">₹ {r.paidAmount}</td>
              <td className="px-3 py-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

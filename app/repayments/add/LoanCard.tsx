export default function LoanCard({ loan, onClick }: any) {
  // Determine badge color based on loan status
  const statusColor = loan.status === 'Active' ? 'bg-green-100 text-green-800' :
                      loan.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800';

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 duration-200 flex flex-col justify-between"
    >
      {/* Header: Loan ID + Status */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Loan ID
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-400">
            {loan.id}
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
          {loan.status || 'Unknown'}
        </span>
      </div>

      {/* Amounts */}
      <div className="mt-4">
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          ₹ {loan.loanAmount.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Remaining: ₹ {loan.remainingAmount.toLocaleString()}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-blue-500 font-medium hover:underline">
        Click to manage EMIs →
      </div>
    </div>
  );
}

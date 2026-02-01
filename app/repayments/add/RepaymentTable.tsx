import EmiRow from './EmiRow';

export default function RepaymentTable({
    loan,
    repayments,
    onBack,
}: any) {
    return (
        <div className="space-y-6 p-4 max-w-7xl mx-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
            >
                ← Back to loans
            </button>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="w-full min-w-150 text-sm text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="p-3 border-b text-gray-600 font-medium">EMI</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Due Date</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Amount</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Paid</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Status</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {repayments.map((emi: any) => (
                            <EmiRow
                                key={emi.emiNumber}
                                loanId={loan.id}
                                emi={emi}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

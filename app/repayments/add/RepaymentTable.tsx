import EmiRow from './EmiRow';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function RepaymentTable({
    loan,
    repayments,
    onBack,
}: any) {
    const downloadPdf = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Loan ID: ${loan.id}`, 14, 15);

        const tableData = repayments.map((emi: any) => [
            emi.emiNumber,
            new Date(emi.dueDate).toLocaleDateString(),
            `INR ${emi.emiAmount.toLocaleString()}`,
            `INR ${emi.principalAmount.toLocaleString()}`,
            `INR ${emi.interestAmount.toLocaleString()}`,
            `INR ${emi.paidAmount.toLocaleString()}`,
            emi.status,
        ]);

        autoTable(doc, {
            head: [[
                "EMI",
                "Due Date",
                "EMI Amt",
                "Principal",
                "Interest",
                "Paid",
                "Status",
            ]],
            body: tableData,
            startY: 25,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [22, 160, 133] },
        });

        doc.save(`Loan-${loan.id}-Repayment-Schedule.pdf`);
    }
    return (
        <div className="space-y-6 p-4 max-w-7xl mx-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition"
            >
                ← Back to loans
            </button>
            <div className="flex justify-between items-center p-4 bg-gray-100">
                <h2 className="text-lg font-semibold text-gray-700">
                    Repayment Schedule
                </h2>

                <button
                    onClick={downloadPdf}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                >
                    Download PDF
                </button>
            </div>
            {/* Table Container */}
            <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="w-full min-w-150 text-sm text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="p-3 border-b text-gray-600 font-medium">EMI</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Due Date</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Amount</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Principal Amount</th>
                            <th className="p-3 border-b text-gray-600 font-medium">Interest Amount</th>
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

import EmiRow from './EmiRow';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function EmiTable({ loanId, repayments }: any) {

  const downloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Loan ID: ${loanId}`, 14, 15);

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

    doc.save(`Loan-${loanId}-Repayment-Schedule.pdf`);
  }
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      {/* Header with Download Button */}
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
              Principal Amount
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              Interest Amount
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              Paid
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
              Proof
            </th>
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

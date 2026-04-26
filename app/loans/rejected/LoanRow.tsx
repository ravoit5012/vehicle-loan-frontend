'use client';

import { useRouter } from 'next/navigation';
import StatusBadge from './StatusBadge';
import { API_ENDPOINTS } from '@/app/config/config';

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


  const handleDeleteLoan = async (loanId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_LOAN_APPLICATION}/${loanId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert("Loan Deleted Successfully");
        window.location.reload();
      } else {
        alert("Failed to delete loan");
      }
    } catch (error: any) {
      alert("Error deleting loan: " + error.message);
    }
  };

  // Filter loans based on status
  if (loan.status !== 'REJECTED') {
    return null; // Do not render this row if the loan status is not ADMIN_APPROVED or DISBURSED
  }

  return (
    <tr className="border-t hover:bg-transparent border-t border-white/40 transition">
      <td className="px-4 py-3">
        <div className="font-medium">{customer?.applicantName}</div>
        <div className="text-xs text-gray-500">
          {customer?.mobileNumber}
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="font-medium"> ₹ {loan.loanAmount}</div>
        <div className="text-xs text-gray-500">
          {loan.interestRate}% ({loan.interestType})
        </div>
        <div className="text-xs text-gray-500">
          {loan.loanDuration} months
        </div>
      </td>

      <td className="px-4 py-3">
        <div>{loan.loanType?.loanName}</div> <div>{loan.loanType?.vehicleCondition.charAt(0).toUpperCase() + loan.loanType?.vehicleCondition.slice(1).toLowerCase()} Vehicle Loan</div>
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
        {/* Conditionally render buttons */}
        {/* {loan.status === 'ADMIN_APPROVED' && (
          <button
            onClick={() => handleDisburseLoan(loan.id)}
            className="cursor-pointer bg-blue-400 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
          >
            Disburse Loan
          </button>
        )}
        {loan.status === 'DISBURSED' && (
          <button
            onClick={() => handleCloseLoan(loan.id)}
            className="cursor-pointer bg-green-400 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
          >
            Close Loan
          </button>
        )} */}
        {/* {loan.status === 'CLOSED' && ( */}
        <button
          onClick={() => handleDeleteLoan(loan.id)}
          className="cursor-pointer bg-red-400 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
        >
          Delete Loan
        </button>
        <button
          onClick={() => router.push(`/loans/view/${loan.id}`)}
          className="cursor-pointer bg-blue-400 mx-2 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
        >
          View
        </button>
        {/* )} */}
      </td>
    </tr>
  );
}

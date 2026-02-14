'use client';

import { useRouter } from 'next/navigation';
import StatusBadge from './StatusBadge';
import { API_ENDPOINTS } from '@/app/config/config';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  // Function to handle loan disbursement
  const handleDisburseLoan = async (loanId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DISBURSE_LOAN}/${loanId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert("Loan Disbursed Successfully");
        window.location.reload();
      } else {
        alert("Failed to disburse loan");
      }
    } catch (error: any) {
      alert("Error disbursing loan: " + error.message);
    }
  };

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
  // Function to handle loan closure
  const handleCloseLoan = async (loanId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CLOSE_LOAN}/${loanId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert("Loan Closed Successfully");
        window.location.reload();
      } else {
        alert("Failed to close loan");
        window.location.reload();
      }
    } catch (error: any) {
      alert("Error closing loan: " + error.message);
    }
  };

  // Filter loans based on status
  if (loan.status !== 'ADMIN_APPROVED' && loan.status !== 'DISBURSED' && loan.status !== 'CLOSED') {
    return null; // Do not render this row if the loan status is not ADMIN_APPROVED or DISBURSED
  }

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
        {/* Conditionally render buttons */}
        {loan.status === 'ADMIN_APPROVED' && user?.role == "ADMIN" && (
          <button
            onClick={() => handleDisburseLoan(loan.id)}
            className="cursor-pointer bg-blue-400 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
          >
            Disburse Loan
          </button>
        )}
        {loan.status === 'DISBURSED' && user?.role == "ADMIN" && (
          <button
            onClick={() => handleCloseLoan(loan.id)}
            className="cursor-pointer bg-green-400 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
          >
            Close Loan
          </button>
        )}
        {loan.status === 'CLOSED'  && user?.role == "ADMIN" && (
          <button
            onClick={() => handleDeleteLoan(loan.id)}
            className="cursor-pointer bg-red-400 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
          >
            Delete Loan
          </button>
        )}
        <button
          onClick={() => router.push(`/loans/view/${loan.id}`)}
          className="cursor-pointer bg-blue-400 mx-2 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary"
        >
          View
        </button>
      </td>
    </tr>
  );
}

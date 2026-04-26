'use client';

import { useRouter } from 'next/navigation';
import StatusBadge from './StatusBadge';
import { API_ENDPOINTS } from '@/app/config/config';
import { useAuth } from '@/hooks/useAuth';
import { extractErrorMessage } from '@/lib/errors';

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
  const callLoanAction = async (
    url: string,
    method: 'POST' | 'DELETE',
    successMsg: string,
    failPrefix: string,
  ) => {
    try {
      const response = await fetch(url, { method, credentials: 'include' });
      if (response.ok) {
        alert(successMsg);
        window.location.reload();
        return;
      }
      let body: any = null;
      try { body = await response.json(); } catch { /* ignore */ }
      alert(`${failPrefix}: ${extractErrorMessage(body, 'Unknown error')}`);
    } catch (error) {
      alert(`${failPrefix}: ${extractErrorMessage(error, 'Network error')}`);
    }
  };

  const handleDisburseLoan = (loanId: string) =>
    callLoanAction(`${API_ENDPOINTS.DISBURSE_LOAN}/${loanId}`, 'POST', 'Loan Disbursed Successfully', 'Failed to disburse loan');

  const handleDeleteLoan = (loanId: string) =>
    callLoanAction(`${API_ENDPOINTS.DELETE_LOAN_APPLICATION}/${loanId}`, 'DELETE', 'Loan Deleted Successfully', 'Failed to delete loan');

  const handleCloseLoan = (loanId: string) =>
    callLoanAction(`${API_ENDPOINTS.CLOSE_LOAN}/${loanId}`, 'POST', 'Loan Closed Successfully', 'Failed to close loan');

  // Filter loans based on status
  if (loan.status !== 'ADMIN_APPROVED' && loan.status !== 'DISBURSED' && loan.status !== 'CLOSED') {
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
        {loan.status === 'CLOSED' && user?.role == "ADMIN" && (
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

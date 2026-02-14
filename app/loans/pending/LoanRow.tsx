'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { API_ENDPOINTS } from '@/app/config/config';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/app/components/Loading';
import RemarkModal from './RemarkModal';
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

  const [isLoading, setIsLoading] = useState(false);


  const handleCallVerification = async (loanId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CALL_VERIFY}/${loanId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert("Call Verified Successfully");
        window.location.reload();
      } else {
        alert("Failed to verify the call");
      }
    } catch (error: any) {
      alert("Error call verifying loan: " + error.message);
    }
  };

  const handleContractGeneration = async (loanId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.GENERATE_CONTRACT}/${loanId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();

        const newTab = window.open('', '_blank');

        alert("Contract Generated Successfully");

        if (newTab) {
          newTab.location.href = data.contractDocument.url;
        } else {
          // fallback if popup was blocked
          window.location.href = data.contractDocument.url;
        }

        setTimeout(() => {
          window.location.reload();
        }, 500);
      }

      else {
        alert("Failed to generate contract");
      }
    } catch (error: any) {
      alert("Error generating the contract: " + error.message);
      const errorData = await error.json(); // read backend error
      console.error("Error generating contract:", errorData);
      alert(errorData.message || "Failed to generate contract");
    } finally {
      setIsLoading(false);
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<'approve' | 'reject' | null>(null);

  const handleActionClick = (action: 'approve' | 'reject') => {
    setCurrentAction(action);
    setModalOpen(true);
  };

  const handleSubmitRemark = async (remark: string) => {
    setModalOpen(false);

    if (currentAction === 'approve') {
      await handleAdminApproveLoan(loan.id, remark);
    } else if (currentAction === 'reject') {
      await handleRejectLoan(loan.id, remark);
    }
  };

  const handleRejectLoan = async (loanId: string, remark: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.REJECT_LOAN}/${loanId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remark }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.message || "Failed to reject loan");
        return;
      }

      alert("Loan Rejected Successfully");
      window.location.reload();
    } catch (error: any) {
      alert("Error rejecting loan: " + error.message);
    }
  };

  const handleAdminApproveLoan = async (loanId: string, remark: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN_APPROVAL}/${loanId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remark }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.message || "Failed to approve loan");
        return;
      }

      alert("Loan Approved Successfully");
      window.location.reload();
    } catch (error: any) {
      alert("Error approving loan: " + error.message);
    }
  };


  if (loan.status === 'ADMIN_APPROVED' || loan.status === 'DISBURSED' || loan.status === 'CLOSED' || loan.status === 'REJECTED') {
    return null;
  }

  return (
    <>
      <Loading visible={isLoading} />
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

        <td className="px-4 py-3 flex flex-col text-right">
          {loan.status === 'SUBMITTED' && (
            <button
              onClick={() => handleCallVerification(loan.id)}
              className="cursor-pointer bg-blue-100 text-blue-700 my-1 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary w-full"
            >
              Call Verified
            </button>
          )}
          {loan.status === 'CALL_VERIFIED' && (
            <button
              onClick={() => handleContractGeneration(loan.id)}
              className="cursor-pointer bg-indigo-100 text-indigo-700 my-1 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary w-full"
            >
              Generate Contract
            </button>
          )}
          {loan.status === 'CONTRACT_GENERATED' && (
            <button
              onClick={() => router.push(`/loans/view/${loan.id}`)}
              className="cursor-pointer bg-indigo-100 text-indigo-700 my-1 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary w-full"
            >
              Upload Signed Contract
            </button>)}
          {loan.status === 'CONTRACT_SIGNED' && (
            <button
              onClick={() => router.push(`/loans/view/${loan.id}/field-verify`)}
              className="cursor-pointer bg-purple-100 text-purple-700 my-1 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary w-full"
            >
              Field Verification
            </button>
          )}
          <div>
            {loan.status === 'FIELD_VERIFIED' && user?.role === 'ADMIN' && (
              <button
                onClick={() => handleActionClick('approve')}
                className="cursor-pointer bg-teal-100 text-teal-700 my-1 hover:scale-110 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary w-full"
              >
                Admin Approve Loan
              </button>
            )}

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => handleActionClick('reject')}
                className="cursor-pointer bg-red-100 text-red-700 hover:scale-110 my-1 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary w-full"
              >
                Reject Loan
              </button>
            )}

            <RemarkModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleSubmitRemark}
              title={currentAction === 'approve' ? 'Approve Loan Remark' : 'Reject Loan Remark'}
              actionLabel={currentAction === 'approve' ? 'Approve' : 'Reject'}
            />
          </div>

          <button
            onClick={() => router.push(`/loans/view/${loan.id}`)}
            className="cursor-pointer bg-blue-400 hover:scale-110 my-1 ease-in-out duration-300 transition-all py-1 px-4 rounded-lg btn-secondary w-full"
          >
            View
          </button>
        </td>

      </tr>
    </>
  );
}

'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FeeRow({ fee }: { fee: any }) {
  const [open, setOpen] = useState(false);
  const isCash = fee.paymentMethod === 'CASH';

  const shortLoanId = fee.loanId
    ? `...${String(fee.loanId).slice(-8).toUpperCase()}`
    : '—';
  const shortFeeId = fee.id
    ? `FEE-${String(fee.id).slice(-8).toUpperCase()}`
    : '—';

  const fmtDate = (d: any) =>
    d
      ? new Date(d).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : '—';

  return (
    <>
      <tr className="border-t hover:bg-gray-50/50 border-t border-white/40 transition">

        {/* Customer */}
        <td className="px-4 py-3">
          <div className="font-medium">{fee.customer?.applicantName}</div>
          <div className="text-xs text-gray-500">{fee.customer?.mobileNumber}</div>
          {fee.customer?.memberId && (
            <div className="text-[11px] text-gray-400 mt-0.5">
              Member: <span className="font-mono">{fee.customer.memberId}</span>
            </div>
          )}
        </td>

        {/* Loan Details */}
        <td className="px-4 py-3">
          <div className="font-medium">₹ {fee.loan?.loanAmount}</div>
          <div className="text-xs text-gray-500">
            {fee.loan?.interestRate}% ({fee.loan?.interestType})
          </div>
          <div className="text-xs text-gray-500">{fee.loan?.loanDuration} months</div>
          <div className="text-[11px] text-gray-400 font-mono mt-0.5">{shortLoanId}</div>
        </td>

        {/* Loan Type */}
        <td className="px-4 py-3">
          <div>{fee.loan?.loanType?.loanName}</div>
          <div className="text-xs text-gray-500">
            {fee.loan?.loanType?.vehicleCondition
              ? fee.loan.loanType.vehicleCondition.charAt(0).toUpperCase() +
                fee.loan.loanType.vehicleCondition.slice(1).toLowerCase() +
                ' Vehicle Loan'
              : '—'}
          </div>
        </td>

        {/* Total Fees */}
        <td className="px-4 py-3 font-semibold">₹ {fee.totalFees}</td>

        {/* Payment Method */}
        <td className="px-4 py-3">
          {fee.paymentMethod ? (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              fee.paymentMethod === 'CASH'
                ? 'bg-green-100 text-green-700'
                : fee.paymentMethod === 'DISBURSEMENT'
                ? 'bg-gray-200 text-gray-600'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {fee.paymentMethod.replace(/_/g, ' ')}
            </span>
          ) : (
            <span className="text-gray-400 text-xs italic">—</span>
          )}
        </td>

        {/* Transaction ID / Collected By */}
        <td className="px-4 py-3">
          {fee.transactionId ? (
            <div>
              <div className="text-xs text-gray-500 mb-0.5">
                {isCash ? 'Collected by' : 'Transaction ID'}
              </div>
              <div className="font-mono text-sm break-all">{fee.transactionId}</div>
            </div>
          ) : (
            <span className="text-gray-400 text-xs italic">—</span>
          )}
        </td>

        {/* Payment Receipt (uploaded image) */}
        <td className="px-4 py-3">
          {fee.receiptUrl ? (
            <a
              href={fee.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm underline"
            >
              📷 View
            </a>
          ) : (
            <span className="text-gray-400 text-xs italic">No receipt</span>
          )}
        </td>

        {/* Customer Receipt PDF */}
        <td className="px-4 py-3">
          {fee.customerReceiptUrl ? (
            <a
              href={fee.customerReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-md text-xs font-medium transition"
            >
              📄 Receipt PDF
            </a>
          ) : (
            <span className="text-gray-400 text-xs italic">Not generated</span>
          )}
        </td>

        {/* Collected At */}
        <td className="px-4 py-3 text-right text-xs text-gray-600">
          {fmtDate(fee.paidAt)}
        </td>

        {/* Expand/Collapse */}
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100 transition"
          >
            {open ? (
              <>
                <FaChevronUp /> Hide
              </>
            ) : (
              <>
                <FaChevronDown /> Details
              </>
            )}
          </button>
        </td>
      </tr>

      {open && (
        <tr className="bg-gray-50/60 border-t border-white/40">
          <td colSpan={10} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              <DetailItem label="Fee Receipt No." value={shortFeeId} mono />
              <DetailItem label="Fee Record ID" value={fee.id} mono small />
              <DetailItem label="Loan ID" value={fee.loanId} mono small />
              <DetailItem label="Customer ID" value={fee.customerId} mono small />
              <DetailItem
                label="Customer Member ID"
                value={fee.customer?.memberId}
                mono
              />
              <DetailItem
                label="Customer Name (snapshot)"
                value={fee.customerName}
              />
              <DetailItem
                label="Customer Mobile (snapshot)"
                value={fee.customermobileNumber}
              />
              <DetailItem
                label="Total Fees"
                value={`₹ ${fee.totalFees ?? '—'}`}
              />
              <DetailItem
                label="Payment Method"
                value={fee.paymentMethod?.replace(/_/g, ' ')}
              />
              <DetailItem
                label={isCash ? 'Collected By' : 'Transaction ID'}
                value={fee.transactionId}
                mono
              />
              <DetailItem label="Status" value={fee.paid ? 'Paid' : 'Pending'} />
              <DetailItem label="Paid At" value={fmtDate(fee.paidAt)} />
              <DetailItem label="Record Created" value={fmtDate(fee.createdAt)} />
              <DetailItem label="Record Updated" value={fmtDate(fee.updatedAt)} />

              <div className="md:col-span-2 lg:col-span-3 flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                {fee.receiptUrl && (
                  <a
                    href={fee.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-medium transition"
                  >
                    📷 Open Payment Receipt Image
                  </a>
                )}
                {fee.customerReceiptUrl && (
                  <a
                    href={fee.customerReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-medium transition"
                  >
                    📄 Open Customer Receipt PDF
                  </a>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DetailItem({
  label,
  value,
  mono,
  small,
}: {
  label: string;
  value: any;
  mono?: boolean;
  small?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span
        className={`${mono ? 'font-mono' : ''} ${
          small ? 'text-xs' : 'text-sm'
        } text-gray-800 break-all`}
      >
        {value || value === 0 ? value : <span className="text-gray-400 italic">—</span>}
      </span>
    </div>
  );
}

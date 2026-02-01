'use client';

import { useState } from 'react';
import RepaymentHeader from './RepaymentHeader';
import EmiTable from './EmiTable';

export default function RepaymentAccordion({ data }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left"
      >
        <RepaymentHeader data={data} open={open} />
      </button>

      {open && (
        <div className="p-4 bg-gray-50">
          <EmiTable
            loanId={data.loanId}
            repayments={data.repayments}
          />
        </div>
      )}
    </div>
  );
}

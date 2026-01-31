'use client';

interface Props {
  emi: number;
  totalInterest: number;
  totalFees: number;
  totalPayable: number;
  disbursedAmount: number;
}

export default function EmiSummaryCards({
  emi,
  totalInterest,
  totalFees,
  totalPayable,
  disbursedAmount,
}: Props) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Summary label="EMI" value={emi} />
      <Summary label="Total Interest" value={totalInterest} />
      <Summary label="Total Fees" value={totalFees} />
      <Summary label="Total Payable" value={totalPayable} />
      <Summary label="Disbursed Amount" value={disbursedAmount} />
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">₹ {value.toFixed(2)}</p>
    </div>
  );
}

'use client';

import EmiCard from './EmiCard';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function OverdueEmiCards({ emis }: any) {
  return (
    <div className="space-y-6 px-4 py-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 text-red-700">
        <FaExclamationTriangle className="text-2xl" />
        <h3 className="text-xl font-semibold">Overdue EMIs (Immediate Attention)</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {emis.map((emi: any, i: number) => (
          <EmiCard key={i} emi={emi} variant="overdue" />
        ))}
      </div>
    </div>
  );
}

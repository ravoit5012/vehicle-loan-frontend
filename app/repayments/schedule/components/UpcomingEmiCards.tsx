'use client';

import EmiCard from './EmiCard';

export default function UpcomingEmiCards({ emis }: any) {
  if (!emis.length) return null;

  return (
    <div className="space-y-6 px-4 py-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">
        Upcoming EMIs
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {emis.map((emi: any, i: number) => (
          <EmiCard key={i} emi={emi} variant="upcoming" />
        ))}
      </div>
    </div>
  );
}

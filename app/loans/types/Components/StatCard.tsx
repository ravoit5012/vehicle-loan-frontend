"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

type StatCardProps = {
  title: string;
  endpoint: string;
  icon: React.ReactNode;
  formatter?: (value: any) => string | number;
};

export default function StatCard({
  title,
  endpoint,
  icon,
  formatter,
}: StatCardProps) {
  const [value, setValue] = useState<number | string>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStat = async () => {
      try {
        const res = await fetch(endpoint);

        if (!res.ok) throw new Error("Failed to fetch");

        const result = await res.json();

        // If API returns just number
        const dataValue =
          typeof result === "number"
            ? result
            : result.count ?? result.value ?? 0;

        setValue(formatter ? formatter(dataValue) : dataValue);
      } catch (err: any) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchStat();
  }, [endpoint, formatter]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
      {loading ? (
        <div className="flex justify-center items-center h-16">
          <Loader2 className="animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertTriangle size={16} />
          {error}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">{title}</div>
            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>

          <div className="mt-4 text-2xl font-bold text-gray-800">
            {value}
          </div>
        </>
      )}
    </div>
  );
}

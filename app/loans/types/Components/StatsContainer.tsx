"use client";

export default function StatsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

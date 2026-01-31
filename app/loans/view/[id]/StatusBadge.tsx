export default function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-700',
    CALL_VERIFIED: 'bg-indigo-100 text-indigo-700',
    CONTRACT_SIGNED: 'bg-purple-100 text-purple-700',
    FIELD_VERIFIED: 'bg-teal-100 text-teal-700',
    ADMIN_APPROVED: 'bg-green-100 text-green-700',
    DISBURSED: 'bg-green-200 text-green-800',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-medium ${
        map[status] || 'bg-gray-200'
      }`}
    >
      {status.replaceAll('_', ' ')}
    </span>
  );
}

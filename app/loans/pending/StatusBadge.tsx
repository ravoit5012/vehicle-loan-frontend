export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-200 text-gray-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    CALL_VERIFIED: 'bg-indigo-100 text-indigo-700',
    CONTRACT_GENERATED: 'bg-yellow-100 text-yellow-700',
    CONTRACT_SIGNED: 'bg-purple-100 text-purple-700',
    FIELD_VERIFIED: 'bg-teal-100 text-teal-700',
    ADMIN_APPROVED: 'bg-green-100 text-green-700',
    DISBURSED: 'bg-green-200 text-green-800',
    CLOSED: 'bg-gray-300 text-gray-800',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[status] || 'bg-gray-100'
      }`}
    >
      {status.replaceAll('_', ' ')}
    </span>
  );
}

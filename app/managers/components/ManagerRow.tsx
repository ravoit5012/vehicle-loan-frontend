'use client';

import { useRouter } from 'next/navigation';

export default function ManagerRow({ manager }: any) {
  const router = useRouter();

  return (
    <tr className="border-t hover:bg-gray-50 transition">
      <td className="p-4 font-medium">{manager.name}</td>
      <td className="p-4">{manager.managerCode}</td>
      <td className="p-4">{manager.phoneNumber}</td>
      <td className="p-4">{manager.email || '-'}</td>
      <td className="p-4 text-right">
        <button
          onClick={() => router.push(`/managers/view/${manager.id}`)}
          className="bg-blue-500 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          View
        </button>
      </td>
    </tr>
  );
}

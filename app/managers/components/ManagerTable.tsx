import ManagerRow from './ManagerRow';

export default function ManagerTable({ managers }: any) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full">
        <thead className="bg-white/40 backdrop-blur-md border border-white/50 text-left">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Manager Code</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Email</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {managers.map((m: any) => (
            <ManagerRow key={m.id} manager={m} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

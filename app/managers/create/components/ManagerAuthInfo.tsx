export default function ManagerAuthInfo({ form, update }: any) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {/* Username Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          placeholder="Username"
          value={form.username}
          onChange={e => update('username', e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => update('password', e.target.value)}
        />
      </div>
    </div>
  );
}

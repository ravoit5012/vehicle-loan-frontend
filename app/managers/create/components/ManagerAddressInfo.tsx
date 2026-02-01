export default function ManagerAddressInfo({ form, update }: any) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
      {/* Address Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          placeholder="Address"
          value={form.address}
          onChange={e => update('address', e.target.value)}
        />
      </div>

      {/* City Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          placeholder="City"
          value={form.city}
          onChange={e => update('city', e.target.value)}
        />
      </div>

      {/* Pincode Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Pincode</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          placeholder="Pincode"
          value={form.pincode}
          onChange={e => update('pincode', e.target.value)}
        />
      </div>
    </div>
  );
}

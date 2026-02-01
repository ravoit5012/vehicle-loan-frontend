import { useEffect } from "react";
export default function ManagerBasicInfo({ form, update }: any) {
  // Function to generate Manager Code
  const generateManagerCode = (name: string, phone: string) => {
    if (!name || !phone) return '';
    const namePart = name.substring(0, 4).toUpperCase(); // first 4 letters of name
    const phonePart = phone.substring(3, 8); // 4th to 8th digits of phone
    return `MGR-${namePart}-${phonePart}`;
  };

  // Compute manager code dynamically
  const managerCode = generateManagerCode(form.name, form.phoneNumber);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Manager Code</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          placeholder="Manager Code (Auto Generated)"
          value={managerCode}
          readOnly
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          placeholder="Full Name"
          value={form.name}
          onChange={e => {
            update('name', e.target.value);
            const code = generateManagerCode(e.target.value, form.phoneNumber);
            update('managerCode', code);
          }}

        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={e => {
            update('phoneNumber', e.target.value);
            const code = generateManagerCode(form.name, e.target.value);
            update('managerCode', code);
          }}

        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          placeholder="Email"
          value={form.email}
          onChange={e => update('email', e.target.value)}
        />
      </div>
    </div>
  );
}

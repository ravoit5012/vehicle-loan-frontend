import React from "react";
import dayjs from "dayjs"; // for formatting date

export default function ManagerDetailsCard({ manager }: any) {
  return (
    <div className="bg-linear-to-r from-blue-50 to-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto space-y-6 hover:shadow-2xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900">
          {manager.name}
        </h2>
        <span
          className={`mt-2 md:mt-0 px-4 py-1 rounded-full font-semibold text-sm ${
            manager.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {manager.status === "ACTIVE" ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Manager Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div><b>Manager ID:</b> {manager._id}</div>
        <div><b>Manager Code:</b> {manager.managerCode}</div>
        <div><b>Username:</b> {manager.username}</div>
        <div><b>Phone:</b> {manager.phoneNumber}</div>
        <div><b>Email:</b> {manager.email || '-'}</div>
        <div><b>City:</b> {manager.city || '-'}</div>
        <div><b>Pincode:</b> {manager.pincode || '-'}</div>
        <div><b>Address:</b> {manager.address || '-'}</div>
        <div className="md:col-span-2">
          <b>Created At:</b> {dayjs(manager.createdAt).format("dddd, MMMM D, YYYY h:mm A")}
        </div>
      </div>

      {/* Footer / Extra */}
      <div className="text-sm text-gray-500 border-t pt-4">
        <p><i>Note:</i> Sensitive info like passwords are hidden for security.</p>
      </div>
    </div>
  );
}

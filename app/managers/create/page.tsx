'use client';
import ManagerForm from "./components/ManagerForm";
import { FaUserPlus } from "react-icons/fa";

export default function CreateManagerPage() {
  return (
    <div className="mx-auto p-6">
      <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
        <FaUserPlus className="text-orange-400 text-3xl" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Manager</h2>
          <p className="text-gray-600 mt-1">
            Create a manager to empower your team with expert leadership
          </p>
        </div>
      </div>

      <ManagerForm />
    </div>
  );
}

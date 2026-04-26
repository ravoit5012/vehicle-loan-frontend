'use client';
import ManagerForm from "./components/ManagerForm";
import { FaUserPlus } from "react-icons/fa";

export default function CreateManagerPage() {
  return (
    <div className="mx-auto p-6">
      <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] mb-4">
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

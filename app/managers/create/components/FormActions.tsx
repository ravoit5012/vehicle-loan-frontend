import { FaReact } from "react-icons/fa";
export default function FormActions({ loading, onSubmit }: any) {
  return (
    <div className="flex justify-center md:justify-end gap-3 mt-6">
      <button
        disabled={loading}
        onClick={onSubmit}
        className="w-full cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        // className="bg-red-500 text-white p-10"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <FaReact className="animate-spin w-5 h-5 text-white" />
            <span>Creating...</span>
          </div>
        ) : (
          'Create Manager'
        )}
      </button>
    </div>
  );
}

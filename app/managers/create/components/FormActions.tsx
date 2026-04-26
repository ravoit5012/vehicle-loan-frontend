import { FaReact } from "react-icons/fa";
export default function FormActions({ loading, onSubmit }: any) {
  return (
    <div className="flex justify-center md:justify-end gap-3 mt-6">
      <button
        disabled={loading}
        onClick={onSubmit}
        className="w-full md:w-auto cursor-pointer font-bold px-8 py-3 rounded-xl shadow-lg border border-white/40 bg-gradient-to-r from-indigo-500 to-purple-600 text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(79,70,229,0.4)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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

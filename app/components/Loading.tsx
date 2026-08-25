// components/Loading.tsx
import React from 'react';

interface LoadingProps {
  visible: boolean;
  label?: string;
  progress?: { completed: number; total: number };
}

const Loading = ({ visible, label = "Handling your Request", progress }: LoadingProps) => {
  if (!visible) return null;
  const pct = progress && progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : null;
  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-md border border-white/50 bg-opacity-20 text-black flex justify-center items-center z-50">
      <div className="flex flex-col items-center gap-3 bg-white/90 rounded-xl px-6 py-5 shadow-lg min-w-[260px]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin"></div>
          <span className="text-black font-semibold">{label}</span>
        </div>
        {pct !== null && progress && (
          <div className="w-full">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-600 text-center">
              {progress.completed} of {progress.total} documents uploaded ({pct}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;

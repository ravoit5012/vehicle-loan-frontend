// components/Loading.tsx
import React from 'react';

interface LoadingProps {
  visible: boolean;
}

const Loading = ({ visible }: LoadingProps) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-20 text-black flex justify-center items-center z-50">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin"></div>
        <span className="text-black font-semibold">Handling your Request</span>
      </div>
    </div>
  );
};

export default Loading;

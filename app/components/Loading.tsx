// components/Loading.tsx
import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin"></div>
        <span className="text-white font-semibold">Handling your Request</span>
      </div>
    </div>
  );
};

export default Loading;

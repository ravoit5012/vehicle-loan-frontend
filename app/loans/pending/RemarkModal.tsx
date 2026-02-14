// components/RemarkModal.tsx
import React, { useState, useEffect } from 'react';

type RemarkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (remark: string) => void;
  title: string;
  actionLabel: string;
};

const RemarkModal: React.FC<RemarkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  actionLabel,
}) => {
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (isOpen) setRemark(''); // reset when modal opens
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6 mx-4 animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Enter your remark..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-24"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(remark)}
            disabled={!remark.trim()}
            className={`px-4 py-2 rounded-lg text-white transition
              ${remark.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemarkModal;

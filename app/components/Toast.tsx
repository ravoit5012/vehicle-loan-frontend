import React, { useEffect } from "react";
<style jsx global>{`
  @keyframes slideIn {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  .animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
  }
`}</style>

type ToastProps = {
    message: string;
    duration?: number; // in milliseconds
    onClose: () => void;
};

export const Toast = ({ message, duration = 3000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-slideIn">
            {message}
        </div>
    );
};

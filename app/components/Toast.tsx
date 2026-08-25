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
    type?: "success" | "error";
    duration?: number; // in milliseconds
    onClose: () => void;
};

export const Toast = ({ message, type = "success", duration = 3000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed bottom-5 right-5 z-50 max-w-sm text-white px-4 py-3 rounded-lg shadow-lg animate-slideIn ${
                type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
        >
            {message}
        </div>
    );
};

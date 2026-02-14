"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    redirectTo?: string;
    seconds?: number;
}

const ProtectedPageMessage = ({ redirectTo = "/login", seconds = 3 }: Props) => {
    const [counter, setCounter] = useState(seconds);
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace(redirectTo);
        }, seconds * 1000);

        return () => clearTimeout(timer);
    }, [redirectTo, router, seconds]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg md:text-2xl mb-6">
                You need to <strong>log in</strong> to access this page
            </p>
            <p className="text-md md:text-lg">
                Redirecting to login page in <strong>{counter}</strong> second{counter !== 1 ? "s" : ""}...
            </p>
            <button
                onClick={() => router.replace(redirectTo)}
                className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
                Go to Login Now
            </button>
        </div>
    );
};

export default ProtectedPageMessage;

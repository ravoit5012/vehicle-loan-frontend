"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const router = useRouter();

  const { company, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black px-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl space-y-6 py-16">
        {/* Company Logo */}
        {company?.logoUrl ? (
          <img
            src={company.logoUrl}
            alt="Company Logo"
            className="w-20 h-20 object-cover rounded-full mx-auto shadow-lg border-2 border-white"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center mx-auto shadow-lg text-white text-3xl font-bold">
            {company?.companyName?.charAt(0) || "C"}
          </div>
        )}

        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 dark:text-indigo-300">
          Welcome to <span className="text-blue-500">{company?.companyName}</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
          Manage your vehicle loans with ease and security.
          <br />
          Sign in to access your dashboard and get started.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Login
          </button>
        </div>
      </div>

      {/* Features/Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full max-w-5xl">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            Secure Login
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Have peace of mind with protected administrator access.
          </p>
        </div>



        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            Fast & Easy
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Quick access to your loan dashboard with one click.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} {company?.companyName || "Champanand Motors"} — All Rights Reserved.
      </footer>
    </div>
  );
}

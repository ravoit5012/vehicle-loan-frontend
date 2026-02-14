"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/app/config/config";
import {
  FaHandHoldingUsd,
  FaEye,
  FaPen,
  FaBox,
  FaCheckCircle,
  FaClipboardList,
  FaRupeeSign,
  FaFileAlt,
  FaCheck,
} from "react-icons/fa";

interface LoanType {
  id: string;
  loanName: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  status: string;
  totalLoans: number;
  activeProducts: number;
  totalDisbursed: number;
}

import Stats from "./Stats";
export default function LoanTypesPage() {
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.GET_ALL_LOAN_TYPES)
      .then((res) => res.json())
      .then((data) => {
        setLoanTypes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-full min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="mb-6 bg-blue-600 rounded-lg p-6 text-white shadow-md">
        <div className="flex items-center gap-3 mb-1">
          <FaHandHoldingUsd className="w-8 h-8" />
          <h1 className="text-xl font-semibold">Loan Types Management</h1>
        </div>
        <p className="text-sm font-light">Manage and configure loan types.</p>
      </header>

      {/* Stats cards */}
      <section className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-6 text-white mb-2">
        <Stats />
      </section>

      {/* Add New Product */}
      <div className="mb-4 flex justify-end">
        <Link href="/loans/types/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition cursor-pointer">
            + Add New Product
          </button>
        </Link>
      </div>

      {/* Loan products table */}
      <section className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 font-semibold">PRODUCT DETAILS</th>
              <th className="px-6 py-3 font-semibold text-center">INTEREST RATE</th>
              <th className="px-6 py-3 font-semibold text-center">AMOUNT RANGE</th>
              {/* <th className="px-6 py-3 font-semibold text-center">LOAN STATS</th> */}
              <th className="px-6 py-3 font-semibold text-center">STATUS</th>
              <th className="px-6 py-3 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loanTypes.map((lt) => (
              <tr
                key={lt.id}
                className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="font-bold capitalize">{lt.loanName}</div>
                  <div className="text-xs text-gray-500">{lt.description}</div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded">
                    {lt.interestRate.toFixed(2)}%
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  ₹{lt.minAmount.toLocaleString()} → ₹
                  {lt.maxAmount.toLocaleString()}
                </td>

                {/* <td className="px-6 py-4 text-center flex justify-center items-center gap-4 text-xs">
                  <FaFileAlt className="text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    {lt.totalLoans || 0}
                  </span>

                  <FaCheck className="text-green-600 ml-4" />
                  <span>{lt.activeProducts || 0}</span>
                </td> */}

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${lt.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {lt.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center space-x-2">
                  <Link href={`/loans/types/${lt.id}?mode=view`}>
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded cursor-pointer">
                      <FaEye className="inline-block mr-1" />
                      View
                    </button>
                  </Link>

                  <Link href={`/loans/types/${lt.id}?mode=edit`}>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded cursor-pointer">
                      <FaPen className="inline-block mr-1" />
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

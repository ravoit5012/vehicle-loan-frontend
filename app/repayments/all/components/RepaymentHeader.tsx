import { useRouter } from "next/navigation";

export default function RepaymentHeader({ data, open }: any) {
    const router = useRouter();
    const pendingCount = data.repayments.filter(
        (r: any) => r.status !== 'PAID'
    ).length;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white hover:bg-gray-50 transition-colors rounded-lg cursor-pointer">

            {/* Left section: Customer info */}
            <div className="flex flex-col">
                <div className="text-lg font-semibold text-gray-800">
                    {data.customerName}
                </div>
                <div className="text-sm text-gray-500">
                    {data.customerMobile}
                </div>
            </div>

            {/* Middle section: Loan info */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600 mt-2 md:mt-0">
                <div>
                    Loan ID: <span className="font-medium text-gray-800">{data.loanId}</span>
                </div>
                <div>
                    Remaining: <span className="font-medium text-gray-800">₹ {data.remainingAmount}</span>
                </div>
                <div>
                    Pending EMIs:{' '}
                    <span className="font-semibold text-red-600">{pendingCount}</span>
                </div>
                <button
                    onClick={() => router.push(`/loans/view/${data.loanId}`)}
                    className="text-blue-600 underline cursor-pointer hover:text-blue-700 transition duration-200 ease-in-out text-sm"
                >
                    View Loan
                </button>
            </div>

            {/* Right section: Chevron */}
            <div className={`ml-auto text-gray-500 transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

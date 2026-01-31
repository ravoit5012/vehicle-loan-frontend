import { FaInfo } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

export default function LoanInfoCard({ loan }: { loan: any }) {
    return (
        <div className="w-[75%] mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6">
            <h2 className="text-2xl font-semibold text-white bg-[#006CE0] flex items-center justify-center space-x-2 p-4 mb-6 rounded-lg">
                <FaInfo className="text-xl" />
                <span>Loan Information</span>
            </h2>
            <div className="space-y-4">
                <div className="container">
                <StatusBadge status={loan.status} /></div>
                <Info label="Loan Amount" value={`₹ ${loan.loanAmount}`} />
                <Info
                    label="Interest"
                    value={`${loan.interestRate}% (${loan.interestType})`}
                />
                <Info label="Duration" value={`${loan.loanDuration} months`} />
                <Info label="Collection" value={loan.collectionFreq} />
                <Info label="Total Interest" value={`₹ ${loan.totalInterest}`} />
                <Info
                    label="Total Payable"
                    value={`₹ ${loan.totalPayableAmount}`}
                />
                <Info
                    label="Disbursed Amount"
                    value={`₹ ${loan.disbursedAmount}`}
                />
                <Info
                    label="First EMI Date"
                    value={new Date(loan.firstEmiDate).toDateString()}
                />
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-medium">{label}</span>
            <span className="text-gray-800">{value || 'N/A'}</span>
        </div>
    );
}

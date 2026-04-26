'use client';
import { useState } from "react";
import { FaInfo, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/config";

enum CollectionFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
}

enum FeesPaymentMethod {
    UPFRONT = 'UPFRONT',
    DEDUCTED = 'DEDUCTED',
    CAPITALIZED = 'CAPITALIZED'
}

export default function LoanInfoCard({ loan }: { loan: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        loanAmount: loan.loanAmount,
        loanDuration: loan.loanDuration,
        collectionFreq: loan.collectionFreq,
        firstEmiDate: loan.firstEmiDate ? new Date(loan.firstEmiDate).toISOString().split('T')[0] : '',
        feesPaymentMethod: loan.feesPaymentMethod,
        disbursementMethod: loan.disbursementMethod || 'CASH',
        additionalFees: [] // we won't reinvent the complex additional fees UI here, they can recreate the loan if fees change drastically
    });

    const isEditable = ['SUBMITTED', 'DRAFT', 'PENDING', 'CALL_VERIFIED', 'CONTRACT_GENERATED', 'CONTRACT_SIGNED'].includes(loan.status);

    const handleSave = async () => {
        if (!confirm("Editing loan financials will completely recalculate the EMI schedule. Proceed?")) return;
        setLoading(true);
        try {
            await axios.patch(`${API_ENDPOINTS.UPDATE_LOAN_INFO}/${loan.id}`, {
                ...form,
                loanAmount: Number(form.loanAmount),
                loanDuration: Number(form.loanDuration),
                firstEmiDate: new Date(form.firstEmiDate).toISOString()
            }, { withCredentials: true });
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to update loan data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6 relative">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 p-4 mb-6 rounded-lg text-white shadow">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                    <FaInfo className="text-2xl" />
                    <span>Loan Information</span>
                </h2>
                {isEditable && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition cursor-pointer">
                        <FaEdit title="Edit Core Data" />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <div className="container">
                    <StatusBadge status={loan.status} />
                </div>

                {isEditing ? (
                    <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-lg border">
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase">Amount</label>
                            <input type="number" className="border px-2 py-1 rounded" value={form.loanAmount} onChange={e => setForm({ ...form, loanAmount: e.target.value as any })} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase">Duration (Months)</label>
                            <input type="number" className="border px-2 py-1 rounded" value={form.loanDuration} onChange={e => setForm({ ...form, loanDuration: e.target.value as any })} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase">First EMI</label>
                            <input type="date" className="border px-2 py-1 rounded" value={form.firstEmiDate} onChange={e => setForm({ ...form, firstEmiDate: e.target.value })} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase">Frequency</label>
                            <select className="border px-2 py-1 rounded" value={form.collectionFreq} onChange={e => setForm({ ...form, collectionFreq: e.target.value })}>
                                {Object.values(CollectionFrequency).map(f => (<option key={f} value={f}>{f}</option>))}
                            </select>
                        </div>
                        <div className="col-span-2 flex justify-end gap-2 mt-4 border-t pt-4">
                            <button onClick={() => setIsEditing(false)} className="text-sm px-4 py-2 border rounded font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                            <button onClick={handleSave} disabled={loading} className="text-sm px-4 py-2 bg-blue-600 rounded text-white font-bold hover:bg-blue-700 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save & Recalculate'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
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
                            value={loan.firstEmiDate ? new Date(loan.firstEmiDate).toDateString() : 'N/A'}
                        />
                        <Info label="Fees Payment" value={loan.feesPaymentMethod} />
                    </>
                )}
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-sm text-gray-700 py-1 border-b border-gray-100 last:border-0">
            <span className="font-semibold text-gray-500 uppercase text-xs">{label}</span>
            <span className="font-bold">{value || 'N/A'}</span>
        </div>
    );
}

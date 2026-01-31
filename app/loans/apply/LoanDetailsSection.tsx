'use client';
import { CollectionFrequency } from "@/app/config/collection-frequency.enum";
import { FeesPaymentMethod } from "@/app/config/fee-payment.enum";
import { FaMoneyBill1Wave } from "react-icons/fa6";
interface Props {
    loanType: any;
    register: any;
    watch: any;
}

export default function LoanDetailsSection({
    loanType,
    register,
    watch,
}: Props) {
    const interestRate = loanType.interestRate;
    const interestType = loanType.interestType;
    const processingFees = loanType.processingFees;
    const insuranceFees = loanType.insuranceFees;
    const otherFees = loanType.otherFees;

    return (
        <section className="card p-6 shadow-xl rounded-lg bg-white">
            <h2 className="text-2xl font-semibold bg-[#7162F3] text-white rounded-4xl p-4"><FaMoneyBill1Wave className="inline-block mx-1 md:mx-3"/> Loan Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

                {/* Loan Amount */}
                <div className="form-group space-y-2">
                    <label htmlFor="loanAmount" className="text-sm md:block font-medium text-gray-700">Loan Amount</label>
                    <input
                        id="loanAmount"
                        type="number"
                        placeholder={`Loan Amount (${loanType.minAmount} - ${loanType.maxAmount})`}
                        {...register('loanAmount', {
                            required: true,
                            min: loanType.minAmount,
                            max: loanType.maxAmount,
                        })}
                        className="input-field border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]"
                    />
                </div>

                {/* Duration */}
                <div className="form-group space-y-2">
                    <label htmlFor="loanDuration" className="text-sm md:block font-medium text-gray-700">Duration (Months)</label>
                    <input
                        id="loanDuration"
                        type="number"
                        placeholder="Duration (Months)"
                        {...register('loanDuration')}
                        className="input-field border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]"
                    />
                </div>

                {/* Interest Rate */}
                <div className="form-group space-y-2 bg-gray-100 p-4 rounded-md">
                    <label htmlFor="interestRate" className="text-sm font-medium md:block text-gray-700">Interest Rate</label>
                    <input
                        id="interestRate"
                        type="text"
                        value={`${interestRate}% : ${interestType}`}
                        readOnly
                        className="input-field bg-gray-100 cursor-not-allowed  border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]"
                    />
                </div>

                {/* Collection Frequency */}
                <div className="form-group space-y-2">
                    <label htmlFor="collectionFreq" className="text-sm md:block font-medium text-gray-700">Collection Frequency</label>
                    <select
                        id="collectionFreq"
                        {...register('collectionFreq')}
                        className="input-field border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]"
                        required
                    >
                        {Object.values(CollectionFrequency).map(freq => (
                            <option key={freq} value={freq}>
                                {freq}
                            </option>
                        ))}
                    </select>
                </div>

                {/* First EMI Date */}
                <div className="form-group space-y-2">
                    <label htmlFor="firstEmiDate" className="text-sm md:block font-medium text-gray-700">First EMI Date</label>
                    <input
                        id="firstEmiDate"
                        type="date"
                        {...register('firstEmiDate')}
                        required
                        className="input-field border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]"
                    />
                </div>

                {/* Fees Payment Method */}
                <div className="form-group space-y-2">
                    <label htmlFor="feesPaymentMethod" className="text-sm md:block font-medium text-gray-700">Fees Payment Method</label>
                    <select
                        id="feesPaymentMethod"
                        {...register('feesPaymentMethod')}
                        required
                        className="input-field  border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]"
                    >
                        {Object.values(FeesPaymentMethod).map(method => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Disbursement Method */}
                <div className="form-group space-y-2">
                    <label htmlFor="disbursementMethod" className="text-sm md:block font-medium text-gray-700">Disbursement Method</label>
                    <select
                        id="disbursementMethod"
                        {...register('disbursementMethod')}
                        required
                        className="input-field border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]"
                    >
                        <option value="CASH">Cash</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                </div>

                {/* Processing Fees */}
                <div className="form-group space-y-2 bg-gray-100 p-4 rounded-md">
                    <label className="text-sm font-medium md:block text-gray-700">Processing Fees</label>
                    <input
                        type="text"
                        value={`${processingFees.isPercentage ? processingFees.amount + "%" : "₹" + processingFees.amount}`}
                        readOnly
                        className="input-field bg-gray-100  border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]cursor-not-allowed"
                    />
                </div>

                {/* Insurance Fees */}
                <div className="form-group space-y-2 bg-gray-100 p-4 rounded-md">
                    <label className="text-sm font-medium md:block text-gray-700">Insurance Fees</label>
                    <input
                        type="text"
                        value={`${insuranceFees.isPercentage ? insuranceFees.amount + "%" : "₹" + insuranceFees.amount}`}
                        readOnly
                        className="input-field border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%] bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Other Fees */}
                {otherFees.length > 0 && otherFees.map((fee: OtherFee, index: number) => (
                    <div key={index} className="form-group space-y-2 bg-gray-100 p-4 rounded-md shadow-sm">
                        <label className="text-sm font-medium md:block text-gray-700">{fee.description}</label>
                        <input
                            type="text"
                            value={`${fee.isPercentage ? fee.amount + "%" : "₹" + fee.amount}`}
                            readOnly
                            className="input-field bg-gray-100 cursor-not-allowed border-2 py-2 px-4 rounded-lg mx-4 md:mx-0 md:w-[75%]"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

interface OtherFee {
    amount: number;
    isPercentage: boolean;
    description: string;
}

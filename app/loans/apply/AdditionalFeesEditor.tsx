'use client';
import { FaTrash } from "react-icons/fa";
interface Fee {
    amount: number;
    isPercentage: boolean;
    description: string;
}

interface Props {
    fees: Fee[];
    setFees: (fees: Fee[]) => void;
}

export default function AdditionalFeesEditor({ fees, setFees }: Props) {
    const updateFee = <K extends keyof Fee>(index: number, key: K, value: Fee[K]) => {
        const copy = [...fees];
        copy[index][key] = value;
        setFees(copy);
    };

    const addFee = () => {
        setFees([...fees, { amount: 0, isPercentage: false, description: '' }]);
    };

    const removeFee = (index: number) => {
        setFees(fees.filter((_, i) => i !== index));
    };

    return (
        <section className="card space-y-6 p-6">
            <h2 className="text-2xl font-semibold text-gray-800">Additional Fees / Discounts</h2>

            {fees.map((fee, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr_0.5fr] gap-6 items-center p-4 border rounded-lg shadow-lg transition-all hover:shadow-xl">
                    {/* Description Input */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor={`description-${index}`} className="text-sm text-gray-600">Description</label>
                        <input
                            id={`description-${index}`}
                            type="text"
                            placeholder="Enter description"
                            value={fee.description}
                            onChange={(e) => updateFee(index, 'description', e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Amount Input */}
                    <div className="flex flex-col space-y-2">
                        <label htmlFor={`amount-${index}`} className="text-sm text-gray-600">Amount</label>
                        <input
                            id={`amount-${index}`}
                            type="number"
                            placeholder="Enter amount"
                            value={fee.amount}
                            onChange={(e) => updateFee(index, 'amount', Number(e.target.value))}
                            onFocus={(e) => {
                                if (e.target.value === '0') {
                                    e.target.value = '';
                                }
                            }}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>


                    {/* Percentage Checkbox */}
                    <div className="flex items-center md:pt-5 space-x-3">
                        <input
                            type="checkbox"
                            checked={fee.isPercentage}
                            onChange={(e) => updateFee(index, 'isPercentage', e.target.checked)}
                            className="rounded-lg border-gray-300 cursor-pointer focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="text-md cursor-pointer text-gray-600">Percentage</label>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => removeFee(index)}
                            className="text-red-500 hover:text-red-700 font-bold transition-all"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addFee}
                className="w-full py-3 mt-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
                + Add Fee / Discount
            </button>
        </section>
    );
}

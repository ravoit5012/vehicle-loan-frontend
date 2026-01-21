// 'use client';

// import React, { useState } from 'react';
// import { FaInfoCircle, FaWallet, FaClock, FaFileInvoice, FaPlus, FaTrash } from 'react-icons/fa';
// import { API_ENDPOINTS } from '@/app/config/config';
// import { Toast } from '@/app/components/Toast';

// /* ================= TYPES ================= */

// type Fee = {
//     amount: string;
//     isPercentage: boolean;
// };

// type OtherFee = {
//     amount: string;
//     isPercentage: boolean;
//     description: string;
// };

// type LoanForm = {
//     loanName: string;
//     status: 'ACTIVE' | 'INACTIVE';
//     description: string;
//     minAmount: string;
//     maxAmount: string;
//     interestRate: string;
//     interestType: 'FLAT' | 'REDUCING_BALANCE';
//     processingFees: Fee;
//     insuranceFees: Fee;
//     otherFees: OtherFee[];
//     loanDuration: string;
//     collectionFreq: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
// };

// /* ================= PAGE ================= */

// export default function CreateLoanTypePage() {
//     const [loading, setLoading] = useState(false);
//     const [toastMessage, setToastMessage] = useState<string | null>(null);

//     const [form, setForm] = useState<LoanForm>({
//         loanName: '',
//         status: 'ACTIVE',
//         description: '',
//         minAmount: '',
//         maxAmount: '',
//         interestRate: '',
//         interestType: 'FLAT',
//         processingFees: { amount: '', isPercentage: false },
//         insuranceFees: { amount: '', isPercentage: false },
//         otherFees: [],
//         loanDuration: '',
//         collectionFreq: 'MONTHLY',
//     });

//     const update = <K extends keyof LoanForm>(key: K, value: LoanForm[K]) =>
//         setForm(prev => ({ ...prev, [key]: value }));

//     const addOtherFee = () => {
//         update('otherFees', [
//             ...form.otherFees,
//             { description: '', amount: '', isPercentage: false },
//         ]);
//     };

//     const removeOtherFee = (index: number) => {
//         const updated = [...form.otherFees];
//         updated.splice(index, 1);
//         update('otherFees', updated);
//     };

//     const submit = async () => {
//         setLoading(true);

//         const payload = {
//             loanName: form.loanName,
//             status: form.status,
//             description: form.description || null,
//             minAmount: Number(form.minAmount),
//             maxAmount: Number(form.maxAmount),
//             interestRate: Number(form.interestRate),
//             interestType: form.interestType,
//             loanDuration: Number(form.loanDuration),
//             collectionFreq: form.collectionFreq,
//             processingFees: {
//                 amount: Number(form.processingFees.amount),
//                 isPercentage: form.processingFees.isPercentage,
//             },
//             insuranceFees: {
//                 amount: Number(form.insuranceFees.amount),
//                 isPercentage: form.insuranceFees.isPercentage,
//             },
//             otherFees: form.otherFees.map(f => ({
//                 amount: Number(f.amount),
//                 isPercentage: f.isPercentage,
//                 description: f.description,
//             })),
//         };

//         try {
//             const res = await fetch(API_ENDPOINTS.CREATE_LOAN_TYPE, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });

//             if (!res.ok) throw new Error('Failed to create loan type');

//             setToastMessage('Loan Type Created Successfully');

//             setTimeout(() => window.location.reload(), 2000);
//         } catch (e) {
//             alert((e as Error).message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="p-6 bg-[#F8F9FA] min-h-screen">
//             <h1 className="font-bold text-2xl mb-6">Add New Loan Product</h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card title="Basic Information" color="bg-blue-500" icon={<FaInfoCircle />}>
//                     <Input label="Loan Name" value={form.loanName} onChange={v => update('loanName', v)} />
//                     <Select label="Status" value={form.status} options={['ACTIVE', 'INACTIVE']} onChange={v => update('status', v)} />
//                     <Textarea label="Description" value={form.description} onChange={v => update('description', v)} />
//                 </Card>

//                 <Card title="Financial Details" color="bg-purple-500" icon={<FaWallet />}>
//                     <Input label="Min Amount" type="number" value={form.minAmount} onChange={v => update('minAmount', v)} />
//                     <Input label="Max Amount" type="number" value={form.maxAmount} onChange={v => update('maxAmount', v)} />
//                     <Input label="Interest Rate (%)" type="number" value={form.interestRate} onChange={v => update('interestRate', v)} />
//                     <TabSelect
//                         label="Interest Type"
//                         value={form.interestType}
//                         options={[
//                             { label: 'Flat Rate', value: 'FLAT' },
//                             { label: 'Reducing Balance', value: 'REDUCING_BALANCE' },
//                         ]}
//                         onChange={v => update('interestType', v)}
//                     />
//                 </Card>

//                 <Card title="Processing, Insurance & Other Fees" color="bg-green-500" icon={<FaFileInvoice />}>
//                     <FeeBlock title="Processing Fee" fee={form.processingFees} onChange={v => update('processingFees', v)} />
//                     <FeeBlock title="Insurance Fee" fee={form.insuranceFees} onChange={v => update('insuranceFees', v)} />

//                     {/* ===== OTHER FEES ===== */}
//                     <div className="flex justify-between items-center mt-6 mb-3">
//                         <h4 className="text-sm font-semibold">Other Fees</h4>
//                         <button
//                             type="button"
//                             onClick={addOtherFee}
//                             className="flex items-center gap-2 text-sm text-[#304CDD] font-semibold"
//                         >
//                             <FaPlus /> Add Other Fee
//                         </button>
//                     </div>

//                     {form.otherFees.map((fee, index) => (
//                         <div key={index} className="border rounded-lg p-4 mb-4 bg-[#F9FAFB] relative">
//                             <button
//                                 type="button"
//                                 onClick={() => removeOtherFee(index)}
//                                 className="absolute top-3 right-3 text-red-500"
//                             >
//                                 <FaTrash />
//                             </button>

//                             <Input
//                                 label="Description"
//                                 value={fee.description}
//                                 onChange={v => {
//                                     const updated = [...form.otherFees];
//                                     updated[index].description = v;
//                                     update('otherFees', updated);
//                                 }}
//                             />

//                             <div className="grid grid-cols-2 gap-3">
//                                 <Input
//                                     label="Amount"
//                                     type="number"
//                                     value={fee.amount}
//                                     onChange={v => {
//                                         const updated = [...form.otherFees];
//                                         updated[index].amount = v;
//                                         update('otherFees', updated);
//                                     }}
//                                 />

//                                 <TabSelect
//                                     label="Type"
//                                     value={fee.isPercentage ? 'PERCENTAGE' : 'FLAT'}
//                                     options={[
//                                         { label: 'Flat', value: 'FLAT' },
//                                         { label: 'Percentage', value: 'PERCENTAGE' },
//                                     ]}
//                                     onChange={v => {
//                                         const updated = [...form.otherFees];
//                                         updated[index].isPercentage = v === 'PERCENTAGE';
//                                         update('otherFees', updated);
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                 </Card>

//                 <Card title="Loan Duration & Collection" color="bg-yellow-500" icon={<FaClock />}>
//                     <Input
//                         label="Loan Duration (Months)"
//                         type="number"
//                         value={form.loanDuration}
//                         onChange={v => update('loanDuration', v)}
//                     />
//                     <Select
//                         label="Collection Frequency"
//                         value={form.collectionFreq}
//                         options={['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY']}
//                         onChange={v => update('collectionFreq', v)}
//                     />
//                 </Card>
//             </div>

//             <button
//                 onClick={submit}
//                 disabled={loading}
//                 className="mt-8 w-64 py-3 rounded-lg bg-[#304CDD] text-white font-semibold disabled:opacity-50"
//             >
//                 {loading ? 'Creating...' : 'Create Loan Product'}
//             </button>

//             {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
//         </div>
//     );
// }

// /* ================= REUSABLE COMPONENTS ================= */

// type InputProps = {
//     label: string;
//     value: string;
//     type?: string;
//     onChange: (value: string) => void;
// };

// const Input = ({ label, value, onChange, type = 'text' }: InputProps) => (
//     <div className="flex flex-col mb-3">
//         <label className="text-sm mb-1 text-[#394150]">{label}</label>
//         <input
//             type={type}
//             value={value}
//             onChange={e => onChange(e.target.value)}
//             className="px-4 py-2 rounded-xl border border-[#DADDE5]"
//         />
//     </div>
// );

// const Textarea = ({ label, value, onChange }: InputProps) => (
//     <div className="flex flex-col mb-3">
//         <label className="text-sm mb-1 text-[#394150]">{label}</label>
//         <textarea
//             value={value}
//             onChange={e => onChange(e.target.value)}
//             className="p-3 rounded-md border border-[#DADDE5] min-h-20"
//         />
//     </div>
// );

// type SelectProps<T extends string> = {
//     label: string;
//     value: T;
//     options: T[];
//     onChange: (value: T) => void;
// };

// const Select = <T extends string>({ label, value, options, onChange }: SelectProps<T>) => (
//     <div className="flex flex-col mb-3">
//         <label className="text-sm mb-1 text-[#394150]">{label}</label>
//         <select
//             value={value}
//             onChange={e => onChange(e.target.value as T)}
//             className="py-2 px-4 rounded-xl border border-[#DADDE5]"
//         >
//             {options.map(o => (
//                 <option key={o} value={o}>
//                     {o}
//                 </option>
//             ))}
//         </select>
//     </div>
// );

// type FeeBlockProps = {
//     title: string;
//     fee: Fee;
//     onChange: (fee: Fee) => void;
// };

// const FeeBlock = ({ title, fee, onChange }: FeeBlockProps) => (
//     <>
//         <h4 className="text-sm font-semibold my-3">{title}</h4>
//         <div className="grid grid-cols-2 gap-3">
//             <Input label="Amount" type="number" value={fee.amount} onChange={v => onChange({ ...fee, amount: v })} />
//             <TabSelect
//                 label="Type"
//                 value={fee.isPercentage ? 'PERCENTAGE' : 'FLAT'}
//                 options={[
//                     { label: 'Flat', value: 'FLAT' },
//                     { label: 'Percentage', value: 'PERCENTAGE' },
//                 ]}
//                 onChange={v => onChange({ ...fee, isPercentage: v === 'PERCENTAGE' })}
//             />
//         </div>
//     </>
// );

// const Card = ({ title, icon, color, children }: any) => (
//     <div className="rounded-lg bg-white shadow-sm overflow-hidden">
//         <div className={`flex items-center gap-2 px-6 py-4 text-white font-bold ${color}`}>
//             {icon}
//             <span>{title}</span>
//         </div>
//         <div className="p-4">{children}</div>
//     </div>
// );

// type TabOption<T extends string> = {
//     label: string;
//     value: T;
// };

// type TabSelectProps<T extends string> = {
//     label: string;
//     value: T;
//     options: TabOption<T>[];
//     onChange: (value: T) => void;
// };

// const TabSelect = <T extends string>({ label, value, options, onChange }: TabSelectProps<T>) => (
//     <div className="flex flex-col mb-3">
//         <label className="text-sm mb-1 text-[#394150]">{label}</label>
//         <div className="flex border rounded-lg overflow-hidden">
//             {options.map(o => (
//                 <button
//                     key={o.value}
//                     type="button"
//                     onClick={() => onChange(o.value)}
//                     className={`flex-1 py-2 text-sm font-medium ${
//                         o.value === value ? 'bg-[#304CDD] text-white' : 'bg-[#F7F8FC]'
//                     }`}
//                 >
//                     {o.label}
//                 </button>
//             ))}
//         </div>
//     </div>
// );


'use client';

import React, { useState } from 'react';
import {
    FaInfoCircle,
    FaWallet,
    FaClock,
    FaFileInvoice,
    FaPlus,
    FaTrash,
} from 'react-icons/fa';
import { API_ENDPOINTS } from '@/app/config/config';
import { Toast } from '@/app/components/Toast';

/* ================= TYPES ================= */

type Fee = {
    amount: string;
    isPercentage: boolean;
};

type OtherFee = {
    amount: string;
    isPercentage: boolean;
    description: string;
};

type LoanForm = {
    loanName: string;
    status: 'ACTIVE' | 'INACTIVE';
    description: string;
    minAmount: string;
    maxAmount: string;
    interestRate: string;
    interestType: 'FLAT' | 'REDUCING_BALANCE';
    processingFees: Fee;
    insuranceFees: Fee;
    otherFees: OtherFee[];
    loanDuration: string;
    collectionFreq: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY';
};

type LoanFormErrors = Partial<Record<keyof LoanForm, string>> & {
    processingFeesAmount?: string;
    insuranceFeesAmount?: string;
};

/* ================= PAGE ================= */

export default function CreateLoanTypePage() {
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<LoanFormErrors>({});

    const [form, setForm] = useState<LoanForm>({
        loanName: '',
        status: 'ACTIVE',
        description: '',
        minAmount: '',
        maxAmount: '',
        interestRate: '',
        interestType: 'FLAT',
        processingFees: { amount: '', isPercentage: false },
        insuranceFees: { amount: '', isPercentage: false },
        otherFees: [],
        loanDuration: '',
        collectionFreq: 'MONTHLY',
    });

    const update = <K extends keyof LoanForm>(key: K, value: LoanForm[K]) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const addOtherFee = () =>
        update('otherFees', [
            ...form.otherFees,
            { description: '', amount: '', isPercentage: false },
        ]);

    const removeOtherFee = (index: number) => {
        const updated = [...form.otherFees];
        updated.splice(index, 1);
        update('otherFees', updated);
    };

    /* ================= VALIDATION ================= */

    const validateForm = (): boolean => {
        const e: LoanFormErrors = {};

        if (!form.loanName.trim()) e.loanName = 'Loan name is required';
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.minAmount) e.minAmount = 'Min amount is required';
        if (!form.maxAmount) e.maxAmount = 'Max amount is required';
        if (!form.interestRate) e.interestRate = 'Interest rate is required';
        if (!form.loanDuration) e.loanDuration = 'Loan duration is required';

        if (!form.processingFees.amount)
            e.processingFeesAmount = 'Processing fee is required';

        if (!form.insuranceFees.amount)
            e.insuranceFeesAmount = 'Insurance fee is required';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* ================= SUBMIT ================= */

    const submit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        const payload = {
            loanName: form.loanName,
            status: form.status,
            description: form.description,
            minAmount: Number(form.minAmount),
            maxAmount: Number(form.maxAmount),
            interestRate: Number(form.interestRate),
            interestType: form.interestType,
            loanDuration: Number(form.loanDuration),
            collectionFreq: form.collectionFreq,
            processingFees: {
                amount: Number(form.processingFees.amount),
                isPercentage: form.processingFees.isPercentage,
            },
            insuranceFees: {
                amount: Number(form.insuranceFees.amount),
                isPercentage: form.insuranceFees.isPercentage,
            },
            otherFees: form.otherFees.map(f => ({
                description: f.description,
                amount: Number(f.amount),
                isPercentage: f.isPercentage,
            })),
        };

        try {
            const res = await fetch(API_ENDPOINTS.CREATE_LOAN_TYPE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to create loan type');

            setToastMessage('Loan Type Created Successfully');
            setTimeout(() => window.location.reload(), 2000);
        } catch (e) {
            alert((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <h1 className="font-bold text-2xl mb-6">Add New Loan Product</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Basic Information" color="bg-blue-500" icon={<FaInfoCircle />}>
                    <Input
                        label="Loan Name"
                        value={form.loanName}
                        onChange={v => update('loanName', v)}
                        error={errors.loanName}
                    />
                    <Select
                        label="Status"
                        value={form.status}
                        options={['ACTIVE', 'INACTIVE']}
                        onChange={v => update('status', v)}
                    />
                    <Textarea
                        label="Description"
                        value={form.description}
                        onChange={v => update('description', v)}
                        error={errors.description}
                    />
                </Card>

                <Card title="Financial Details" color="bg-purple-500" icon={<FaWallet />}>
                    <Input
                        label="Min Amount"
                        type="number"
                        value={form.minAmount}
                        onChange={v => update('minAmount', v)}
                        error={errors.minAmount}
                    />
                    <Input
                        label="Max Amount"
                        type="number"
                        value={form.maxAmount}
                        onChange={v => update('maxAmount', v)}
                        error={errors.maxAmount}
                    />
                    <Input
                        label="Interest Rate (%)"
                        type="number"
                        value={form.interestRate}
                        onChange={v => update('interestRate', v)}
                        error={errors.interestRate}
                    />
                    <TabSelect
                        label="Interest Type"
                        value={form.interestType}
                        options={[
                            { label: 'Flat Rate', value: 'FLAT' },
                            { label: 'Reducing Balance', value: 'REDUCING_BALANCE' },
                        ]}
                        onChange={v => update('interestType', v)}
                    />
                </Card>

                <Card title="Processing, Insurance & Other Fees" color="bg-green-500" icon={<FaFileInvoice />}>
                    <FeeBlock
                        title="Processing Fee"
                        fee={form.processingFees}
                        onChange={v => update('processingFees', v)}
                        error={errors.processingFeesAmount}
                    />
                    <FeeBlock
                        title="Insurance Fee"
                        fee={form.insuranceFees}
                        onChange={v => update('insuranceFees', v)}
                        error={errors.insuranceFeesAmount}
                    />

                    <div className="flex justify-between items-center mt-6 mb-3">
                        <h4 className="text-sm font-semibold">Other Fees</h4>
                        <button
                            type="button"
                            onClick={addOtherFee}
                            className="flex items-center gap-2 text-sm text-[#304CDD] font-semibold"
                        >
                            <FaPlus /> Add Other Fee
                        </button>
                    </div>

                    {form.otherFees.map((fee, index) => (
                        <div key={index} className="border rounded-lg p-4 mb-4 bg-[#F9FAFB] relative">
                            <button
                                type="button"
                                onClick={() => removeOtherFee(index)}
                                className="absolute top-3 right-3 text-red-500"
                            >
                                <FaTrash />
                            </button>

                            <Input
                                label="Description"
                                value={fee.description}
                                onChange={v => {
                                    const updated = [...form.otherFees];
                                    updated[index].description = v;
                                    update('otherFees', updated);
                                }}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Amount"
                                    type="number"
                                    value={fee.amount}
                                    onChange={v => {
                                        const updated = [...form.otherFees];
                                        updated[index].amount = v;
                                        update('otherFees', updated);
                                    }}
                                />
                                <TabSelect
                                    label="Type"
                                    value={fee.isPercentage ? 'PERCENTAGE' : 'FLAT'}
                                    options={[
                                        { label: 'Flat', value: 'FLAT' },
                                        { label: 'Percentage', value: 'PERCENTAGE' },
                                    ]}
                                    onChange={v => {
                                        const updated = [...form.otherFees];
                                        updated[index].isPercentage = v === 'PERCENTAGE';
                                        update('otherFees', updated);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </Card>

                <Card title="Loan Duration & Collection" color="bg-yellow-500" icon={<FaClock />}>
                    <Input
                        label="Loan Duration (Months)"
                        type="number"
                        value={form.loanDuration}
                        onChange={v => update('loanDuration', v)}
                        error={errors.loanDuration}
                    />
                    <Select
                        label="Collection Frequency"
                        value={form.collectionFreq}
                        options={['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY']}
                        onChange={v => update('collectionFreq', v)}
                    />
                </Card>
            </div>

            <button
                onClick={submit}
                disabled={loading}
                className="mt-8 w-64 py-3 rounded-lg bg-[#304CDD] text-white font-semibold disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Loan Product'}
            </button>

            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        </div>
    );
}

/* ================= REUSABLE COMPONENTS ================= */

type InputProps = {
    label: string;
    value: string;
    type?: string;
    onChange: (value: string) => void;
    error?: string;
};

const Input = ({ label, value, onChange, type = 'text', error }: InputProps) => (
    <div className="flex flex-col mb-3">
        <label className="text-sm mb-1 text-[#394150]">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`px-4 py-2 rounded-xl border ${
                error ? 'border-red-500 bg-red-50' : 'border-[#DADDE5]'
            }`}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
);

const Textarea = ({ label, value, onChange, error }: InputProps & { error?: string }) => (
    <div className="flex flex-col mb-3">
        <label className="text-sm mb-1 text-[#394150]">{label}</label>
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`p-3 rounded-md border min-h-20 ${
                error ? 'border-red-500 bg-red-50' : 'border-[#DADDE5]'
            }`}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
);

const Select = <T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: T[];
    onChange: (value: T) => void;
}) => (
    <div className="flex flex-col mb-3">
        <label className="text-sm mb-1 text-[#394150]">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value as T)}
            className="py-2 px-4 rounded-xl border border-[#DADDE5]"
        >
            {options.map(o => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    </div>
);

const FeeBlock = ({
    title,
    fee,
    onChange,
    error,
}: {
    title: string;
    fee: Fee;
    onChange: (fee: Fee) => void;
    error?: string;
}) => (
    <>
        <h4 className="text-sm font-semibold my-3">{title}</h4>
        <div className="grid grid-cols-2 gap-3">
            <Input
                label="Amount"
                type="number"
                value={fee.amount}
                onChange={v => onChange({ ...fee, amount: v })}
                error={error}
            />
            <TabSelect
                label="Type"
                value={fee.isPercentage ? 'PERCENTAGE' : 'FLAT'}
                options={[
                    { label: 'Flat', value: 'FLAT' },
                    { label: 'Percentage', value: 'PERCENTAGE' },
                ]}
                onChange={v => onChange({ ...fee, isPercentage: v === 'PERCENTAGE' })}
            />
        </div>
    </>
);

const Card = ({ title, icon, color, children }: any) => (
    <div className="rounded-lg bg-white shadow-sm overflow-hidden">
        <div className={`flex items-center gap-2 px-6 py-4 text-white font-bold ${color}`}>
            {icon}
            <span>{title}</span>
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const TabSelect = <T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: { label: string; value: T }[];
    onChange: (value: T) => void;
}) => (
    <div className="flex flex-col mb-3">
        <label className="text-sm mb-1 text-[#394150]">{label}</label>
        <div className="flex border rounded-lg overflow-hidden">
            {options.map(o => (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={`flex-1 py-2 text-sm font-medium ${
                        o.value === value ? 'bg-[#304CDD] text-white' : 'bg-[#F7F8FC]'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    </div>
);

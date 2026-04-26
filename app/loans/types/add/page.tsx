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
import { useAuth } from '@/hooks/useAuth';

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
    status: 'APPROVED' | 'NOT_APPROVED';
    vehicleCondition: 'NEW' | 'USED';
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
    const { user } = useAuth() ?? {};
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<LoanFormErrors>({});

    const [form, setForm] = useState<LoanForm>({
        loanName: '',
        status: 'NOT_APPROVED',
        vehicleCondition: 'NEW',
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
            vehicleCondition: form.vehicleCondition,
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
                credentials: "include",
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
        <div className="relative z-10 w-full/50 p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="fixed top-0 -left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
            <div className="fixed top-20 -right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
            <div className="fixed -bottom-20 left-1/3 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl p-8 flex items-center justify-between transition-all duration-300 hover:shadow-indigo-500/10 mb-8">
                    <div className="flex items-center space-x-5">
                        <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center transform -rotate-3 hover:rotate-0 transition duration-300">
                            <FaPlus className="text-white text-3xl drop-shadow-[0_8px_30px_rgb(0,0,0,0.04)]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">Add New Loan Product</h1>
                            <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">Design and configure a new loan type strategy</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
                    <Card title="Basic Information" color="bg-blue-500" icon={<FaInfoCircle />}>
                        <Input
                            label="Loan Name"
                            value={form.loanName}
                            onChange={v => update('loanName', v)}
                            error={errors.loanName}
                        />
                        {user?.role === 'ADMIN' && (
                            <Select
                                label="Status"
                                value={form.status}
                                options={['APPROVED', 'NOT_APPROVED']}
                                onChange={v => update('status', v)}
                            />
                        )}
                        <Select
                            label="Vehicle Condition"
                            value={form.vehicleCondition}
                            options={['NEW', 'USED']}
                            onChange={v => update('vehicleCondition', v)}
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

                <div className="flex justify-center mt-12 mb-16 relative z-10 w-full">
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl w-[80%] md:w-[60%] lg:w-[40%] bg-gradient-to-r from-blue-600 to-indigo-600 transition-all hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <div className="relative px-8 py-5 flex flex-row items-center justify-center space-x-3 text-white">
                            <FaPlus className="text-2xl drop-shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:animate-bounce" />
                            <span className="text-xl font-bold tracking-wider drop-shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                {loading ? 'CREATING...' : 'CREATE LOAN PRODUCT'}
                            </span>
                        </div>
                    </button>
                </div>

                {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            </div>
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
            className={`px-4 py-2 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-[#DADDE5]'
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
            className={`p-3 rounded-md border min-h-20 ${error ? 'border-red-500 bg-red-50' : 'border-[#DADDE5]'
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
    <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-blue-500/10">
        <div className={`flex items-center gap-2 px-6 py-5 text-white font-bold tracking-wide ${color.replace('bg-', 'bg-gradient-to-r from-').replace('-500', '-500 to-indigo-600')}`}>
            <span className="text-xl">{icon}</span>
            <span className="text-lg">{title}</span>
        </div>
        <div className="p-6">{children}</div>
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
                    className={`flex-1 py-2 text-sm font-medium ${o.value === value ? 'bg-[#304CDD] text-white' : 'bg-[#F7F8FC]'
                        }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    </div>
);

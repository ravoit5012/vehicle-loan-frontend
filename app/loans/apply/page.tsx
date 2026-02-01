'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaUser, FaSave, FaPlus } from 'react-icons/fa';
import LoanDetailsSection from './LoanDetailsSection';
import AdditionalFeesEditor from './AdditionalFeesEditor';
import EmiSummaryCards from './EmiSummaryCards';
import SearchableSelect from '@/app/components/SearchableSelect';
import {
    calculateFlatLoan,
    calculateReducingLoan,
    calculateTotalFees,
    calculateDisbursedAmount,
} from '@/app/config/getPeriodsPerYear';
import { API_ENDPOINTS } from '@/app/config/config';
import { CollectionFrequency } from '@/app/config/collection-frequency.enum';
import { FeesPaymentMethod } from '@/app/config/fee-payment.enum';

type AdditionalFee = {
    amount: number;
    isPercentage: boolean;
    description: string;
};

export default function ApplyLoanPage() {
    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm();

    const [customers, setCustomers] = useState<any[]>([]);
    const [loanTypes, setLoanTypes] = useState<any[]>([]);
    const [selectedLoanType, setSelectedLoanType] = useState<any>(null);
    const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    // =========================
    // Fetch Customers & Loan Types
    // =========================
    useEffect(() => {
        (async () => {
            const [customersRes, loanTypesRes] = await Promise.all([
                axios.get(API_ENDPOINTS.GET_ALL_CUSTOMERS, { withCredentials: true }),
                axios.get(API_ENDPOINTS.GET_ALL_LOAN_TYPES, { withCredentials: true }),
            ]);

            setCustomers(customersRes.data);
            setLoanTypes(loanTypesRes.data);
        })();
    }, []);

    // =========================
    // Watch Form Values
    // =========================
    const loanAmount = Number(watch('loanAmount'));
    const duration = Number(watch('loanDuration'));
    const collectionFreq = watch('collectionFreq') as CollectionFrequency;
    const feesPaymentMethod = watch(
        'feesPaymentMethod'
    ) as FeesPaymentMethod;

    // =========================
    // Calculations (Memoized)
    // =========================
    const calculations = useMemo(() => {
        if (
            !selectedLoanType ||
            !loanAmount ||
            !duration ||
            !collectionFreq
        )
            return null;

        const interestResult =
            selectedLoanType.interestType === 'FLAT'
                ? calculateFlatLoan(
                    loanAmount,
                    selectedLoanType.interestRate,
                    duration,
                    collectionFreq
                )
                : calculateReducingLoan(
                    loanAmount,
                    selectedLoanType.interestRate,
                    duration,
                    collectionFreq
                );

        const totalFees = calculateTotalFees(
            loanAmount,
            selectedLoanType.processingFees,
            selectedLoanType.insuranceFees,
            selectedLoanType.otherFees,
            additionalFees
        );

        const disbursedAmount = calculateDisbursedAmount(
            loanAmount,
            totalFees,
            feesPaymentMethod
        );

        return {
            ...interestResult,
            totalFees,
            disbursedAmount,
        };
    }, [
        selectedLoanType,
        loanAmount,
        duration,
        collectionFreq,
        additionalFees,
        feesPaymentMethod,
    ]);

    // =========================
    // Submit Handler
    // =========================
    const onSubmit = async (formData: any) => {
        if (!selectedLoanType || !selectedCustomer) return;

        if (!selectedLoanType) alert("Select Loan type")
        if (!selectedCustomer) alert("select customer")
            console.log(selectedCustomer)
        const payload = {
            customerId: selectedCustomer.id, // Use selectedCustomer directly
            loanTypeId: formData.loanTypeId,
            agentId: selectedCustomer.agentId,
            loanAmount,
            loanDuration: duration,
            collectionFreq,
            firstEmiDate: new Date(formData.firstEmiDate).toISOString(),
            feesPaymentMethod,
            disbursementMethod: formData.disbursementMethod,
            additionalFees,
        };


        await axios.post(API_ENDPOINTS.CREATE_LOAN, payload, { withCredentials: true });

        alert('Loan application created successfully');
        window.location.reload();
    };


    // =========================
    // UI
    // =========================
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <header>
                <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
                    <FaPlus className="text-orange-400 text-3xl" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Add New Loan</h2>
                        <p className="text-gray-600 mt-1">
                            Create a new Loan Application
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* ================= Customer & Loan Selection ================= */}
                <section className="card p-6 space-y-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold bg-[#7162F3] text-white rounded-4xl p-4"><FaUser className="inline-block mx-1 md:mx-3" /> Customer & Loan Selection</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Select */}
                        <div className="flex flex-col">
                            <label htmlFor="customerId" className="mb-2 text-gray-600 font-medium">
                                Customer
                            </label>
                            <SearchableSelect
                                options={customers.map(c => ({
                                    id: c.id,
                                    label: `${c.applicantName} (${c.mobileNumber})`,
                                    ...c // Spread the entire customer object here
                                }))}
                                value={selectedCustomer}
                                onChange={(customer) => setSelectedCustomer(customer)} // This will now set the full customer object
                                placeholder="Select Customer"
                            />

                        </div>

                        {/* Loan Type Select */}
                        <div className="flex flex-col">
                            <label htmlFor="loanTypeId" className="mb-2 text-gray-600 font-medium">
                                Loan Type
                            </label>
                            <SearchableSelect
                                options={loanTypes.map(lt => ({ id: lt.id, label: lt.loanName }))}
                                value={selectedLoanType ? { id: selectedLoanType.id, label: selectedLoanType.loanName } : null}
                                onChange={(selectedOption) => {
                                    const loanType = loanTypes.find(lt => lt.id === selectedOption?.id) || null;
                                    setSelectedLoanType(loanType);

                                    if (loanType) {
                                        // Update React Hook Form values
                                        setValue('loanTypeId', loanType.id);
                                        setValue('loanDuration', loanType.loanDuration);
                                        setValue('collectionFreq', loanType.collectionFreq);
                                        setValue('feesPaymentMethod', FeesPaymentMethod.DEDUCTED);
                                    }
                                }}
                                placeholder="Select Loan Type"
                            />



                        </div>

                        {/* Placeholder for future field or spacing */}
                        {/* <div className="hidden md:block"></div> */}
                    </div>
                </section>

                {/* ================= Loan Details ================= */}
                {selectedLoanType && (
                    <LoanDetailsSection
                        loanType={selectedLoanType}
                        register={register}
                        watch={watch}
                    />
                )}

                {/* ================= Additional Fees ================= */}
                <AdditionalFeesEditor
                    fees={additionalFees}
                    setFees={setAdditionalFees}
                />

                {/* ================= EMI Summary ================= */}
                {calculations && (
                    <EmiSummaryCards
                        emi={calculations.emi}
                        totalInterest={calculations.totalInterest}
                        totalFees={calculations.totalFees}
                        totalPayable={calculations.totalPayable}
                        disbursedAmount={calculations.disbursedAmount}
                    />
                )}

                {/* ================= Submit ================= */}
                <div className="flex justify-center pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary cursor-pointer w-[75%] px-10 py-3"
                    >     <h2 className="text-2xl font-semibold bg-[#835EF5] text-white rounded-4xl p-4"><FaSave className="inline-block mx-1 md:mx-3" />  {isSubmitting
                        ? 'Submitting...'
                        : 'Submit Loan Application'}</h2>

                    </button>
                </div>
            </form>
        </div>
    );
}


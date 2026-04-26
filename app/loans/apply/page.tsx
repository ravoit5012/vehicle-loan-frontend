'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaUser, FaSave, FaPlus } from 'react-icons/fa';
import LoanDetailsSection from './LoanDetailsSection';
import VehicleDetailsSection from './VehicleDetailsSection';
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
import { extractErrorMessage } from '@/lib/errors';
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
            setLoanTypes(loanTypesRes.data.filter((lt: any) => lt.status === 'APPROVED'));
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
        if (!selectedLoanType) {
            alert("Select Loan type");
            return;
        }
        if (!selectedCustomer) {
            alert("Select customer");
            return;
        }

        const payload = {
            customerId: selectedCustomer.id,
            loanTypeId: formData.loanTypeId,
            agentId: selectedCustomer.agentId,
            loanAmount,
            loanDuration: duration,
            collectionFreq,
            firstEmiDate: new Date(formData.firstEmiDate).toISOString(),
            feesPaymentMethod,
            disbursementMethod: formData.disbursementMethod,
            additionalFees,
            registrationNumber: formData.registrationNumber,
            chassisNumber: formData.chassisNumber,
            engineNumber: formData.engineNumber,
            repoFinancerName: formData.repoFinancerName,
            registrationImageUrl: formData.registrationImageUrl,
            chassisImageUrl: formData.chassisImageUrl,
            engineImageUrl: formData.engineImageUrl,
            repoFinancerImageUrl: formData.repoFinancerImageUrl,
        };

        try {
            await axios.post(API_ENDPOINTS.CREATE_LOAN, payload, { withCredentials: true });
            alert('Loan application created successfully');
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(extractErrorMessage(err, 'Failed to create loan application'));
        }
    };


    return (
        <div className="relative font-sans p-4 md:p-8 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-8 relative z-10 pt-4">
                <header className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 flex items-center justify-between transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
                    <div className="flex items-center space-x-5">
                        <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition duration-300">
                            <FaPlus className="text-white text-3xl drop-shadow-md" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-900 tracking-tight">Create Application</h1>
                            <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">Initiate a new financial contract and calculate schedules dynamically</p>
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* ================= Customer & Loan Selection ================= */}
                    <section className="bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-3xl transition-all duration-300 hover:shadow-indigo-500/10 relative z-20">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-5 flex items-center space-x-4 rounded-t-3xl">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FaUser className="text-white text-xl" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-wide drop-shadow-md">Customer & Profile Context</h2>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
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

                            {/* Placeholder for spacing */}
                            <div className="hidden md:block"></div>
                        </div>
                    </section>

                    {/* ================= Loan Details & Vehicle Details ================= */}
                    {selectedLoanType && (
                        <>
                            <LoanDetailsSection
                                loanType={selectedLoanType}
                                register={register}
                                watch={watch}
                            />
                            <VehicleDetailsSection
                                loanType={selectedLoanType}
                                register={register}
                                watch={watch}
                                setValue={setValue}
                                customer={selectedCustomer}
                            />
                        </>
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
                    <div className="flex justify-center pt-8 pb-12">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl w-[80%] md:w-[60%] lg:w-[40%] bg-gradient-to-r from-indigo-600 to-purple-600 transition-all hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            <div className="relative px-8 py-5 flex flex-row items-center justify-center space-x-3 text-white">
                                <FaSave className="text-2xl drop-shadow-md group-hover:animate-bounce" />
                                <span className="text-xl font-bold tracking-wider drop-shadow-md">
                                    {isSubmitting ? 'GENERATING...' : 'AUTHORIZE APPLICATION'}
                                </span>
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


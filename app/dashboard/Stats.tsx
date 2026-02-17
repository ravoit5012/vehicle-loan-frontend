"use client";

import {
    FileText,
    CheckCircle,
    DollarSign,
    Percent,
    Wallet,
    Clock,
    Landmark,
    CrossIcon,
    XCircle
} from "lucide-react";
import { API_ENDPOINTS } from "../config/config";
import StatCard from "./Components/StatCard";
import StatsContainer from "./Components/StatsContainer";

export default function Stats() {
    return (
        <>
            <StatsContainer>
                <StatCard
                    title="All Loans"
                    endpoint={API_ENDPOINTS.GET_ALL_LOAN_COUNT}
                    icon={<FileText size={22} />}
                    href="/loans/view"
                />

                <StatCard
                    title="Approved Loans"
                    endpoint={API_ENDPOINTS.GET_ALL_APPROVED_LOAN_COUNT}
                    icon={<CheckCircle size={22} />}
                    href='/loans/approved'
                />

                <StatCard
                    title="Rejected Loans"
                    endpoint={API_ENDPOINTS.GET_ALL_REJECTED_LOAN_COUNT}
                    icon={<XCircle size={22} />}
                    href="/loans/rejected"
                />

                <StatCard
                    title="Total Principal Amount"
                    endpoint={API_ENDPOINTS.GET_TOTAL_PRINCIPAL_AMOUNT}
                    icon={<Landmark size={22} />}
                    href="#"
                />

                <StatCard
                    title="Total Interest Amount"
                    endpoint={API_ENDPOINTS.GET_TOTAL_INTEREST_AMOUNT}
                    icon={<Percent size={22} />}
                    href="#"
                />

                <StatCard
                    title="Total Repaid Amount"
                    endpoint={API_ENDPOINTS.GET_TOTAL_REPAID_AMOUNT}
                    icon={<Wallet size={22} />}
                    href="#"
                />

                <StatCard
                    title="Total Pending Amount"
                    endpoint={API_ENDPOINTS.GET_TOTAL_PENDING_AMOUNT}
                    icon={<Clock size={22} />}
                    href="#"
                />

                <StatCard
                    title="Total Repayable Amount"
                    endpoint={API_ENDPOINTS.GET_TOTAL_REPAYABLE_AMOUNT}
                    icon={<DollarSign size={22} />}
                    href="#"
                />

            </StatsContainer>
        </>
    );
}

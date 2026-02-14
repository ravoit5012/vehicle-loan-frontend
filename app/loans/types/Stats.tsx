"use client";

import {
    FileText,
    CheckCircle,
    DollarSign,
    Percent,
    Wallet,
    Clock,
    Landmark
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/config/config";
import StatCard from "./Components/StatCard";
import StatsContainer from "./Components/StatsContainer";

export default function Stats() {
    return (
        <>
            <StatsContainer>
                <StatCard
                    title="Total Products"
                    endpoint={API_ENDPOINTS.GET_ALL_LOAN_TYPE_COUNT}
                    icon={<FileText size={22} />}
                />

                <StatCard
                    title="Total Principal Amount"
                    endpoint={API_ENDPOINTS.GET_TOTAL_PRINCIPAL_AMOUNT}
                    icon={<Landmark size={22} />}
                />

            </StatsContainer>
        </>
    );
}

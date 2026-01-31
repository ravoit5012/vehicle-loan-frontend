'use client';
import { FaSearch } from "react-icons/fa";
interface Props {
    agents: any[];
    onAgentChange: (id: string) => void;
    onSearch: (value: string) => void;
}

export default function LoanFilters({
    agents,
    onAgentChange,
    onSearch,
}: Props) {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                    placeholder="Search by customer name or mobile"
                    className="border-2 rounded-xl pl-12 pr-4 py-2 mr-8 input w-full" // Adjusted padding
                    onChange={e => onSearch(e.target.value)}
                />
            </div>

            {/* Agent Select */}
            <select
                className="input border-2 rounded-xl pl-4 pr-4 w-full md:w-[25%]"
                onChange={e => onAgentChange(e.target.value)}
            >
                <option value="">All Agents</option>
                {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                        {agent.name}
                    </option>
                ))}
            </select>
        </div>

    );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import ManagerSelect from './ManagerSelect';

// type AgentFormState = {
//     agentCode: string;
//     name: string;
//     email: string;
//     phoneNumber: string;
//     username: string;
//     password?: string;
//     address: string;
//     city: string;
//     pincode: string;
//     managerId: string;
// };

// export default function AgentForm({
//     initialData = {},
//     onSubmit,
//     title,
//     isEdit = false,
// }: any) {
//     const { user } = useAuth();

//     const inputClass =
//         "input-field p-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200";

//     const [form, setForm] = useState<AgentFormState>({
//         agentCode: '',
//         name: '',
//         email: '',
//         phoneNumber: '',
//         username: '',
//         password: '',
//         address: '',
//         city: '',
//         pincode: '',
//         managerId: '',
//         ...initialData,
//     });

//     useEffect(() => {
//         if (user?.role === 'MANAGER') {
//             setForm((prev: AgentFormState) => ({
//                 ...prev,
//                 managerId: user.id,
//             }));
//         }
//     }, [user]);

//     // Helper function to generate agent code
//     function generateAgentCode(name: string, phone: string) {
//         const namePart = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
//         const phonePart = phone.slice(3, 8); // 4th to 8th character
//         if (!namePart || !phonePart) return '';
//         return `AGN-${namePart}-${phonePart}`;
//     }

//     function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//         const { name, value } = e.target;

//         setForm(prev => {
//             const updated = { ...prev, [name]: value };

//             // Auto-generate Agent Code on name or phone change
//             if (name === 'name' || name === 'phoneNumber') {
//                 updated.agentCode = generateAgentCode(
//                     updated.name,
//                     updated.phoneNumber
//                 );
//             }

//             return updated;
//         });
//     }

//     function submit() {
//         const payload = { ...form };
//         if (isEdit && !payload.password) {
//             delete payload.password;
//         }
//         onSubmit(payload);
//     }

//     return (
//         <div className="container mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-lg space-y-8">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                 {title}
//             </h1>

//             {/* Form Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField label="Agent Code">
//                     <input
//                         className={inputClass}
//                         name="agentCode"
//                         value={form.agentCode}
//                         readOnly
//                         placeholder="Auto Generated"
//                     />
//                 </FormField>

//                 <FormField label="Full Name">
//                     <input
//                         className={inputClass}
//                         name="name"
//                         value={form.name}
//                         onChange={handleChange}
//                         placeholder="Enter full name"
//                     />
//                 </FormField>

//                 <FormField label="Email">
//                     <input
//                         className={inputClass}
//                         type="email"
//                         name="email"
//                         value={form.email}
//                         onChange={handleChange}
//                         placeholder="Enter email"
//                     />
//                 </FormField>

//                 <FormField label="Phone Number">
//                     <input
//                         className={inputClass}
//                         name="phoneNumber"
//                         value={form.phoneNumber}
//                         onChange={handleChange}
//                         placeholder="Enter phone number"
//                     />
//                 </FormField>

//                 <FormField label="Username">
//                     <input
//                         className={inputClass}
//                         name="username"
//                         value={form.username}
//                         onChange={handleChange}
//                         placeholder="Enter username"
//                     />
//                 </FormField>


//                 <FormField label="Password">
//                     <input
//                         className={inputClass}
//                         type="password"
//                         name="password"
//                         value={form.password}
//                         onChange={handleChange}
//                         placeholder="Enter password"
//                     />
//                 </FormField>


//                 <FormField label="Address">
//                     <input
//                         className={inputClass}
//                         name="address"
//                         value={form.address}
//                         onChange={handleChange}
//                         placeholder="Enter address"
//                     />
//                 </FormField>

//                 <FormField label="City">
//                     <input
//                         className={inputClass}
//                         name="city"
//                         value={form.city}
//                         onChange={handleChange}
//                         placeholder="Enter city"
//                     />
//                 </FormField>

//                 <FormField label="Pincode">
//                     <input
//                         className={inputClass}
//                         name="pincode"
//                         value={form.pincode}
//                         onChange={handleChange}
//                         placeholder="Enter pincode"
//                     />
//                 </FormField>
//             </div>

//             {/* Manager Selection */}
//             <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                     Manager
//                 </label>

//                 {user?.role === 'ADMIN' ? (
//                     <ManagerSelect
//                         value={form.managerId}
//                         onChange={id => setForm({ ...form, managerId: id })}
//                     />
//                 ) : (
//                     <div className="text-sm bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-700">
//                         Assigned Manager: <b>You</b>
//                     </div>
//                 )}
//             </div>

//             {/* Submit */}
//             <div className="flex justify-end hover:cursor-pointer">
//                 <button
//                     onClick={submit}
//                     className="bg-blue-600 text-white px-4  transition-all duration-300 ease-in-out hover:scale-105 py-2 rounded-xl font-medium
//                                hover:bg-blue-700 focus:outline-none focus:ring-4
//                                focus:ring-blue-200"
//                 >
//                     {isEdit ? 'Update Agent' : 'Create Agent'}
//                 </button>
//             </div>
//         </div>
//     );
// }

// /* Reusable Form Field Wrapper */
// function FormField({
//     label,
//     children,
// }: {
//     label: string;
//     children: React.ReactNode;
// }) {
//     return (
//         <div className="flex flex-col space-y-1">
//             <label className="text-sm font-medium text-gray-700">
//                 {label}
//             </label>
//             {children}
//         </div>
//     );
// }


'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ManagerSelect from './ManagerSelect';

type AgentFormState = {
    agentCode: string;
    name: string;
    email: string;
    phoneNumber: string;
    username: string;
    password?: string;
    address: string;
    city: string;
    pincode: string;
    managerId: string;
    status: 'ACTIVE' | 'INACTIVE';
};

export default function AgentForm({
    initialData = {},
    onSubmit,
    title,
    isEdit = false,
}: any) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const inputClass =
        "input-field p-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200";

    const [form, setForm] = useState<AgentFormState>({
        agentCode: '',
        name: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        address: '',
        city: '',
        pincode: '',
        managerId: '',
        status: 'ACTIVE',
        ...initialData,
    });

    useEffect(() => {
        if (user?.role === 'MANAGER') {
            setForm((prev: AgentFormState) => ({
                ...prev,
                managerId: user.id,
            }));
        }
    }, [user]);

    function generateAgentCode(name: string, phone: string) {
        const namePart = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
        const phonePart = phone.slice(3, 8);
        if (!namePart || !phonePart) return '';
        return `AGN-${namePart}-${phonePart}`;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm(prev => {
            const updated = { ...prev, [name]: value };

            if (name === 'name' || name === 'phoneNumber') {
                updated.agentCode = generateAgentCode(
                    updated.name,
                    updated.phoneNumber
                );
            }

            return updated;
        });
    }

    async function submit() {
        setLoading(true);
        const payload: any = { ...form };

        // Remove password if not changed during edit
        if (isEdit && !payload.password) {
            delete payload.password;
        }

        await onSubmit(payload);
        setLoading(false);
    }

    return (
        <div className="container mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-lg space-y-8">
            {/* <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Agent Code">
                    <input
                        className={inputClass}
                        name="agentCode"
                        value={form.agentCode}
                        readOnly
                        placeholder="Auto Generated"
                    />
                </FormField>

                <FormField label="Full Name">
                    <input
                        className={inputClass}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                    />
                </FormField>

                <FormField label="Email">
                    <input
                        className={inputClass}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                    />
                </FormField>

                <FormField label="Phone Number">
                    <input
                        className={inputClass}
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                    />
                </FormField>

                <FormField label="Username">
                    <input
                        className={inputClass}
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                    />
                </FormField>

                <FormField label="Password">
                    <input
                        className={inputClass}
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder={isEdit ? "Leave empty to keep current password" : "Enter password"}
                    />
                </FormField>

                <FormField label="Address">
                    <input
                        className={inputClass}
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                    />
                </FormField>

                <FormField label="City">
                    <input
                        className={inputClass}
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                    />
                </FormField>

                <FormField label="Pincode">
                    <input
                        className={inputClass}
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="Enter pincode"
                    />
                </FormField>

                <FormField label="Status">
                    <select
                        className={inputClass}
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                </FormField>
            </div>

            {/* Manager Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Manager
                </label>

                {user?.role === 'ADMIN' ? (
                    <ManagerSelect
                        value={form.managerId}
                        onChange={id => setForm({ ...form, managerId: id })}
                    />
                ) : (
                    <div className="text-sm bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-700">
                        Assigned Manager: <b>You</b>
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    onClick={submit}
                    disabled={loading}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-in-out 
                        hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update Agent' : 'Create Agent'}
                </button>
            </div>
        </div>
    );
}

function FormField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {children}
        </div>
    );
}

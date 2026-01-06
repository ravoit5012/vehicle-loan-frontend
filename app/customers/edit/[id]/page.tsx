"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js 13+ app router
import axios from "axios";
import { FILES_URL, API_ENDPOINTS } from "../../../config/config";
import {
    FaUser,
    FaUserTie,
    FaHome,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaMapMarkedAlt,
    FaHashtag,
    FaPhone,
    FaUsers,
    FaFileAlt,
    FaLock,
    FaEnvelope,
    FaIdCard,
    FaTrash,
} from "react-icons/fa";

interface Customer {
    id: string;
    applicantName: string;
    guardianName: string;
    relationType: string;
    religion: string;
    village: string;
    postOffice: string;
    policeStation: string;
    district: string;
    pinCode: string;
    mobileNumber: string;
    maritalStatus: string;
    gender: string;
    dateOfBirth: string;
    nomineeName: string;
    nomineeMobileNumber: string;
    nomineeRelation: string;
    nomineeVillage: string;
    nomineePostOffice: string;
    nomineePoliceStation: string;
    nomineeDistrict: string;
    nomineePinCode: string;
    panNumber: string;
    panImageUrl: string;
    poiDocumentType: string;
    poiDocumentNumber: string;
    poiFrontImageUrl: string;
    poiBackImageUrl: string;
    poaDocumentType: string;
    poaDocumentNumber: string;
    poaFrontImageUrl: string;
    poaBackImageUrl: string;
    applicantSignatureUrl: string;
    personalPhotoUrl: string;
    memberId: string;
    email: string;
    password: string;
    accountStatus: string;
    managerId: string;
    agentId: string;
}

const EditCustomer: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [customer, setCustomer] = useState<Partial<Customer>>({});
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<{ [key: string]: File | null }>({});

    useEffect(() => {
        if (!id) return;

        const fetchCustomer = async () => {
            setLoading(true);
            try {
                const res = await axios.get<Customer>(
                    `${API_ENDPOINTS.GET_CUSTOMER_BY_ID}/${id}`
                );
                setCustomer(res.data);
            } catch (err) {
                console.error("Error fetching customer:", err);
                alert("Failed to fetch customer data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id]);

    if (loading) return <p className="p-6">Loading customer...</p>;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const { name } = e.target;
        setFiles((prev) => ({ ...prev, [name]: e.target.files![0] }));
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();

            // Add only allowed fields (exclude id, memberId, managerId, agentId)
            Object.entries(customer).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    key !== "id" &&        // ❌ exclude id
                    key !== "memberId" &&
                    key !== "managerId" &&
                    key !== "agentId"
                ) {
                    formData.append(key, value as string);
                }
            });

            // Add files
            Object.entries(files).forEach(([key, file]) => {
                if (file) formData.append(key, file);
            });

            await axios.patch(
                `${API_ENDPOINTS.UPDATE_CUSTOMER}/${id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            alert("Customer updated successfully");
            router.push("/customers"); // Redirect after update
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update customer");
        }
    };


    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this customer?")) return;
        try {
            await axios.delete(`${API_ENDPOINTS.DELETE_CUSTOMER}/${id}`, {
                withCredentials: true,
            });
            alert("Customer deleted successfully");
            router.push("/customers"); // Redirect after delete
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete customer");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-md shadow-md my-8">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-6 mb-4">
                <div className="flex items-center space-x-4">
                    <FaUser className="text-orange-400 text-3xl" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Edit Customer</h2>
                        <p className="text-gray-600 mt-1">Click to Update customer details</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="cursor-pointer flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    <FaTrash /> Delete Customer
                </button>
            </div>

            {/* Personal Information */}
            <section className="mb-8">
                <h2 className="bg-blue-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
                    <FaUser /> Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-blue-600 rounded-b-md">
                    <ClickToActivateInput label="Applicant Name" name="applicantName" value={customer.applicantName} onChange={handleInputChange} />
                    <ClickToActivateSelect
                        label="Relation Type"
                        name="relationType"
                        value={customer.relationType || ""}
                        onChange={handleInputChange}
                        options={[
                            { label: "S/O", value: "SO" },
                            { label: "W/O", value: "WO" },
                            { label: "D/O", value: "DO" },
                        ]}
                    />
                    <ClickToActivateInput label="Guardian Name" name="guardianName" value={customer.guardianName} onChange={handleInputChange} />
                    <ClickToActivateSelect
                        label="Religion"
                        name="religion"
                        value={customer.religion || ""}
                        onChange={handleInputChange}
                        options={[
                            { label: "Hindu", value: "HINDU" },
                            { label: "Muslim", value: "MUSLIM" },
                            { label: "Christian", value: "CHRISTIAN" },
                            { label: "Sikh", value: "SIKH" },
                            { label: "Buddhist", value: "BUDDHIST" },
                            { label: "Jain", value: "JAIN" },
                            { label: "Other", value: "OTHER" },
                        ]}
                    />
                    <ClickToActivateInput label="Village" name="village" value={customer.village} onChange={handleInputChange} />
                    <ClickToActivateInput label="Post Office" name="postOffice" value={customer.postOffice} onChange={handleInputChange} />
                    <ClickToActivateInput label="Police Station" name="policeStation" value={customer.policeStation} onChange={handleInputChange} />
                    <ClickToActivateInput label="District" name="district" value={customer.district} onChange={handleInputChange} />
                    <ClickToActivateInput label="PIN Code" name="pinCode" value={customer.pinCode} onChange={handleInputChange} />
                    <ClickToActivateInput label="Mobile Number" name="mobileNumber" value={customer.mobileNumber} onChange={handleInputChange} />
                    <ClickToActivateSelect
                        label="Marital Status"
                        name="maritalStatus"
                        value={customer.maritalStatus || ""}
                        onChange={handleInputChange}
                        options={[
                            { label: "Married", value: "MARRIED" },
                            { label: "Unmarried", value: "UNMARRIED" },
                        ]}
                    />
                    <ClickToActivateSelect
                        label="Gender"
                        name="gender"
                        value={customer.gender || ""}
                        onChange={handleInputChange}
                        options={[
                            { label: "Male", value: "MALE" },
                            { label: "Female", value: "FEMALE" },
                            { label: "Other", value: "OTHER" },
                        ]}
                    />
                    <ClickToActivateInput label="Date of Birth" name="dateOfBirth" type="date" value={customer.dateOfBirth?.split("T")[0]} onChange={handleInputChange} />
                </div>
            </section>

            {/* Nomination Details */}
            <section className="mb-8">
                <h2 className="bg-green-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
                    <FaUsers /> Nomination Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-t-0 border-green-600 rounded-b-md">
                    <ClickToActivateInput label="Nominee Name" name="nomineeName" value={customer.nomineeName} onChange={handleInputChange} />
                    <ClickToActivateInput label="Nominee Mobile" name="nomineeMobileNumber" value={customer.nomineeMobileNumber} onChange={handleInputChange} />
                    {/* <ClickToActivateInput label="Nominee Relation" name="nomineeRelation" value={customer.nomineeRelation} onChange={handleInputChange} /> */}
                    <ClickToActivateSelect
                        label="Nominee Relation"
                        name="nomineeRelation"
                        value={customer.nomineeRelation || ""}
                        onChange={handleInputChange}
                        options={[
                            { label: "Father", value: "FATHER" },
                            { label: "Mother", value: "MOTHER" },
                            { label: "Spouse", value: "SPOUSE" },
                            { label: "Son", value: "SON" },
                            { label: "Daughter", value: "DAUGHTER" },
                            { label: "Brother", value: "BROTHER" },
                            { label: "Sister", value: "SISTER" },
                            { label: "Other", value: "OTHER" },
                        ]}
                    />
                    <ClickToActivateInput label="Nominee Village" name="nomineeVillage" value={customer.nomineeVillage} onChange={handleInputChange} />
                    <ClickToActivateInput label="Nominee Post Office" name="nomineePostOffice" value={customer.nomineePostOffice} onChange={handleInputChange} />
                    <ClickToActivateInput label="Nominee Police Station" name="nomineePoliceStation" value={customer.nomineePoliceStation} onChange={handleInputChange} />
                    <ClickToActivateInput label="Nominee District" name="nomineeDistrict" value={customer.nomineeDistrict} onChange={handleInputChange} />
                    <ClickToActivateInput label="Nominee PIN Code" name="nomineePinCode" value={customer.nomineePinCode} onChange={handleInputChange} />
                </div>
            </section>

            {/* Documents */}
            <section className="mb-8">
                <h2 className="bg-yellow-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
                    <FaFileAlt /> Documents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-yellow-600 rounded-b-md">
                    <FileUploadField label="PAN Card" name="panImage" onChange={handleFileChange} currentUrl={customer.panImageUrl} />
                    <FileUploadField label="POI Front" name="poiFrontImage" onChange={handleFileChange} currentUrl={customer.poiFrontImageUrl} />
                    <FileUploadField label="POI Back" name="poiBackImage" onChange={handleFileChange} currentUrl={customer.poiBackImageUrl} />
                    <FileUploadField label="POA Front" name="poaFrontImage" onChange={handleFileChange} currentUrl={customer.poaFrontImageUrl} />
                    <FileUploadField label="POA Back" name="poaBackImage" onChange={handleFileChange} currentUrl={customer.poaBackImageUrl} />
                    <FileUploadField label="Signature" name="applicantSignature" onChange={handleFileChange} currentUrl={customer.applicantSignatureUrl} />
                    <FileUploadField label="Personal Photo" name="personalPhoto" onChange={handleFileChange} currentUrl={customer.personalPhotoUrl} />
                </div>
            </section>

            {/* Account Information */}
            <section className="mb-8">
                <h2 className="bg-purple-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
                    <FaLock /> Account Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-purple-600 rounded-b-md">
                    <ClickToActivateInput label="Email" name="email" value={customer.email} onChange={handleInputChange} type="email" />
                    <ClickToActivateInput label="Password" name="password" value={customer.password} onChange={handleInputChange} type="password" />
                    <ClickToActivateSelect
                        label="Account Status"
                        name="accountStatus"
                        value={customer.accountStatus || ""}
                        onChange={handleInputChange}
                        options={[
                            { label: "Active", value: "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE" },
                        ]}
                    />
                </div>
            </section>

            <div className="flex justify-end">
                <button
                    onClick={handleUpdate}
                    className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditCustomer;

/* -------------------------------
   REUSABLE EDITABLE COMPONENTS
---------------------------------*/

interface EditableFieldProps {
    label: string;
    name: string;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, name, value, onChange, type = "text" }) => (
    <label className="cursor-pointer flex flex-col text-gray-700 text-sm">
        <span className="cursor-pointer mb-1 font-semibold">{label}</span>
        <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className="cursor-pointer border border-gray-300 rounded-md px-3 py-2"
        />
    </label>
);

interface FileUploadFieldProps {
    label: string;
    name: string;
    currentUrl?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, name, currentUrl, onChange }) => (
    <div className="cursor-pointer flex flex-col gap-2">
        <span className="cursor-pointer font-semibold">{label}</span>
        <input type="file" name={name} onChange={onChange} className="cursor-pointer border border-gray-300 rounded-md p-1" />
        {currentUrl && (
            <button
                onClick={() => window.open(`${FILES_URL}${currentUrl}`, "_blank")}
                className="cursor-pointer px-3 py-1 text-sm text-blue-700 underline hover:text-blue-900"
            >
                View Current File
            </button>
        )}
    </div>
);

function ClickToActivateInput({
    label,
    name,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    name: string;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    const [active, setActive] = useState(false);

    return (
        <label className="cursor-pointer flex flex-col text-gray-700 text-sm">
            <span className="cursor-pointer mb-1 font-semibold">{label}</span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={!active}           // ✅ use readOnly instead of disabled
                onFocus={() => setActive(true)} // optional: activate on focus
                className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2
          ${active ? "bg-white cursor-text focus:ring-blue-500" : "bg-gray-200 cursor-pointer"}`}
            />
        </label>
    );
}
function ClickToActivateSelect({
    label,
    name,
    value,
    onChange,
    options,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: { label: string; value: string }[];
}) {
    const [active, setActive] = useState(false);

    return (
        <label className="cursor-pointer flex flex-col text-gray-700 text-sm">
            <span className="cursor-pointer mb-1 font-semibold">{label}</span>
            <div
                onClick={() => setActive(true)}
                className={`border rounded-md px-3 py-2 focus-within:ring-2
          ${active ? "bg-white cursor-pointer focus-within:ring-blue-500" : "bg-gray-200"}`}
            >
                <select
                    name={name}
                    value={value}
                    onChange={active ? onChange : () => { }}
                    className="cursor-pointer w-full bg-transparent"
                >
                    <option value="" disabled>
                        Select {label}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </label>
    );
}


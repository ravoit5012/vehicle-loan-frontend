"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation"; // Next.js 13+ app router
import axios from "axios";
import { API_ENDPOINTS} from "../../../config/config";
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
  accountStatus: string;
  managerId: string;
  agentId: string;
}

const ViewCustomer: React.FC = () => {
  const params = useParams();
  const id = params.id; // From /customers/add/:id

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const openFile = (url: string) => {
    window.open(url, "_blank");
  };

  if (loading) return <p className="p-6">Loading customer...</p>;
  if (!customer) return <p className="p-6 text-red-500">Customer not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-md shadow-md my-8">
      {/* Header */}
      <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
        <FaUser className="text-orange-400 text-3xl" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">View Customer</h2>
          <p className="text-gray-600 mt-1">Customer profile details (read-only)</p>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <section className="mb-8">
        <h2 className="bg-blue-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaUser /> Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-blue-600 rounded-b-md">
          <InputField label="Applicant Name" value={customer.applicantName} readOnly icon={<FaUser />} />
          <InputField label="Relation Type" value={customer.relationType} readOnly />
          <InputField label="Guardian Name" value={customer.guardianName} readOnly icon={<FaUserTie />} />
          <InputField label="Religion" value={customer.religion} readOnly />
          <InputField label="Village" value={customer.village} readOnly icon={<FaHome />} />
          <InputField label="Post Office" value={customer.postOffice} readOnly icon={<FaMapMarkerAlt />} />
          <InputField label="Police Station" value={customer.policeStation} readOnly icon={<FaShieldAlt />} />
          <InputField label="District" value={customer.district} readOnly icon={<FaMapMarkedAlt />} />
          <InputField label="PIN Code" value={customer.pinCode} readOnly icon={<FaHashtag />} />
          <InputField label="Mobile Number" value={customer.mobileNumber} readOnly icon={<FaPhone />} />
          <InputField label="Marital Status" value={customer.maritalStatus} readOnly />
          <InputField label="Gender" value={customer.gender} readOnly />
          <InputField label="Date of Birth" value={customer.dateOfBirth.split("T")[0]} readOnly type="date" />
        </div>
      </section>

      {/* NOMINATION DETAILS */}
      <section className="mb-8">
        <h2 className="bg-green-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaUsers /> Nomination Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-t-0 border-green-600 rounded-b-md">
          <InputField label="Nominee Name" value={customer.nomineeName} readOnly />
          <InputField label="Nominee Mobile" value={customer.nomineeMobileNumber} readOnly icon={<FaPhone />} />
          <InputField label="Nominee Relation" value={customer.nomineeRelation} readOnly />
          <InputField label="Nominee Village" value={customer.nomineeVillage} readOnly />
          <InputField label="Nominee Post Office" value={customer.nomineePostOffice} readOnly />
          <InputField label="Nominee Police Station" value={customer.nomineePoliceStation} readOnly />
          <InputField label="Nominee District" value={customer.nomineeDistrict} readOnly />
          <InputField label="Nominee PIN Code" value={customer.nomineePinCode} readOnly />
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="mb-8">
        <h2 className="bg-yellow-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaFileAlt /> Documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-yellow-600 rounded-b-md">
          <InputField label="PAN Card Number" value={customer.panNumber} readOnly />
          <FileField label="PAN Card" url={customer.panImageUrl} />
          <InputField label="Proof of Identity Document" value={customer.poiDocumentType} readOnly />
          <InputField label="POI Document Number" value={customer.poiDocumentNumber} readOnly />
          <FileField label="POI Front Image" url={customer.poiFrontImageUrl} />
          <FileField label="POI Back Image" url={customer.poiBackImageUrl} />
          <InputField label="Proof of Address Document" value={customer.poaDocumentType} readOnly />
          <InputField label="POA Document Number" value={customer.poaDocumentNumber} readOnly />
          <FileField label="POA Front Image" url={customer.poaFrontImageUrl} />
          <FileField label="POA Back Image" url={customer.poaBackImageUrl} />
          <FileField label="Signature" url={customer.applicantSignatureUrl} />
          <FileField label="Personal Photo" url={customer.personalPhotoUrl} />
        </div>
      </section>

      {/* ACCOUNT */}
      <section className="mb-8">
        <h2 className="bg-purple-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaLock /> Account Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-purple-600 rounded-b-md">
          <InputField label="Member ID" value={customer.memberId} readOnly icon={<FaUser />} />
          <InputField label="Email" value={customer.email} readOnly icon={<FaEnvelope />} />
          <InputField label="Account Status" value={customer.accountStatus} readOnly />
        </div>
      </section>
    </div>
  );
};

export default ViewCustomer;

/* --------------------------------------
   REUSABLE COMPONENTS
-------------------------------------- */

interface InputFieldProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, icon, readOnly = true, type = "text" }) => (
  <label className="flex flex-col text-gray-700 text-sm">
    <span className="mb-1 font-semibold flex items-center gap-2">
      {icon} {label}
    </span>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
    />
  </label>
);

interface FileFieldProps {
  label: string;
  url: string;
}

const FileField: React.FC<FileFieldProps> = ({ label, url }) => (
  <div className="flex flex-col gap-2">
    <span className="font-semibold">{label}</span>
    <button
      onClick={() => window.open(url, "_blank")}
      className="px-3 py-1 text-sm cursor-pointer text-blue-700 underline hover:text-blue-900"
    >
      View File
    </button>
  </div>
);
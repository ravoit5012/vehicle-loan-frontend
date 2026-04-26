"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js 13+ app router
import axios from "axios";
import { API_ENDPOINTS } from "../../../config/config";
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
  FaExternalLinkAlt,
  FaMoneyBillWave,
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
  nomineePanNumber: string;
  nomineePanImageUrl: string;
  nomineePoiDocumentType: string;
  nomineePoiDocumentNumber: string;
  nomineePoiFrontImageUrl: string;
  nomineePoiBackImageUrl: string;
  nomineePoaDocumentType: string;
  nomineePoaDocumentNumber: string;
  nomineePoaFrontImageUrl: string;
  nomineePoaBackImageUrl: string;
  nomineeSignatureUrl: string;
  nomineePersonalPhotoUrl: string;
  memberId: string;
  email: string;
  accountStatus: string;
  managerId: string;
  agentId: string;
  extraDocuments?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];

}

interface Loan {
  id: string;
  loanAmount: number;
  interestRate: number;
  interestType: string;
  loanDuration: number;
  totalInterest: number;
  totalPayableAmount: number;
  status: string;
  agentId: string;
  loanTypeId: string;
  customerId: string;
  loanType?: {
    loanName: string;
    vehicleCondition: string;
  };
  agent?: {
    name: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-200 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  CALL_VERIFIED: "bg-indigo-100 text-indigo-700",
  CONTRACT_GENERATED: "bg-yellow-100 text-yellow-700",
  CONTRACT_SIGNED: "bg-purple-100 text-purple-700",
  FIELD_VERIFIED: "bg-teal-100 text-teal-700",
  ADMIN_APPROVED: "bg-green-100 text-green-700",
  DISBURSED: "bg-green-200 text-green-800",
  CLOSED: "bg-gray-300 text-gray-800",
  REJECTED: "bg-red-100 text-red-700",
};

const ViewCustomer: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id; // From /customers/add/:id

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loansLoading, setLoansLoading] = useState(true);

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

    const fetchLoans = async () => {
      setLoansLoading(true);
      try {
        const res = await axios.get<Loan[]>(API_ENDPOINTS.GET_ALL_LOAN_APPLICATIONS);
        const filtered = res.data.filter((l) => l.customerId === id);

        // Enrich each loan with agent and loanType details fetched in parallel
        const enriched = await Promise.all(
          filtered.map(async (loan) => {
            const [agentRes, loanTypeRes] = await Promise.all([
              axios.get(`${API_ENDPOINTS.GET_AGENT_BY_ID}/${loan.agentId}`).catch(() => null),
              axios.get(`${API_ENDPOINTS.GET_LOAN_TYPE_BY_ID}/${loan.loanTypeId}`, { withCredentials: true }).catch(() => null),
            ]);
            return {
              ...loan,
              agent: agentRes?.data ?? undefined,
              loanType: loanTypeRes?.data ?? undefined,
            };
          })
        );

        setLoans(enriched);
      } catch (err) {
        console.error("Error fetching loans:", err);
      } finally {
        setLoansLoading(false);
      }
    };
    fetchLoans();
  }, [id]);

  const openFile = (url: string) => {
    window.open(url, "_blank");
  };

  if (loading) return <p className="p-6">Loading customer...</p>;
  if (!customer) return <p className="p-6 text-red-500">Customer not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] my-8">
      {/* Header */}
      <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] mb-4">
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

      {/* LINKED LOANS */}
      <section className="mb-8">
        <h2 className="bg-indigo-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaMoneyBillWave /> Linked Loans
        </h2>
        <div className="border border-t-0 border-indigo-600 rounded-b-md overflow-x-auto bg-white">
          {loansLoading ? (
            <div className="text-center text-gray-500 py-6">Loading loans...</div>
          ) : loans.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No loans linked to this customer.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">Loan Details</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Loan Type Details</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Totals</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Applied By</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-t border-gray-100 hover:bg-indigo-50/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium">₹ {loan.loanAmount}</div>
                      <div className="text-xs text-gray-500">
                        {loan.interestRate}% ({loan.interestType})
                      </div>
                      <div className="text-xs text-gray-500">{loan.loanDuration} months</div>
                    </td>
                    <td className="px-4 py-3">
                      {loan.loanType ? (
                        <>
                          <div>{loan.loanType.loanName}</div>
                          <div className="text-xs text-gray-500">
                            {loan.loanType.vehicleCondition.charAt(0).toUpperCase() +
                              loan.loanType.vehicleCondition.slice(1).toLowerCase()}{" "}
                            Vehicle Loan
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>Interest: ₹ {loan.totalInterest}</div>
                      <div className="text-xs text-gray-500">Total: ₹ {loan.totalPayableAmount}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[loan.status] ??
                          "bg-white/40 backdrop-blur-md border border-white/50"
                          }`}
                      >
                        {loan.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(loan as any).agent?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => router.push(`/loans/view/${loan.id}`)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        <FaExternalLinkAlt className="text-[10px]" />
                        View Loan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

      {/* NOMINEE DOCUMENTS */}
      <section className="mb-8">
        <h2 className="bg-yellow-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaFileAlt /> Nominee Documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-yellow-600 rounded-b-md">
          <InputField label="PAN Card Number" value={customer.nomineePanNumber} readOnly />
          <FileField label="PAN Card" url={customer.nomineePanImageUrl} />
          <InputField label="Proof of Identity Document" value={customer.nomineePoiDocumentType} readOnly />
          <InputField label="POI Document Number" value={customer.nomineePoiDocumentNumber} readOnly />
          <FileField label="POI Front Image" url={customer.nomineePoiFrontImageUrl} />
          <FileField label="POI Back Image" url={customer.nomineePoiBackImageUrl} />
          <InputField label="Proof of Address Document" value={customer.nomineePoaDocumentType} readOnly />
          <InputField label="POA Document Number" value={customer.nomineePoaDocumentNumber} readOnly />
          <FileField label="POA Front Image" url={customer.nomineePoaFrontImageUrl} />
          <FileField label="POA Back Image" url={customer.nomineePoaBackImageUrl} />
          <FileField label="Nominee Signature" url={customer.nomineeSignatureUrl} />
          <FileField label="Nominee Photo" url={customer.nomineePersonalPhotoUrl} />
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

      {/* EXTRA DOCUMENTS */}
      <section className="mb-8">
        <h2 className="bg-indigo-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaFileAlt /> Extra Documents
        </h2>

        <div className="p-4 border border-t-0 border-indigo-600 rounded-b-md bg-white">

          {customer.extraDocuments && customer.extraDocuments?.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {customer.extraDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition bg-transparent border-t border-white/40"
                >
                  <div className="flex flex-col gap-3">

                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {doc.name}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>

                    <button
                      onClick={() => window.open(doc.url, "_blank")}
                      className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 transition-all outline outline-white/30 hover:shadow-lg text-white text-sm px-4 py-2 rounded-md transition"
                    >
                      View Document
                    </button>

                  </div>
                </div>
              ))}

            </div>

          ) : (

            <div className="text-center text-gray-500 py-6">
              No extra documents uploaded.
            </div>

          )}

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
      className="border border-gray-300 rounded-md px-3 py-2 bg-white/40 backdrop-blur-md border border-white/50 cursor-not-allowed"
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
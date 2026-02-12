"use client";

import React, { useState, ChangeEvent } from "react";
import { API_ENDPOINTS } from "@/app/config/config";
import { useEffect } from "react";
import {
  FaUser,
  FaUserTie,
  FaPhone,
  FaHome,
  FaUserPlus,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaHashtag,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaUsers,
  FaFileAlt,
  FaIdCard,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
interface FormState {
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
  sameAddress: boolean;
  nomineeVillage: string;
  nomineePostOffice: string;
  nomineePoliceStation: string;
  nomineeDistrict: string;
  nomineePinCode: string;

  nomineePanNumber: string;
  nomineePanImage: File | null;
  nomineePoiDocumentType: string;
  nomineePoiDocumentNumber: string;
  nomineePoiFrontImage: File | null;
  nomineePoiBackImage: File | null;
  nomineePoaDocumentType: string;
  nomineePoaDocumentNumber: string;
  nomineePoaFrontImage: File | null;
  nomineePoaBackImage: File | null;
  nomineeSignature: File | null;
  nomineePersonalPhoto: File | null;

  panNumber: string;
  panImage: File | null;
  poiDocumentType: string;
  poiDocumentNumber: string;
  poiFrontImage: File | null;
  poiBackImage: File | null;
  poaDocumentType: string;
  poaDocumentNumber: string;
  poaFrontImage: File | null;
  poaBackImage: File | null;
  applicantSignature: File | null;
  personalPhoto: File | null;

  manager: string;
  agent: string;
  memberId: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountStatus: string;
}
import Loading from "@/app/components/Loading";
export default function AddCustomer() {
  const [form, setForm] = useState<FormState>({
    applicantName: "",
    guardianName: "",
    relationType: "",
    religion: "",
    village: "",
    postOffice: "",
    policeStation: "",
    district: "",
    pinCode: "",
    mobileNumber: "",
    maritalStatus: "",
    gender: "",
    dateOfBirth: "",

    nomineeName: "",
    nomineeMobileNumber: "",
    nomineeRelation: "",
    sameAddress: false,
    nomineeVillage: "",
    nomineePostOffice: "",
    nomineePoliceStation: "",
    nomineeDistrict: "",
    nomineePinCode: "",

    nomineePanNumber: "",
    nomineePanImage: null,
    nomineePoiDocumentType: "",
    nomineePoiDocumentNumber: "",
    nomineePoiFrontImage: null,
    nomineePoiBackImage: null,
    nomineePoaDocumentType: "",
    nomineePoaDocumentNumber: "",
    nomineePoaFrontImage: null,
    nomineePoaBackImage: null,
    nomineeSignature: null,
    nomineePersonalPhoto: null,

    panNumber: "",
    panImage: null,
    poiDocumentType: "",
    poiDocumentNumber: "",
    poiFrontImage: null,
    poiBackImage: null,
    poaDocumentType: "",
    poaDocumentNumber: "",
    poaFrontImage: null,
    poaBackImage: null,
    applicantSignature: null,
    personalPhoto: null,

    manager: "",
    agent: "",
    memberId: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountStatus: "",
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    setForm((prev) => ({
      ...prev,
      [name]: files[0],
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const checked = target.checked;

      setForm((prev) => ({
        ...prev,
        sameAddress: checked,
        nomineeVillage: checked ? prev.village : "",
        nomineePostOffice: checked ? prev.postOffice : "",
        nomineePoliceStation: checked ? prev.policeStation : "",
        nomineeDistrict: checked ? prev.district : "",
        nomineePinCode: checked ? prev.pinCode : "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // const handleSubmit = async () => {
  //   if (!validateForm()) {
  //     alert("Fill all required fields");
  //     return;
  //   }

  //   if (form.password !== form.confirmPassword) {
  //     alert("Passwords do not match");
  //     return;
  //   }

  //   const { sameAddress, confirmPassword, manager, agent, ...payload } = form;

  //   const formData = new FormData();

  //   Object.entries(payload).forEach(([key, value]) => {
  //     if (value !== null && value !== undefined) {
  //       formData.append(key, value as any);
  //     }
  //   });

  //   formData.append("managerId", manager);
  //   formData.append("agentId", agent);

  //   try {
  //     const response = await fetch(API_ENDPOINTS.ADD_CUSTOMER, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Something went wrong");
  //     }

  //     alert("Customer added successfully");
  //     window.location.reload();
  //   } catch (error: unknown) {
  //     alert(error instanceof Error ? error.message : "Unexpected error");
  //   }
  // };
  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Fill all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true); // ✅ Start loading

    const { sameAddress, confirmPassword, manager, agent, ...payload } = form;
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    formData.append("managerId", manager);
    formData.append("agentId", agent);

    try {
      const response = await fetch(API_ENDPOINTS.ADD_CUSTOMER, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Customer added successfully");
      window.location.reload();
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setIsLoading(false); // ✅ Stop loading
    }
  };

  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
  const { user } = useAuth();
  const userRole = user?.role as "ADMIN" | "MANAGER" | "AGENT";
  const loggedInUserId = user?.id || "";
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    Object.entries(form).forEach(([key, value]) => {
      // file validation
      if (value instanceof File === false && value === "") {
        newErrors[key] = true;
      }

      if (value === null || value === undefined) {
        newErrors[key] = true;
      }
    });

    // remove optional fields
    delete newErrors.sameAddress;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch managers & agents on mount
  useEffect(() => {
    const fetchData = async () => {
      if (userRole === "ADMIN") {
        const managersRes = await fetch(API_ENDPOINTS.GET_ALL_MANAGERS);
        const managersData = await managersRes.json();
        setManagers(managersData);

        const selectedManagerId = form.manager;

        const agentsRes = await fetch(`${API_ENDPOINTS.GET_AGENTS_OF_MANAGER}/${selectedManagerId}`);
        const agentsData = await agentsRes.json();
        setAgents(normalizeArray(agentsData));
      }

      if (userRole === "MANAGER") {
        // manager only sees themselves
        const managersRes = await fetch(`${API_ENDPOINTS.GET_MANAGER_BY_ID}/${loggedInUserId}`);
        const managerData = await managersRes.json();
        setManagers([managerData]);

        const selectedManagerId = form.manager;
        const agentsRes = await fetch(`${API_ENDPOINTS.GET_AGENTS_OF_MANAGER}/${selectedManagerId}`);
        const agentsData = await agentsRes.json();
        setAgents(normalizeArray(agentsData));



        // auto-set manager
        setForm(prev => ({ ...prev, manager: managerData.id }));
      }

      if (userRole === "AGENT") {
        // fetch agent info
        const agentRes = await fetch(`${API_ENDPOINTS.GET_AGENT_BY_ID}/${loggedInUserId}`);
        const agentData = await agentRes.json();
        setAgents([agentData]); // only themselves
        const managersRes = await fetch(`${API_ENDPOINTS.GET_MANAGER_BY_ID}/${agentData.managerId}`);
        const managerData = await managersRes.json();
        setManagers([managerData]);
        setForm(prev => ({ ...prev, agent: agentData.id, manager: agentData.managerId }));
      }
    };

    fetchData();
  }, [userRole, loggedInUserId, managers, form.manager]);

  const handleManagerChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const managerId = e.target.value;
    setForm(prev => ({ ...prev, manager: managerId, agent: "" }));

    const agentsRes = await fetch(`${API_ENDPOINTS.GET_AGENTS_OF_MANAGER}/${managerId}`);
    const agentsData = await agentsRes.json();
    setAgents(normalizeArray(agentsData));


    // fetch agents under selected manager
    fetch(`${API_ENDPOINTS.GET_ALL_AGENTS}?managerId=${managerId}`)
      .then(res => res.json())
      .then(data => setAgents(data));
  };

  const generateCustomerId = (
    managerName: string,
    applicantName: string,
    phoneNumber: string,
  ) => {
    const managerPart = managerName.slice(0, 3).toUpperCase();
    const namePart = applicantName.slice(0, 3).toUpperCase();
    const phonePart = phoneNumber.slice(-4);

    return `C-${managerPart}${namePart}${phonePart}`;
  };
  useEffect(() => {
    const managerObj = managers.find(m => m.id === form.manager);
    const agentObj = agents.find(a => a.id === form.agent);

    if (managerObj && agentObj) {
      const newCustomerId = generateCustomerId(
        managerObj.name,
        form.applicantName,
        form.mobileNumber
      );

      setForm(prev => ({
        ...prev,
        memberId: newCustomerId,
      }));
    }
  }, [form.manager, form.agent, form.applicantName, form.mobileNumber, managers, agents]);
  const normalizeArray = <T,>(data: T | T[]): T[] => {
    return Array.isArray(data) ? data : [data];
  };

  return (<>
  <Loading visible={isLoading} />
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-md shadow-md my-8">
      <div className="flex items-center space-x-4 bg-gray-100 rounded-lg p-6 mb-4">
        <FaUserPlus className="text-orange-400 text-3xl" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Customer</h2>
          <p className="text-gray-600 mt-1">
            Create a comprehensive customer profile with personal and account information
          </p>
        </div>
      </div>
      {/* PERSONAL INFORMATION */}
      <section className="mb-8">
        <h2 className="bg-blue-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaUser /> Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-blue-600 rounded-b-md">
          <InputField
            label="Applicant Name"
            name="applicantName"
            icon={<FaUser />}
            value={form.applicantName}
            onChange={handleChange}
            required
            error={errors.applicantName}
          />
          <RadioGroup
            label="Relation Type"
            name="relationType"
            options={[
              { label: "S/O", value: "SO" },
              { label: "W/O", value: "WO" },
              { label: "D/O", value: "DO" },
            ]}
            selected={form.relationType}
            onChange={handleChange}
            required
            error={errors.relationType}
          />
          <InputField
            label="Guardian Name"
            name="guardianName"
            icon={<FaUserTie />}
            value={form.guardianName}
            onChange={handleChange}
            required
            error={errors.guardianName}
          />
          <SelectField
            label="Religion"
            name="religion"
            value={form.religion}
            onChange={handleChange}
            required
            options={[
              { label: "Hindu", value: "HINDU" },
              { label: "Muslim", value: "MUSLIM" },
              { label: "Christian", value: "CHRISTIAN" },
              { label: "Sikh", value: "SIKH" },
              { label: "Buddhist", value: "BUDDHIST" },
              { label: "Jain", value: "JAIN" },
              { label: "Other", value: "OTHER" },
            ]}
            error={errors.religion}
          />
          <InputField
            label="Village"
            name="village"
            icon={<FaHome />}
            value={form.village}
            onChange={handleChange}
            required
            error={errors.village}
          />
          <InputField
            label="Post Office"
            name="postOffice"
            icon={<FaMapMarkerAlt />}
            value={form.postOffice}
            onChange={handleChange}
            required
            error={errors.postOffice}
          />
          <InputField
            label="Police Station"
            name="policeStation"
            icon={<FaShieldAlt />}
            value={form.policeStation}
            onChange={handleChange}
            required
            error={errors.policeStation}
          />
          <InputField
            label="District"
            name="district"
            icon={<FaMapMarkedAlt />}
            value={form.district}
            onChange={handleChange}
            required
            error={errors.district}
          />
          <InputField
            label="PIN Code"
            name="pinCode"
            icon={<FaHashtag />}
            value={form.pinCode}
            onChange={handleChange}
            required
            error={errors.pinCode}
          />
          <InputField
            label="Mobile Number"
            name="mobileNumber"
            icon={<FaPhone />}
            value={form.mobileNumber}
            onChange={handleChange}
            required
            type="tel"
            error={errors.mobileNumber}
          />
          <RadioGroup
            label="Marital Status"
            name="maritalStatus"
            options={[
              { label: "Married", value: "MARRIED" },
              { label: "Unmarried", value: "UNMARRIED" },
            ]}
            selected={form.maritalStatus}
            onChange={handleChange}
            required
            error={errors.maritalStatus}
          />
          <RadioGroup
            label="Gender"
            name="gender"
            options={[
              { label: "Male", value: "MALE" },
              { label: "Female", value: "FEMALE" },
              { label: "Other", value: "OTHER" },
            ]}
            selected={form.gender}
            onChange={handleChange}
            required
            error={errors.gender}
          />
          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            error={errors.dateOfBirth}
          />
        </div>
      </section>

      {/* NOMINATION DETAILS */}
      <section className="mb-8">
        <h2 className="bg-green-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaUsers /> Nomination Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-t-0 border-green-600 rounded-b-md">
          <InputField
            label="Nominee Name"
            name="nomineeName"
            icon={<FaUser />}
            value={form.nomineeName}
            onChange={handleChange}
            required
            error={errors.nomineeName}
          />
          <InputField
            label="Nominee Mobile"
            name="nomineeMobileNumber"
            icon={<FaPhone />}
            value={form.nomineeMobileNumber}
            onChange={handleChange}
            type="tel"
            required
            error={errors.nomineeMobileNumber}
          />
          <SelectField
            label="Nominee Relation"
            name="nomineeRelation"
            value={form.nomineeRelation}
            onChange={handleChange}
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
            required
            error={errors.nomineeRelation}
          />
          <CheckboxField
            label="Same Address as Applicant"
            name="sameAddress"
            checked={form.sameAddress}
            onChange={handleChange}
          />
          <InputField
            label="Nominee Village"
            name="nomineeVillage"
            icon={<FaHome />}
            value={form.nomineeVillage}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            error={errors.nomineeVillage}
          />
          <InputField
            label="Nominee PO"
            name="nomineePostOffice"
            icon={<FaMapMarkerAlt />}
            value={form.nomineePostOffice}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            error={errors.nomineePostOffice}
          />
          <InputField
            label="Nominee PS"
            name="nomineePoliceStation"
            icon={<FaShieldAlt />}
            value={form.nomineePoliceStation}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            error={errors.nomineePoliceStation}
          />
          <InputField
            label="Nominee District"
            name="nomineeDistrict"
            icon={<FaMapMarkedAlt />}
            value={form.nomineeDistrict}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            error={errors.nomineeDistrict}
          />
          <InputField
            label="Nominee Address PIN Code"
            name="nomineePinCode"
            icon={<FaHashtag />}
            value={form.nomineePinCode}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            error={errors.nomineePinCode}
          />
        </div>
      </section>

      {/* DOCUMENT DETAILS */}
      <section className="mb-8">
        <h2 className="bg-yellow-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaFileAlt /> Document Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-yellow-600 rounded-b-md">
          <InputField
            label="PAN Card Number"
            name="panNumber"
            icon={<FaIdCard />}
            value={form.panNumber}
            onChange={handleChange}
            required
            error={errors.panNumber}
          />
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold">PAN Card Image<span className="text-red-600">*</span></span>
            <input
              type="file"
              name="panImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>

          <SelectField
            label="Proof of Identity Document"
            name="poiDocumentType"
            value={form.poiDocumentType}
            onChange={handleChange}
            options={[
              { label: "Aadhar Card", value: "AADHAR" },
              { label: "Voter ID Card", value: "VOTER_ID" },
              { label: "Driving License", value: "DRIVING_LICENSE" },
              { label: "Passport", value: "PASSPORT" },
            ]}
            required
            error={errors.poiDocumentType}
          />

          <InputField
            label="POI Document Number"
            name="poiDocumentNumber"
            value={form.poiDocumentNumber}
            onChange={handleChange}
            required
            error={errors.poiDocumentNumber}
          />
          <label className="flex flex-col text-sm">
            <span className="font-semibold">POI Document Front Image<span className="text-red-600">*</span></span>
            <input
              type="file"
              name="poiFrontImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="font-semibold">POI Document Back Image<span className="text-red-600">*</span></span>
            <input
              type="file"
              name="poiBackImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>

          <SelectField
            label="Proof of Address Document"
            name="poaDocumentType"
            value={form.poaDocumentType}
            onChange={handleChange}
            options={[
              { label: "Aadhar Card", value: "AADHAR" },
              { label: "Voter ID Card", value: "VOTER_ID" },
              { label: "Driving License", value: "DRIVING_LICENSE" },
              { label: "Electricity Bill", value: "ELECTRICITY_BILL" },
              { label: "Gas Bill", value: "GAS_BILL" },
              { label: "Bank Statement", value: "BANK_STATEMENT" },
            ]}
            required
            error={errors.poaDocumentType}
          />
          <InputField
            label="POA Document Number"
            name="poaDocumentNumber"
            value={form.poaDocumentNumber}
            onChange={handleChange}
            required
            error={errors.poaDocumentNumber}
          />
          <label className="flex flex-col text-sm">
            <span className="font-semibold">POA Document Front Image<span className="text-red-600">*</span></span>
            <input
              type="file"
              name="poaFrontImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="font-semibold">POA Document Back Image <span className="text-red-600">*</span> </span>
            <input
              type="file"
              name="poaBackImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="font-semibold">Applicant Signature<span className="text-red-600">*</span> </span>
            <input
              type="file"
              name="applicantSignature"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="font-semibold">Personal Photo<span className="text-red-600">*</span> </span>
            <input
              type="file"
              name="personalPhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
        </div>
      </section>


      {/* NOMINEE DOCUMENT DETAILS */}
      <section className="mb-8">
        <h2 className="bg-orange-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaFileAlt /> Nominee Document Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-yellow-600 rounded-b-md">
          <InputField
            label="PAN Card Number"
            name="nomineePanNumber"
            icon={<FaIdCard />}
            value={form.nomineePanNumber}
            onChange={handleChange}
            required
            error={errors.nomineePanNumber}
          />
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold">PAN Card Image<span className="text-red-600">*</span></span>
            <input
              type="file"
              name="nomineePanImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>

          <SelectField
            label="Proof of Identity Document"
            name="nomineePoiDocumentType"
            value={form.nomineePoiDocumentType}
            onChange={handleChange}
            options={[
              { label: "Aadhar Card", value: "AADHAR" },
              { label: "Voter ID Card", value: "VOTER_ID" },
              { label: "Driving License", value: "DRIVING_LICENSE" },
              { label: "Passport", value: "PASSPORT" },
            ]}
            required
            error={errors.nomineePoiDocumentType}
          />

          <InputField
            label="POI Document Number"
            name="nomineePoiDocumentNumber"
            value={form.nomineePoiDocumentNumber}
            onChange={handleChange}
            required
            error={errors.nomineePoiDocumentNumber}
          />
          <label className="flex flex-col text-sm">
            <span className="font-semibold">POI Document Front Image<span className="text-red-600">*</span></span>
            <input
              type="file"
              name="nomineePoiFrontImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="font-semibold">POI Document Back Image<span className="text-red-600">*</span></span>
            <input
              type="file"
              name="nomineePoiBackImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>

          <SelectField
            label="Proof of Address Document"
            name="nomineePoaDocumentType"
            value={form.nomineePoaDocumentType}
            onChange={handleChange}
            options={[
              { label: "Aadhar Card", value: "AADHAR" },
              { label: "Voter ID Card", value: "VOTER_ID" },
              { label: "Driving License", value: "DRIVING_LICENSE" },
              { label: "Electricity Bill", value: "ELECTRICITY_BILL" },
              { label: "Gas Bill", value: "GAS_BILL" },
              { label: "Bank Statement", value: "BANK_STATEMENT" },
            ]}
            required
            error={errors.nomineePoaDocumentType}
          />
          <InputField
            label="POA Document Number"
            name="nomineePoaDocumentNumber"
            value={form.nomineePoaDocumentNumber}
            onChange={handleChange}
            required
            error={errors.nomineePoaDocumentNumber}
          />
          <label className="flex flex-col text-sm">
            <span className="font-semibold">POA Document Front Image<span className="text-red-600">*</span></span>
            <input
              type="file"
              name="nomineePoaFrontImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="font-semibold">POA Document Back Image <span className="text-red-600">*</span> </span>
            <input
              type="file"
              name="nomineePoaBackImage"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="font-semibold">Nominee Signature<span className="text-red-600">*</span> </span>
            <input
              type="file"
              name="nomineeSignature"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="font-semibold">Nominee Photo<span className="text-red-600">*</span> </span>
            <input
              type="file"
              name="nomineePersonalPhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-2 py-1 file:mr-4 file:py-0.5 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 file:text-sm hover:file:bg-gray-200 cursor-pointer file:cursor-pointer"
              required
            />
          </label>
        </div>
      </section>

      {/* ACCOUNT INFORMATION */}
      <section className="mb-8">
        <h2 className="bg-purple-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaLock /> Account Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-purple-600 rounded-b-md">

          {/* Manager */}
          <SelectField
            label="Manager"
            name="manager"
            value={form.manager}
            onChange={handleManagerChange}
            options={managers.map(m => ({ label: m.name, value: m.id }))}
            required
            error={errors.manager}
          />

          <SelectField
            label="Agent"
            name="agent"
            value={form.agent}
            onChange={handleChange}
            options={(Array.isArray(agents) ? agents : []).map(a => ({ label: a.name, value: a.id }))}
            required
            error={errors.agent}
          />

          <InputField
            label="Member ID"
            name="memberId"
            value={form.memberId}
            onChange={handleChange}
            readOnly
            placeholder="Auto Generated"
            icon={<FaUser />}
            required
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            icon={<FaEnvelope />}
            value={form.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            icon={<FaLock />}
            value={form.password}
            onChange={handleChange}
            required
            error={errors.password}
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            icon={<FaLock />}
            value={form.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />
          <SelectField
            label="Account Status"
            name="accountStatus"
            value={form.accountStatus}
            onChange={handleChange}
            options={[
              { label: "Active", value: "ACTIVE" },
            ]}
            required
            error={errors.accountStatus}
          />
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div></>
  );
}


interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
  required = false,
  readOnly = false,
  disabled = false,
  placeholder = "",
  error = false,
}: InputFieldProps) {
  return (
    <label className="cursor-pointer flex flex-col text-sm">
      <span className="cursor-pointer mb-1 font-semibold flex items-center gap-2">
        {icon} {label} {required && <span className="cursor-pointer text-red-600">*</span>}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`cursor-pointer border rounded-md px-3 py-2 focus:ring-2 
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
      />

      {error && (
        <span className="text-red-600 text-xs mt-1">
          Fill the required field
        </span>
      )}
    </label>
  );
}

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
  error?: boolean;
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error = false,
}: SelectFieldProps) {
  return (
    <label className="cursor-pointer flex flex-col text-sm">
      <span className="cursor-pointer mb-1 font-semibold">
        {label} {required && <span className="cursor-pointer text-red-600">*</span>}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`cursor-pointer border rounded-md px-3 py-2 focus:ring-2
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
        `}
      >
        <option value="" disabled>
          Select {label}
        </option>

        {options.map((opt) => (
          <option key={opt.value} className="cursor-pointer" value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="text-red-600 text-xs mt-1">
          Fill the required field
        </span>
      )}
    </label>
  );
}

interface RadioOption {
  label: string;
  value: string;
}


interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  selected: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: boolean;
}

function RadioGroup({
  label,
  name,
  options,
  selected,
  onChange,
  required = false,
  error = false,
}: RadioGroupProps) {
  return (
    <fieldset className="text-sm">
      <legend className="cursor-pointer mb-1 font-semibold">
        {label} {required && <span className="cursor-pointer text-red-600">*</span>}
      </legend>

      <div className="cursor-pointer flex gap-6">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected === option.value}
              onChange={onChange}
              required={required}
            />
            {option.label}
          </label>
        ))}
      </div>

      {error && (
        <span className="text-red-600 text-xs mt-1 block">
          Fill the required field
        </span>
      )}
    </fieldset>
  );
}


interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function CheckboxField({ label, name, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
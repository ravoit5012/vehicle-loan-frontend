"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/app/config/config";
import { FaUser, FaPlus, FaTrash, FaUpload, FaArrowLeft } from "react-icons/fa";

interface UploadItem {
  file: File | null;
  name: string;
}

export default function AddExtraDocumentsPage() {
  const { customerId } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<any>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([
    { file: null, name: "" },
  ]);
  const [loading, setLoading] = useState(false);

  // Fetch Customer
  useEffect(() => {
    fetch(`${API_ENDPOINTS.GET_CUSTOMER_BY_ID}/${customerId}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data));
  }, [customerId]);

  // Add New Document Field
  const addDocumentField = () => {
    if (uploads.length >= 20) {
      alert("Maximum 20 documents allowed");
      return;
    }
    setUploads([...uploads, { file: null, name: "" }]);
  };

  // Remove Field
  const removeDocumentField = (index: number) => {
    const updated = uploads.filter((_, i) => i !== index);
    setUploads(updated);
  };

  // Handle File Change
  const handleFileChange = (index: number, file: File | null) => {
    const updated = [...uploads];
    updated[index].file = file;
    setUploads(updated);
  };

  // Handle Name Change
  const handleNameChange = (index: number, value: string) => {
    const updated = [...uploads];
    updated[index].name = value;
    setUploads(updated);
  };

  // Upload All
  const handleUploadAll = async () => {
    for (const item of uploads) {
      if (!item.file || !item.name.trim()) {
        alert("Each document must have file and name");
        return;
      }
    }

    const formData = new FormData();

    uploads.forEach((item) => {
      formData.append("documents", item.file as File);
      formData.append("documentNames", item.name);
    });

    setLoading(true);

    const res = await fetch(
      `${API_ENDPOINTS.UPLOAD_EXTRA_DOCUMENTS}/${customerId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Upload failed");
    } else {
      alert("Documents uploaded successfully");
      router.back();
    }

    setLoading(false);
  };

  if (!customer) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading Customer...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
      >
        <FaArrowLeft />
        Back
      </button>

      {/* Customer Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <FaUser className="text-indigo-600 text-3xl" />
          <h2 className="text-3xl font-bold text-gray-800">
            {customer.applicantName}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-700">
          <Info label="Member ID" value={customer.memberId} />
          <Info label="Mobile" value={customer.mobileNumber} />
          <Info label="Email" value={customer.email} />
          <Info label="District" value={customer.district} />
          <Info label="Status" value={customer.accountStatus} />
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold text-gray-800">
            Add Extra Documents
          </h3>

          <button
            onClick={addDocumentField}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            <FaPlus />
            Add Document
          </button>
        </div>

        {/* Document Fields */}
        <div className="space-y-6">
          {uploads.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  placeholder="Enter document name (e.g., RC Document)"
                  value={item.name}
                  onChange={(e) =>
                    handleNameChange(index, e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(index, e.target.files?.[0] || null)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:px-4 file:py-1 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition"
                />
              </div>

              {uploads.length > 1 && (
                <button
                  onClick={() => removeDocumentField(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="mt-10 text-right">
          <button
            onClick={handleUploadAll}
            disabled={loading}
            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg transition disabled:opacity-50"
          >
            <FaUpload />
            {loading ? "Uploading..." : "Upload All Documents"}
          </button>
        </div>

      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}

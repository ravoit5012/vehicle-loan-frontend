"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/app/config/config";
import CropModal from "@/app/components/CropModal";
import { extractErrorMessage } from "@/lib/errors";
import { FaUser, FaPlus, FaTrash, FaUpload, FaArrowLeft, FaCrop } from "react-icons/fa";

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
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [cropTitle, setCropTitle] = useState("Crop Image");

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

  // Handle File Change — open crop modal for images, set directly for non-images
  const handleFileChange = (index: number, file: File | null) => {
    if (!file) {
      const updated = [...uploads];
      updated[index].file = null;
      setUploads(updated);
      return;
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result as string);
        setCropIndex(index);
        setCropTitle(uploads[index].name ? `Crop — ${uploads[index].name}` : "Crop Image");
      };
      reader.readAsDataURL(file);
    } else {
      const updated = [...uploads];
      updated[index].file = file;
      setUploads(updated);
    }
  };

  const openCropForExisting = (index: number) => {
    const file = uploads[index].file;
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCropIndex(index);
      setCropTitle(uploads[index].name ? `Crop — ${uploads[index].name}` : "Crop Image");
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = (croppedFile: File) => {
    if (cropIndex === null) return;
    const updated = [...uploads];
    updated[cropIndex].file = croppedFile;
    setUploads(updated);
    setCropSrc(null);
    setCropIndex(null);
  };

  const handleCropCancel = () => {
    setCropSrc(null);
    setCropIndex(null);
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

    try {
      const res = await fetch(
        `${API_ENDPOINTS.UPLOAD_EXTRA_DOCUMENTS}/${customerId}`,
        { method: "POST", body: formData, credentials: "include" }
      );

      let data: any = null;
      try { data = await res.json(); } catch { /* ignore */ }

      if (!res.ok) {
        alert(extractErrorMessage(data, `Upload failed (${res.status})`));
        return;
      }
      alert("Documents uploaded successfully");
      router.back();
    } catch (err) {
      alert(extractErrorMessage(err, "Upload failed"));
    } finally {
      setLoading(false);
    }
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
      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          title={cropTitle}
          onCropDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}

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
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 transition-all outline outline-white/30 hover:shadow-lg text-white px-4 py-2 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition"
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
              className="bg-transparent border-t border-white/40 border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center"
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
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    handleFileChange(index, e.target.files?.[0] || null);
                    e.target.value = "";
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:px-4 file:py-1 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition"
                />
                {item.file && item.file.type.startsWith("image/") && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(item.file)}
                      alt="Preview"
                      className="h-16 w-auto rounded border border-gray-200 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => openCropForExisting(index)}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      <FaCrop /> Re-crop
                    </button>
                  </div>
                )}
                {item.file && !item.file.type.startsWith("image/") && (
                  <p className="mt-2 text-xs text-gray-500">{item.file.name}</p>
                )}
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

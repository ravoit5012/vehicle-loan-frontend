'use client';
import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/app/config/config';
import { FaCar, FaCheckCircle, FaEdit, FaTimesCircle } from 'react-icons/fa';
import CropModal from '@/app/components/CropModal';

interface Props {
  loan: any;
  user: any;
  onUpdate: () => void; // callback to refresh the loan data
  customer: any;
}

export default function VehicleDetailsCard({ loan, user, onUpdate, customer }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [fields, setFields] = useState({
    registrationNumber: loan.registrationNumber || '',
    chassisNumber: loan.chassisNumber || '',
    engineNumber: loan.engineNumber || '',
    repoFinancerName: loan.repoFinancerName || '',
    registrationImageUrl: loan.registrationImageUrl || '',
    chassisImageUrl: loan.chassisImageUrl || '',
    engineImageUrl: loan.engineImageUrl || '',
    repoFinancerImageUrl: loan.repoFinancerImageUrl || '',
  });

  const [cropTarget, setCropTarget] = useState<{ field: string, src: string, title: string } | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const canEdit = loan.status !== 'CLOSED';
  const isAdmin = user?.role === 'ADMIN';

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.patch(`${API_ENDPOINTS.UPDATE_VEHICLE}/${loan.id}`, fields, {
        withCredentials: true,
      });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to update vehicle details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!confirm("Are you sure you want to verify these vehicle details?")) return;
    try {
      await axios.patch(`${API_ENDPOINTS.VERIFY_VEHICLE}/${loan.id}`, {}, {
        withCredentials: true,
      });
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to verify vehicle details.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, title: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCropTarget({ field: fieldName, src: ev.target.result as string, title });
        }
      };
      reader.readAsDataURL(file);
      e.target.value = ""; // reset
    }
  };

  const onCropDone = async (croppedFile: File) => {
    if (!cropTarget) return;
    const { field } = cropTarget;
    setCropTarget(null);
    setUploading((prev) => ({ ...prev, [field]: true }));

    const formData = new FormData();
    formData.append("file", croppedFile);
    formData.append("applicantName", customer?.applicantName || "Unknown");
    formData.append("mobileNumber", customer?.mobileNumber || "Unknown");
    formData.append("documentType", `vehicle_${field}_${Date.now()}`);

    try {
      const res = await axios.post(API_ENDPOINTS.UPLOAD_SINGLE_DOCUMENT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.url) {
        setFields(prev => ({ ...prev, [field]: res.data.url }));
      } else {
        alert(`Upload succeeded but no URL was returned for ${field}.`);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to upload ${field}`);
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const ImageBox = ({ title, field }: { title: string, field: keyof typeof fields }) => {
    const defaultUrl = loan[field];
    const editingUrl = fields[field];

    const displayUrl = isEditing ? editingUrl : defaultUrl;

    return (
      <div className="flex flex-col space-y-2 border rounded p-3 bg-transparent border-t border-white/40">
        <label className="text-sm font-semibold text-gray-700">{title}</label>
        {displayUrl ? (
          <div className="flex flex-col gap-2">
            <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline truncate max-w-[150px]">
              View Image
            </a>
            {isEditing && (
              <button
                className="text-xs text-red-500 hover:text-red-700 text-left"
                onClick={() => setFields(prev => ({ ...prev, [field]: '' }))}
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          isEditing ? (
            uploading[field] ? (
              <span className="text-sm text-blue-500">Uploading...</span>
            ) : (
              <div className="relative border-2 border-dashed border-gray-300 rounded p-2 text-center text-xs hover:bg-white/40 backdrop-blur-md border border-white/50 cursor-pointer">
                + Upload
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, field, title)}
                  title={`Upload ${title}`}
                />
              </div>
            )
          ) : (
            <span className="text-xs text-gray-400">Not provided</span>
          )
        )}
      </div>
    );
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
      {cropTarget && (
        <CropModal
          imageSrc={cropTarget.src}
          title={cropTarget.title}
          onCropDone={onCropDone}
          onCancel={() => setCropTarget(null)}
        />
      )}

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaCar className="text-white text-xl" />
          <h2 className="text-lg font-bold text-white">Vehicle Details</h2>
        </div>
        <div className="flex items-center gap-4">
          {loan.vehicleDetailsVerified ? (
            <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
              <FaCheckCircle /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
              <FaTimesCircle /> Unverified
            </span>
          )}

          {isAdmin && !loan.vehicleDetailsVerified && (
            <button onClick={handleVerify} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm transition">
              Verify Now
            </button>
          )}

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-white hover:text-blue-200 transition"
              title="Edit Vehicle Details"
            >
              <FaEdit size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-semibold uppercase">Registration No.</label>
            {isEditing ? (
              <input
                className="w-full border rounded px-3 py-2"
                value={fields.registrationNumber}
                onChange={e => setFields(f => ({ ...f, registrationNumber: e.target.value }))}
              />
            ) : (
              <p className="font-medium text-gray-800">{loan.registrationNumber || '-'}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-semibold uppercase">Chassis No.</label>
            {isEditing ? (
              <input
                className="w-full border rounded px-3 py-2"
                value={fields.chassisNumber}
                onChange={e => setFields(f => ({ ...f, chassisNumber: e.target.value }))}
              />
            ) : (
              <p className="font-medium text-gray-800">{loan.chassisNumber || '-'}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-semibold uppercase">Engine No.</label>
            {isEditing ? (
              <input
                className="w-full border rounded px-3 py-2"
                value={fields.engineNumber}
                onChange={e => setFields(f => ({ ...f, engineNumber: e.target.value }))}
              />
            ) : (
              <p className="font-medium text-gray-800">{loan.engineNumber || '-'}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-semibold uppercase">Financer Name</label>
            {isEditing ? (
              <input
                className="w-full border rounded px-3 py-2"
                value={fields.repoFinancerName}
                onChange={e => setFields(f => ({ ...f, repoFinancerName: e.target.value }))}
              />
            ) : (
              <p className="font-medium text-gray-800">{loan.repoFinancerName || '-'}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ImageBox title="Registration Doc" field="registrationImageUrl" />
          <ImageBox title="Chassis Doc" field="chassisImageUrl" />
          <ImageBox title="Engine Doc" field="engineImageUrl" />
          <ImageBox title="Financer Doc" field="repoFinancerImageUrl" />
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button
              onClick={() => {
                setFields({
                  registrationNumber: loan.registrationNumber || '',
                  chassisNumber: loan.chassisNumber || '',
                  engineNumber: loan.engineNumber || '',
                  repoFinancerName: loan.repoFinancerName || '',
                  registrationImageUrl: loan.registrationImageUrl || '',
                  chassisImageUrl: loan.chassisImageUrl || '',
                  engineImageUrl: loan.engineImageUrl || '',
                  repoFinancerImageUrl: loan.repoFinancerImageUrl || '',
                });
                setIsEditing(false);
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-white/40 backdrop-blur-md border border-white/50 rounded font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 outline outline-white/30 hover:shadow-lg hover:-translate-y-0.5 transition-all rounded font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

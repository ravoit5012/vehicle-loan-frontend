import { useState, useEffect } from "react";
import { FaCar } from "react-icons/fa";
import CropModal from "@/app/components/CropModal";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/config";
import { Toast } from "@/app/components/Toast";

interface Props {
  loanType: any;
  register: any;
  watch: any;
  setValue: any;
  customer: any;
}

export default function VehicleDetailsSection({ loanType, register, watch, setValue, customer }: Props) {
  const isUsed = loanType?.vehicleCondition === "USED";

  const [cropTarget, setCropTarget] = useState<{ field: string, src: string, title: string } | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [duplicateConflicts, setDuplicateConflicts] = useState<Record<string, string>>({});

  // Throttle check for duplication
  const registrationNumber = watch("registrationNumber");
  const chassisNumber = watch("chassisNumber");
  const engineNumber = watch("engineNumber");
  const repoFinancerName = watch("repoFinancerName");

  useEffect(() => {
    if (!registrationNumber && !chassisNumber && !engineNumber && !repoFinancerName) {
      setDuplicateConflicts({});
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.post(`${API_ENDPOINTS.CHECK_DUPLICATE_VEHICLE}`, {
          registrationNumber,
          chassisNumber,
          engineNumber,
          repoFinancerName
        }, { withCredentials: true });

        if (res.data.isDuplicate) {
          const confl: Record<string, string> = {};
          res.data.conflicts.forEach((c: string) => {
            confl[c] = "This detail is already registered to an active loan";
          });
          setDuplicateConflicts(confl);
        } else {
          setDuplicateConflicts({});
        }
      } catch (err) {
        console.error("Duplicate check failed:", err);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [registrationNumber, chassisNumber, engineNumber, repoFinancerName]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, title: string) => {
    if (!customer) {
      alert("Please select a customer first before uploading files.");
      e.target.value = "";
      return;
    }
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
    if (!cropTarget || !customer) return;
    const { field } = cropTarget;
    setCropTarget(null);
    setUploading((prev) => ({ ...prev, [field]: true }));

    const formData = new FormData();
    formData.append("file", croppedFile);
    formData.append("applicantName", customer.applicantName);
    formData.append("mobileNumber", customer.mobileNumber);
    formData.append("documentType", `vehicle_${field}_${Date.now()}`);

    try {
      const res = await axios.post(API_ENDPOINTS.UPLOAD_SINGLE_DOCUMENT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.url) {
        setValue(field, res.data.url, { shouldValidate: true, shouldDirty: true });
      } else {
        alert("Failed to get URL from server.");
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to upload ${field}`);
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const renderUploadBox = (title: string, field: string) => {
    const currentValue = watch(field);
    const isWorking = uploading[field];

    return (
      <div key={field} className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {title} {isUsed ? <span className="text-red-500">*</span> : <span className="text-gray-400 text-xs">(optional)</span>}
        </label>
        {currentValue ? (
          <div className="relative border-2 border-green-500 rounded-lg p-2 flex items-center justify-between bg-green-50">
            <span className="text-sm text-green-700 font-semibold truncate">Uploaded ✓</span>
            <button type="button" onClick={() => setValue(field, '', { shouldValidate: true })} className="text-red-500 text-xs underline cursor-pointer hover:text-red-600">Remove</button>
          </div>
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-transparent border-t border-white/40 flex items-center justify-center">
            {isWorking ? (
              <span className="text-blue-500 font-medium">Uploading...</span>
            ) : (
              <span className="text-gray-500 font-medium">+ Upload {title}</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e, field, title)}
              title={`Upload ${title}`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="card p-6 shadow-xl rounded-lg bg-white mt-8">
      {cropTarget && (
        <CropModal
          imageSrc={cropTarget.src}
          title={cropTarget.title}
          onCropDone={onCropDone}
          onCancel={() => setCropTarget(null)}
        />
      )}

      <h2 className="text-2xl font-semibold bg-[#4f46e5] text-white rounded-4xl p-4">
        <FaCar className="inline-block mx-1 md:mx-3" /> Vehicle Details {isUsed ? "(Required for Used Vehicles)" : "(Optional for New Vehicles)"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="form-group space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Registration Number {isUsed && <span className="text-red-500">*</span>}
          </label>
          <input
            {...register("registrationNumber", { required: isUsed })}
            className={`input-field border-2 py-2 px-4 rounded-lg w-full ${duplicateConflicts.registrationNumber ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="e.g. MH12AB1234"
          />
          {duplicateConflicts.registrationNumber && <p className="text-xs text-red-500 font-semibold">{duplicateConflicts.registrationNumber}</p>}
        </div>
        <div className="form-group space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Chassis Number {isUsed && <span className="text-red-500">*</span>}
          </label>
          <input
            {...register("chassisNumber", { required: isUsed })}
            className={`input-field border-2 py-2 px-4 rounded-lg w-full ${duplicateConflicts.chassisNumber ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="e.g. MA123456789"
          />
          {duplicateConflicts.chassisNumber && <p className="text-xs text-red-500 font-semibold">{duplicateConflicts.chassisNumber}</p>}
        </div>
        <div className="form-group space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Engine Number {isUsed && <span className="text-red-500">*</span>}
          </label>
          <input
            {...register("engineNumber", { required: isUsed })}
            className={`input-field border-2 py-2 px-4 rounded-lg w-full ${duplicateConflicts.engineNumber ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="e.g. EN123456"
          />
          {duplicateConflicts.engineNumber && <p className="text-xs text-red-500 font-semibold">{duplicateConflicts.engineNumber}</p>}
        </div>
        <div className="form-group space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Financer Name {isUsed && <span className="text-red-500">*</span>}
          </label>
          <input
            {...register("repoFinancerName", { required: isUsed })}
            className={`input-field border-2 py-2 px-4 rounded-lg w-full ${duplicateConflicts.repoFinancerName ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="e.g. HDFC Bank"
          />
          {duplicateConflicts.repoFinancerName && <p className="text-xs text-red-500 font-semibold">{duplicateConflicts.repoFinancerName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {renderUploadBox("Registration Image", "registrationImageUrl")}
        {renderUploadBox("Chassis Image", "chassisImageUrl")}
        {renderUploadBox("Engine Image", "engineImageUrl")}
        {renderUploadBox("Repossed Financer Image", "repoFinancerImageUrl")}
      </div>

      {/* Hidden inputs to bind react-hook-form to the urls so it blocks submission if required but missing */}
      <input type="hidden" {...register("registrationImageUrl", { required: isUsed })} />
      <input type="hidden" {...register("chassisImageUrl", { required: isUsed })} />
      <input type="hidden" {...register("engineImageUrl", { required: isUsed })} />
      <input type="hidden" {...register("repoFinancerImageUrl", { required: isUsed })} />

      {isUsed && (!watch("registrationImageUrl") || !watch("chassisImageUrl") || !watch("engineImageUrl") || !watch("repoFinancerImageUrl")) && (
        <p className="text-xs text-red-500 font-medium mt-4">For Used vehicles, all 4 vehicle image documents are mandatory to proceed.</p>
      )}
    </section>
  );
}

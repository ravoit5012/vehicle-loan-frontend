"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import CropModal from "@/app/components/CropModal";
import { Toast } from "@/app/components/Toast";
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
  FaCheckCircle,
  FaExclamationTriangle,
  FaUniversity,
  FaMoneyCheckAlt,
  FaEye,
  FaEyeSlash,
  FaCrop,
  FaSyncAlt,
} from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/errors";
import { compressImage } from "@/lib/compressImage";
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

  // Bank Details (Borrower)
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankAddress: string;
  chequeNumber1: string;
  chequeNumber2: string;
  chequeNumber3: string;
  chequeNumber4: string;
  chequeImage1: File | null;
  chequeImage2: File | null;
  chequeImage3: File | null;
  chequeImage4: File | null;

  // Bank Details (Nominee) - optional block
  addNomineeBankDetails: boolean;
  nomineeBankName: string;
  nomineeBankAccountNumber: string;
  nomineeBankIfscCode: string;
  nomineeBankAddress: string;
  nomineeChequeNumber1: string;
  nomineeChequeNumber2: string;
  nomineeChequeNumber3: string;
  nomineeChequeNumber4: string;
  nomineeChequeImage1: File | null;
  nomineeChequeImage2: File | null;
  nomineeChequeImage3: File | null;
  nomineeChequeImage4: File | null;
}
import Loading from "@/app/components/Loading";

// Maps every form field to the wizard step it lives on, so validation
// errors can be attributed to a step (for badge indicators + jump-to-error).
const FIELD_STEP: Record<string, number> = {
  applicantName: 1, guardianName: 1, relationType: 1, religion: 1, village: 1,
  postOffice: 1, policeStation: 1, district: 1, pinCode: 1, mobileNumber: 1,
  maritalStatus: 1, gender: 1, dateOfBirth: 1,
  nomineeName: 1, nomineeMobileNumber: 1, nomineeRelation: 1, nomineeVillage: 1,
  nomineePostOffice: 1, nomineePoliceStation: 1, nomineeDistrict: 1, nomineePinCode: 1,
  manager: 1, agent: 1, memberId: 1, email: 1, password: 1, confirmPassword: 1, accountStatus: 1,

  panNumber: 2, panImage: 2, poiDocumentType: 2, poiDocumentNumber: 2,
  poiFrontImage: 2, poiBackImage: 2, poaDocumentType: 2, poaDocumentNumber: 2,
  poaFrontImage: 2, poaBackImage: 2, applicantSignature: 2, personalPhoto: 2,

  nomineePanNumber: 3, nomineePanImage: 3, nomineePoiDocumentType: 3, nomineePoiDocumentNumber: 3,
  nomineePoiFrontImage: 3, nomineePoiBackImage: 3, nomineePoaDocumentType: 3, nomineePoaDocumentNumber: 3,
  nomineePoaFrontImage: 3, nomineePoaBackImage: 3, nomineeSignature: 3, nomineePersonalPhoto: 3,

  bankName: 4, bankAccountNumber: 4, bankIfscCode: 4, bankAddress: 4,
  chequeNumber1: 4, chequeNumber2: 4, chequeNumber3: 4, chequeNumber4: 4,
  chequeImage1: 4, chequeImage2: 4, chequeImage3: 4, chequeImage4: 4,
  nomineeBankName: 4, nomineeBankAccountNumber: 4, nomineeBankIfscCode: 4, nomineeBankAddress: 4,
  nomineeChequeNumber1: 4, nomineeChequeNumber2: 4, nomineeChequeNumber3: 4, nomineeChequeNumber4: 4,
  nomineeChequeImage1: 4, nomineeChequeImage2: 4, nomineeChequeImage3: 4, nomineeChequeImage4: 4,
};

const STEP_LABELS: Record<number, string> = {
  1: "Personal Details",
  2: "Borrower Documents",
  3: "Nominee Documents",
  4: "Bank Details",
};

// Draft is saved to localStorage so an accidental refresh (or a session that
// expires mid-form) doesn't wipe out everything typed so far. File objects
// can't survive JSON/localStorage, so only text/boolean fields are persisted
// — documents always need re-selecting after a restore. Password fields are
// deliberately excluded too, so no plaintext credential sits in local storage.
const DRAFT_STORAGE_KEY = "customer-add-draft-v1";
const DRAFT_EXCLUDED_FIELDS = new Set(["password", "confirmPassword"]);

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

    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankAddress: "",
    chequeNumber1: "",
    chequeNumber2: "",
    chequeNumber3: "",
    chequeNumber4: "",
    chequeImage1: null,
    chequeImage2: null,
    chequeImage3: null,
    chequeImage4: null,

    addNomineeBankDetails: false,
    nomineeBankName: "",
    nomineeBankAccountNumber: "",
    nomineeBankIfscCode: "",
    nomineeBankAddress: "",
    nomineeChequeNumber1: "",
    nomineeChequeNumber2: "",
    nomineeChequeNumber3: "",
    nomineeChequeNumber4: "",
    nomineeChequeImage1: null,
    nomineeChequeImage2: null,
    nomineeChequeImage3: null,
    nomineeChequeImage4: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  // Steps the user has visited-and-left (or attempted submit from) — used to decide
  // when to surface per-field error styling, so a fresh blank step doesn't look broken.
  const [touchedSteps, setTouchedSteps] = useState<Set<number>>(new Set());
  const [submitBlocker, setSubmitBlocker] = useState<{ title: string; items: string[] } | null>(null);
  const goToStep = (step: number) => {
    setTouchedSteps((prev) => new Set(prev).add(currentStep));
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(step);
  };

  /* ===== Draft persistence (localStorage) ===== */
  const [draftPrompt, setDraftPrompt] = useState<{ form: Partial<FormState>; currentStep: number; savedAt: number } | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  // Check for a saved draft once, on first mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && parsed.form) {
          setDraftPrompt(parsed);
        }
      }
    } catch {
      // corrupt/unavailable storage — nothing to restore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep saving the draft as the user types (debounced), until they either
  // restore/discard the prompt or successfully submit.
  useEffect(() => {
    if (draftPrompt) return; // don't overwrite the pending draft before the user decides
    const timer = setTimeout(() => {
      try {
        const persistable: Record<string, unknown> = {};
        Object.entries(form).forEach(([key, value]) => {
          if (value instanceof File) return;
          if (DRAFT_EXCLUDED_FIELDS.has(key)) return;
          persistable[key] = value;
        });
        const hasContent = Object.values(persistable).some((v) =>
          typeof v === "string" ? v.trim() !== "" : typeof v === "boolean" ? v : !!v
        );
        if (!hasContent) {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
          return;
        }
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({ form: persistable, currentStep, savedAt: Date.now() })
        );
      } catch {
        // storage unavailable/full — silently skip persistence
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [form, currentStep, draftPrompt]);

  const restoreDraft = () => {
    if (!draftPrompt) return;
    setForm((prev) => ({ ...prev, ...draftPrompt.form }));
    setCurrentStep(draftPrompt.currentStep && draftPrompt.currentStep >= 1 ? draftPrompt.currentStep : 1);
    setDraftRestored(true);
    setDraftPrompt(null);
  };

  const discardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setDraftPrompt(null);
  };

  /* ===== Crop modal state ===== */
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFieldName, setCropFieldName] = useState<string>("");
  const [cropTitle, setCropTitle] = useState<string>("Crop Image");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /* ===== Duplicate-check warnings ===== */
  const [dupWarnings, setDupWarnings] = useState<Record<string, string>>({});
  const [dupChecking, setDupChecking] = useState<Record<string, boolean>>({});

  const DUP_FIELDS = [
    "panNumber",
    "mobileNumber",
    "email",
    "poiDocumentNumber",
    "poaDocumentNumber",
    "nomineePanNumber",
    "nomineePoiDocumentNumber",
    "nomineePoaDocumentNumber",
  ] as const;

  type DupField = (typeof DUP_FIELDS)[number];

  const fieldDisplayName = (f: string) => {
    const map: Record<string, string> = {
      poiDocumentNumber: "POI",
      poaDocumentNumber: "POA",
      nomineePoiDocumentNumber: "nominee POI",
      nomineePoaDocumentNumber: "nominee POA",
    };
    return map[f] || f;
  };

  // Cropping is opt-in: selecting a file uses it as-is immediately. The user
  // can then choose to crop it via a button on the file card if they want to.
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    const file = files[0];
    setForm((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: false }));
    // Reset so the same file can be re-selected later
    e.target.value = "";
  };

  const handleFileRemove = (name: string) => {
    setForm((prev) => ({ ...prev, [name]: null }));
  };

  const openCropModal = (name: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCropFieldName(name);
      const title = name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
      setCropTitle(`Crop — ${title}`);
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = (croppedFile: File) => {
    setForm((prev) => ({ ...prev, [cropFieldName]: croppedFile }));
    setErrors((prev) => ({ ...prev, [cropFieldName]: false }));
    setCropSrc(null);
    setCropFieldName("");
  };

  const handleCropCancel = () => {
    setCropSrc(null);
    setCropFieldName("");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const checked = target.checked;

      if (name === "sameAddress") {
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
        setForm((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      // Uppercase-normalize fields where mixed case is just user error (PAN/IFSC),
      // so duplicate-detection isn't fooled by casing differences either.
      const UPPERCASE_FIELDS = new Set(["panNumber", "nomineePanNumber", "bankIfscCode", "nomineeBankIfscCode"]);
      const nextValue = UPPERCASE_FIELDS.has(name) ? value.toUpperCase() : value;

      setForm((prev) => ({
        ...prev,
        [name]: nextValue,
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
  const uploadSingleDocument = async (file: File, documentType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("applicantName", form.applicantName);
    formData.append("mobileNumber", form.mobileNumber);
    formData.append("documentType", documentType);

    const response = await fetch(API_ENDPOINTS.UPLOAD_SINGLE_DOCUMENT, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${documentType}`);
    }

    const data = await response.json();
    return data.url;
  };

  // Retries a single document upload a couple of times with backoff before
  // giving up — survives a transient network blip on flaky mobile connections
  // without failing the whole submission over one file.
  const uploadSingleDocumentWithRetry = async (file: File, documentType: string, attempts = 3): Promise<string> => {
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await uploadSingleDocument(file, documentType);
      } catch (err) {
        lastError = err;
        if (attempt < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
        }
      }
    }
    throw lastError;
  };

  const humanizeFieldName = (name: string) =>
    name.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();

  const handleNextStep = () => goToStep(Math.min(currentStep + 1, 4));

  const handlePrevStep = () => goToStep(Math.max(currentStep - 1, 1));

  const handleSubmit = async () => {
    setSubmitBlocker(null);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setTouchedSteps(new Set([1, 2, 3, 4]));

      const stepsWithErrors = new Set<number>();
      Object.keys(newErrors).forEach((k) => {
        const step = FIELD_STEP[k];
        if (step) stepsWithErrors.add(step);
      });
      const sortedSteps = Array.from(stepsWithErrors).sort((a, b) => a - b);

      if (sortedSteps.length > 0) {
        setCurrentStep(sortedSteps[0]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      setSubmitBlocker({
        title: "Please complete the following before submitting:",
        items: sortedSteps.map((s) => {
          const count = Object.keys(newErrors).filter((k) => FIELD_STEP[k] === s).length;
          return `Step ${s} (${STEP_LABELS[s]}): ${count} field(s) missing`;
        }),
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setTouchedSteps((prev) => new Set(prev).add(1));
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSubmitBlocker({ title: "Passwords do not match.", items: [] });
      return;
    }

    const activeWarningFields = Object.keys(dupWarnings).filter((f) => dupWarnings[f]);
    if (activeWarningFields.length > 0) {
      const firstStep = FIELD_STEP[activeWarningFields[0]] ?? 1;
      setTouchedSteps((prev) => new Set(prev).add(firstStep));
      setCurrentStep(firstStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSubmitBlocker({
        title: "Resolve these duplicate-value warnings before submitting:",
        items: activeWarningFields.map((f) => dupWarnings[f]),
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(null);

    try {
      // 1. Upload all document files: compress each image client-side first,
      // then upload with bounded concurrency (a few at a time, not all 22 at
      // once and not fully one-by-one) so large multi-document submissions
      // stay fast and don't sit on a slow connection any longer than needed.
      const uploadMap: Record<string, string> = {
        panImage: "pan",
        poiFrontImage: "poiFrontImage",
        poiBackImage: "poiBackImage",
        poaFrontImage: "poaFrontImage",
        poaBackImage: "poaBackImage",
        applicantSignature: "signature",
        personalPhoto: "photo",
        nomineePanImage: "nomineePan",
        nomineePoiFrontImage: "nomineePoiFront",
        nomineePoiBackImage: "nomineePoiBack",
        nomineePoaFrontImage: "nomineePoaFront",
        nomineePoaBackImage: "nomineePoaBack",
        nomineeSignature: "nomineeSignature",
        nomineePersonalPhoto: "nomineePhoto",
        chequeImage1: "cheque1",
        chequeImage2: "cheque2",
        chequeImage3: "cheque3",
        chequeImage4: "cheque4",
        nomineeChequeImage1: "nomineeCheque1",
        nomineeChequeImage2: "nomineeCheque2",
        nomineeChequeImage3: "nomineeCheque3",
        nomineeChequeImage4: "nomineeCheque4",
      };

      const pendingUploads = Object.entries(uploadMap).filter(
        ([formKey]) => (form as any)[formKey] instanceof File
      );

      const finalUrls: Record<string, string> = {};
      const total = pendingUploads.length;
      let completed = 0;
      setUploadProgress({ completed: 0, total });

      const UPLOAD_CONCURRENCY = 3;
      let cursor = 0;

      const worker = async () => {
        while (cursor < pendingUploads.length) {
          const myIndex = cursor++;
          const [formKey, backendType] = pendingUploads[myIndex];
          const rawFile = (form as any)[formKey] as File;
          try {
            const compressed = await compressImage(rawFile);
            const url = await uploadSingleDocumentWithRetry(compressed, backendType);
            finalUrls[formKey + "Url"] = url;
          } catch {
            throw new Error(`Failed to upload "${humanizeFieldName(formKey)}" after multiple attempts.`);
          }
          completed++;
          setUploadProgress({ completed, total });
        }
      };

      try {
        await Promise.all(
          Array.from({ length: Math.min(UPLOAD_CONCURRENCY, pendingUploads.length) }, worker)
        );
      } catch (uploadErr) {
        throw uploadErr instanceof Error
          ? uploadErr
          : new Error("One of the documents failed to upload. Please try submitting again.");
      }

      // 2. Submit the JSON payload
      const {
        sameAddress, confirmPassword, manager, agent, addNomineeBankDetails,
        panImage, poiFrontImage, poiBackImage, poaFrontImage, poaBackImage, applicantSignature, personalPhoto,
        nomineePanImage, nomineePoiFrontImage, nomineePoiBackImage, nomineePoaFrontImage, nomineePoaBackImage, nomineeSignature, nomineePersonalPhoto,
        chequeImage1, chequeImage2, chequeImage3, chequeImage4,
        nomineeChequeImage1, nomineeChequeImage2, nomineeChequeImage3, nomineeChequeImage4,
        ...remainingForm
      } = form;

      const payload = {
        ...remainingForm,
        ...finalUrls,
        managerId: manager,
        agentId: agent,
      };

      const response = await fetch(API_ENDPOINTS.ADD_CUSTOMER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try { data = await response.json(); } catch { /* ignore */ }

      if (!response.ok) {
        showToast(extractErrorMessage(data, `Failed to add customer (${response.status})`), "error");
        return;
      }

      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }
      showToast("Customer added successfully!", "success");
      setTimeout(() => window.location.reload(), 1200);
    } catch (error) {
      showToast(extractErrorMessage(error, "Unexpected error while adding customer"), "error");
    } finally {
      setIsLoading(false);
      setUploadProgress(null);
    }
  };

  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
  const { user } = useAuth();
  const userRole = user?.role as "ADMIN" | "MANAGER" | "AGENT";
  const loggedInUserId = user?.id || "";
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const NOMINEE_BANK_FIELDS = [
    "nomineeBankName", "nomineeBankAccountNumber", "nomineeBankIfscCode", "nomineeBankAddress",
    "nomineeChequeNumber1", "nomineeChequeNumber2", "nomineeChequeNumber3", "nomineeChequeNumber4",
    "nomineeChequeImage1", "nomineeChequeImage2", "nomineeChequeImage3", "nomineeChequeImage4",
  ];

  const validateForm = (): Record<string, boolean> => {
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

    // remove non-required / conditional fields
    delete newErrors.sameAddress;
    delete newErrors.addNomineeBankDetails;

    // nominee bank details are only required if the user opted in
    if (!form.addNomineeBankDetails) {
      NOMINEE_BANK_FIELDS.forEach((f) => delete newErrors[f]);
    }

    setErrors(newErrors);
    return newErrors;
  };

  // Keep `errors` (and thus step-badge indicators) live as the user types,
  // without waiting for a submit attempt.
  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // A field's red/error state only shows once its step has been visited-and-left
  // (or submit was attempted) — so a fresh blank step doesn't look broken on arrival.
  const fieldError = (name: string) => {
    const step = FIELD_STEP[name];
    return !!errors[name] && (step === undefined || touchedSteps.has(step));
  };

  const stepErrorCount = (step: number) =>
    Object.keys(errors).filter((k) => errors[k] && FIELD_STEP[k] === step).length;

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  // Overall completion % across all currently-active required fields
  // (nominee bank fields only count while that optional block is switched on).
  const activeRequiredFieldCount = Object.keys(FIELD_STEP).filter(
    (k) => form.addNomineeBankDetails || !NOMINEE_BANK_FIELDS.includes(k)
  ).length;
  const missingFieldCount = Object.keys(errors).filter((k) => errors[k]).length;
  const progressPct = activeRequiredFieldCount
    ? Math.round(((activeRequiredFieldCount - missingFieldCount) / activeRequiredFieldCount) * 100)
    : 0;

  // Fetch managers & agents. Extracted so a "Retry" button can re-run this on
  // demand — previously any failure here (network blip, backend restarting)
  // left the dropdowns silently empty with no way to recover short of a full
  // page reload, which would also wipe the rest of the form.
  const [managerAgentError, setManagerAgentError] = useState<string | null>(null);
  const [managerAgentLoading, setManagerAgentLoading] = useState(false);

  const fetchManagersAndAgents = async () => {
    setManagerAgentLoading(true);
    setManagerAgentError(null);
    try {
      if (userRole === "ADMIN") {
        const managersRes = await fetch(API_ENDPOINTS.GET_ALL_MANAGERS);
        if (!managersRes.ok) throw new Error("Failed to load managers");
        const managersData = await managersRes.json();
        setManagers(managersData);

        if (form.manager) {
          const agentsRes = await fetch(`${API_ENDPOINTS.GET_AGENTS_OF_MANAGER}/${form.manager}`);
          if (!agentsRes.ok) throw new Error("Failed to load agents");
          const agentsData = await agentsRes.json();
          setAgents(normalizeArray(agentsData));
        }
      } else if (userRole === "MANAGER") {
        // manager only sees themselves
        const managersRes = await fetch(`${API_ENDPOINTS.GET_MANAGER_BY_ID}/${loggedInUserId}`);
        if (!managersRes.ok) throw new Error("Failed to load your manager profile");
        const managerData = await managersRes.json();
        setManagers([managerData]);

        const agentsRes = await fetch(`${API_ENDPOINTS.GET_AGENTS_OF_MANAGER}/${managerData.id}`);
        if (!agentsRes.ok) throw new Error("Failed to load agents");
        const agentsData = await agentsRes.json();
        setAgents(normalizeArray(agentsData));

        // auto-set manager
        setForm(prev => ({ ...prev, manager: managerData.id }));
      } else if (userRole === "AGENT") {
        // fetch agent info
        const agentRes = await fetch(`${API_ENDPOINTS.GET_AGENT_BY_ID}/${loggedInUserId}`);
        if (!agentRes.ok) throw new Error("Failed to load your agent profile");
        const agentData = await agentRes.json();
        setAgents([agentData]); // only themselves

        const managersRes = await fetch(`${API_ENDPOINTS.GET_MANAGER_BY_ID}/${agentData.managerId}`);
        if (!managersRes.ok) throw new Error("Failed to load your manager");
        const managerData = await managersRes.json();
        setManagers([managerData]);
        setForm(prev => ({ ...prev, agent: agentData.id, manager: agentData.managerId }));
      }
    } catch (err) {
      setManagerAgentError(extractErrorMessage(err, "Failed to load managers/agents"));
    } finally {
      setManagerAgentLoading(false);
    }
  };

  useEffect(() => {
    fetchManagersAndAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, loggedInUserId]);

  const handleManagerChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const managerId = e.target.value;
    setForm(prev => ({ ...prev, manager: managerId, agent: "" }));
    if (!managerId) {
      setAgents([]);
      return;
    }
    try {
      const agentsRes = await fetch(`${API_ENDPOINTS.GET_AGENTS_OF_MANAGER}/${managerId}`);
      if (!agentsRes.ok) throw new Error("Failed to load agents for the selected manager");
      const agentsData = await agentsRes.json();
      setAgents(normalizeArray(agentsData));
      setManagerAgentError(null);
    } catch (err) {
      setManagerAgentError(extractErrorMessage(err, "Failed to load agents"));
    }
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

  useEffect(() => {
    const handlers = DUP_FIELDS.map((field) => {
      const value = (form as any)[field] as string | undefined;
      const timer = setTimeout(async () => {
        if (!value || !value.trim()) {
          setDupWarnings((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
          });
          return;
        }
        setDupChecking((prev) => ({ ...prev, [field]: true }));
        try {
          const res = await fetch(API_ENDPOINTS.CHECK_CUSTOMER_DUPLICATE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ field, value }),
          });
          if (!res.ok) return;
          const data = await res.json();
          setDupWarnings((prev) => {
            const next = { ...prev };
            if (data.exists) {
              const owner = data.applicantName
                ? ` — ${data.applicantName}${data.memberId ? ` (Member ID: ${data.memberId})` : ""}`
                : "";
              if (data.conflictField && data.conflictField !== field) {
                next[field] = `Customer account already exists, used as ${fieldDisplayName(data.conflictField)}${owner}`;
              } else {
                next[field] = `Customer account already exists${owner}`;
              }
            } else {
              delete next[field];
            }
            return next;
          });
        } catch {
          // network failure — silently ignore
        } finally {
          setDupChecking((prev) => ({ ...prev, [field]: false }));
        }
      }, 400);
      return timer;
    });
    return () => handlers.forEach((t) => clearTimeout(t));
  }, [
    form.panNumber,
    form.mobileNumber,
    form.email,
    form.poiDocumentNumber,
    form.poaDocumentNumber,
    form.nomineePanNumber,
    form.nomineePoiDocumentNumber,
    form.nomineePoaDocumentNumber,
  ]);

  return (<>
  <Loading
    visible={isLoading}
    label={uploadProgress ? "Uploading documents…" : "Creating customer…"}
    progress={uploadProgress ?? undefined}
  />
    {/* ===== Crop Modal ===== */}
    {cropSrc && (
      <CropModal
        imageSrc={cropSrc}
        title={cropTitle}
        onCropDone={handleCropDone}
        onCancel={handleCropCancel}
      />
    )}
    {toast && (
      <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
    )}
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] my-8">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] mb-6">
        <div className="flex items-center space-x-4">
          <FaUserPlus className="text-orange-400 text-3xl" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Add New Customer</h2>
            <p className="text-gray-600 mt-1">
              Step {currentStep} of 4 — {STEP_LABELS[currentStep]}
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-2xl font-bold text-blue-600">{progressPct}%</div>
            <div className="text-xs text-gray-500">complete</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Connected stepper */}
        <div className="mt-6 flex items-start">
          {([
            { step: 1, label: "Personal Details" },
            { step: 2, label: "Borrower Docs" },
            { step: 3, label: "Nominee Docs" },
            { step: 4, label: "Bank Details" },
          ] as const).map(({ step, label }, idx, arr) => {
            const errCount = stepErrorCount(step);
            const isComplete = errCount === 0;
            const showError = errCount > 0 && (touchedSteps.has(step) || currentStep > step);
            const isCurrent = currentStep === step;
            const isDoneAndClean = !isCurrent && isComplete && touchedSteps.has(step);
            return (
              <React.Fragment key={step}>
                <button
                  type="button"
                  onClick={() => goToStep(step)}
                  title={showError ? `${errCount} field(s) need attention` : undefined}
                  className="cursor-pointer flex flex-col items-center gap-1.5 flex-1 group"
                >
                  <span
                    className={`flex items-center justify-center h-9 w-9 rounded-full text-sm font-bold border-2 transition
                      ${isCurrent
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                        : showError
                          ? "bg-red-50 border-red-400 text-red-600"
                          : isDoneAndClean
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-gray-300 text-gray-500 group-hover:border-gray-400"
                      }`}
                  >
                    {isDoneAndClean ? <FaCheckCircle /> : showError ? <FaExclamationTriangle /> : step}
                  </span>
                  <span className={`text-xs font-semibold text-center leading-tight ${isCurrent ? "text-blue-700" : showError ? "text-red-600" : "text-gray-600"}`}>
                    {label}
                    {showError && <span className="block font-normal">{errCount} missing</span>}
                  </span>
                </button>
                {idx < arr.length - 1 && (
                  <div className={`h-0.5 flex-1 mt-4.5 mx-1 rounded ${currentStep > step ? "bg-blue-400" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {draftPrompt && (
        <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-300 text-blue-800 rounded-xl px-4 py-3">
          <FaSyncAlt className="mt-0.5 shrink-0 text-blue-600" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">
              We found unsaved progress from {new Date(draftPrompt.savedAt).toLocaleString()}.
            </p>
            <p className="mt-0.5 text-blue-700/80">
              Text fields will be restored — documents/photos you'd selected will need to be re-added.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={restoreDraft}
              className="cursor-pointer bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={discardDraft}
              className="cursor-pointer bg-white border border-blue-300 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-blue-100 transition"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {draftRestored && !draftPrompt && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-300 text-green-800 rounded-xl px-4 py-2 text-sm">
          <FaCheckCircle className="shrink-0 text-green-600" />
          <span className="flex-1">Draft restored. Please re-select any document photos on steps 2–4.</span>
          <button
            type="button"
            onClick={() => setDraftRestored(false)}
            className="cursor-pointer text-green-600 hover:text-green-800 font-bold leading-none px-1"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {submitBlocker && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-300 text-red-800 rounded-xl px-4 py-3">
          <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-600" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">{submitBlocker.title}</p>
            {submitBlocker.items.length > 0 && (
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                {submitBlocker.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSubmitBlocker(null)}
            className="cursor-pointer text-red-500 hover:text-red-700 font-bold leading-none px-1"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <div className={currentStep === 1 ? "block" : "hidden"}>

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
            error={fieldError("applicantName")}
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
            error={fieldError("relationType")}
          />
          <InputField
            label="Guardian Name"
            name="guardianName"
            icon={<FaUserTie />}
            value={form.guardianName}
            onChange={handleChange}
            required
            error={fieldError("guardianName")}
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
            error={fieldError("religion")}
          />
          <InputField
            label="Village"
            name="village"
            icon={<FaHome />}
            value={form.village}
            onChange={handleChange}
            required
            error={fieldError("village")}
          />
          <InputField
            label="Post Office"
            name="postOffice"
            icon={<FaMapMarkerAlt />}
            value={form.postOffice}
            onChange={handleChange}
            required
            error={fieldError("postOffice")}
          />
          <InputField
            label="Police Station"
            name="policeStation"
            icon={<FaShieldAlt />}
            value={form.policeStation}
            onChange={handleChange}
            required
            error={fieldError("policeStation")}
          />
          <InputField
            label="District"
            name="district"
            icon={<FaMapMarkedAlt />}
            value={form.district}
            onChange={handleChange}
            required
            error={fieldError("district")}
          />
          <InputField
            label="PIN Code"
            name="pinCode"
            icon={<FaHashtag />}
            value={form.pinCode}
            onChange={handleChange}
            required
            maxLength={6}
            placeholder="6-digit PIN"
            error={fieldError("pinCode")}
          />
          <InputField
            label="Mobile Number"
            name="mobileNumber"
            icon={<FaPhone />}
            value={form.mobileNumber}
            onChange={handleChange}
            required
            maxLength={10}
            placeholder="10-digit mobile number"
            type="tel"
            error={fieldError("mobileNumber")}
            warning={dupWarnings.mobileNumber}
            checking={dupChecking.mobileNumber}
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
            error={fieldError("maritalStatus")}
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
            error={fieldError("gender")}
          />
          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            error={fieldError("dateOfBirth")}
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
            error={fieldError("nomineeName")}
          />
          <InputField
            label="Nominee Mobile"
            name="nomineeMobileNumber"
            icon={<FaPhone />}
            value={form.nomineeMobileNumber}
            onChange={handleChange}
            type="tel"
            required
            maxLength={10}
            placeholder="10-digit mobile number"
            error={fieldError("nomineeMobileNumber")}
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
            error={fieldError("nomineeRelation")}
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
            error={fieldError("nomineeVillage")}
          />
          <InputField
            label="Nominee PO"
            name="nomineePostOffice"
            icon={<FaMapMarkerAlt />}
            value={form.nomineePostOffice}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            error={fieldError("nomineePostOffice")}
          />
          <InputField
            label="Nominee PS"
            name="nomineePoliceStation"
            icon={<FaShieldAlt />}
            value={form.nomineePoliceStation}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            error={fieldError("nomineePoliceStation")}
          />
          <InputField
            label="Nominee District"
            name="nomineeDistrict"
            icon={<FaMapMarkedAlt />}
            value={form.nomineeDistrict}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            error={fieldError("nomineeDistrict")}
          />
          <InputField
            label="Nominee Address PIN Code"
            name="nomineePinCode"
            icon={<FaHashtag />}
            value={form.nomineePinCode}
            onChange={handleChange}
            disabled={form.sameAddress}
            required
            maxLength={6}
            placeholder="6-digit PIN"
            error={fieldError("nomineePinCode")}
          />
        </div>
      </section>

      {/* ACCOUNT INFORMATION (Moved to Step 1) */}
      <section className="mb-8">
        <h2 className="bg-purple-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaLock /> Account Information
        </h2>
        <div className="p-4 border border-t-0 border-purple-600 rounded-b-md">
          {managerAgentError && (
            <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-300 text-red-800 rounded-lg px-3 py-2 text-sm">
              <FaExclamationTriangle className="shrink-0 text-red-600" />
              <span className="flex-1">{managerAgentError}</span>
              <button
                type="button"
                onClick={fetchManagersAndAgents}
                disabled={managerAgentLoading}
                className="cursor-pointer inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-red-700 disabled:opacity-60 transition"
              >
                <FaSyncAlt className={managerAgentLoading ? "animate-spin" : ""} /> Retry
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <SelectField
            label="Manager"
            name="manager"
            value={form.manager}
            onChange={handleManagerChange}
            options={managers.map(m => ({ label: m.name, value: m.id }))}
            required
            error={fieldError("manager")}
            onRefresh={fetchManagersAndAgents}
            refreshing={managerAgentLoading}
          />

          <SelectField
            label="Agent"
            name="agent"
            value={form.agent}
            onChange={handleChange}
            options={(Array.isArray(agents) ? agents : []).map(a => ({ label: a.name, value: a.id }))}
            required
            error={fieldError("agent")}
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
            error={fieldError("email")}
            warning={dupWarnings.email}
            checking={dupChecking.email}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            icon={<FaLock />}
            value={form.password}
            onChange={handleChange}
            required
            error={fieldError("password")}
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            icon={<FaLock />}
            value={form.confirmPassword}
            onChange={handleChange}
            required
            error={fieldError("confirmPassword")}
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
            error={fieldError("accountStatus")}
          />
          </div>
        </div>
      </section>
      </div>

      <div className={currentStep === 2 ? "block" : "hidden"}>

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
            maxLength={10}
            placeholder="e.g. ABCDE1234F"
            error={fieldError("panNumber")}
            warning={dupWarnings.panNumber}
            checking={dupChecking.panNumber}
          />
          <FileField
            label="PAN Card Image"
            name="panImage"
            file={form.panImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("panImage")}
          />

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
            error={fieldError("poiDocumentType")}
          />

          <InputField
            label="POI Document Number"
            name="poiDocumentNumber"
            value={form.poiDocumentNumber}
            onChange={handleChange}
            required
            error={fieldError("poiDocumentNumber")}
            warning={dupWarnings.poiDocumentNumber}
            checking={dupChecking.poiDocumentNumber}
          />
          <FileField
            label="POI Document Front Image"
            name="poiFrontImage"
            file={form.poiFrontImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("poiFrontImage")}
          />
          <FileField
            label="POI Document Back Image"
            name="poiBackImage"
            file={form.poiBackImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("poiBackImage")}
          />

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
            error={fieldError("poaDocumentType")}
          />
          <InputField
            label="POA Document Number"
            name="poaDocumentNumber"
            value={form.poaDocumentNumber}
            onChange={handleChange}
            required
            error={fieldError("poaDocumentNumber")}
            warning={dupWarnings.poaDocumentNumber}
            checking={dupChecking.poaDocumentNumber}
          />
          <FileField
            label="POA Document Front Image"
            name="poaFrontImage"
            file={form.poaFrontImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("poaFrontImage")}
          />
          <FileField
            label="POA Document Back Image"
            name="poaBackImage"
            file={form.poaBackImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("poaBackImage")}
          />
          <FileField
            label="Applicant Signature"
            name="applicantSignature"
            file={form.applicantSignature}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("applicantSignature")}
          />
          <FileField
            label="Personal Photo"
            name="personalPhoto"
            file={form.personalPhoto}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("personalPhoto")}
          />
        </div>
      </section>
      </div>

      <div className={currentStep === 3 ? "block" : "hidden"}>
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
            maxLength={10}
            placeholder="e.g. ABCDE1234F"
            error={fieldError("nomineePanNumber")}
            warning={dupWarnings.nomineePanNumber}
            checking={dupChecking.nomineePanNumber}
          />
          <FileField
            label="PAN Card Image"
            name="nomineePanImage"
            file={form.nomineePanImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("nomineePanImage")}
          />

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
            error={fieldError("nomineePoiDocumentType")}
          />

          <InputField
            label="POI Document Number"
            name="nomineePoiDocumentNumber"
            value={form.nomineePoiDocumentNumber}
            onChange={handleChange}
            required
            error={fieldError("nomineePoiDocumentNumber")}
            warning={dupWarnings.nomineePoiDocumentNumber}
            checking={dupChecking.nomineePoiDocumentNumber}
          />
          <FileField
            label="POI Document Front Image"
            name="nomineePoiFrontImage"
            file={form.nomineePoiFrontImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("nomineePoiFrontImage")}
          />
          <FileField
            label="POI Document Back Image"
            name="nomineePoiBackImage"
            file={form.nomineePoiBackImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("nomineePoiBackImage")}
          />

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
            error={fieldError("nomineePoaDocumentType")}
          />
          <InputField
            label="POA Document Number"
            name="nomineePoaDocumentNumber"
            value={form.nomineePoaDocumentNumber}
            onChange={handleChange}
            required
            error={fieldError("nomineePoaDocumentNumber")}
            warning={dupWarnings.nomineePoaDocumentNumber}
            checking={dupChecking.nomineePoaDocumentNumber}
          />
          <FileField
            label="POA Document Front Image"
            name="nomineePoaFrontImage"
            file={form.nomineePoaFrontImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("nomineePoaFrontImage")}
          />
          <FileField
            label="POA Document Back Image"
            name="nomineePoaBackImage"
            file={form.nomineePoaBackImage}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("nomineePoaBackImage")}
          />
          <FileField
            label="Nominee Signature"
            name="nomineeSignature"
            file={form.nomineeSignature}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("nomineeSignature")}
          />
          <FileField
            label="Nominee Photo"
            name="nomineePersonalPhoto"
            file={form.nomineePersonalPhoto}
            onChange={handleFileChange}
            onRemove={handleFileRemove}
                onCrop={openCropModal}
            required
            error={fieldError("nomineePersonalPhoto")}
          />
        </div>
      </section>
      </div>

      <div className={currentStep === 4 ? "block" : "hidden"}>
      {/* BANK DETAILS */}
      <section className="mb-8">
        <h2 className="bg-teal-600 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaUniversity /> Borrower Bank Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-t-0 border-teal-600 rounded-b-md">
          <InputField
            label="Bank Name"
            name="bankName"
            icon={<FaUniversity />}
            value={form.bankName}
            onChange={handleChange}
            required
            error={fieldError("bankName")}
          />
          <InputField
            label="Account Number"
            name="bankAccountNumber"
            icon={<FaMoneyCheckAlt />}
            value={form.bankAccountNumber}
            onChange={handleChange}
            required
            error={fieldError("bankAccountNumber")}
          />
          <InputField
            label="IFSC Code"
            name="bankIfscCode"
            icon={<FaHashtag />}
            value={form.bankIfscCode}
            onChange={handleChange}
            required
            maxLength={11}
            placeholder="e.g. SBIN0001234"
            error={fieldError("bankIfscCode")}
          />
          <InputField
            label="Bank Address"
            name="bankAddress"
            icon={<FaMapMarkerAlt />}
            value={form.bankAddress}
            onChange={handleChange}
            required
            error={fieldError("bankAddress")}
          />
        </div>

        <h3 className="mt-4 mb-2 px-1 text-sm font-semibold text-gray-600 flex items-center gap-2">
          <FaMoneyCheckAlt /> Security Cheques (4 required)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-lg border border-gray-200 bg-gray-50/60 p-3 flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Cheque {n}</p>
              <InputField
                label="Cheque Number"
                name={`chequeNumber${n}`}
                value={(form as any)[`chequeNumber${n}`]}
                onChange={handleChange}
                required
                error={fieldError(`chequeNumber${n}`)}
              />
              <FileField
                label="Cheque Photo"
                name={`chequeImage${n}`}
                file={(form as any)[`chequeImage${n}`]}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
                onCrop={openCropModal}
                required
                error={fieldError(`chequeImage${n}`)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="bg-cyan-700 text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-3">
          <FaUniversity /> Nominee Bank Details
        </h2>
        <div className="p-4 border border-t-0 border-cyan-700 rounded-b-md">
          <CheckboxField
            label="Add Nominee Bank Details (optional)"
            name="addNomineeBankDetails"
            checked={form.addNomineeBankDetails}
            onChange={handleChange}
          />

          {form.addNomineeBankDetails && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <InputField
                  label="Bank Name"
                  name="nomineeBankName"
                  icon={<FaUniversity />}
                  value={form.nomineeBankName}
                  onChange={handleChange}
                  required
                  error={fieldError("nomineeBankName")}
                />
                <InputField
                  label="Account Number"
                  name="nomineeBankAccountNumber"
                  icon={<FaMoneyCheckAlt />}
                  value={form.nomineeBankAccountNumber}
                  onChange={handleChange}
                  required
                  error={fieldError("nomineeBankAccountNumber")}
                />
                <InputField
                  label="IFSC Code"
                  name="nomineeBankIfscCode"
                  icon={<FaHashtag />}
                  value={form.nomineeBankIfscCode}
                  onChange={handleChange}
                  required
                  maxLength={11}
                  placeholder="e.g. SBIN0001234"
                  error={fieldError("nomineeBankIfscCode")}
                />
                <InputField
                  label="Bank Address"
                  name="nomineeBankAddress"
                  icon={<FaMapMarkerAlt />}
                  value={form.nomineeBankAddress}
                  onChange={handleChange}
                  required
                  error={fieldError("nomineeBankAddress")}
                />
              </div>

              <h3 className="mt-4 mb-2 px-1 text-sm font-semibold text-gray-600 flex items-center gap-2">
                <FaMoneyCheckAlt /> Security Cheques (4 required)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="rounded-lg border border-gray-200 bg-gray-50/60 p-3 flex flex-col gap-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Cheque {n}</p>
                    <InputField
                      label="Cheque Number"
                      name={`nomineeChequeNumber${n}`}
                      value={(form as any)[`nomineeChequeNumber${n}`]}
                      onChange={handleChange}
                      required
                      error={fieldError(`nomineeChequeNumber${n}`)}
                    />
                    <FileField
                      label="Cheque Photo"
                      name={`nomineeChequeImage${n}`}
                      file={(form as any)[`nomineeChequeImage${n}`]}
                      onChange={handleFileChange}
                      onRemove={handleFileRemove}
                onCrop={openCropModal}
                      required
                      error={fieldError(`nomineeChequeImage${n}`)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      </div>

      <div className="sticky bottom-0 -mx-6 mt-6 px-6 py-4 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] rounded-b-md flex justify-between items-center gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
          >
            ← Back
          </button>
        ) : <div />}

        <span className="hidden sm:block text-xs text-gray-500 text-center flex-1">
          {stepErrorCount(currentStep) > 0
            ? `${stepErrorCount(currentStep)} field(s) remaining on this step`
            : "This step looks complete"}
        </span>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="cursor-pointer bg-blue-600 text-white px-8 py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            Next Step →
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`cursor-pointer text-white px-8 py-2 rounded-md shadow transition ${isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </button>
        )}
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
  maxLength?: number;
  error?: boolean;
  warning?: string;
  checking?: boolean;
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
  maxLength,
  error = false,
  warning = "",
  checking = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const showWarning = !!warning && !error;
  return (
    <label className="cursor-pointer flex flex-col text-sm">
      <span className="cursor-pointer mb-1 font-semibold flex items-center gap-2">
        {icon} {label} {required && <span className="cursor-pointer text-red-600">*</span>}
        {checking && (
          <span className="text-gray-400 text-xs font-normal animate-pulse">checking…</span>
        )}
      </span>

      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          className={`cursor-pointer border rounded-md px-3 py-2 focus:ring-2 w-full
            ${error ? "border-red-500 focus:ring-red-500" : showWarning ? "border-amber-500 focus:ring-amber-500" : "border-gray-300 focus:ring-blue-500"}
            ${disabled ? "bg-white/40 backdrop-blur-md border border-white/50 cursor-not-allowed" : ""}
            ${isPassword ? "pr-9" : ""}
          `}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPassword((s) => !s);
            }}
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-red-600 text-xs mt-1">
          Fill the required field
        </span>
      )}
      {showWarning && (
        <div className="mt-1 flex items-center gap-1.5 text-amber-800 bg-amber-50 border border-amber-400 rounded px-2 py-1 text-xs font-medium">
          <FaExclamationTriangle className="shrink-0" /> {warning}
        </div>
      )}
    </label>
  );
}

interface FileFieldProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (name: string) => void;
  onCrop?: (name: string, file: File) => void;
  required?: boolean;
  error?: boolean;
}

function FileField({ label, name, file, onChange, onRemove, onCrop, required = false, error = false }: FileFieldProps) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-semibold flex items-center gap-2 flex-wrap">
        {label} {required && <span className="text-red-600">*</span>}
        {file && (
          <span className="inline-flex items-center gap-1 text-green-600 text-xs font-normal">
            <FaCheckCircle /> Uploaded
          </span>
        )}
      </span>

      {file ? (
        <div className={`flex items-center gap-3 rounded-md border p-2 ${error ? "border-red-500" : "border-green-300 bg-green-50/40"}`}>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="h-14 w-14 rounded border border-gray-200 object-cover shrink-0"
          />
          <div className="min-w-0 flex-1 flex flex-col gap-0.5">
            <p className="truncate text-xs text-gray-700" title={file.name}>{file.name}</p>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer text-xs text-blue-600 hover:underline">
                Replace
                <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
              </label>
              {onCrop && file.type.startsWith("image/") && (
                <button
                  type="button"
                  onClick={() => onCrop(name, file)}
                  className="cursor-pointer inline-flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 hover:underline"
                >
                  <FaCrop className="text-[10px]" /> Crop
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove?.(name)}
            className="cursor-pointer text-gray-400 hover:text-red-600 text-lg leading-none px-1"
            aria-label={`Remove ${label}`}
          >
            ×
          </button>
        </div>
      ) : (
        <label
          className={`cursor-pointer flex items-center justify-center gap-2 rounded-md border-2 border-dashed px-3 py-4 text-xs transition hover:bg-gray-50
            ${error ? "border-red-500 text-red-600" : "border-gray-300 text-gray-500"}`}
        >
          <FaFileAlt />
          Click to upload
          <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
        </label>
      )}

      {error && !file && (
        <span className="text-red-600 text-xs">
          Document not uploaded — this field is required
        </span>
      )}
    </div>
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
  onRefresh?: () => void;
  refreshing?: boolean;
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error = false,
  onRefresh,
  refreshing = false,
}: SelectFieldProps) {
  return (
    <label className="cursor-pointer flex flex-col text-sm">
      <span className="cursor-pointer mb-1 font-semibold flex items-center gap-1.5">
        {label} {required && <span className="cursor-pointer text-red-600">*</span>}
        {onRefresh && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRefresh();
            }}
            disabled={refreshing}
            title="Refresh list"
            className="cursor-pointer text-gray-400 hover:text-blue-600 disabled:opacity-50"
          >
            <FaSyncAlt className={`text-[11px] ${refreshing ? "animate-spin" : ""}`} />
          </button>
        )}
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
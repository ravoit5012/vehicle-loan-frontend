"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { API_ENDPOINTS } from "../../config/config";
import ProtectedPageMessage from "../../components/ProtectedPageMessage";
import { Toast } from "../../components/Toast";
import {
  Settings,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Save,
  Loader2,
} from "lucide-react";

type CompanySettingsData = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  panNumber: string;
};

const emptySettings: CompanySettingsData = {
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  companyAddress: "",
  panNumber: "",
};

export default function GeneralSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<CompanySettingsData>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ===== Fetch current settings ===== */
  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    const fetchSettings = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.GET_COMPANY_SETTINGS, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSettings({
              companyName: data.companyName || "",
              companyEmail: data.companyEmail || "",
              companyPhone: data.companyPhone || "",
              companyAddress: data.companyAddress || "",
              panNumber: data.panNumber || "",
            });
          }
        }
      } catch {
        // first-time use — no settings yet, keep empty
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  /* ===== Save handler ===== */
  const handleSave = async () => {
    setError(null);

    // Basic validation
    if (!settings.companyName.trim()) {
      setError("Company name is required");
      return;
    }
    if (!settings.companyEmail.trim()) {
      setError("Company email is required");
      return;
    }
    if (!settings.companyPhone.trim()) {
      setError("Company phone is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_COMPANY_SETTINGS, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to save settings");
      }

      setToast("Company settings saved successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* ===== Auth guard ===== */
  if (authLoading) return null;
  if (!user) return <ProtectedPageMessage />;
  if (user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg md:text-2xl">
          Only <strong>Admins</strong> can access this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-500" size={36} />
      </div>
    );
  }

  /* ===== Field config ===== */
  const fields: {
    key: keyof CompanySettingsData;
    label: string;
    icon: React.ReactNode;
    type: string;
    placeholder: string;
  }[] = [
    {
      key: "companyName",
      label: "Company Name",
      icon: <Building2 size={18} className="text-indigo-500" />,
      type: "text",
      placeholder: "e.g. Champanand Finance Pvt Ltd",
    },
    {
      key: "companyEmail",
      label: "Company Email",
      icon: <Mail size={18} className="text-indigo-500" />,
      type: "email",
      placeholder: "e.g. info@champanand.com",
    },
    {
      key: "companyPhone",
      label: "Company Phone",
      icon: <Phone size={18} className="text-indigo-500" />,
      type: "tel",
      placeholder: "e.g. +91 9876543210",
    },
    {
      key: "companyAddress",
      label: "Company Address",
      icon: <MapPin size={18} className="text-indigo-500" />,
      type: "text",
      placeholder: "e.g. 123, Main Road, City, State - 000000",
    },
    {
      key: "panNumber",
      label: "PAN Number",
      icon: <CreditCard size={18} className="text-indigo-500" />,
      type: "text",
      placeholder: "e.g. ABCDE1234F",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* ===== Header ===== */}
      <div className="rounded-2xl p-6 sm:p-8 text-white bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex items-center gap-3">
          <Settings size={28} />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            General Settings
          </h1>
        </div>
        <p className="mt-2 text-white/80 text-sm sm:text-base">
          Manage your company details. These settings are used across the
          application.
        </p>
      </div>

      {/* ===== Form Card ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Building2 size={20} className="text-indigo-500" />
            Company Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update your company details below
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map(({ key, label, icon, type, placeholder }) => (
              <div
                key={key}
                className={
                  key === "companyAddress"
                    ? "md:col-span-2"
                    : ""
                }
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  {icon}
                  {label}
                </label>
                {key === "companyAddress" ? (
                  <textarea
                    value={settings[key]}
                    onChange={(e) =>
                      setSettings({ ...settings, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
                      transition-all duration-200 resize-none bg-gray-50/50 hover:bg-white"
                  />
                ) : (
                  <input
                    type={type}
                    value={settings[key]}
                    onChange={(e) =>
                      setSettings({ ...settings, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
                      transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              id="save-company-settings"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600
                text-white font-semibold rounded-xl shadow-md hover:shadow-lg
                hover:from-indigo-600 hover:to-purple-700
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200 text-sm cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Toast ===== */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

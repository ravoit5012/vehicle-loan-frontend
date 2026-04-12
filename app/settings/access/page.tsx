"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import NavbarWrapper from "../../components/NavbarWrapper";
import Loading from "../../components/Loading";
import { Toast } from "@/app/components/Toast";
import ProtectedPageMessage from "../../components/ProtectedPageMessage";
import { Check, Loader2, Save } from "lucide-react";
import { API_ENDPOINTS } from "@/app/config/config";

type RoleAccess = {
  role: "AGENT" | "MANAGER";
  allowedStatuses: string[];
};

const STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "CALL_VERIFIED",
  "CONTRACT_GENERATED",
  "CONTRACT_SIGNED",
  "FIELD_VERIFIED",
  "ADMIN_APPROVED",
  "DISBURSED",
  "REJECTED",
  "CLOSED"
];

export default function AssignAccessPage() {
  const { user } = useAuth();
  const [accessConfigs, setAccessConfigs] = useState<RoleAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setLoading(false);
      return;
    }
    fetchConfigs();
  }, [user]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.GET_ACCESS_CONTROL, {
        method: "GET",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to load access configs");

      const data = await res.json();
      setAccessConfigs(data);
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (role: "AGENT" | "MANAGER", status: string) => {
    setAccessConfigs((prev) =>
      prev.map((config) => {
        if (config.role !== role) return config;

        const hasStatus = config.allowedStatuses.includes(status);
        const newStatuses = hasStatus
          ? config.allowedStatuses.filter((s) => s !== status)
          : [...config.allowedStatuses, status];

        return { ...config, allowedStatuses: newStatuses };
      })
    );
  };

  const handleSave = async (role: "AGENT" | "MANAGER") => {
    const config = accessConfigs.find((c) => c.role === role);
    if (!config) return;

    try {
      setSaving(role);
      const res = await fetch(API_ENDPOINTS.UPDATE_ACCESS_CONTROL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: config.role,
          allowedStatuses: config.allowedStatuses,
        }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error("Failed to update access control");

      setToast({ message: `${role} access updated successfully!`, type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(null);
    }
  };


  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">

          <div className="text-5xl mb-4">🔒</div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-1">
            Only administrators can assign access roles.
          </p>

          <p className="text-sm text-gray-400 mb-6">
            Contact your admin if you think this is a mistake.
          </p>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div>
      <Loading visible={loading} />
      <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Access Control
            </h1>
            <p className="text-blue-100/90 text-lg sm:text-xl leading-relaxed">
              Dynamically assign application permissions to Managers and Agents to securely govern the flow of operations.
            </p>
          </div>
        </div>

        {/* Roles Mapping */}
        <div className="grid lg:grid-cols-2 gap-8">
          {["MANAGER", "AGENT"].map((roleName) => {
            const roleConfig = accessConfigs.find((c) => c.role === roleName);
            const rRole = roleName as "AGENT" | "MANAGER";

            if (!roleConfig) return null;

            return (
              <div
                key={roleName}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
                        {roleName.charAt(0)}
                      </span>
                      {roleName} Permissions
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Select which statuses a {roleName.toLowerCase()} can transition loan applications to.
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {STATUSES.map((status) => {
                    const isChecked = roleConfig.allowedStatuses.includes(status);
                    return (
                      <label
                        key={status}
                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 group
                        ${isChecked
                            ? "border-blue-500 bg-blue-50/50"
                            : "border-transparent bg-gray-50 hover:bg-gray-100"}`}
                      >
                        <span className={`font-semibold transition-colors ${isChecked ? "text-blue-700" : "text-gray-700"}`}>
                          {getStatusLabel(status)}
                        </span>

                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white text-transparent group-hover:border-blue-400"
                          }`}>
                          <Check size={16} strokeWidth={3} />
                        </div>

                        {/* Hidden Checkbox */}
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isChecked}
                          onChange={() => handleToggleStatus(rRole, status)}
                        />
                      </label>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleSave(rRole)}
                  disabled={saving === rRole}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving === rRole ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {saving === rRole ? "Saving Configuration..." : "Save Preferences"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {
        toast && (
          <Toast
            message={toast.message}
            // type={toast.type}
            onClose={() => setToast(null)}
          />
        )
      }
    </div>
  );
}

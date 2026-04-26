"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import ProtectedPageMessage from "@/app/components/ProtectedPageMessage";
import { API_ENDPOINTS } from "@/app/config/config";
import { 
  DatabaseBackup, 
  UploadCloud, 
  DownloadCloud, 
  AlertTriangle,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function BackupRestorePage() {
  const { user, logout, loading: authLoading } = useAuth();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importNotice, setImportNotice] = useState<{type: 'error' | 'success', message: string} | null>(null);

  /* ===== EXPORT LOGIC ===== */
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const response = await axios.get(API_ENDPOINTS.EXPORT_BACKUP, {
        withCredentials: true,
        responseType: 'blob', // Important for downloading files
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Try extracting filename from headers, else fallback
      const contentDisposition = response.headers['content-disposition'];
      let filename = `database_backup_${new Date().getTime()}.json`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export database. Please check your connection.");
    } finally {
      setIsExporting(false);
    }
  };

  /* ===== IMPORT LOGIC ===== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setImportNotice(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    if (!confirm("⚠️ WARNING: This will completely WIPE the current database and replace it with the uploaded file. This action cannot be undone. Are you absolutely sure?")) {
      return;
    }

    try {
      setIsImporting(true);
      setImportNotice(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(API_ENDPOINTS.IMPORT_BACKUP, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImportNotice({
        type: 'success',
        message: response.data.message || "Database restored successfully. You will be logged out shortly."
      });

      // After successful massive DB swap, force logout so they re-authenticate against new DB
      setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, 4000);

    } catch (error: any) {
      console.error("Import failed", error);
      setImportNotice({
        type: 'error',
        message: error.response?.data?.message || "Failed to restore database. Ensure the JSON file is valid."
      });
    } finally {
      setIsImporting(false);
    }
  };

  /* ===== RENDER ===== */
  if (authLoading) return null;
  if (!user || user.role !== "ADMIN") return <ProtectedPageMessage />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <DatabaseBackup size={32} className="text-yellow-400" />
            <h1 className="text-2xl sm:text-3xl font-bold">Data Management</h1>
          </div>
          <p className="mt-2 text-slate-300 max-w-2xl">
            Securely backup your entire application database into a single, portable JSON file, or restore your system from a previous snapshot.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EXPORT CARD */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100 p-6 sm:p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <DownloadCloud size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Export Backup</h2>
              <p className="text-sm text-gray-500">Download a full snapshot of the current database.</p>
            </div>
          </div>
          
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex-1">
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
              <li>Includes all Managers, Agents, and Customers.</li>
              <li>Includes all Loans, Repayments, and Ledgers.</li>
              <li>Includes configuration settings and company details.</li>
              <li>Images and PDFs (stored in Cloudflare R2) are referenced by URL.</li>
            </ul>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 outline outline-white/30 hover:shadow-lg hover:-translate-y-0.5 transition-all text-white font-bold py-3.5 px-4 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 className="animate-spin" size={20} /> : <DownloadCloud size={20} />}
            {isExporting ? "Generating Backup..." : "Generate & Download JSON Backup"}
          </button>
        </div>

        {/* IMPORT CARD */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-red-100 p-6 sm:p-8 flex flex-col h-full border-t-[4px] border-t-red-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <UploadCloud size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Restore Database</h2>
              <p className="text-sm text-red-500 font-medium">Danger Zone: Replaces current data.</p>
            </div>
          </div>

          <div className="bg-red-50 text-red-800 text-sm p-4 rounded-xl border border-red-100 mb-6 flex gap-3 flex-1 items-start">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p>
              Uploading a backup file will <strong>permanently delete</strong> the current database records and overwrite them with the contents of the file. You will be automatically logged out after a successful restore.
            </p>
          </div>

          {importNotice && (
            <div className={`p-4 rounded-xl mb-4 text-sm font-medium flex items-center gap-2 ${importNotice.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {importNotice.type === 'success' ? <CheckCircle2 size={18}/> : <AlertTriangle size={18} />}
              {importNotice.message}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-transparent border-t border-white/40 hover:bg-white/40 backdrop-blur-md border border-white/50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedFile ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500" />
                      <p className="mb-2 text-sm text-gray-700 font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">JSON backup file only</p>
                    </>
                  )}
                </div>
                <input id="dropzone-file" type="file" accept=".json" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            <button
              onClick={handleImport}
              disabled={isImporting || !selectedFile}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? <Loader2 className="animate-spin" size={20} /> : <AlertTriangle size={20} />}
              {isImporting ? "Restoring Database..." : "Wipe & Restore Database"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

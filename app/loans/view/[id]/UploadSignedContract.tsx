'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import Loading from '@/app/components/Loading';

export default function UploadSignedContract({
    loanId,
}: {
    loanId: string;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a signed contract PDF');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);

            const response = await fetch(
                `${API_ENDPOINTS.UPLOAD_SIGNED_LETTER}/${loanId}`,
                {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            alert('Signed contract uploaded successfully');
            window.location.reload();
        } catch (err: any) {
            alert(err.message || 'Error uploading signed contract');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <Loading visible={loading} />
            <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                    Upload Signed Contract Letter
                </h2>

                <p className="text-gray-700 mb-4">
                    Please upload the signed contract received from the customer.
                    Only PDF files are allowed.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose a Signed Contract (PDF)
                    </label>
                    <div
                        className="border-2 border-dashed border-blue-400 p-4 rounded-lg cursor-pointer hover:border-blue-500 transition"
                        style={{ width: '100%' }}
                    >
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={e => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="fileInput"
                        />
                        <label
                            htmlFor="fileInput"
                            className="flex justify-center items-center cursor-pointer text-gray-600"
                        >
                            {file ? (
                                <span className="text-gray-800">{file.name}</span>
                            ) : (
                                <span className="text-gray-400">No file chosen</span>
                            )}
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleUpload}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Upload Signed Contract
                </button>
            </div>
        </>
    );
}

'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';

export default function EditManagerModal({ manager, onClose, onUpdated }: any) {
    const [form, setForm] = useState({
        name: manager.name || '',
        phoneNumber: manager.phoneNumber || '',
        email: manager.email || '',
        username: manager.username || '',
        password: '',
        status: manager.status || '',
        address: manager.address || '',
        city: manager.city || '',
        pincode: manager.pincode || '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    async function submit() {
        try {
            setLoading(true);
            setMessage(null);

            // Exclude password if blank to keep current
            const payload: any = { ...form };
            if (!payload.password) delete payload.password;

            const res = await fetch(`${API_ENDPOINTS.UPDATE_MANAGER}/${manager.id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data?.message?.message || 'Update failed' });
                return;
            }

            setMessage({ type: 'success', text: 'Manager updated successfully!' });
            onUpdated(data);
            setTimeout(onClose, 1200);
            window.location.reload();
        } catch (err) {
            console.error('Network error:', err);
            setMessage({ type: 'error', text: 'Network error, please try again.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full md:w-[75%] overflow-y-auto max-h-[90vh] p-6 sm:p-8 animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Manager</h3>

                {message && (
                    <div
                        className={`p-3 rounded mb-4 text-white font-medium ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Name', key: 'name', type: 'text' },
                        { label: 'Phone Number', key: 'phoneNumber', type: 'text' },
                        { label: 'Email', key: 'email', type: 'email' },
                        { label: 'Username', key: 'username', type: 'text' },
                        { label: 'Password', key: 'password', type: 'password', placeholder: 'Leave blank to keep current' },
                        { label: 'Status', key: 'status', type: 'select', options: ['', 'ACTIVE', 'INACTIVE'] },
                        { label: 'Address', key: 'address', type: 'text' },
                        { label: 'City', key: 'city', type: 'text' },
                        { label: 'Pincode', key: 'pincode', type: 'text' },
                    ].map(field => (
                        <div key={field.key} className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    value={form[field.key as keyof typeof form]}
                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                >
                                    {field.options?.map(option => (
                                        <option key={option} value={option}>
                                            {option === '' ? 'Select status' : option}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder || ''}
                                    className="mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    value={form[field.key as keyof typeof form]}
                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        className={`px-5 py-2 cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 rounded-lg text-white font-medium ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

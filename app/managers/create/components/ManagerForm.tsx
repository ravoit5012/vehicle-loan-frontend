'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';
import ManagerBasicInfo from './ManagerBasicInfo';
import ManagerAuthInfo from './ManagerAuthInfo';
import ManagerAddressInfo from './ManagerAddressInfo';
import FormActions from './FormActions';
import { useEffect } from 'react';

export default function ManagerForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    managerCode: '',
    name: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    address: '',
    city: '',
    pincode: '',
  });


  useEffect(() => {
    const code =
      form.name && form.phoneNumber
        ? `MGR-${form.name.substring(0, 4).toUpperCase()}-${form.phoneNumber.substring(3, 8)}`
        : '';
    setForm(prev => ({ ...prev, managerCode: code }));
  }, [form.name, form.phoneNumber]);
  
  function updateField(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.CREATE_MANAGER, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message.message || 'Failed to create manager');
      }

      alert('Manager created successfully');
      setForm({
        managerCode: '',
        name: '',
        phoneNumber: '',
        email: '',
        username: '',
        password: '',
        address: '',
        city: '',
        pincode: '',
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl p-8 md:p-12 space-y-8 transition-all duration-300">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Create Manager
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Fill in the details to add a new manager
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          <ManagerBasicInfo form={form} update={updateField} />
          <ManagerAuthInfo form={form} update={updateField} />
          <ManagerAddressInfo form={form} update={updateField} />
        </div>

        <div className="flex justify-end">
          <FormActions loading={loading} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

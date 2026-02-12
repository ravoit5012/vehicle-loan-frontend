'use client';

import { API_ENDPOINTS } from '@/app/config/config';
import Loading from '@/app/components/Loading';
import { useState } from 'react';

export default function SubmitFieldVerification({
  loanId,
  photos,
  location,
}: {
  loanId: string;
  photos: File[];
  location: any;
}) {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (photos.length !== 6) return alert('Capture exactly 6 photos');
    if (!location) return alert('Location missing');

    const formData = new FormData();
    photos.forEach(p => formData.append('files', p));
    formData.append('latitude', location.lat.toString());
    formData.append('longitude', location.lng.toString());

    try {
      setLoading(true);
      const res = await fetch(`${API_ENDPOINTS.FIELD_VERIFICATION}/${loanId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Submission failed');

      alert('Field verification completed');
      window.location.href = '/loans/pending';
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading visible={loading} />
      <button
        onClick={submit}
        className="w-full bg-green-600 text-white py-3 rounded-lg text-lg"
      >
        Submit Field Verification
      </button>
    </>
  );
}

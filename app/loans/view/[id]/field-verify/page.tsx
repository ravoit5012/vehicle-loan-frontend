'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/app/config/config';

import CameraCapture from './CameraCapture';
import PhotoPreviewGrid from './PhotoPreviewGrid';
import LocationStatus from './LocationStatus';
import SubmitFieldVerification from './SubmitFieldVerification';
import Loading from '@/app/components/Loading';

export default function FieldVerifyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [photos, setPhotos] = useState<File[]>([]);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);

  // =========================
  // Fetch loan & validate status
  // =========================
  // useEffect(() => {
  //   if (!id) return;

  //   (async () => {
  //     try {
  //       const res = await fetch(
  //         `${API_ENDPOINTS.GET_LOAN_APPLICATION_BY_ID}/${id}`,
  //         { credentials: 'include' }
  //       );

  //       const data = await res.json();
  //       setLoan(data);
  //       setLoading(false);

  //       // ❌ If contract not signed → redirect
  //       if (data.status !== 'CONTRACT_SIGNED') {
  //         const timer = setInterval(() => {
  //           setCountdown(prev => {
  //             if (prev === 1) {
  //               clearInterval(timer);
  //               router.push(`/loans/view/${id}`);
  //             }
  //             return prev - 1;
  //           });
  //         }, 1000);
  //       }
  //     } catch (err) {
  //       setLoading(false);
  //       alert('Failed to load loan details');
  //       router.push('/loans');
  //     }
  //   })();
  // }, [id, router]);
  useEffect(() => {
    if (!id) return;

    let timer: NodeJS.Timeout;

    (async () => {
      try {
        const res = await fetch(
          `${API_ENDPOINTS.GET_LOAN_APPLICATION_BY_ID}/${id}`,
          { credentials: 'include' }
        );
        if (!res.ok) {
          throw new Error('Failed request');
        }

        const data = await res.json();
        setLoan(data);
        setLoading(false);

        if (data.status !== 'CONTRACT_SIGNED') {
          timer = setInterval(() => {
            setCountdown(prev => {
              if (prev === 1) {
                clearInterval(timer);
                router.push(`/loans/view/${id}`);
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (err) {
        setLoading(false);
        router.push('/loans');
      }
    })();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [id, router]);

  // =========================
  // WARNING STATE
  // =========================
  if (loading) return <Loading visible={true} />;
  if (!loan) return null;
  if (loan.status !== 'CONTRACT_SIGNED') {
    return (<>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            ⚠️ Field Verification Not Allowed
          </h2>

          <p className="text-sm text-yellow-700 mb-4">
            Please sign the contract before completing field verification.
          </p>

          <div className="text-lg font-bold text-yellow-900">
            Redirecting in {countdown}…
          </div>

          <button
            onClick={() => router.push(`/loans/view/${id}`)}
            className="mt-4 inline-block bg-yellow-600 text-white px-5 py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            Go to Loan Details Now
          </button>
        </div>
      </div>
    </>
    );
  }

  // =========================
  // MAIN FIELD VERIFICATION UI
  // =========================
  if (loading) return <Loading visible={true} />
  return (<>
    <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8 pt-4 pb-12">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
        <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center transform -rotate-3 transition duration-300">
                <span className="text-3xl text-white drop-shadow-md">📍</span>
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-900 tracking-tight">
                    Field Verification Control
                </h1>
                <p className="text-slate-500 font-medium mt-1 text-sm tracking-wide">
                    Capture secure GPS metadata and environmental telemetry for Loan ID: <span className="font-bold text-indigo-600">{id}</span>
                </p>
            </div>
        </div>
      </div>

      {/* Wrap sub-components into single pane */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-12 space-y-8 transition-shadow">
        {/* Location */}
        <LocationStatus
            location={location}
            setLocation={setLocation}
        />

        {/* Camera */}
        <CameraCapture
            photos={photos}
            setPhotos={setPhotos}
        />

        {/* Preview */}
        <PhotoPreviewGrid
            photos={photos}
            onRemove={index =>
            setPhotos(prev =>
                prev.filter((_, i) => i !== index)
            )
            }
        />

        {/* Submit */}
        <div className="pt-6 mt-6 border-t border-slate-200/50">
            <SubmitFieldVerification
                loanId={id as string}
                photos={photos}
                location={location}
            />
        </div>
      </div>
    </div></>
  );
}

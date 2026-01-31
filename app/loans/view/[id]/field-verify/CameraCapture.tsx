'use client';

import { useEffect, useRef } from 'react';

export default function CameraCapture({
  photos,
  setPhotos,
}: {
  photos: File[];
  setPhotos: (files: File[]) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
  }, []);

  const capture = () => {
    if (photos.length >= 6) return alert('Only 6 photos allowed');

    const canvas = canvasRef.current!;
    const video = videoRef.current!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `house_${photos.length + 1}.jpg`, {
        type: 'image/jpeg',
      });
      setPhotos([...photos, file]);
    }, 'image/jpeg');
  };

  return (
    <div className="card">
      <h2 className="section-title mb-2">Capture House Photos</h2>

      <video ref={videoRef} autoPlay playsInline className="rounded w-full h-64 object-cover" />

      <button
        onClick={capture}
        disabled={photos.length >= 6}
        className="mt-3 bg-blue-500 cursor-pointer text-white px-4 py-2 rounded"
      >
        Capture Photo ({photos.length}/6)
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

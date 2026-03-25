"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Crop as CropIcon, Check } from "lucide-react";

/* ===== Helper: extract cropped blob from canvas ===== */
function getCroppedBlob(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      "image/png",
      1
    );
  });
}

/* ===== Types ===== */
interface CropModalProps {
  /** Data URL of the selected image */
  imageSrc: string;
  /** Label shown in the modal header */
  title?: string;
  /** Fixed aspect ratio (e.g. 1 for square). Omit or pass undefined for free crop. */
  aspect?: number;
  /** Called with the cropped File when user confirms */
  onCropDone: (croppedFile: File) => void;
  /** Called when user cancels */
  onCancel: () => void;
}

export default function CropModal({
  imageSrc,
  title = "Crop Image",
  aspect,
  onCropDone,
  onCancel,
}: CropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      imgRef.current = e.currentTarget;
    },
    []
  );

  const handleConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop);
      const file = new File([blob], "cropped.png", { type: "image/png" });
      onCropDone(file);
    } catch {
      onCancel();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <CropIcon size={18} className="text-blue-600" />
            {title}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Crop area */}
        <div className="p-4 flex justify-center bg-gray-100 max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              style={{ maxHeight: "50vh", maxWidth: "100%" }}
            />
          </ReactCrop>
        </div>

        {/* Hint */}
        <div className="px-6 py-2">
          <p className="text-xs text-gray-500">
            Drag the edges or corners to adjust the crop area freely.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-3 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing || !completedCrop}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg
              hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200 text-sm cursor-pointer"
          >
            {processing ? (
              "Processing..."
            ) : (
              <>
                <Check size={16} />
                Crop & Select
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Resizes/re-encodes an image File client-side before upload so a multi-document
// submission (KYC docs + security cheques) doesn't ship raw multi-MB camera
// photos over the wire. Always falls back to the original file on any failure —
// these are legal documents, so we never want a compression bug to silently
// drop or corrupt one.

type BitmapSource = {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  cleanup: () => void;
};

async function loadBitmapSource(file: File): Promise<BitmapSource> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
        cleanup: () => bitmap.close(),
      };
    } catch {
      // fall through to the <img> based loader below
    }
  }

  const objectUrl = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = objectUrl;
  });
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
    draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h),
    cleanup: () => URL.revokeObjectURL(objectUrl),
  };
}

export interface CompressImageOptions {
  /** Longest edge, in pixels, to downscale to. Default 1920 — comfortably legible for KYC review. */
  maxDimension?: number;
  /** JPEG quality 0–1. Default 0.82. */
  quality?: number;
  /** Skip files already smaller than this (bytes) — not worth re-encoding. Default 400KB. */
  skipBelowBytes?: number;
}

export async function compressImage(file: File, options: CompressImageOptions = {}): Promise<File> {
  const { maxDimension = 1920, quality = 0.82, skipBelowBytes = 400 * 1024 } = options;

  if (!file.type.startsWith("image/")) return file;
  if (file.size < skipBelowBytes) return file;

  try {
    const src = await loadBitmapSource(file);
    try {
      const scale = Math.min(1, maxDimension / Math.max(src.width, src.height));
      const targetWidth = Math.max(1, Math.round(src.width * scale));
      const targetHeight = Math.max(1, Math.round(src.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;

      src.draw(ctx, targetWidth, targetHeight);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );
      if (!blob || blob.size >= file.size) return file;

      const baseName = file.name.replace(/\.[^./\\]+$/, "");
      return new File([blob], `${baseName}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
    } finally {
      src.cleanup();
    }
  } catch {
    return file;
  }
}

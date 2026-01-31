'use client';

export default function PhotoPreviewGrid({
  photos,
  onRemove,
}: {
  photos: File[];
  onRemove?: (index: number) => void;
}) {
  if (photos.length === 0) {
    return (
      <div className="card text-gray-500 text-sm">
        No photos captured yet.
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title mb-3">
        Captured Photos ({photos.length}/6)
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((file, index) => {
          const url = URL.createObjectURL(file);

          return (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden"
            >
              <img
                src={url}
                alt={`House ${index + 1}`}
                className="h-40 w-full object-cover"
              />

              {onRemove && (
                <button
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 cursor-pointer bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                Photo {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

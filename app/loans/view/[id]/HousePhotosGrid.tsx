export default function HousePhotosGrid({
  photos,
}: {
  photos: any[];
}) {

  return (
    <div className="card">
      <h2 className="section-title mb-4">
        Field Verification Photos
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((p, i) => (
          <div key={i} className="relative">
            <img
              src={p.url}
              className="rounded-lg object-cover h-40 w-full"
            />
            <div className="text-xs mt-1 text-gray-500">
              📍 {p.latitude}, {p.longitude}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

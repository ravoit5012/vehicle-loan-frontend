'use client';

export default function LocationStatus({
  location,
  setLocation,
}: {
  location: any;
  setLocation: (loc: any) => void;
}) {
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => alert('Location permission required')
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Your Location</h2>

      {location ? (
        <div className="text-center">
          <p className="text-green-600 text-lg font-medium">
            📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
          <div className="mt-4">
            <button
              onClick={getLocation}
              className="px-6 py-3 bg-yellow-500 cursor-pointer text-white rounded-full shadow-md hover:bg-yellow-600 transition duration-300 ease-in-out focus:outline-none"
            >
              Recapture Location
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <button
            onClick={getLocation}
            className="px-6 py-3 bg-blue-500 cursor-pointer text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Capture Location
          </button>
        </div>
      )}
    </div>
  );
}

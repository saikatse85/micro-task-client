export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

        {/* Inner pulse dot */}
        <div className="absolute w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
      </div>

      {/* Text */}
      <h1 className="mt-6 text-xl font-semibold text-gray-700 tracking-wide">
        Loading, please wait...
      </h1>

      <p className="text-sm text-gray-500 mt-2">
        Preparing your dashboard experience
      </p>

      {/* Skeleton cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl px-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 rounded-xl bg-white shadow-md animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function NotFound() {
  const router = useRouter();

  const goHome = () => {
    Swal.fire({
      icon: "info",
      title: "Redirecting...",
      text: "Taking you back to home page",
      timer: 1200,
      showConfirmButton: false,
    });

    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-black dark:text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black text-emerald-500">404</h1>

        <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>

        <p className="text-slate-500 mt-2">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={goHome}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
          >
            Go Home
          </button>

          <Link
            href="/dashboard"
            className="px-5 py-2 border border-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

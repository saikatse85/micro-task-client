"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { AuthContext } from "@/context/AuthProvider";

export default function AdminDashboardPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const role = user.role;
    if (role !== "admin") {
      Swal.fire({
        icon: "error",
        title: "Access denied",
        text: "Redirecting to your dashboard.",
        timer: 1600,
        showConfirmButton: false,
      });
      router.push(`/dashboard/${role}`);
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-8 shadow-lg">
        <h1 className="text-4xl font-black text-emerald-500">
          Admin Dashboard
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Manage users, tasks, and withdrawal requests from the admin control
          panel.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow">
          <h2 className="text-xl font-bold">Manage Users</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            View, promote, and manage registered users on the platform.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow">
          <h2 className="text-xl font-bold">Manage Tasks</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Review task activity, manage submissions, and oversee marketplace
            operations.
          </p>
        </div>
      </div>
    </div>
  );
}

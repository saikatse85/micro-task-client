"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { AuthContext } from "@/context/AuthProvider";

export default function BuyerDashboardPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const role = user.role;
    if (role !== "buyer") {
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

  if (loading || !user || user.role !== "buyer") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading buyer dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-8 shadow-lg">
        <h1 className="text-4xl font-black text-emerald-500">
          Buyer Dashboard
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Manage your tasks, monitor spending, and track worker activity.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow">
          <h2 className="text-xl font-bold">Create Tasks</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Publish new tasks and assign work to qualified workers.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow">
          <h2 className="text-xl font-bold">Purchase Coins</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Add coins to your account and manage payment history.
          </p>
        </div>
      </div>
    </div>
  );
}

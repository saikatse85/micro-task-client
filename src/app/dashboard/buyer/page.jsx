"use client";

import { AuthContext } from "@/context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function BuyerDashboardPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [stats, setStats] = useState({
    coins: 0,
    totalTasks: 0,
    activeTasks: 0,
    totalSpent: 0,
    pendingWorkers: 0,
    completedSubmissions: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "buyer") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Redirecting to your dashboard...",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push(`/dashboard/${user.role}`);
      return;
    }

    loadBuyerStats();
  }, [user, loading]);

  const loadBuyerStats = async () => {
    try {
      setStatsLoading(true);

      const res = await fetch(
        `/api/buyer-stats?email=${encodeURIComponent(user.email)}`,
      );

      const data = await res.json();

      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-black">Welcome Back, {user?.name}</h1>

        <p className="mt-2 text-emerald-100">
          Manage your tasks, workers, and spending from one place.
        </p>

        <div className="mt-6">
          <span className="text-sm uppercase tracking-wider">
            Available Coins
          </span>

          <h2 className="text-5xl font-black mt-2">{stats.coins}</h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border">
          <p className="text-gray-500">Total Tasks</p>
          <h2 className="text-4xl font-black mt-2">{stats.totalTasks}</h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border">
          <p className="text-gray-500">Active Tasks</p>
          <h2 className="text-4xl font-black mt-2 text-emerald-500">
            {stats.activeTasks}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border">
          <p className="text-gray-500">Coins Spent</p>
          <h2 className="text-4xl font-black mt-2 text-red-500">
            {stats.totalSpent}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border">
          <p className="text-gray-500">Pending Workers</p>
          <h2 className="text-4xl font-black mt-2 text-orange-500">
            {stats.pendingWorkers}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border">
          <p className="text-gray-500">Completed Submissions</p>
          <h2 className="text-4xl font-black mt-2 text-blue-500">
            {stats.completedSubmissions}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border">
          <p className="text-gray-500">Success Rate</p>
          <h2 className="text-4xl font-black mt-2 text-purple-500">
            {stats.totalTasks > 0
              ? Math.round(
                  (stats.completedSubmissions /
                    (stats.completedSubmissions + stats.pendingWorkers)) *
                    100,
                ) || 0
              : 0}
            %
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div
          onClick={() => router.push("/dashboard/buyer/create-task")}
          className="cursor-pointer rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-lg hover:shadow-2xl transition"
        >
          <h2 className="text-2xl font-bold text-emerald-500">Create Task</h2>

          <p className="mt-2 text-gray-500">
            Publish a new task and hire workers.
          </p>
        </div>

        <div
          onClick={() => router.push("/dashboard/purchase-coins")}
          className="cursor-pointer rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-lg hover:shadow-2xl transition"
        >
          <h2 className="text-2xl font-bold text-blue-500">Purchase Coins</h2>

          <p className="mt-2 text-gray-500">
            Add more coins to create additional tasks.
          </p>
        </div>
      </div>
    </div>
  );
}

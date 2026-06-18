"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { AuthContext } from "@/context/AuthProvider";

export default function AdminDashboardPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
    pendingWithdrawals: 0,
    recentActivities: [],
  });

  const [statsLoading, setStatsLoading] = useState(true);

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

  useEffect(() => {
    const fetchAdminStats = async () => {
      if (!user?.email || user?.role !== "admin") return;

      try {
        setStatsLoading(true);

        const query = new URLSearchParams({
          email: user.email,
          role: "admin",
        }).toString();

        const res = await fetch(`/api/dashboard?${query}`);

        if (!res.ok) {
          throw new Error("Failed to fetch admin stats");
        }

        const data = await res.json();

        setStats({
          totalWorkers: data.totalWorkers || data.workers || 0,
          totalBuyers: data.totalBuyers || data.buyers || 0,
          totalCoins: data.totalCoins || 0,
          totalPayments: data.totalPayments || data.payments || 0,
          pendingWithdrawals: data.pendingWithdrawals || 0,
          recentActivities: data.recentActivities || data.activities || [],
        });
      } catch (error) {
        console.log("Admin dashboard error:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAdminStats();
  }, [user]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-black">
          Welcome Back, {user.name} 👋
        </h1>

        <p className="mt-3 text-white/90">
          Monitor users, payments, tasks, and platform activity from one place.
        </p>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="text-slate-500">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          <StatCard title="Total Workers" value={stats.totalWorkers} />

          <StatCard title="Total Buyers" value={stats.totalBuyers} />

          <StatCard title="Total Coins" value={stats.totalCoins} />

          <StatCard title="Total Payments" value={`$${stats.totalPayments}`} />

          <StatCard
            title="Pending Withdrawals"
            value={stats.pendingWithdrawals}
          />
        </div>
      )}

      {/* Management Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow">
          <h2 className="text-xl font-bold">Manage Users</h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            View all users, update roles, and remove unwanted accounts.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow">
          <h2 className="text-xl font-bold">Manage Tasks</h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Review task activity and oversee platform operations.
          </p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow">
        <h2 className="text-xl font-bold mb-5">Recent Activities</h2>

        {stats.recentActivities.length === 0 ? (
          <p className="text-slate-500">No recent activities found.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentActivities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="border-b border-slate-200 dark:border-slate-700 pb-3"
              >
                {typeof activity === "string" ? (
                  <p>{activity}</p>
                ) : (
                  <>
                    <p className="font-medium">{activity.title}</p>

                    {activity.buyer && (
                      <p className="text-sm text-slate-500">{activity.buyer}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 p-6">
      <h3 className="text-emerald-500 font-bold">{title}</h3>

      <p className="text-4xl font-black mt-3">{value}</p>
    </div>
  );
}

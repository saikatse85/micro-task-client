"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";

export default function WorkerStatusPage() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    coins: 0,
    submitted: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    availableTasks: 0,
    earnings: 0,
    recentSubmissions: [],
    notifications: [],
  });

  useEffect(() => {
    const fetchWorkerStats = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const query = new URLSearchParams({
          email: user.email,
          role: user.role,
        }).toString();

        const res = await fetch(`/api/dashboard?${query}`);

        if (!res.ok) {
          throw new Error("Failed to fetch worker stats");
        }

        const data = await res.json();

        setStats({
          coins: data.coins || 0,
          submitted: data.totalSubmissions || 0,
          pending: data.pendingSubmissions || 0,
          approved: data.approvedSubmissions || 0,
          rejected: data.rejectedSubmissions || 0,
          availableTasks: data.availableTasks || 0,
          earnings: data.earnings || 0,
          recentSubmissions: data.recentSubmissions || [],
          notifications: data.notifications || [],
        });
      } catch (error) {
        console.log("Error fetching worker stats:", error);

        setStats({
          coins: 0,
          submitted: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          availableTasks: 0,
          earnings: 0,
          recentSubmissions: [],
          notifications: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerStats();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-black">
          Welcome Back, {user?.displayName || user?.name || "Worker"} 👋
        </h1>

        <p className="mt-3 text-white/90">
          Track your submissions, earnings, and task activity.
        </p>

        <div className="mt-5">
          <p className="text-sm text-white/80">Current Coin Balance</p>

          <h2 className="text-5xl font-black mt-2">{stats.coins} Coins</h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard title="Coin Balance" value={stats.coins} />
        <StatCard title="Total Submissions" value={stats.submitted} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Approved" value={stats.approved} />
        <StatCard title="Rejected" value={stats.rejected} />
        <StatCard title="Available Tasks" value={stats.availableTasks} />

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 md:col-span-2 xl:col-span-3">
          <h3 className="text-emerald-500 font-bold">Total Earnings</h3>

          <p className="text-4xl font-black mt-3">{stats.earnings} Coins</p>
        </div>
      </div>

      {/* Withdrawal Progress */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Withdrawal Progress</h3>

          <span className="font-semibold">{stats.coins}/200 Coins</span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((stats.coins / 200) * 100, 100)}%`,
            }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Minimum 200 coins required to request withdrawal.
        </p>
      </div>

      {/* Recent Submissions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10">
        <h2 className="text-xl font-bold mb-5">Recent Submissions</h2>

        {stats.recentSubmissions.length === 0 ? (
          <p className="text-slate-500">No recent submissions found.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentSubmissions.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3"
              >
                <span className="font-medium">{item.task_title}</span>

                <span
                  className={`capitalize font-semibold ${
                    item.status === "approved"
                      ? "text-green-500"
                      : item.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10">
        <h2 className="text-xl font-bold mb-5">Recent Notifications</h2>

        {stats.notifications.length === 0 ? (
          <p className="text-slate-500">No notifications found.</p>
        ) : (
          <div className="space-y-4">
            {stats.notifications.map((item) => (
              <div
                key={item._id}
                className="border-b border-slate-200 dark:border-slate-700 pb-4"
              >
                <p>{item.message}</p>
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
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10">
      <h3 className="text-emerald-500 font-bold">{title}</h3>

      <p className="text-4xl font-black mt-3">{value}</p>
    </div>
  );
}

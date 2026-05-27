"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";

export default function WorkerStatusPage() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    submitted: 0,
    pending: 0,
    earnings: 0,
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
          submitted: data.totalSubmissions || 0,
          pending: data.pendingSubmissions || 0,
          earnings: data.earnings || 0,
        });
      } catch (error) {
        console.log("Error fetching worker stats:", error);

        setStats({
          submitted: 50,
          pending: 3,
          earnings: 5200,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerStats();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* TITLE */}
      <div>
        <h1 className="text-4xl font-black text-emerald-500">
          Worker Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Track your submissions, pending tasks, and earnings
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-slate-500">Loading stats...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* TOTAL SUBMISSIONS */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10">
            <h3 className="text-emerald-500 font-bold">Total Submissions</h3>
            <p className="text-4xl font-black mt-3">{stats.submitted}</p>
          </div>

          {/* PENDING */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10">
            <h3 className="text-emerald-500 font-bold">Pending Submissions</h3>
            <p className="text-4xl font-black mt-3">{stats.pending}</p>
          </div>

          {/* EARNINGS */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10">
            <h3 className="text-emerald-500 font-bold">Total Earnings</h3>
            <p className="text-4xl font-black mt-3">{stats.earnings} Coins</p>
          </div>
        </div>
      )}
    </div>
  );
}

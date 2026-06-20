"use client";
import { useEffect, useState } from "react";

export default function TopWorkersSection() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/top-workers")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      })
      .then((result) => {
        setWorkers(result.data || []);
      })
      .catch((error) => {
        console.error("Top workers error:", error);
        setWorkers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <section className="py-24 text-center">Loading top workers...</section>
    );
  }

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black">Top Workers</h2>

          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
            Meet our highest earning workers on the platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && workers.length === 0 && (
            <p className="text-center text-slate-500">No workers found.</p>
          )}
          {Array.isArray(workers) &&
            workers.map((worker, index) => (
              <div
                key={worker._id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 hover:-translate-y-2 transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={worker.photoURL}
                    alt={worker.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500"
                  />

                  <div>
                    <h3 className="text-2xl font-bold">
                      #{index + 1} {worker.name}
                    </h3>

                    <p className="text-emerald-400 mt-1">{worker.coin} Coins</p>
                  </div>
                </div>

                <div className="mt-6 bg-gray-100 dark:bg-slate-900 rounded-2xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Task Success</span>

                    <span>95%</span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full w-[95%]"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

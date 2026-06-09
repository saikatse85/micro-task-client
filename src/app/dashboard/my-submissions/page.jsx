"use client";

import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";

export default function MySubmissions() {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ CORRECT API
        const res = await fetch(`/api/submissions?worker_email=${user.email}`);

        if (!res.ok) {
          throw new Error("API Error");
        }

        const result = await res.json();

        // ✅ API RETURNS { success, data }
        setData(Array.isArray(result?.data) ? result.data : []);
      } catch (error) {
        console.log("Fetch error:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-emerald-500">My Submissions</h1>

      {/* LOADING */}
      {loading && <p className="mt-5 text-gray-500">Loading submissions...</p>}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <p className="mt-5 text-gray-500">No submissions found</p>
      )}

      {/* LIST */}
      <div className="mt-6 space-y-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="
              p-4 rounded-xl
              border border-gray-200
              dark:border-white/10
            "
          >
            {/* TASK TITLE */}
            <h2 className="font-bold text-lg">{item.task_title}</h2>

            {/* STATUS */}
            <p className="mt-2">
              Status:
              <span
                className={`ml-2 font-semibold
                  ${
                    item.status === "approved"
                      ? "text-green-500"
                      : item.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }
                `}
              >
                {item.status}
              </span>
            </p>

            {/* DETAILS */}
            <p className="text-sm text-gray-500 mt-2">
              {item.submission_details}
            </p>

            {item.proof_url || item.proof_image ? (
              <div className="mt-3">
                <p className="text-sm font-semibold text-emerald-600">
                  Proof image
                </p>
                <Image
                  src={item.proof_url || item.proof_image}
                  alt="Submission proof"
                  width={128}
                  height={128}
                  className="mt-2 w-32 h-32 rounded-xl object-cover border border-gray-200 dark:border-white/10"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "@/context/AuthProvider";

export default function TaskReviewPage() {
  const { user } = useContext(AuthContext);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // =========================
  // FETCH SUBMISSIONS (BUYER ONLY)
  // =========================
  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/submissions?buyer_email=${user?.email}`);

      const data = await res.json();

      setSubmissions(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to load submissions", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.email) {
      fetchSubmissions();
    }
  }, [user]);

  // =========================
  // APPROVE TASK
  // =========================
  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve this submission?",
      text: "Worker will receive coins",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
    });

    if (!confirm.isConfirmed) return;

    try {
      setActionLoading(true);

      const res = await fetch("/api/submissions/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Approved!", "Coins sent to worker", "success");
        fetchSubmissions();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // REJECT TASK
  // =========================
  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject this submission?",
      text: "Worker will be notified",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
    });

    if (!confirm.isConfirmed) return;

    try {
      setActionLoading(true);

      const res = await fetch("/api/submissions/reject", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Rejected!", "Worker notified", "success");
        fetchSubmissions();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="p-6 text-center font-bold">Loading submissions...</div>
    );
  }

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-black mb-6">Task Review Panel</h1>

      {/* EMPTY STATE */}
      {submissions.length === 0 && (
        <div className="text-center p-10 text-gray-500">
          No submissions found
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="p-3 text-left">Worker</th>
              <th className="p-3 text-left">Task</th>
              <th className="p-3 text-left">Details</th>
              <th className="p-3 text-left">Proof</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((item) => (
              <tr
                key={item._id}
                className="border-t border-gray-200 dark:border-white/10"
              >
                {/* WORKER */}
                <td className="p-3">
                  <p className="font-semibold">{item.worker_name}</p>
                  <p className="text-sm text-gray-500">{item.worker_email}</p>
                </td>

                {/* TASK */}
                <td className="p-3 font-medium">{item.task_title}</td>

                {/* DETAILS */}
                <td className="p-3 text-sm text-gray-600 dark:text-gray-300">
                  {item.submission_details}
                </td>

                {/* PROOF */}
                <td className="p-3">
                  {item.proof_url ? (
                    <a
                      href={item.proof_url}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      View Proof
                    </a>
                  ) : (
                    "No proof"
                  )}
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-bold
                      ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="p-3 text-center flex space-x-2">
                  <button
                    onClick={() => handleApprove(item._id)}
                    disabled={item.status !== "pending" || actionLoading}
                    className="px-3 py-1 rounded-lg bg-green-500 text-white disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(item._id)}
                    disabled={item.status !== "pending" || actionLoading}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white disabled:opacity-50"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

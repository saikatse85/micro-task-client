"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function WithdrawalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // FETCH WITHDRAWALS
  // ======================
  const fetchWithdrawals = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/withdrawals");
      const result = await res.json();

      setData(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      console.log(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // ======================
  // UPDATE LOCAL STATE
  // ======================
  const updateLocalStatus = (id, status) => {
    setData((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status } : item)),
    );
  };

  // ======================
  // APPROVE
  // ======================
  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve withdrawal?",
      icon: "question",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch("/api/admin/withdrawals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (result.success) {
      Swal.fire("Success", result.message, "success");

      // update UI instantly
      updateLocalStatus(id, "approved");
    }
  };

  // ======================
  // REJECT
  // ======================
  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject withdrawal?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch("/api/admin/withdrawals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (result.success) {
      Swal.fire("Rejected", result.message, "success");

      // update UI instantly
      updateLocalStatus(id, "rejected");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>

      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-gray-500 font-semibold">
            No withdrawal request
          </p>
        ) : (
          data.map((w) => (
            <div
              key={w._id}
              className="p-4 border rounded-xl flex justify-between items-center"
            >
              {/* INFO */}
              <div>
                <p className="font-bold">{w.worker_email}</p>
                <p>Coins: {w.withdrawal_coin}</p>
                <p>Status: {w.status}</p>
              </div>

              {/* ACTIONS */}
              <div className="space-x-2">
                <button
                  onClick={() => handleApprove(w._id)}
                  disabled={w.status !== "pending"}
                  className={`px-3 py-1 rounded text-white ${
                    w.status === "pending"
                      ? "bg-green-500"
                      : "bg-green-300 cursor-not-allowed"
                  }`}
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(w._id)}
                  disabled={w.status !== "pending"}
                  className={`px-3 py-1 rounded text-white ${
                    w.status === "pending"
                      ? "bg-red-500"
                      : "bg-red-300 cursor-not-allowed"
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

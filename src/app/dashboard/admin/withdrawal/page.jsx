"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function WithdrawalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // APPROVE
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

    const data = await res.json();

    if (data.success) {
      Swal.fire("Success", data.message, "success");
      fetchWithdrawals();
    }
  };

  // REJECT
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

    const data = await res.json();

    if (data.success) {
      Swal.fire("Rejected", data.message, "success");
      fetchWithdrawals();
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
              className="p-4 border rounded-xl flex justify-between"
            >
              <div>
                <p className="font-bold">{w.worker_email}</p>
                <p>Coins: {w.withdrawal_coin}</p>
                <p>Status: {w.status}</p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleApprove(w._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(w._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
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

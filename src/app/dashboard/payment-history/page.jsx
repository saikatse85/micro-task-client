"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";
import Swal from "sweetalert2";

export default function PaymentHistoryPage() {
  const { user } = useContext(AuthContext);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH PAYMENTS
  // =========================
  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/payments?email=${encodeURIComponent(user.email)}`,
      );

      const data = await res.json();

      if (data.success) {
        setPayments(data.payments);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to load payments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchPayments();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 text-center font-bold">
        Loading payment history...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-black mb-6">Payment History</h1>

      {/* EMPTY STATE */}
      {payments.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No payment history found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
            <thead className="bg-emerald-500 text-white">
              <tr>
                <th className="p-3 text-left">Coins</th>
                <th className="p-3 text-left">Amount ($)</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-200 dark:border-white/10"
                >
                  <td className="p-3 font-bold text-emerald-500">
                    {item.coins}
                  </td>

                  <td className="p-3">${item.amount}</td>

                  <td className="p-3 text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

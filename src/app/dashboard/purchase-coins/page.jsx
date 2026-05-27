"use client";

import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "@/context/AuthProvider";

export default function PurchaseCoinsPage() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // COIN PACKAGES (from your doc)
  const packages = [
    { coins: 10, price: 1 },
    { coins: 150, price: 10 },
    { coins: 500, price: 20 },
    { coins: 1000, price: 35 },
  ];

  // =========================
  // HANDLE PURCHASE
  // =========================
  const handlePurchase = async (pkg) => {
    try {
      setLoading(true);

      // 1. Call backend API
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          coins: pkg.coins,
          amount: pkg.price,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Success!", `You purchased ${pkg.coins} coins`, "success");
      } else {
        Swal.fire("Error", data.message || "Payment failed", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-black mb-2">Purchase Coins</h1>
      <p className="text-gray-500 mb-6">Buy coins to create and manage tasks</p>

      {/* COIN PACKAGES */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-sm"
          >
            <h2 className="text-2xl font-black text-emerald-500">
              {pkg.coins} Coins
            </h2>

            <p className="mt-2 text-gray-500">
              Price: <span className="font-bold">${pkg.price}</span>
            </p>

            <button
              onClick={() => handlePurchase(pkg)}
              disabled={loading}
              className="
                mt-4 w-full py-2 rounded-xl
                bg-emerald-500 text-white font-bold
                hover:bg-emerald-600
                disabled:opacity-50
              "
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

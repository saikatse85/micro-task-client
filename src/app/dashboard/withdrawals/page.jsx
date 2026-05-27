"use client";

import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "@/context/AuthProvider";

export default function WithdrawPage() {
  const { user } = useContext(AuthContext);

  const [coins, setCoins] = useState(0);
  const [amount, setAmount] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);

      // USER COINS
      const userRes = await fetch(
        `/api/users/${encodeURIComponent(user?.email)}`,
      );
      const userData = await userRes.json();

      setCoins(userData?.coin || 0);

      // WITHDRAW HISTORY
      const res = await fetch(`/api/withdraw?email=${user?.email}`);
      const data = await res.json();

      setHistory(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchData();
  }, [user]);

  // =========================
  // REQUEST WITHDRAW
  // =========================
  const handleWithdraw = async () => {
    if (coins < 200) {
      return Swal.fire("Error", "Minimum 200 coins required", "error");
    }

    if (amount <= 0 || amount > coins) {
      return Swal.fire("Error", "Invalid amount", "error");
    }

    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        worker_email: user.email,
        withdrawal_coin: amount,
        amount_usd: (amount / 20).toFixed(2),
      }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("Success", "Withdraw request sent", "success");
      setAmount(0);
      fetchData();
    }
  };

  if (loading) {
    return <div className="p-6 text-center font-bold">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black">Withdraw Coins</h1>
        <p className="text-gray-500">20 coins = $1 | Minimum 200 coins</p>
      </div>

      {/* BALANCE CARD */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border">
        <h2 className="text-lg font-bold">Your Balance</h2>
        <p className="text-3xl font-black mt-2">{coins} Coins</p>
      </div>

      {/* WITHDRAW FORM */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border space-y-4">
        <h2 className="font-bold">Request Withdrawal</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter coins to withdraw"
          className="w-full p-3 border rounded-lg"
        />

        <p className="text-sm text-gray-500">
          You will receive: ${(amount / 20).toFixed(2)}
        </p>

        <button
          onClick={handleWithdraw}
          className="
            w-full py-3 rounded-lg
            bg-emerald-500 text-white font-bold
          "
        >
          Request Withdraw
        </button>
      </div>

      {/* HISTORY */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border">
        <h2 className="font-bold mb-4">Withdrawal History</h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No withdrawal history</p>
        ) : (
          <div className="space-y-3">
            {history.map((w) => (
              <div
                key={w._id}
                className="p-3 border rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-semibold">{w.withdrawal_coin} Coins</p>
                  <p className="text-sm text-gray-500">${w.amount_usd}</p>
                </div>

                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${
                      w.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : w.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

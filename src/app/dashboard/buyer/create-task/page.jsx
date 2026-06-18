"use client";

import { AuthContext } from "@/context/AuthProvider";
import { useContext, useState } from "react";
import Swal from "sweetalert2";

export default function CreateTaskPage() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [requiredWorkers, setRequiredWorkers] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);

  const totalCost = Number(requiredWorkers || 0) * Number(payableAmount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const form = e.target;

    const task = {
      task_title: form.task_title.value,
      task_detail: form.task_detail.value,
      required_workers: Number(form.required_workers.value),
      payable_amount: Number(form.payable_amount.value),
      total_cost: totalCost,
      buyer_name: user?.name,
      buyer_email: user?.email,
      deadline: form.deadline.value,
      status: "active",
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "warning",
          title: "Not Enough Coins",
          text:
            data.message ||
            "Please purchase more coins before creating a task.",
        });

        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Task created successfully. Cost: ${totalCost} coins`,
        confirmButtonText: "OK",
      });

      form.reset();
      setRequiredWorkers(0);
      setPayableAmount(0);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create task. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-black text-emerald-500 mb-6">
        Create New Task
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="task_title"
          placeholder="Task Title"
          className="w-full p-3 rounded-xl border"
          required
        />

        <textarea
          name="task_detail"
          placeholder="Task Detail"
          className="w-full p-3 rounded-xl border"
          required
        />

        <input
          name="required_workers"
          type="number"
          min="1"
          placeholder="Required Workers"
          className="w-full p-3 rounded-xl border"
          required
          onChange={(e) => setRequiredWorkers(e.target.value)}
        />

        <input
          name="payable_amount"
          type="number"
          min="1"
          placeholder="Payable Amount (Coins)"
          className="w-full p-3 rounded-xl border"
          required
          onChange={(e) => setPayableAmount(e.target.value)}
        />

        <input
          name="deadline"
          type="date"
          className="w-full p-3 rounded-xl border"
          required
        />

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <h3 className="font-bold text-lg">Total Cost: {totalCost} Coins</h3>

          <p className="text-sm text-gray-600 mt-1">
            {requiredWorkers || 0} Workers × {payableAmount || 0} Coins
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}

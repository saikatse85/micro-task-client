"use client";

import { useState } from "react";

export default function CreateTaskPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const form = e.target;

    const task = {
      task_title: form.task_title.value,
      task_detail: form.task_detail.value,
      required_workers: form.required_workers.value,
      payable_amount: form.payable_amount.value,
      buyer_name: form.buyer_name.value,
      deadline: form.deadline.value,
      buyer_email: form.buyer_email.value,
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

      alert("Task Created Successfully!");
      console.log(data);
      e.target.reset();
    } catch (error) {
      console.log(error);
      alert("Failed to create task");
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
          placeholder="Required Workers"
          className="w-full p-3 rounded-xl border"
          required
        />

        <input
          name="payable_amount"
          type="number"
          placeholder="Payable Amount"
          className="w-full p-3 rounded-xl border"
          required
        />

        <input
          name="buyer_name"
          placeholder="Buyer Name (e.g. Tech Store)"
          className="w-full p-3 rounded-xl border"
          required
        />

        <input
          name="deadline"
          placeholder="Deadline (e.g. 24h, 2 days)"
          className="w-full p-3 rounded-xl border"
          required
        />

        <input
          name="buyer_email"
          type="email"
          placeholder="Buyer Email"
          className="w-full p-3 rounded-xl border"
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}

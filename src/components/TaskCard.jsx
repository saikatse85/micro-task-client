"use client";

import SubmitTaskButton from "./SubmitTaskButton";

export default function TaskCard({ task, onSubmitClick }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition">
      <h2 className="text-xl font-bold text-emerald-500">{task.task_title}</h2>

      <p className="text-slate-500 mt-2">
        Buyer: <span className="font-semibold">{task.buyer_name}</span>
      </p>

      <p className="mt-3">
        💰 Payable:
        <span className="text-emerald-400 font-bold">
          {" "}
          {task.payable_amount} Coins
        </span>
      </p>

      <p className="mt-1 text-slate-400 text-sm">
        ⏳ Deadline: {task.deadline}
      </p>

      <div className="mt-5">
        <SubmitTaskButton task={task} onClick={onSubmitClick} />
      </div>
    </div>
  );
}

"use client";

export default function SubmitTaskButton({ task, onClick, className = "" }) {
  return (
    <button
      onClick={() => onClick(task)}
      className={`w-full bg-emerald-500 hover:bg-emerald-600 transition py-2 rounded-xl font-semibold ${className}`}
    >
      Submit Task
    </button>
  );
}

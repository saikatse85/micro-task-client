"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Container from "./Container";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/tasks");
      const data = await res.json();

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to load tasks", "error");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const availableTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.required_workers > 0)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleViewTask = (e, taskId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      e.preventDefault();

      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "To view task details you need to login first.",
      }).then(() => {
        router.push("/login");
      });

      return;
    }

    router.push(`/dashboard/tasks/${taskId}`);
  };
  return (
    <div className="min-h-screen mt-16 bg-slate-100 dark:bg-slate-950 text-black dark:text-white transition-colors">
      <Container>
        {/* HEADER */}
        <div className="pt-10 pb-6">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm border border-emerald-500/30">
            Available Micro Tasks
          </span>

          <h1 className="text-3xl md:text-5xl font-black mt-4">
            Complete Tasks &{" "}
            <span className="text-emerald-400">Earn Coins</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl">
            Choose from available micro-tasks, complete them, and start earning
            instantly.
          </p>
        </div>

        {/* EMPTY */}
        {availableTasks.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No tasks available right now.
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {availableTasks.map((task) => (
            <div
              key={task._id}
              className="
                group relative overflow-hidden
                bg-white/70 dark:bg-white/5
                backdrop-blur-xl
                border border-slate-200 dark:border-white/10
                rounded-3xl p-6
                shadow-lg hover:shadow-2xl
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              {/* TOP BADGE */}
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active Task
                </span>

                <span className="text-xs text-slate-400">
                  {task.status || "active"}
                </span>
              </div>

              {/* TITLE */}
              <h2 className="text-xl font-bold group-hover:text-emerald-400 transition">
                {task.task_title}
              </h2>

              {/* BUYER */}
              <p className="text-sm text-slate-500 mt-1 break-all">
                {task.buyer_email}
              </p>

              {/* DESCRIPTION */}
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 line-clamp-3">
                {task.task_detail?.slice(0, 120)}...
              </p>

              {/* INFO BOX */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl">
                  <p className="text-xs text-slate-400">Reward</p>
                  <p className="text-emerald-400 font-bold">
                    ${task.payable_amount}
                  </p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl">
                  <p className="text-xs text-slate-400">Workers</p>
                  <p className="font-bold">{task.required_workers}</p>
                </div>
              </div>

              {/* BUTTON */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  ID: {task._id.slice(-5)}
                </div>

                <button
                  onClick={(e) => handleViewTask(e, task._id)}
                  className="
    px-5 py-2 rounded-2xl
    bg-emerald-500 hover:bg-emerald-600
    text-white text-sm font-semibold
    transition
  "
                >
                  View Task
                </button>
              </div>

              {/* GLOW EFFECT */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-emerald-500/5 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

"use client";

import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "@/context/AuthProvider";

export default function MyTasksPage() {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH TASKS
  // =========================
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/tasks/my?email=${user?.email}`);

      const data = await res.json();

      // ✅ SAFE ARRAY
      setTasks(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.log(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
    }
  }, [user]);

  // =========================
  // DELETE TASK
  // =========================
  const handleDelete = async (taskId) => {
    const confirm = await Swal.fire({
      title: "Delete Task?",
      text: "Coins will be refunded",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/tasks/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          buyer_email: user.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Deleted!", data.message, "success");

        fetchTasks();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.log(error);

      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-6 text-center font-bold">Loading tasks...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      {/* EMPTY */}
      {tasks.length === 0 && <p className="text-gray-500">No tasks found</p>}

      {/* TASK LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="
              p-5 rounded-xl
              border border-gray-200
              dark:border-white/10
              bg-white dark:bg-slate-900
            "
          >
            <h2 className="text-xl font-bold">{task.task_title}</h2>

            <p className="text-sm mt-2">
              Remaining Workers: {task.required_workers}
            </p>

            <p className="mt-1">Pay: {task.payable_amount} coins</p>

            <p className="mt-2 font-semibold">Status: {task.status}</p>

            <button
              onClick={() => handleDelete(task._id)}
              className="
                mt-4 px-4 py-2
                bg-red-500 text-white
                rounded-lg
              "
            >
              Delete Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

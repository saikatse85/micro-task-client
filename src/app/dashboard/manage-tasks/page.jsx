"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ManageTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ALL TASKS
  // =========================
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/tasks");
      const data = await res.json();

      setTasks(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      console.log(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // DELETE TASK
  // =========================
  const handleDelete = async (taskId) => {
    const confirm = await Swal.fire({
      title: "Delete Task?",
      text: "This will remove it permanently",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/admin/tasks/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Deleted", data.message, "success");
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
  // LOADING UI
  // =========================
  if (loading) {
    return <div className="p-6 text-center font-bold">Loading tasks...</div>;
  }

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-black mb-6">Manage Tasks</h1>

      {/* EMPTY STATE */}
      {tasks.length === 0 && <p className="text-gray-500">No tasks found</p>}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>

              <th className="p-3 text-left">Buyer</th>

              <th className="p-3 text-left">Payable</th>

              <th className="p-3 text-left">Workers</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-t">
                {/* TITLE */}
                <td className="p-3">{task.task_title}</td>

                {/* BUYER */}
                <td className="p-3">{task.buyer_email}</td>

                {/* PAYABLE */}
                <td className="p-3">{task.payable_amount}</td>

                {/* WORKERS */}
                <td className="p-3">{task.required_workers}</td>

                {/* STATUS */}
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-green-400">
                    {task.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="
                      px-4 py-2
                      bg-red-500 text-white
                      rounded-lg
                    "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

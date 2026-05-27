"use client";

import { AuthContext } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function TaskListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/tasks");
        const data = await res.json();

        setTasks(data);
      } catch (error) {
        console.log("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black text-emerald-500">
          Available Tasks
        </h1>
        <p className="text-slate-500 mt-2">
          Complete tasks and earn coins instantly
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-slate-500">Loading tasks...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks
            .filter((task) => task.required_workers > 0)
            .map((task) => (
              <div
                key={task._id}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition"
              >
                {/* TITLE */}
                <h2 className="text-xl font-bold text-emerald-500">
                  {task.task_title}
                </h2>

                {/* BUYER */}
                <p className="text-slate-500 mt-2">
                  Buyer:{" "}
                  <span className="font-semibold">{task.buyer_name}</span>
                </p>

                {/* PAYABLE */}
                <p className="mt-3">
                  💰 Payable:{" "}
                  <span className="text-emerald-400 font-bold">
                    {task.payable} Coins
                  </span>
                </p>

                {/* DEADLINE */}
                <p className="mt-1 text-slate-400 text-sm">
                  ⏳ Deadline: {task.deadline}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setOpenModal(true);
                  }}
                  className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 transition py-2 rounded-xl font-semibold"
                >
                  Submit Task
                </button>
              </div>
            ))}
        </div>
      )}
      {openModal && selectedTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-xl">
            {/* TITLE */}
            <h2 className="text-2xl font-bold text-emerald-500">Submit Task</h2>

            {/* TASK INFO */}
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-semibold">Title:</span>{" "}
                {selectedTask.task_title}
              </p>

              <p>
                <span className="font-semibold">Details:</span>{" "}
                {selectedTask.task_detail}
              </p>

              <p>
                <span className="font-semibold">Buyer:</span>{" "}
                {selectedTask.buyer_name}
              </p>

              <p>
                <span className="font-semibold">Deadline:</span>{" "}
                {selectedTask.deadline}
              </p>

              <p>
                <span className="font-semibold">Reward:</span>{" "}
                <span className="text-emerald-500 font-bold">
                  {selectedTask.payable_amount} Coins
                </span>
              </p>

              <p>
                <span className="font-semibold">Workers Left:</span>{" "}
                {selectedTask.required_workers}
              </p>
            </div>

            {/* SUBMISSION INPUT */}
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Write your submission details..."
              className="w-full mt-5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
            />

            {/* BUTTONS */}
            <div className="flex gap-3 mt-5">
              {/* SUBMIT */}
              <button
                onClick={async () => {
                  try {
                    if (!user?.email) {
                      alert("User not loaded");
                      return;
                    }

                    if (!submissionText.trim()) {
                      alert("Please write submission details");
                      return;
                    }
                    setLoading(true);

                    await fetch("/api/submissions", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        task_id: selectedTask._id,
                        task_title: selectedTask.task_title,
                        buyer_email: selectedTask.buyer_email,
                        buyer_name: selectedTask.buyer_name,

                        worker_email: user.email,
                        worker_name: user.name,

                        submission_details: submissionText,
                        status: "pending",
                        createdAt: new Date(),
                      }),
                    });

                    setOpenModal(false);
                    setSubmissionText("");

                    router.push("/dashboard/my-submissions");
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex-1 bg-emerald-500 text-white py-2 rounded-xl"
              >
                {loading ? "Submitting..." : "Submit Work"}
              </button>

              {/* CANCEL */}
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

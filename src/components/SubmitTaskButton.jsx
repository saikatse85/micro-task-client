"use client";

import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthProvider";

export default function SubmitTaskButton({ taskId }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: taskId,
          worker_email: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Task submitted successfully",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="px-4 py-2 bg-emerald-500 text-white rounded-xl"
    >
      {loading ? "Submitting..." : "Submit Task"}
    </button>
  );
}

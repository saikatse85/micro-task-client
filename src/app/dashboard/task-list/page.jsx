"use client";

import { useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";
import SubmitTaskModal from "@/components/SubmitTaskModal";
import Loading from "@/app/loading";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTask, setSelectedTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();

        setTasks(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black text-emerald-500">Available Tasks</h1>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks
            .filter((task) => task.required_workers > 0)
            .map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onSubmitClick={handleOpenModal}
              />
            ))}
        </div>
      )}

      <SubmitTaskModal
        task={selectedTask}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}

import FooterSection from "@/components/Footer";
import TasksPage from "@/components/TasksPage";
import React from "react";

const tasks = () => {
  return (
    <div>
      <TasksPage></TasksPage>
      <h2 className="font-bold text-amber-300">Footer section</h2>
      <FooterSection></FooterSection>
    </div>
  );
};

export default tasks;

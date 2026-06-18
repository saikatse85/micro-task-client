import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const { id } = await req.json();

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    // =========================
    // FIND SUBMISSION
    // =========================
    const submission = await db.collection("submissions").findOne({
      _id: new ObjectId(id),
    });

    if (!submission) {
      return Response.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    // =========================
    // FIND TASK
    // =========================
    const task = await db.collection("tasks").findOne({
      _id: new ObjectId(submission.task_id),
    });

    if (!task) {
      return Response.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    // =========================
    // UPDATE SUBMISSION STATUS
    // =========================
    await db.collection("submissions").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "approved" } }
    );

    // =========================
    // UPDATE WORKER COINS
    // =========================
    await db.collection("users").updateOne(
      { email: submission.worker_email },
      {
        $inc: {
          coin: task.payable_amount,
          total_earned: task.payable_amount,
        },
      }
    );

    // =========================
    // UPDATE TASK (optional but recommended)
    // =========================
    await db.collection("tasks").updateOne(
      { _id: new ObjectId(submission.task_id) },
      {
        $inc: {
          required_workers: -1,
        },
      }
    );

    // =========================
    // NOTIFICATION → WORKER
    // =========================
    await db.collection("notifications").insertOne({
      toEmail: submission.worker_email,
      role: "worker",
      message: `Your submission for "${task.task_title}" was approved. You earned ${task.payable_amount} coins.`,
      actionRoute: "/dashboard/my-submissions",
      type: "success",
      createdAt: new Date(),
      time: new Date(),
    });

    // =========================
    // NOTIFICATION → BUYER (NEW FIX)
    // =========================
    await db.collection("notifications").insertOne({
      toEmail: task.buyer_email,
      role: "buyer",
      message: `A worker completed your task "${task.task_title}".`,
      actionRoute: "/dashboard/my-tasks",
      type: "info",
      createdAt: new Date(),
      time: new Date(),
    });

    return Response.json({
      success: true,
      message: "Submission approved successfully",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
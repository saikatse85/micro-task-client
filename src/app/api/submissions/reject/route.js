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
    // UPDATE SUBMISSION STATUS
    // =========================
    await db.collection("submissions").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "rejected" } }
    );

    // =========================
    // RESTORE TASK WORKER SLOT
    // =========================
    await db.collection("tasks").updateOne(
      { _id: new ObjectId(submission.task_id) },
      {
        $inc: {
          required_workers: 1,
        },
      }
    );

    // =========================
    // NOTIFY WORKER
    // =========================
    await db.collection("notifications").insertOne({
      toEmail: submission.worker_email,
      message: `Your submission for "${submission.task_title}" was rejected. Please try again.`,
      actionRoute: "/dashboard/task-list",
      time: new Date(),
    });

    return Response.json({
      success: true,
      message: "Submission rejected successfully",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
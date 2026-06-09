import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// =========================
// POST SUBMISSION
// =========================
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      task_id,
      task_title,
      buyer_email,
      buyer_name,
      worker_email,
      worker_name,
      worker_photo,
      submission_details,
      proof_url,
      proof_image,
    } = body;

    if (
      !task_id ||
      !task_title ||
      !buyer_email ||
      !worker_email ||
      !submission_details
    ) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const alreadySubmitted = await db.collection("submissions").findOne({
      task_id,
      worker_email,
    });

    if (alreadySubmitted) {
      return Response.json(
        { success: false, message: "Already submitted" },
        { status: 409 }
      );
    }

    const submissionData = {
      task_id,
      task_title,
      buyer_email,
      buyer_name,
      worker_email,
      worker_name,
      worker_photo: worker_photo || "",
      submission_details,
      proof_url: proof_image || proof_url || "",
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db
      .collection("submissions")
      .insertOne(submissionData);

    // reduce worker slots
    await db.collection("tasks").updateOne(
      { _id: new ObjectId(task_id) },
      { $inc: { required_workers: -1 } }
    );

    // =========================
    // NOTIFICATIONS
    // =========================

    await db.collection("notifications").insertOne({
      toEmail: buyer_email,
      role: "buyer",
      type: "info",
      message: `${worker_name} submitted work for "${task_title}"`,
      actionRoute: "/dashboard/task-review",
      isRead: false,
      createdAt: new Date(),
    });

    await db.collection("notifications").insertOne({
      toEmail: worker_email,
      role: "worker",
      type: "success",
      message: `You submitted "${task_title}" successfully`,
      actionRoute: "/dashboard/my-submissions",
      isRead: false,
      createdAt: new Date(),
    });

    await db.collection("notifications").insertOne({
      toEmail: "admin@system.com",
      role: "admin",
      type: "info",
      message: `New submission: "${task_title}"`,
      actionRoute: "/dashboard/manage-tasks",
      isRead: false,
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      message: "Submission created",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// =========================
// GET SUBMISSIONS
// =========================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const worker_email = searchParams.get("worker_email");
    const buyer_email = searchParams.get("buyer_email");

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    let query = {};

    if (worker_email) query.worker_email = worker_email;
    if (buyer_email) query.buyer_email = buyer_email;

    const submissions = await db
      .collection("submissions")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
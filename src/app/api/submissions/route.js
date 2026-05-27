import clientPromise from "@/lib/mongodb";

// =========================
// CREATE SUBMISSION
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
      submission_details,
      proof_url,
    } = body;

    // =========================
    // VALIDATION
    // =========================
    if (
      !task_id ||
      !task_title ||
      !buyer_email ||
      !worker_email ||
      !submission_details
    ) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    // =========================
    // PREVENT DUPLICATE SUBMISSION
    // =========================
    const alreadySubmitted = await db.collection("submissions").findOne({
      task_id,
      worker_email,
    });

    if (alreadySubmitted) {
      return Response.json(
        {
          success: false,
          message: "You already submitted this task",
        },
        { status: 409 }
      );
    }

    // =========================
    // CREATE SUBMISSION
    // =========================
    const submissionData = {
      task_id,
      task_title,
      buyer_email,
      buyer_name,

      worker_email,
      worker_name,

      submission_details,
      proof_url: proof_url || "",

      status: "pending",
      createdAt: new Date(),
    };

    const result = await db
      .collection("submissions")
      .insertOne(submissionData);

    // =========================
    // REDUCE REQUIRED WORKERS
    // =========================
    await db.collection("tasks").updateOne(
      { _id: submissionData.task_id },
      {
        $inc: {
          required_workers: -1,
        },
      }
    );

    // =========================
    // CREATE BUYER NOTIFICATION
    // =========================
    await db.collection("notifications").insertOne({
      toEmail: buyer_email,
      type: "info",
      message: `${worker_name} submitted work for "${task_title}"`,
      actionRoute: "/dashboard/task-review",
      time: new Date(),
    });

    return Response.json({
      success: true,
      message: "Submission created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.log("SUBMISSION POST ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
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

    // =========================
    // WORKER MY SUBMISSIONS
    // =========================
    if (worker_email) {
      query.worker_email = worker_email;
    }

    // =========================
    // BUYER TASK REVIEWS
    // =========================
    if (buyer_email) {
      query.buyer_email = buyer_email;
    }

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
    console.log("SUBMISSION GET ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
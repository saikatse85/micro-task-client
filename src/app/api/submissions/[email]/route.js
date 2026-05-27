import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const buyer_email = searchParams.get("buyer_email");
    const worker_email = searchParams.get("worker_email");

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    // =========================
    // BUYER REVIEW PAGE
    // =========================
    if (buyer_email) {
      // 1. FIND BUYER TASKS
      const buyerTasks = await db
        .collection("tasks")
        .find({ buyer_email })
        .toArray();

      // 2. GET TASK IDS
      const taskIds = buyerTasks.map((task) => task._id.toString());

      // 3. FIND SUBMISSIONS FOR THOSE TASKS
      const submissions = await db
        .collection("submissions")
        .find({
          task_id: { $in: taskIds },
        })
        .sort({ createdAt: -1 })
        .toArray();

      return Response.json({
        success: true,
        data: submissions,
      });
    }

    // =========================
    // WORKER MY SUBMISSIONS
    // =========================
    if (worker_email) {
      const submissions = await db
        .collection("submissions")
        .find({ worker_email })
        .sort({ createdAt: -1 })
        .toArray();

      return Response.json({
        success: true,
        data: submissions,
      });
    }

    return Response.json({
      success: false,
      message: "Email query missing",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
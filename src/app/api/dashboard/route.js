import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (!email || !role) {
      return Response.json(
        { message: "Missing email or role" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    let result = {};

    // WORKER DASHBOARD
    if (role === "worker") {
      const submissionsCollection = db.collection("submissions");
      const usersCollection = db.collection("users");
      const tasksCollection = db.collection("tasks");
      const notificationsCollection = db.collection("notifications");

      const submissions = await submissionsCollection
        .find({ worker_email: email })
        .toArray();

      const user = await usersCollection.findOne({ email });

      const approvedSubmissions = submissions.filter(
        (s) => s.status === "approved"
      );

      const pendingSubmissions = submissions.filter(
        (s) => s.status === "pending"
      );

      const rejectedSubmissions = submissions.filter(
        (s) => s.status === "rejected"
      );

      const earnings = approvedSubmissions.reduce((total, item) => {
        return total + (item.payable_amount || 0);
      }, 0);

      const recentSubmissions = await submissionsCollection
        .find({ worker_email: email })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      const notifications = await notificationsCollection
        .find({ toEmail: email })
        .sort({ time: -1 })
        .limit(5)
        .toArray();

      const availableTasks = await tasksCollection.countDocuments({
        required_workers: { $gt: 0 },
      });

      result = {
        coins: user?.coin || 0,
        totalSubmissions: submissions.length,
        pendingSubmissions: pendingSubmissions.length,
        approvedSubmissions: approvedSubmissions.length,
        rejectedSubmissions: rejectedSubmissions.length,
        earnings,
        availableTasks,
        recentSubmissions,
        notifications,
      };
    }


    // BUYER DASHBOARD
    
    else if (role === "buyer") {
      const tasks = await db
        .collection("tasks")
        .find({ buyer_email: email })
        .toArray();

      const submissions = await db
        .collection("submissions")
        .find({ buyer_email: email })
        .toArray();

      const user = await db.collection("users").findOne({ email });

      const pendingWorkers = submissions.filter(
        (s) => s.status === "pending"
      );

      result = {
        coins: user?.coin || 0,
        totalTasks: tasks.length,
        pendingWorkers: pendingWorkers.length,
        payments: tasks.reduce(
          (sum, t) =>
            sum +
            (t.required_workers || 0) *
              (t.payable_amount || 0),
          0
        ),
        activities: tasks
          .slice(-5)
          .reverse()
          .map((t) => `Task "${t.task_title}" is ${t.status || "active"}`),
      };
    }

    // ADMIN DASHBOARD
    
    else if (role === "admin") {
      const users = await db.collection("users").find().toArray();
      const tasks = await db.collection("tasks").find().toArray();

      const totalCoins = users.reduce(
        (sum, u) => sum + (u.coin || 0),
        0
      );

      const workers = users.filter(
        (u) => u.role === "worker"
      ).length;

      const buyers = users.filter(
        (u) => u.role === "buyer"
      ).length;

      result = {
        workers,
        buyers,
        totalCoins,
        payments: tasks.reduce(
          (sum, t) =>
            sum +
            (t.required_workers || 0) *
              (t.payable_amount || 0),
          0
        ),
        activities: tasks
          .slice(-5)
          .reverse()
          .map((t) => `Task "${t.task_title}" created`),
      };
    }

    return Response.json(result);
  } catch (error) {
    console.log("DASHBOARD API ERROR:", error);

    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
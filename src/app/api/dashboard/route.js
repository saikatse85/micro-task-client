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

    // =========================
    // WORKER DASHBOARD
    // =========================
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
        earnings: user?.total_earned || 0,

        totalSubmissions: submissions.length,
        pendingSubmissions: pendingSubmissions.length,
        approvedSubmissions: approvedSubmissions.length,
        rejectedSubmissions: rejectedSubmissions.length,

        availableTasks,
        recentSubmissions,
        notifications,
      };
    }

    // =========================
    // BUYER DASHBOARD
    // =========================
    else if (role === "buyer") {
      const tasksCollection = db.collection("tasks");
      const usersCollection = db.collection("users");

      const tasks = await tasksCollection
        .find({ buyer_email: email })
        .toArray();

      const user = await usersCollection.findOne({ email });

      const pendingWorkers = tasks.reduce(
        (sum, task) => sum + (task.required_workers || 0),
        0
      );

      const totalPayments = tasks.reduce(
        (sum, task) =>
          sum +
          (task.required_workers || 0) *
            (task.payable_amount || 0),
        0
      );

      result = {
        coins: user?.coin || 0,
        totalTasks: tasks.length,
        pendingWorkers,
        payments: totalPayments,

        activities: tasks
          .slice(-5)
          .reverse()
          .map(
            (task) =>
              `Task "${task.task_title}" is ${
                task.status || "active"
              }`
          ),
      };
    }

    // =========================
    // ADMIN DASHBOARD
    // =========================
    else if (role === "admin") {
      const usersCollection = db.collection("users");
      const tasksCollection = db.collection("tasks");
      const paymentsCollection = db.collection("payments");
      const withdrawalsCollection =
        db.collection("withdrawals");

      const users = await usersCollection.find().toArray();

      const totalWorkers = users.filter(
        (user) => user.role === "worker"
      ).length;

      const totalBuyers = users.filter(
        (user) => user.role === "buyer"
      ).length;

      const totalCoins = users.reduce(
        (sum, user) => sum + (user.coin || 0),
        0
      );

      const payments = await paymentsCollection
        .find()
        .toArray();

      const totalPayments = payments.reduce(
        (sum, payment) =>
          sum + (payment.amount || 0),
        0
      );

      const pendingWithdrawals =
        await withdrawalsCollection.countDocuments({
          status: "pending",
        });

      const recentTasks = await tasksCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      result = {
        totalWorkers,
        totalBuyers,
        totalCoins,
        totalPayments,
        pendingWithdrawals,

        recentActivities: recentTasks.map((task) => ({
          id: task._id,
          title: task.task_title,
          buyer: task.buyer_email,
          createdAt: task.createdAt,
        })),
      };
    }
    else {
      return Response.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    return Response.json(result);
  } catch (error) {
    console.log("DASHBOARD API ERROR:", error);

    return Response.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  };
};
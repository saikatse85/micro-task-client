import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const limit = parseInt(searchParams.get("limit")) || 50;

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    let filter = {};

    if (email) filter.toEmail = email;
    if (role) filter.role = role;

    const notifications = await db
      .collection("notifications")
      .find(filter)
      .sort({ time: -1 })
      .limit(limit)
      .toArray();

    // 🔥 IMPORTANT: always return consistent structure
    return Response.json({
      success: true,
      notifications: Array.isArray(notifications) ? notifications : [],
    });

  } catch (error) {
    console.log("NOTIFICATION API ERROR:", error);

    return Response.json(
      {
        success: false,
        notifications: [], // 🔥 important fallback
        message: error.message,
      },
      { status: 500 }
    );
  }
}
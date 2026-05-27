import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");

    if (!email) {
      return Response.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("micro-task-db");

    const tasks = await db
      .collection("tasks")
      .find({
        buyer_email: email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    return Response.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


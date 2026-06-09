import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("micro-task-db");

    const workers = await db
      .collection("users")
      .find({
        role: "worker",
      })
      .sort({
        coin: -1,
      })
      .limit(6)
      .toArray();

    return Response.json({
      success: true,
      data: workers,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
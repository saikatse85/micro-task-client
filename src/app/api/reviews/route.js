import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const result = await db.collection("reviews").insertOne({
      ...body,
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      insertedId: result.insertedId,
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

// GET /api/reviews

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const reviews = await db
      .collection("reviews")
      .find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    return Response.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
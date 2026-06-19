import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const result = await db.collection("reviews").insertOne({
      ...body,
      status: "pending",
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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const admin = searchParams.get("admin");

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    let query = {};

    // Homepage reviews
    if (admin !== "true") {
      query = {
        status: "approved",
        rating: { $gte: 4 },
      };
    }

    // Admin filter
    if (admin === "true" && status && status !== "all") {
      query.status = status;
    }

    const reviews = await db
      .collection("reviews")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      data: reviews,
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
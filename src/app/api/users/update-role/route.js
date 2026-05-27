import clientPromise from "@/lib/mongodb";

export async function PATCH(req) {
  try {
    const body = await req.json();

    const { email, role } = body;

    if (!email || !role) {
      return Response.json(
        {
          success: false,
          message: "Email and role required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("micro-task-db");

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          role,
        },
      }
    );

    return Response.json({
      success: true,
      message: "Role updated successfully",
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
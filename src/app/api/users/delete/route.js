import clientPromise from "@/lib/mongodb";

export async function DELETE(req) {
  try {
    const body = await req.json();

    const { email } = body;

    if (!email) {
      return Response.json(
        {
          success: false,
          message: "Email required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("micro-task-db");

    await db.collection("users").deleteOne({
      email,
    });

    return Response.json({
      success: true,
      message: "User deleted successfully",
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
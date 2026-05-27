import clientPromise from "@/lib/mongodb";

const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user;

  return safeUser;
};

export async function GET(req, context) {
  try {
    // Await params
    const params = await context.params;

    const email = decodeURIComponent(params.email).toLowerCase();

    const client = await clientPromise;

    const db = client.db("micro-task-db");

    const userCollection = db.collection("users");

    const user = await userCollection.findOne({
      email,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User profile not found in database",
        },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(req, context) {
  try {
    // Await params
    const params = await context.params;

    const email = decodeURIComponent(params.email).toLowerCase();

    const body = await req.json();

    const client = await clientPromise;

    const db = client.db("micro-task-db");

    const userCollection = db.collection("users");

    const result = await userCollection.updateOne(
      { email },
      {
        $set: {
          name: body.name,
          photoURL: body.photoURL,
        },
      },
    );

    return Response.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
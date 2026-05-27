import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return Response.json(
        {
          success: false,
          message: "Task ID required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    await db.collection("tasks").deleteOne({
      _id: new ObjectId(taskId),
    });

    return Response.json({
      success: true,
      message: "Task deleted successfully",
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
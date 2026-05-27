import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const { taskId, buyer_email } = await req.json();

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const task = await db.collection("tasks").findOne({
      _id: new ObjectId(taskId),
    });

    if (!task) {
      return Response.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // Refund calculation
    const refund =
      task.required_workers * task.payable_amount;

    // Delete task
    await db.collection("tasks").deleteOne({
      _id: new ObjectId(taskId),
    });

    // Refund coins to buyer
    await db.collection("users").updateOne(
      { email: buyer_email },
      { $inc: { coin: refund } }
    );

    return Response.json({
      success: true,
      message: "Task deleted and coins refunded",
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
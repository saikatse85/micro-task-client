import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all withdrawal requests
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const data = await db
      .collection("withdrawals")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// APPROVE WITHDRAWAL
export async function PATCH(req) {
  try {
    const { id } = await req.json();

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const withdrawal = await db.collection("withdrawals").findOne({
      _id: new ObjectId(id),
    });

    if (!withdrawal) {
      return Response.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );
    }

    // update withdrawal status only; coins are already deducted when the request was created
    await db
      .collection("withdrawals")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "approved" } });

    return Response.json({
      success: true,
      message: "Withdrawal approved",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

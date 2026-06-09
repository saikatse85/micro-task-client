import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const { worker_email, withdrawal_coin, amount_usd } = body;
    const amount = Number(withdrawal_coin);

    if (!worker_email || !Number.isFinite(amount) || amount <= 0) {
      return Response.json(
        { message: "Invalid withdrawal amount" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const user = await db.collection("users").findOne({ email: worker_email });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 },
      );
    }

    if ((user.coin ?? 0) < amount) {
      return Response.json(
        { message: "Insufficient coins" },
        { status: 400 },
      );
    }

    const withdrawal = {
      worker_email,
      withdrawal_coin,
      amount_usd,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await db
      .collection("withdrawals")
      .insertOne(withdrawal);

    await db.collection("users").updateOne(
      { email: worker_email },
      { $inc: { coin: -amount } },
    );

    return Response.json({
      success: true,
      message: "Withdrawal request created",
      insertedId: result.insertedId,
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// Get Withdraw API
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json(
        { message: "Email required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const withdrawals = await db
      .collection("withdrawals")
      .find({ worker_email: email })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(withdrawals);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

//Patch API
import { ObjectId } from "mongodb";

export async function PATCH(req) {
  try {
    const body = await req.json();

    const { id } = body;

    if (!id) {
      return Response.json(
        { message: "Withdrawal ID required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    // 1. Find withdrawal
    const withdrawal = await db
      .collection("withdrawals")
      .findOne({ _id: new ObjectId(id) });

    if (!withdrawal) {
      return Response.json(
        { message: "Not found" },
        { status: 404 }
      );
    }

    // 2. Update withdrawal status
    await db.collection("withdrawals").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "approved" } }
    );

    // 3. Deduct coins from user
    await db.collection("users").updateOne(
      { email: withdrawal.worker_email },
      {
        $inc: {
          coin: -withdrawal.withdrawal_coin,
        },
      }
    );

    return Response.json({
      success: true,
      message: "Withdrawal approved and coins deducted",
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
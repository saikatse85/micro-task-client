import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json(); // IMPORTANT FIX

    const { email, coins, amount } = body;

    if (!email || !coins || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const users = db.collection("users");
    const payments = db.collection("payments");

    // 1. Save payment
    await payments.insertOne({
      email,
      coins,
      amount,
      status: "success",
      createdAt: new Date(),
    });

    // 2. Increase coins
    const result = await users.updateOne(
      { email },
      { $inc: { coin: Number(coins) } }
    );

    if (!result.modifiedCount) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("PAYMENT API ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET API

// =====================
// GET PAYMENT HISTORY
// =====================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const payments = await db
      .collection("payments")
      .find({ email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
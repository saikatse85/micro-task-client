import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// CREATE TASK
export async function POST(req) {
  try {
    const body = await req.json();

    // Validation
    if (
      !body.task_title ||
      !body.task_detail ||
      !body.required_workers ||
      !body.payable_amount ||
      !body.buyer_email
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const usersCollection = db.collection("users");
    const tasksCollection = db.collection("tasks");

    const requiredWorkers = Number(body.required_workers);
    const payableAmount = Number(body.payable_amount);

    const totalCost = requiredWorkers * payableAmount;

    // Find buyer
    const buyer = await usersCollection.findOne({
      email: body.buyer_email,
    });

    if (!buyer) {
      return NextResponse.json(
        { message: "Buyer not found" },
        { status: 404 }
      );
    }

    // Check coins
    if (buyer.coin < totalCost) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient coins. Required ${totalCost} coins but you have ${buyer.coin}.`,
        },
        { status: 400 }
      );
    }

    // Deduct coins
    await usersCollection.updateOne(
      { email: body.buyer_email },
      {
        $inc: {
          coin: -totalCost,
        },
      }
    );

    // Create task
    const newTask = {
      task_title: body.task_title,
      task_detail: body.task_detail,
      required_workers: requiredWorkers,
      payable_amount: payableAmount,
      total_cost: totalCost,
      completed_workers: 0,
      buyer_name: body.buyer_name,
      buyer_email: body.buyer_email,
      deadline: body.deadline,
      status: body.status || "active",
      createdAt: new Date(),
    };

    const result = await tasksCollection.insertOne(newTask);

    return NextResponse.json({
      success: true,
      message: "Task created successfully",
      taskId: result.insertedId,
      totalCost,
      remainingCoins: buyer.coin - totalCost,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create task",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const tasksCollection = db.collection("tasks");

    // fetch all tasks
    const tasks = await tasksCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
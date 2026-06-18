import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const usersCollection = db.collection("users");
    const tasksCollection = db.collection("tasks");

    // Find buyer
    const buyer = await usersCollection.findOne({ email });

    if (!buyer) {
      return NextResponse.json(
        { message: "Buyer not found" },
        { status: 404 }
      );
    }

    // Get all buyer tasks
    const tasks = await tasksCollection
      .find({ buyer_email: email })
      .toArray();

    const totalTasks = tasks.length;

    const activeTasks = tasks.filter(
      (task) => task.status === "active"
    ).length;

    const totalSpent = tasks.reduce(
      (sum, task) => sum + (Number(task.total_cost) || 0),
      0
    );

    const pendingWorkers = tasks.reduce(
      (sum, task) => sum + (Number(task.required_workers) || 0),
      0
    );

    const completedSubmissions = tasks.reduce(
      (sum, task) => sum + (Number(task.completed_workers) || 0),
      0
    );

    return NextResponse.json({
      success: true,
      coins: buyer.coin || 0,
      totalTasks,
      activeTasks,
      totalSpent,
      pendingWorkers,
      completedSubmissions,
    });
  } catch (error) {
    console.error("Buyer Stats Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load buyer stats",
      },
      { status: 500 }
    );
  }
}
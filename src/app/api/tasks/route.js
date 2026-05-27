import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// CREATE TASK
export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const tasksCollection = db.collection("tasks");

    // validation (important)
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

    const newTask = {
      task_title: body.task_title,
      task_detail: body.task_detail,
      required_workers: Number(body.required_workers),
      payable_amount: Number(body.payable_amount),
      buyer_name: body.buyer_name,
      deadline: body.deadline,
      buyer_email: body.buyer_email,
      status: body.status || "active",
      createdAt: new Date(),
    };

    const result = await tasksCollection.insertOne(newTask);

    return NextResponse.json({
      message: "Task created successfully",
      taskId: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
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
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// APPROVE REVIEW
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid review id",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const result = await db.collection("reviews").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status: "approved",
          approvedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE REVIEW
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid review id",
        },
        {
          status: 400,
        }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
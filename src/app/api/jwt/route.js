import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return Response.json(
        { error: "JWT_SECRET is not configured" },
        { status: 500 }
      );
    }

    const client = await clientPromise;
    const db = client.db("micro-task-db");
    const user = await db.collection("users").findOne({ email });
    const role = user?.role;

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const maxAge = 7 * 24 * 60 * 60;
    const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
    const setCookie = `token=${token}; Path=/; Max-Age=${maxAge}; SameSite=Lax; ${secure}HttpOnly;`;

    return new Response(JSON.stringify({ token, role }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": setCookie,
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Token generation failed" },
      { status: 500 }
    );
  }
}
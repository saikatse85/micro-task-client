import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*()_\-+=,.<>;:'"[\]{}|\\/`~]).{6,}$/;

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const sendRegistrationEmail = async (email, name) => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.EMAIL_FROM
  ) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Registration Successful",
    text: `Welcome to MicroTask Platform, ${name}! Your account has been created successfully.`,
    html: `<p>Welcome to MicroTask Platform, <strong>${name}</strong>!</p><p>Your account has been created successfully.</p>`,
  });
};

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("micro-task-db");

    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const safeUsers = users.map(sanitizeUser);

    return Response.json({
      success: true,
      data: safeUsers,
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

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("micro-task-db");

    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email: body.email });
    const safeRole = body.role === "buyer" ? "buyer" : "worker";
    const safeCoin = typeof body.coin === "number" ? body.coin : safeRole === "buyer" ? 50 : 10;

    if (existingUser) {
      if (body.googleSignIn) {
        // For Google Sign-In, preserve existing role unless explicitly provided
        const roleToSet =
  body.role === "buyer" || body.role === "worker"
    ? body.role
    : existingUser.role; // Keep their existing role
        
        await usersCollection.updateOne({ email: body.email },
  {
    $set: {
      photoURL: existingUser.photoURL || body.photoURL || "",
    },
  }
);
        const updatedUser = await usersCollection.findOne({ email: body.email });
        return Response.json({ success: true, user: sanitizeUser(updatedUser) });
      }

      return Response.json(
        { success: false, message: "This email is already registered." },
        { status: 409 }
      );
    }

    if (!body.name || !body.email) {
      return Response.json(
        { success: false, message: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(body.email)) {
      return Response.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    if (!body.googleSignIn && (!body.password || !PASSWORD_REGEX.test(body.password))) {
      return Response.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters and include uppercase, lowercase, number, and a special character.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = body.password ? await bcrypt.hash(body.password, 10) : "";

    const newUser = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      photoURL: body.photoURL || "",
      role: safeRole,
      coin: safeCoin,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    const insertedUser = await usersCollection.findOne({
  _id: result.insertedId,
});

    if (body.password) {
      await sendRegistrationEmail(body.email, body.name);
    }

    return Response.json({ success: true, user: sanitizeUser(insertedUser) });
  } catch (error) {
    return Response.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
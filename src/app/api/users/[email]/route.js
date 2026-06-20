import clientPromise from "@/lib/mongodb";

const sanitizeUser = (user) => {
if (!user) return null;

const { password, ...safeUser } = user;
return safeUser;
};

export async function GET(req, context) {
try {
const params = await context.params;
const email = decodeURIComponent(params.email).toLowerCase();

const client = await clientPromise;
const db = client.db("micro-task-db");
const userCollection = db.collection("users");

const user = await userCollection.findOne({ email });

if (!user) {
  return Response.json(
    {
      success: false,
      message: "User not found",
    },
    { status: 404 }
  );
}

return Response.json({
  success: true,
  user: sanitizeUser(user),
});

} catch (error) {
console.error(error);

return Response.json(
  {
    success: false,
    message: error.message,
  },
  { status: 500 }
);

}
}

export async function PUT(req, context) {
try {
const params = await context.params;
const email = decodeURIComponent(params.email).toLowerCase();

const body = await req.json();

const client = await clientPromise;
const db = client.db("micro-task-db");
const userCollection = db.collection("users");

const existingUser = await userCollection.findOne({ email });

if (!existingUser) {
  return Response.json(
    {
      success: false,
      message: "User not found",
    },
    { status: 404 }
  );
}

const updateDoc = {};

if (body.name?.trim()) {
  updateDoc.name = body.name.trim();
}

if (body.photoURL) {
  updateDoc.photoURL = body.photoURL;
}

updateDoc.updatedAt = new Date();

const result = await userCollection.updateOne(
  { email },
  {
    $set: updateDoc,
  }
);

const updatedUser = await userCollection.findOne({ email });

return Response.json({
  success: true,
  modifiedCount: result.modifiedCount,
  user: sanitizeUser(updatedUser),
  message: "Profile updated successfully",
});


} catch (error) {
console.error(error);


return Response.json(
  {
    success: false,
    message: error.message,
  },
  { status: 500 }
);


}
}

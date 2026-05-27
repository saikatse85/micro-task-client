const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// MONGODB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwnfgfy.mongodb.net/?appName=Cluster0`;

// CREATE CLIENT
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // DATABASE
    const db = client.db("micro-task-client");

    // COLLECTIONS
    const usersCollection = db.collection("users");

    // =========================
    // JWT API
    // =========================
    app.post("/jwt", async (req, res) => {
      const user = req.body;

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    });

    // =========================
    // SAVE USER
    // =========================
    app.post("/users", async (req, res) => {
      const user = req.body;

      // CHECK EXISTING USER
      const existingUser = await usersCollection.findOne({
        email: user.email,
      });

      if (existingUser) {
        return res.send({
          message: "User already exists",
          inserted: false,
        });
      }

      const result = await usersCollection.insertOne(user);

      res.send(result);
    });

    // =========================
    // GET ALL USERS
    // =========================
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();

      res.send(result);
    });

    // =========================
    // GET SINGLE USER
    // =========================
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;

      const result = await usersCollection.findOne({ email });

      res.send(result);
    });

    console.log("MongoDB Connected");
  } finally {
  }
}

run().catch(console.dir);

// ROOT API
app.get("/", (req, res) => {
  res.send("Micro Task Server Running");
});

// SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI;

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("study-nook");
    const roomCollection = db.collection("study-rooms");

    console.log("MongoDB Connected Successfully");

// =======================
// CREATE ROOM (POST)
// =======================
    app.post("/rooms", async (req, res) => {
      try {
        const roomData = req.body;

        const result = await roomCollection.insertOne(roomData);

        res.send({
          success: true,
          message: "Room created successfully",
          result,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Failed to create room",
        });
      }
    });

// =======================
// GET ALL ROOMS (GET)
// =======================
    app.get("/rooms", async (req, res) => {
      try {
        const rooms = await roomCollection.find().toArray();

        res.send(rooms);
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Failed to fetch rooms",
        });
      }
    });

  } catch (error) {
    console.error("MongoDB Error:", error);
  }
}

run().catch(console.dir);

// Home route
app.get("/", (req, res) => {
  res.send("StudyNook Server is running fine!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
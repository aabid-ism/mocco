import conn from "../conn.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // finding and returning all news posts
    const results = await collection.find({}).limit(50).toArray();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.post("/publish-news", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("news");
    let data = req.body;
    const today = new Date();
    const dateOnly = today.toISOString().split("T")[0];
    data = { ...data, created_at: dateOnly };
    const results = await collection.insertOne(data);
    res.send(results).status(200);
  } catch (error) {
    console.error(error);
    res.send(error).status(500);
  }
});

router.post("/get-news-by-date", async (req, res) => {
  const { date } = req.body;
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // finding and returning all news posts
    const results = await collection
      .find({ createdAt: date })
      .limit(50)
      .toArray();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

export default router;

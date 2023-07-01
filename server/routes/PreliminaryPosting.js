import conn from "../conn.js";
import express from "express";

const router = express.Router();

// PUSH NEWS TO THE newsStage COLLECTION (UNPUBLISHED).
router.post("/push-news", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("newsStage");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    data = { ...newData, createdAt: today };
    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({ message: "News pushed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

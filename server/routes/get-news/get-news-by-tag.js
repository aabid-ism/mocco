import conn from "../../conn.js";
import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// Gets the top 20 posts from lifestyle collections that matches "mainTag"
router.get("/", async (req, res) => {
  let mainTag = req.query.mainTag;
  console.log(mainTag);
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const lifestyleCollection = await db.collection("lifestyle");

    // finding top 10 posts from news collection
    const lifestyleResults = await lifestyleCollection
      .find({ mainTag: newsTag })
      .limit(20)
      .toArray();

    res.send(lifestyleResults).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

export default router;

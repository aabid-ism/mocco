import conn from "../conn.js";
import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// EDIT UNPUBLISHED NEWS IN THE newsStage COLLECTION.
router.post("/edit-unpublished-news", async (req, res) => {
  try {
    const newsId = req.body.id;
    const { id, ...updateNews } = req.body;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("newsStage");

    // finding and updating news post based on ID
    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(newsId),
      },
      { $set: updateNews },
      { returnDocument: "after" }
    );

    // Check if a document was found and updated
    if (!result.value) {
      return res.status(404).json({ message: "News not found" });
    }

    res
      .status(200)
      .json({ message: "News edited successfully", value: result.value });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE UNPUBLISHED NEWS IN THE newsStage COLLECTION.
router.post("/delete-unpublished-news", async (req, res) => {
  try {
    const newsId = req.body.id;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("newsStage");

    // finding and deleting news post based on ID
    const result = await collection.deleteOne({
      _id: new ObjectId(newsId),
    });

    if (!result) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// APPROVE NEWS FOR PUBLICATION BY DELETING FROM newsStage AND INSERTING TO news COLLECTION.
router.post("/approve-news", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("news");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    data = { ...newData, createdAt: today };
    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "News not found" });
    }

    try {
      const newsId = req.body.id;
      // getting references to database and collection
      const db = conn.getDb();
      const collection = await db.collection("newsStage");

      // finding and deleting news post based on ID
      const result = await collection.deleteOne({
        _id: new ObjectId(newsId),
      });

      if (!result) {
        return res.status(404).json({ message: "News not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "News updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// APPROVE LIFESTYLE NEWS FOR PUBLICATION BY DELETING FROM newsStage AND INSERTING TO lifestyle COLLECTION.
router.post("/approve-lifestyle-news", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("lifestyle");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    data = { ...newData, createdAt: today };
    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "Lifestyle News not found" });
    }

    try {
      const newsId = req.body.id;
      // getting references to database and collection
      const db = conn.getDb();
      const collection = await db.collection("newsStage");

      // finding and deleting news post based on ID
      const result = await collection.deleteOne({
        _id: new ObjectId(newsId),
      });

      if (!result) {
        return res.status(404).json({ message: "Lifestyle News not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "Lifestyle News updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

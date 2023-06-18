import conn from "../conn.js";
import express from "express";
import { ObjectId } from "mongodb";

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
    data = { ...data, createdAt: dateOnly };
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

router.post("/get-authors", async (req, res) => {
  const { date } = req.body;
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("authors");

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

router.post("/get-drop-downs", async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const authorsCollection = await db.collection("authors");
    const mainTagsCollection = await db.collection("mainTags");
    const secondaryTagsCollection = await db.collection("secondaryTags");

    const authorsResults = await authorsCollection.find().toArray();
    const mainTagsResults = await mainTagsCollection.find().toArray();
    const secondaryTagsResults = await secondaryTagsCollection.find().toArray();

    const results = {
      authors: authorsResults,
      mainTags: mainTagsResults,
      secondaryTags: secondaryTagsResults,
    };

    res.send(results).status(200);
  } catch (error) {
    console.log(error);
    res.send(error).status(500);
  }
});

router.post("/delete-news", async (req, res) => {
  try {
    const newsId = req.body.id;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // finding and deleting news post based on ID
    const result = await collection.deleteOne({
      _id: new ObjectId(newsId),
    });

    if (!result) {
      return res.status(404).json({ message: "News not found" });
    }
    res.send(result).status(200);
  } catch (error) {
    console.log(error);
    res.send(error).status(500);
  }
});

export default router;

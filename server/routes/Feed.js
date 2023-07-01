import conn from "../conn.js";
import express from "express";

const router = express.Router();

// GET ALL UNPUBLISHED NEWS FROM newsStage COLLECTION.
router.get("/get-unpublished-news", async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("newsStage");

    // finding and returning all unpublished posts
    const results = await collection.find({}).limit(50).toArray();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

// GET ALL PUBLISHED NEWS FROM news COLLECTION BASED ON THE SELECTED DATE.
router.post("/get-news-by-date", async (req, res) => {
  let { date } = req.body;
  date = new Date(date);
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

// GET ALL DROP DOWNS FROM mainTags, secondaryTags and authors COLLECTIONS.
router.get("/get-drop-downs", async (req, res) => {
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

// GET ALL PUBLISHED LIFESTYLE NEWS FROM THE lifestyle COLLECTION BASED ON THE SELECTED DATE.
router.post("/get-lifestyle-news-by-date", async (req, res) => {
  let { date } = req.body;
  date = new Date(date);
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("lifestyle");

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

import conn from "../../conn.js";
import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// Gets the top OUTPUT number of posts that matches "mainTag"
router.get("/", async (req, res) => {
  let reqTag = req.query.reqTag;
  
  const OUTPUT = 2;
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const lifestyleCollection = await db.collection("lifestyle");
    const newsCollection = await db.collection("news");

    // finding top  posts from news collection
    const newsResult = await newsCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            mainTag: reqTag,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();
    // finding top  posts from life collection
    const lifestyleResults = await lifestyleCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            mainTag: reqTag,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();

    // filtering out the top posts from the two results
    // Sort the documents based on the 'createdAt' field
    let combinedResult = [...newsResult, ...lifestyleResults];
    combinedResult.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Extract the first OUPUT number of documents with the earliest 'createdAt' values
    const filteredDocuments = combinedResult.slice(0, OUTPUT);

    res.send(filteredDocuments).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

export default router;

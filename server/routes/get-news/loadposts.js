// Loading more posts for News, Extra and TagFeed. Needed for the mocco.lk webapp
import conn from "../../conn.js";
import express from "express";

const router = express.Router();
/* 
    @route GET /loadposts/news/
    @query vars: ref_postIndex
    @desc gets the next OUTPUT number of posts with postIndex lower than ref_postIndex from the news collection
    @returns OUTPUT number or remaining number of posts, 400 if ref_postIndex not provided
*/
router.get("/news/", async (req, res) => {
  const ref_postIndex = parseInt(req.query.ref_postIndex);
  const OUTPUT = 10;

  if (!ref_postIndex) {
    return res.send("ref_postIndex is required").status(400);
  }

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("news");

    const result = await newsCollection
      .aggregate([
        {
          $match: {
            postIndex: { $lt: ref_postIndex },
          },
        },
        {
          $sort: { postIndex: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();

    res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

/* 
    @route GET /loadposts/lifestyle/
    @query vars: ref_postIndex
    @desc gets next 20 posts with postIndex lower than ref_postIndex from the lifestyle collection
    @returns OUTPUT numberor remaining number of posts, 400 if ref_postIndex not provided
*/
router.get("/lifestyle/", async (req, res) => {
  const ref_postIndex = parseInt(req.query.ref_postIndex);
  const OUTPUT = 10;

  if (!ref_postIndex) {
    return res.send("ref_postIndex is required").status(400);
  }
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const lifesStyleCollection = await db.collection("lifestyle");

    const result = await lifesStyleCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            postIndex: { $lt: ref_postIndex },
          },
        },
        {
          $sort: { postIndex: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();

    res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

/* 
    @route GET /loadposts/tag/
    @query vars: ref_postIndex, req_tag
    @desc gets next 20 posts with postIndex lower than ref_postIndex and matches req_tag from both collections
    @returns OUTPUT number or remaining number of posts, 400 if parameters are not provided
*/
router.get("/tag/", async (req, res) => {
  const ref_postIndex = parseInt(req.query.ref_postIndex);
  const req_tag = req.query.req_tag;
  const OUTPUT = 10;

  if (!ref_postIndex) {
    return res.send("ref_postIndex is required").status(400);
  }

  if (!req_tag) {
    return res.send("req_tag is required!").status(404);
  }

  try {
    // getting references to database and collection
    const db = await conn.getDb();
    const lifeStyleCollection = await db.collection("lifestyle");
    const newsCollection = await db.collection("news");

    // finding top  posts from news collection
    const newsResult = await newsCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            mainTag: req_tag,
            postIndex: { $lt: ref_postIndex },
          },
        },
        {
          $sort: { postIndex: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();
    // finding top  posts from life collection
    const lifestyleResults = await lifeStyleCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            mainTag: req_tag,
            postIndex: { $lt: ref_postIndex },
          },
        },
        {
          $sort: { postIndex: -1 },
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
      (a, b) => new Date(b.postIndex) - new Date(a.postIndex)
    );

    // Extract the first OUPUT number of documents with the earliest 'createdAt' values
    const filteredDocuments = combinedResult.slice(0, OUTPUT);

    res.send(filteredDocuments).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

export default router;

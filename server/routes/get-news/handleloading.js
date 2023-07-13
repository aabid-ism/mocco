// Loading more posts for News, Extra and TagFeed
import conn from "../../conn.js";
import express from "express";

const router = express.Router();

/* 
    @route GET /handleloading/news/
    @vars body: readPostIndices (list of read postIndexes)
    @desc gets the next OUTPUT number of unread posts from the news collection
    @returns OUTPUT number or remaining number of unread posts
*/
router.get("/news/", async (req, res) => {
  const readPostIndices = req.body.readPostIndices || [];

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("news");

    // Query for unread news objects
    const unreadNews = await newsCollection
      .find({ postIndex: { $nin: readPostIndices } }) // Exclude read post indexes
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      .limit(50) // Limit to 50 news objects
      .toArray();

    res.send(unreadNews).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

/* 
    @route GET /handleloading/lifestyle/
    @vars body: readPostIndices
    @desc gets next 50 unread posts from lifestyle collection
    @returns OUTPUT number or remaining number of unread posts
*/
router.get("/lifestyle/", async (req, res) => {
  const readPostIndices = req.body.readPostIndices || [];

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("lifestyle");

    // Query for unread news objects
    const unreadNews = await newsCollection
      .find({ postIndex: { $nin: readPostIndices } }) // Exclude read post indexes
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      .limit(50) // Limit to 50 news objects
      .toArray();

    res.send(unreadNews).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

/* 
    @route GET /handleloading/tag/
    @vars body: readPostIndices, query: reqTag
    @desc gets next 50 unread posts with the maintag of reqTag (from both news and lifestyle collections)
    @returns OUTPUT number or remaining number of posts, 400 if parameters are not provided
*/
router.get("/tag/", async (req, res) => {
  const readPostIndices = req.body.readPostIndices || [];
  const reqTag = req.query.reqTag;
  if (!reqTag) {
    return res.send("Tag is Empty").status(400);
  }

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const lifestyleCollection = await db.collection("lifestyle");

    // Query for unread posts from lifestyle collection with reqTag
    const unreadLifestyle = await lifestyleCollection
      .find({
        $and: [
          { postIndex: { $nin: readPostIndices } }, // Exclude read post indexes
          { mainTag: reqTag }, // match the Tag
        ],
      })
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      .limit(50) // Limit to 50 news objects
      .toArray();

    const newsCollection = await db.collection("news");

    // Query for unread posts from news collection with reqTag
    const unreadNews = await newsCollection
      .find({
        $and: [
          { postIndex: { $nin: readPostIndices } }, // Exclude read post indexes
          { mainTag: reqTag }, // match the Tag
        ],
      })
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      .limit(50) // Limit to 50 news objects
      .toArray();

    // combine two unread results and sort on postIndex
    let combinedResult = [...unreadNews, ...unreadLifestyle];
    combinedResult.sort(
      (a, b) => new Date(b.postIndex) - new Date(a.postIndex)
    );

    res.send(combinedResult).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

export default router;

// Loading more posts for News, Extra and TagFeed

import conn from "../../conn.js";
import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();
/* 
    @route GET /loadposts/news/
    @query vars: ref_date
    @desc gets next 20 posts after a given objectID in the news collection
    @returns 20 or remaining number of posts if objID is valid, 404 if objID is not valid
*/
router.get("/news/", async (req, res) => {
  // change to postIndex after update
  let ref_date = req.query.ref_date;
  console.log(ref_date);
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("news");

    // to ensure that the datetime is in ISO format
    const ref_date_ISO = new Date(ref_date);
    console.log(ref_date_ISO);
    const result = await newsCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            createdAt: { $lt: ref_date_ISO },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 2,
        },
      ])
      .toArray();

    res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

/* 
    @route GET /loadposts/extra/:objID
    @desc gets next 20 posts after a given objectID in the extra collection
    @returns 20 or remaining number of posts if objID is valid, 404 if objID is not valid
*/
router.get("/extra/:objID", async (req, res) => {
  // change to postIndex after update
  let objID = req.params.objID;
  console.log(objID);
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("news");
  } catch (error) {
    res.send(error).status(404);
  }
});

/* 
    @route GET /loadposts/tag-feed/:tag
    @desc gets next 20 posts, with the corresponding tag, after a given objectID from both news and extra collections
    @returns 20 or remaining number of posts if objID is valid, 404 if objID is not valid
*/
router.get("/tag-feed/:tag/:objID", async (req, res) => {
  // change to postIndex after update
  let objID = req.params.objID;
  console.log(objID);
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("news");
  } catch (error) {
    res.send(error).status(404);
  }
});

export default router;

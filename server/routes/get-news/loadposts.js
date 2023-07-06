// Loading more posts for News, Extra and TagFeed

import conn from "../../conn.js";
import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();
/* 
    @route GET /loadposts/news/
    @query vars: ref_date
    @desc gets next OUTPUT number of posts older than a given ref_date in the news collection
    @returns OUTPUT number or remaining number of posts, 404 if ref_date is not valid
*/
router.get("/news/", async (req, res) => {
  // change to postIndex after update
  let ref_date = req.query.ref_date;
  const OUTPUT = 2;
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
    @query vars: ref_date
    @desc gets next 20 posts older than ref_date in the news collection
    @returns OUTPUT numberor remaining number of posts, 404 if ref_date is not valid
*/
router.get("/lifestyle/", async (req, res) => {
  // change to postIndex after update
  let ref_date = req.query.ref_date;
  const OUTPUT = 2;
  console.log(ref_date);
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const lifesStyleCollection = await db.collection("lifestyle");

    // to ensure that the datetime is in ISO format
    const ref_date_ISO = new Date(ref_date);
    console.log(ref_date_ISO);
    const result = await lifesStyleCollection
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
    @query vars: ref_date, req_tag
    @desc gets next 20 posts older than ref_date that matches req_tag from both collections
    @returns OUTPUT number or remaining number of posts, 404 if ref_date is not valid
*/
router.get("/tag/", async (req, res) => {
  // change to postIndex after update
  let ref_date = req.query.ref_date;
  const ref_date_ISO = new Date(ref_date);
  let req_tag = req.query.req_tag;
  const OUTPUT = 2;

  if (ref_date == null || req_tag == null) {
    return res.send("null parameters").status(404);
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
            createdAt: { $lt: ref_date_ISO },
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
    const lifestyleResults = await lifeStyleCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            mainTag: req_tag,
            createdAt: { $lt: ref_date_ISO },
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

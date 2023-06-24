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

router.get("/feed", async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // finding and returning all news posts
    const results = await collection.find({}).limit(20).toArray();
    results.reverse();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.get("/newer", async (req, res) => {
  try {
    // Getting references to the database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // Extracting the createdAt parameter from the query
    const createdAt = req.query.date;

    // Constructing the query to retrieve news posts newer than createdAt
    const query = { createdAt: { $gt: new Date(createdAt) } };

    // Sorting the results in descending order based on createdAt
    const sortOptions = { createdAt: -1 };

    // Finding and returning the newest news post
    const result = await collection
      .find(query)
      .sort(sortOptions)
      .limit(20)
      .toArray();
    res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.get("/older", async (req, res) => {
  try {
    // Getting references to the database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // Extracting the createdAt parameter from the query
    const createdAt = req.query.date;

    // Constructing the query to retrieve news posts newer than createdAt
    const query = { createdAt: { $lt: new Date(createdAt) } };

    // Sorting the results in descending order based on createdAt
    const sortOptions = { createdAt: -1 };

    // Finding and returning the newest news post
    const result = await collection
      .find(query)
      .sort(sortOptions)
      .limit(20)
      .toArray();
    res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.post("/push-news", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("newsStage");
    let data = req.body;
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

router.post("/approve-news", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("news");
    let data = req.body;
    const today = new Date();
    const dateOnly = new Date(today.toISOString().split("T")[0]);
    const { id, ...newData } = data;
    data = { ...newData, createdAt: dateOnly };
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

router.post("/edit-unpublished-news", async (req, res) => {
  try {
    const newsId = req.body.id;
    const { id, ...updateNews } = req.body;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("newsStage");

    // finding and updating news post based on ID
    const result = await collection.updateOne(
      {
        _id: new ObjectId(newsId),
      },
      { $set: updateNews }
    );

    if (!result) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({ message: "News edit successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/edit-news", async (req, res) => {
  try {
    const newsId = req.body.id;
    const { id, ...updateNews } = req.body;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // finding and updating news post based on ID
    const result = await collection.updateOne(
      {
        _id: new ObjectId(newsId),
      },
      { $set: updateNews }
    );

    if (!result) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({ message: "News edited successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
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

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

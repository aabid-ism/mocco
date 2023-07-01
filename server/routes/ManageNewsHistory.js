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

// EDIT PUBLISHED NEWS IN THE news COLLECTION.
router.post("/edit-news", async (req, res) => {
  try {
    const newsId = req.body.id;
    const { id, ...updateNews } = req.body;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // finding and updating news post based on ID
    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(newsId),
      },
      { $set: updateNews },
      { returnDocument: "after" }
    );

    if (!result) {
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

// DELETE PUBLISHED NEWS IN THE news COLLECTION.
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

// EDIT PUBLISHED LIFESTYLE NEWS IN THE lifestyle COLLECTION.
router.post("/edit-lifestyle-news", async (req, res) => {
  try {
    const newsId = req.body.id;
    const { id, ...updateNews } = req.body;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("lifestyle");

    // finding and updating news post based on ID
    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(newsId),
      },
      { $set: updateNews },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Lifestyle News not found" });
    }

    res.status(200).json({
      message: "Lifestyle News edited successfully",
      value: result.value,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE PUBLISHED LIFESTYLE NEWS IN THE lifestyle COLLECTION.
router.post("/delete-lifestyle-news", async (req, res) => {
  try {
    const newsId = req.body.id;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("lifestyle");

    // finding and deleting news post based on ID
    const result = await collection.deleteOne({
      _id: new ObjectId(newsId),
    });

    if (!result) {
      return res.status(404).json({ message: "Lifestyle News not found" });
    }

    res.status(200).json({ message: "Lifestyle News deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ADD NEWS TO LIFESTYLE NEWS FOR PUBLICATION BY DELETING FROM news AND INSERTING TO lifestyle COLLECTION.
router.post("/add-news-to-lifestyle", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("lifestyle");
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
      const collection = await db.collection("news");

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

    res.status(200).json({ message: "Lifestyle News updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ADD LIFESTYLE NEWS TO NEWS FOR PUBLICATION BY DELETING FROM lifestyle AND INSERTING TO news COLLECTION.
router.post("/add-lifestyle-to-news", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("news");
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
      const collection = await db.collection("lifestyle");

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

    res.status(200).json({ message: "News updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

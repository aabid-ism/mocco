import conn from "../conn.js";
import express from "express";
import { ObjectId } from "mongodb";

import requireAuth from "../middlewares/requireAuth.js";

const router = express.Router();

// require auth for all workout routes
router.use(requireAuth);


const router = express.Router();
import sendNotification from "../services/notifications.js";

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

router.get("/exact-post", async (req, res) => {
  try {
    const reqPostIndex = parseInt(req.query.postIndex);
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("news");

    let result = await newsCollection
      .find({ postIndex: reqPostIndex })
      .limit(1)
      .toArray();

    if (result.length == 0) {
      const lifeCollection = await db.collection("lifestyle");
      result = await lifeCollection
        .find({ postIndex: reqPostIndex })
        .limit(1)
        .toArray();
    }
    res.send(result).status(200);
  } catch (e) {
    res.send(e).status(500);
  }
});

router.get("/lifestyle", async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("lifestyle");

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
    // const results = await collection.find({}).limit(2).toArray();

    const results = await collection
      .aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 2,
        },
      ])
      .toArray();
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

// PUSH NEWS TO THE newsStage COLLECTION (UNPUBLISHED).
router.post("/push-news", async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("newsStage");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    data = { ...newData, createdAt: today };
    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({ message: "News pushed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// APPROVE NEWS FOR PUBLICATION BY DELETING FROM newsStage AND INSERTING TO news COLLECTION.
router.post("/approve-news", async (req, res) => {
  try {
    const db = conn.getDb();
    let newPostIndex = 1;
    const newsCollection = await db.collection("news");
    const lifestyleCollection = await db.collection("lifestyle");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    const newsMaxPostIndex = await newsCollection.findOne(
      {},
      { sort: { postIndex: -1 }, projection: { postIndex: 1 } }
    );

    const lifestyleMaxPostIndex = await lifestyleCollection.findOne(
      {},
      { sort: { postIndex: -1 }, projection: { postIndex: 1 } }
    );

    if (newsMaxPostIndex && lifestyleMaxPostIndex) {
      newsMaxPostIndex.postIndex > lifestyleMaxPostIndex.postIndex
        ? (newPostIndex = newsMaxPostIndex ? newsMaxPostIndex.postIndex + 1 : 1)
        : (newPostIndex = lifestyleMaxPostIndex
            ? lifestyleMaxPostIndex.postIndex + 1
            : 1);
    } else if (newsMaxPostIndex) {
      newPostIndex = newsMaxPostIndex ? newsMaxPostIndex.postIndex + 1 : 1;
    } else if (lifestyleMaxPostIndex) {
      newPostIndex = lifestyleMaxPostIndex
        ? lifestyleMaxPostIndex.postIndex + 1
        : 1;
    }

    data = { ...newData, createdAt: today, postIndex: newPostIndex };
    const result = await newsCollection.insertOne(data);

    // ---------------------------------
    // ******SENDING NOTIFICATION*******
    // ---------------------------------

    await sendNotification(newPostIndex, data.title, data.imageUrl);
    // ----------------------------------------
    // ******END OF SENDING NOTIFICATION*******
    // ----------------------------------------

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
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "News approved and updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    // Getting references to the database and collection
    const db = conn.getDb();
    const collection = await db.collection("news");

    // Finding and returning all news posts within the specified date range
    const results = await collection
      .find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      })
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
    res.send(error).status(500);
  }
});

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
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET ALL PUBLISHED LIFESTYLE NEWS FROM THE lifestyle COLLECTION BASED ON THE SELECTED DATE.
router.post("/get-lifestyle-news-by-date", async (req, res) => {
  let { date } = req.body;
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("lifestyle");

    // finding and returning all news posts
    const results = await collection
      .find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      })
      .limit(50)
      .toArray();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

// APPROVE LIFESTYLE NEWS FOR PUBLICATION BY DELETING FROM newsStage AND INSERTING TO lifestyle COLLECTION.
router.post("/approve-lifestyle-news", async (req, res) => {
  try {
    const db = conn.getDb();
    let newPostIndex = 1;
    const newsCollection = await db.collection("news");
    const lifestyleCollection = await db.collection("lifestyle");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    const newsMaxPostIndex = await newsCollection.findOne(
      {},
      { sort: { postIndex: -1 }, projection: { postIndex: 1 } }
    );

    const lifestyleMaxPostIndex = await lifestyleCollection.findOne(
      {},
      { sort: { postIndex: -1 }, projection: { postIndex: 1 } }
    );

    if (newsMaxPostIndex && lifestyleMaxPostIndex) {
      newsMaxPostIndex.postIndex > lifestyleMaxPostIndex.postIndex
        ? (newPostIndex = newsMaxPostIndex ? newsMaxPostIndex.postIndex + 1 : 1)
        : (newPostIndex = lifestyleMaxPostIndex
            ? lifestyleMaxPostIndex.postIndex + 1
            : 1);
    } else if (newsMaxPostIndex) {
      newPostIndex = newsMaxPostIndex ? newsMaxPostIndex.postIndex + 1 : 1;
    } else if (lifestyleMaxPostIndex) {
      newPostIndex = lifestyleMaxPostIndex
        ? lifestyleMaxPostIndex.postIndex + 1
        : 1;
    }

    data = { ...newData, createdAt: today, postIndex: newPostIndex };
    const result = await lifestyleCollection.insertOne(data);

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
      res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "Lifestyle News updated successfully" });
  } catch (error) {
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
      res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "Lifestyle News updated successfully" });
  } catch (error) {
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
      res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "News updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

import conn from "../conn.js";
import { ObjectId } from "mongodb";
import sendNotification from "../services/notifications.js";

// <-------------------- GET INTERNATIONAL NEWS FROM international COLLECTION -------------------->
export const getInternationalNews = async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("international");

    // finding and returning all international news posts
    // const results = await collection.find({}).limit(20).toArray();
    const results = await collection
      .aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 20,
        },
      ])
      .toArray();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET LOCAL NEWS FROM local COLLECTION -------------------->
export const getLocalNews = async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("local");

    const results = await collection
      .aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 20,
        },
      ])
      .toArray();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET ALL UNPUBLISHED NEWS FROM newsStage COLLECTION -------------------->
export const getUnpublishedNews = async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("newsStage");

    // finding and returning all unpublished posts
    const results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET ALL UNPUBLISHED NEWS FROM newsStage COLLECTION BY DATE -------------------->
export const getUnpublishedNewsByDate = async (req, res) => {
  let { date } = req.body;
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    // Getting references to the database and collection
    const db = conn.getDb();
    const collection = await db.collection("newsStage");

    // Finding and returning all local news posts within the specified date range
    const results = await collection
      .find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      })
      .toArray();

    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET ALL PUBLISHED LOCAL NEWS FROM local COLLECTION BASED ON THE SELECTED DATE -------------------->
export const getLocalNewsByDate = async (req, res) => {
  let { date } = req.body;
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    // Getting references to the database and collection
    const db = conn.getDb();
    const collection = await db.collection("local");

    // Finding and returning all local news posts within the specified date range
    const results = await collection
      .find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      })
      .toArray();

    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET ALL DROP DOWNS FROM mainTags and secondaryTags COLLECTIONS -------------------->
export const getAllDropDowns = async (req, res) => {
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const mainTagsCollection = await db.collection("mainTags");
    const secondaryTagsCollection = await db.collection("secondaryTags");

    const mainTagsResults = await mainTagsCollection.find().toArray();
    const secondaryTagsResults = await secondaryTagsCollection.find().toArray();

    const results = {
      mainTags: mainTagsResults,
      secondaryTags: secondaryTagsResults,
    };

    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET ALL PUBLISHED INTERNATIONAL NEWS FROM THE international COLLECTION BASED ON THE SELECTED DATE -------------------->
export const getInternationalNewsByDate = async (req, res) => {
  let { date } = req.body;
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("international");

    // finding and returning all international news posts
    const results = await collection
      .find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      })
      .toArray();
    res.send(results).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET ALL PUBLISHED NEWS FROM BOTH international AND local COLLECTION BASED ON THE POST INDEX -------------------->
export const getNewsByPostIndex = async (req, res) => {
  const { postIndex } = req.body;

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const internationalCollection = await db.collection("international");
    const localCollection = db.collection("local");

    // finding and returning all international news posts
    const internationalResults = await internationalCollection
      .find({
        postIndex: { $in: postIndex },
      })
      .toArray();

    // finding and returning all local news posts
    const localResults = await localCollection
      .find({
        postIndex: { $in: postIndex },
      })
      .toArray();

    // Concatenate the results from both collections into a single array
    const allResults = internationalResults.concat(localResults);
    // Custom sorting function
    const customSort = (a, b) => {
      const indexA = postIndex.indexOf(a.postIndex);
      const indexB = postIndex.indexOf(b.postIndex);

      if (indexA < indexB) return -1;
      if (indexA > indexB) return 1;
      return 0;
    };
    const finalResults = allResults.sort(customSort);

    if (finalResults.length == 0) {
      return res.status(204).send();
    }

    return res.status(200).send(finalResults);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET EXACT POST FOR NOTIFICATION -------------------->
export const exactPostNotification = async (req, res) => {
  try {
    const reqPostIndex = parseInt(req.query.postIndex);
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("local");

    let result = await newsCollection
      .find({ postIndex: reqPostIndex })
      .limit(1)
      .toArray();

    if (result.length == 0) {
      const lifeCollection = await db.collection("international");
      result = await lifeCollection
        .find({ postIndex: reqPostIndex })
        .limit(1)
        .toArray();
    }
    res.send(result).status(200);
  } catch (e) {
    res.send(e).status(500);
  }
};

// <-------------------- ADD NEWS TO THE newsStage COLLECTION (UNPUBLISHED NEWS) -------------------->
export const pushNews = async (req, res) => {
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
};

// <-------------------- ADD LOCAL NEWS TO INTERNATIONAL NEWS FOR PUBLICATION BY DELETING FROM local AND INSERTING TO international COLLECTION -------------------->
export const addLocalToInternational = async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("international");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    data = { ...newData, createdAt: today };
    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "International News not found" });
    }

    try {
      const newsId = req.body.id;
      // getting references to database and collection
      const db = conn.getDb();
      const collection = await db.collection("local");

      // finding and deleting local news post based on ID
      const result = await collection.deleteOne({
        _id: new ObjectId(newsId),
      });

      if (!result) {
        return res.status(404).json({ message: "Local News not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

    res
      .status(200)
      .json({ message: "International News updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// <-------------------- ADD LOCAL INTERNATIONAL TO LOCAL NEWS FOR PUBLICATION BY DELETING FROM international AND INSERTING TO local COLLECTION -------------------->
export const addInternationalToLocal = async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("local");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    data = { ...newData, createdAt: today };
    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "International News not found" });
    }

    try {
      const newsId = req.body.id;
      // getting references to database and collection
      const db = conn.getDb();
      const collection = await db.collection("international");

      // finding and deleting news post based on ID
      const result = await collection.deleteOne({
        _id: new ObjectId(newsId),
      });

      if (!result) {
        return res
          .status(404)
          .json({ message: "International News not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "Local News updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// <-------------------- APPROVE NEWS FOR PUBLICATION BY DELETING FROM newsStage AND INSERTING TO local COLLECTION -------------------->
export const approveLocalNews = async (req, res) => {
  try {
    const db = conn.getDb();
    let newPostIndex = 1;
    const localCollection = await db.collection("local");
    const internationalCollection = await db.collection("international");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    const localMaxPostIndex = await localCollection.findOne(
      {},
      { sort: { postIndex: -1 }, projection: { postIndex: 1 } }
    );

    const internationalMaxPostIndex = await internationalCollection.findOne(
      {},
      { sort: { postIndex: -1 }, projection: { postIndex: 1 } }
    );

    if (localMaxPostIndex && internationalMaxPostIndex) {
      localMaxPostIndex.postIndex > internationalMaxPostIndex.postIndex
        ? (newPostIndex = localMaxPostIndex
            ? localMaxPostIndex.postIndex + 1
            : 1)
        : (newPostIndex = internationalMaxPostIndex
            ? internationalMaxPostIndex.postIndex + 1
            : 1);
    } else if (localMaxPostIndex) {
      newPostIndex = localMaxPostIndex ? localMaxPostIndex.postIndex + 1 : 1;
    } else if (internationalMaxPostIndex) {
      newPostIndex = internationalMaxPostIndex
        ? internationalMaxPostIndex.postIndex + 1
        : 1;
    }

    data = { ...newData, createdAt: today, postIndex: newPostIndex };
    const result = await localCollection.insertOne(data);

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
        return res.status(404).json({ message: "Local News not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }

    res
      .status(200)
      .json({ message: "Local News approved and updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// <-------------------- APPROVE NEWS FOR PUBLICATION BY DELETING FROM newsStage AND INSERTING TO international COLLECTION -------------------->
export const approveInternationalNews = async (req, res) => {
  try {
    const db = conn.getDb();
    let newPostIndex = 1;
    const localCollection = await db.collection("local");
    const internationalCollection = await db.collection("international");
    let data = req.body;
    const today = new Date();
    const { id, ...newData } = data;
    const localMaxPostIndex = await localCollection.findOne(
      {},
      { sort: { postIndex: -1 }, projection: { postIndex: 1 } }
    );

    const internationalMaxPostIndex = await internationalCollection.findOne(
      {},
      { sort: { postIndex: -1 }, projection: { postIndex: 1 } }
    );

    if (localMaxPostIndex && internationalMaxPostIndex) {
      localMaxPostIndex.postIndex > internationalMaxPostIndex.postIndex
        ? (newPostIndex = localMaxPostIndex
            ? localMaxPostIndex.postIndex + 1
            : 1)
        : (newPostIndex = internationalMaxPostIndex
            ? internationalMaxPostIndex.postIndex + 1
            : 1);
    } else if (localMaxPostIndex) {
      newPostIndex = localMaxPostIndex ? localMaxPostIndex.postIndex + 1 : 1;
    } else if (internationalMaxPostIndex) {
      newPostIndex = internationalMaxPostIndex
        ? internationalMaxPostIndex.postIndex + 1
        : 1;
    }

    data = { ...newData, createdAt: today, postIndex: newPostIndex };
    const result = await internationalCollection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "International News not found" });
    }

    try {
      const newsId = req.body.id;
      // getting references to database and collection
      const db = conn.getDb();
      const collection = await db.collection("newsStage");

      // finding and deleting international news post based on ID
      const result = await collection.deleteOne({
        _id: new ObjectId(newsId),
      });

      if (!result) {
        return res
          .status(404)
          .json({ message: "International News not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

    res
      .status(200)
      .json({ message: "International News updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// <-------------------- EDIT UNPUBLISHED NEWS IN THE newsStage COLLECTION -------------------->
export const editUnpublishedNews = async (req, res) => {
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
};

// <-------------------- EDIT PUBLISHED LOCAL NEWS IN THE local COLLECTION -------------------->
export const editLocalNews = async (req, res) => {
  try {
    const newsId = req.body.id;
    const { id, ...updateNews } = req.body;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("local");

    // finding and updating local news post based on ID
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
};

// <-------------------- EDIT PUBLISHED International NEWS IN THE international COLLECTION -------------------->
export const editInternationalNews = async (req, res) => {
  try {
    const newsId = req.body.id;
    const { id, ...updateNews } = req.body;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("international");

    // finding and updating international news post based on ID
    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(newsId),
      },
      { $set: updateNews },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "International News not found" });
    }

    res.status(200).json({
      message: "International News edited successfully",
      value: result.value,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// <-------------------- DELETE UNPUBLISHED NEWS IN THE newsStage COLLECTION -------------------->
export const deleteUnpublishedNews = async (req, res) => {
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
};

// <-------------------- DELETE PUBLISHED LOCAL NEWS IN THE local COLLECTION -------------------->
export const deleteLocalNews = async (req, res) => {
  try {
    const newsId = req.body.id;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("local");

    // finding and deleting local news post based on ID
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
};

// <-------------------- DELETE PUBLISHED INTERNATIONAL NEWS IN THE international COLLECTION -------------------->
export const deleteInternationalNews = async (req, res) => {
  try {
    const newsId = req.body.id;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("international");

    // finding and deleting international news post based on ID
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
};

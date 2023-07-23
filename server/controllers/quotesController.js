import conn from "../conn.js";
import { ObjectId } from "mongodb";

// <-------------------- GET QUOTES FROM quotes COLLECTION. -------------------->
export const getQuotes = async (req, res) => {
  let { date } = req.body;
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("quotes");

    // finding and returning all Quote posts
    const results = await collection
      .find({
        date: {
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

// <-------------------- ADD QUOTES TO quotes COLLECTION. -------------------->
export const addQuotes = async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("quotes");
    let data = req.body;
    const date = new Date(req.body.date);
    const { id, ...newData } = data;
    data = { ...newData, date: date };
    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.status(200).json({ message: "Quote pushed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Quote server error" });
  }
};

// <-------------------- EDIT QUOTES TO quotes COLLECTION. -------------------->
export const editQuotes = async (req, res) => {
  try {
    const QuoteId = req.body.id;
    const { id, ...editQuote } = req.body;
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("quotes");

    // finding and updating quotes post based on ID
    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(QuoteId),
      },
      { $set: editQuote },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res
      .status(200)
      .json({ message: "Quote edited successfully", value: result.value });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// <-------------------- DELETE QUOTES TO quotes COLLECTION. -------------------->
export const deleteQuotes = async (req, res) => {
  try {
    const newsId = req.body.id;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("quotes");

    // finding and deleting quotes post based on ID
    const result = await collection.deleteOne({
      _id: new ObjectId(newsId),
    });

    if (!result) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

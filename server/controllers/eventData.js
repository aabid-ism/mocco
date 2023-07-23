import conn from "../conn.js";
import { ObjectId } from "mongodb";

// <-------------------- GET EVENT DATA FROM events COLLECTION. -------------------->
export const getEventData = async (req, res) => {
  let { date } = req.body;
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("events");

    // finding and returning all event posts
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

// <-------------------- ADD EVENT DATA TO events COLLECTION. -------------------->
export const addEventData = async (req, res) => {
  try {
    const db = conn.getDb();
    const collection = await db.collection("events");
    let data = req.body;
    const date = new Date(req.body.date);
    const { id, ...newData } = data;
    data = { ...newData, date: date };
    const result = await collection.insertOne(data);

    if (!result) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event pushed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Event server error" });
  }
};

// <-------------------- EDIT EVENT DATA TO events COLLECTION. -------------------->
export const editEventData = async (req, res) => {
  try {
    const eventId = req.body.id;
    const { id, ...editEvent } = req.body;
    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("events");

    // finding and updating event post based on ID

    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(eventId),
      },
      { $set: editEvent },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Event not found" });
    }

    res
      .status(200)
      .json({ message: "Event edited successfully", value: result.value });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// <-------------------- DELETE EVENT DATA TO events COLLECTION. -------------------->
export const deleteEventData = async (req, res) => {
  try {
    const newsId = req.body.id;

    // getting references to database and collection
    const db = conn.getDb();
    const collection = await db.collection("events");

    // finding and deleting event post based on ID

    const result = await collection.deleteOne({
      _id: new ObjectId(newsId),
    });

    if (!result) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
